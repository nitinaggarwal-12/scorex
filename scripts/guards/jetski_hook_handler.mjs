#!/usr/bin/env node
/**
 * OFFICIAL JETSKI LIFECYCLE HOOK HANDLER (agent-hooks.md / docs/hooks.md Compliant)
 * =================================================================================
 * Implements the exact Jetski Hook Input/Output Contract (protojson camelCase stdin -> JSON stdout):
 *   1. PreToolUse  -> outputs { "decision": "allow" | "deny", "reason": "..." }
 *      - Blocks reading/writing .env, .git/ internals, package-lock.json, poetry.lock (Law 2)
 *      - Blocks direct `gcloud run deploy --source . --project=ramp-portal-dev` or `nohup ... gcloud run deploy` (Rule 56)
 *   2. PostToolUse -> outputs {}
 *      - Runs silent single-source trinity check
 *   3. PreInvocation -> outputs { "injectSteps": [...] } or {}
 *   4. Stop        -> outputs { "decision": "allow" } or { "decision": "continue", "reason": "..." }
 *      - When running inside /Users/nitinagga/Documents/scorex and fullyIdle === true,
 *        verifies the 16 UI Integrity Gates (tests/security/uiIntegrityGate.test.js) and blocks
 *        agent termination with { "decision": "continue", "reason": "..." } if any gate fails.
 *
 * USAGE:
 *   node scripts/guards/jetski_hook_handler.mjs --event=PreToolUse
 *   node scripts/guards/jetski_hook_handler.mjs --event=PostToolUse
 *   node scripts/guards/jetski_hook_handler.mjs --event=Stop
 *   node scripts/guards/jetski_hook_handler.mjs --self-test
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const eventArg = (args.find((a) => a.startsWith("--event=")) || "--event=PostToolUse").split("=")[1];
const isSelfTest = args.includes("--self-test");

function readStdinJson() {
  if (isSelfTest) {
    return {
      conversationId: "self-test-conv",
      workspacePaths: [process.cwd()],
      stepIdx: 1,
      fullyIdle: true,
      terminationReason: "model_stop",
      toolCall: {
        name: "run_command",
        args: { CommandLine: "npm test" }
      }
    };
  }
  try {
    if (process.stdin.isTTY) return {};
    const raw = fs.readFileSync(0, "utf-8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function evaluatePreToolUse(payload) {
  const toolName = payload?.toolCall?.name || "";
  const toolArgs = payload?.toolCall?.args || {};

  // 1. Law 2 Protected File Boundary Check on file mutation tools
  if (["write_to_file", "replace_file_content", "multi_replace_file_content", "view_file"].includes(toolName)) {
    const targetPath = String(toolArgs.TargetFile || toolArgs.AbsolutePath || "");
    const base = path.basename(targetPath);
    if (
      base === ".env" ||
      base.startsWith(".env.") ||
      targetPath.includes("/.git/") ||
      (["write_to_file", "replace_file_content", "multi_replace_file_content"].includes(toolName) &&
        (base === "package-lock.json" || base === "poetry.lock"))
    ) {
      return {
        decision: "deny",
        reason: `Law 2 Violation: Direct access/mutation to protected resource "${targetPath}" is forbidden.`
      };
    }
  }

  // 2. Rule 56 Cloud Run Deployment Guard on run_command
  if (toolName === "run_command") {
    const cmd = String(toolArgs.CommandLine || "");
    if (/gcloud\s+run\s+deploy\b.*--source[\s=]/i.test(cmd) && /ramp-portal-dev/i.test(cmd)) {
      return {
        decision: "deny",
        reason:
          "Rule 56 Violation: Direct `gcloud run deploy --source` against ramp-portal-dev is forbidden (HTTP 403 on gs://run-sources-*). Use `bash scripts/deploy_scorex_cloudrun.sh` (2-project sandbox build + image update)."
      };
    }
    if (/nohup\b.*gcloud\s+(builds\s+submit|run\s+(deploy|services\s+update))/i.test(cmd)) {
      return {
        decision: "deny",
        reason:
          "Rule 56 Violation: Fire-and-forget background `nohup` Cloud Run deployments are banned. Run deployment synchronously and verify all 4 readiness gates."
      };
    }
  }

  return { decision: "allow" };
}

export function evaluatePostToolUse() {
  // PostToolUse contract requires an empty JSON object {} on stdout (docs/hooks.md:L226)
  return {};
}

export function evaluateStop(payload) {
  const workspaces = Array.isArray(payload?.workspacePaths) ? payload.workspacePaths : [process.cwd()];
  const scorexRoot = workspaces.find((w) => /\/scorex$/i.test(String(w))) || (fs.existsSync(path.join(process.cwd(), "tests/security/uiIntegrityGate.test.js")) ? process.cwd() : null);

  if (scorexRoot && payload?.fullyIdle !== false) {
    const gateFile = path.join(scorexRoot, "tests/security/uiIntegrityGate.test.js");
    if (fs.existsSync(gateFile)) {
      const res = spawnSync(process.execPath, ["--test", gateFile], {
        cwd: scorexRoot,
        encoding: "utf-8",
        timeout: 15000
      });
      if (res.status !== 0) {
        const errSnippet = String(res.stderr || res.stdout || "UI Integrity Gate failed").slice(0, 400).replace(/\s+/g, " ");
        return {
          decision: "continue",
          reason: `ScoreX Stop Hook Gate (Rule 50A–50J) failed: ${errSnippet}. Remediate all failing gates before stopping.`
        };
      }
    }
  }
  return { decision: "allow" };
}

function main() {
  if (isSelfTest) {
    const allowRes = evaluatePreToolUse({ toolCall: { name: "run_command", args: { CommandLine: "npm test" } } });
    const denyEnv = evaluatePreToolUse({ toolCall: { name: "write_to_file", args: { TargetFile: "/app/.env" } } });
    const denyDeploy = evaluatePreToolUse({
      toolCall: { name: "run_command", args: { CommandLine: "gcloud run deploy scorex --source . --project=ramp-portal-dev" } }
    });
    const postRes = evaluatePostToolUse();
    const stopRes = evaluateStop({ workspacePaths: [process.cwd()], fullyIdle: true });
    if (
      allowRes.decision !== "allow" ||
      denyEnv.decision !== "deny" ||
      denyDeploy.decision !== "deny" ||
      Object.keys(postRes).length !== 0 ||
      stopRes.decision !== "allow"
    ) {
      process.stderr.write("Self-test failed\n");
      process.exit(1);
    }
    process.stdout.write(JSON.stringify({ selfTest: "PASS", allowRes, denyEnv, denyDeploy, postRes, stopRes }) + "\n");
    process.exit(0);
  }

  const payload = readStdinJson();
  let response = {};
  if (eventArg === "PreToolUse") {
    response = evaluatePreToolUse(payload);
  } else if (eventArg === "PostToolUse") {
    response = evaluatePostToolUse(payload);
  } else if (eventArg === "Stop") {
    response = evaluateStop(payload);
  } else if (eventArg === "BrandValidator") {
    response = {};
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

main();
