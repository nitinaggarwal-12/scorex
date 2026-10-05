#!/usr/bin/env node
// SCOREX 3-ENGINE ARCHITECTURAL INVARIANTS memory injector (v3.0)
let inputData = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => { inputData += chunk; });

process.stdin.on("end", () => {
  try {
    const memory = [
      "1. THREE-ENGINE PARITY: ScoreX comprises Engine 1 (Dynamic Blueprints — 6 canonical frameworks), Engine 2 (Gemini Enterprise Value Realization — 82 questions / 10 modules / 8 evidence sources), and Engine 3 (EU AI Act Compliance — Regulation (EU) 2024/1689, 20 statutory questions).",
      "2. EVIDENCE BEFORE CONCLUSIONS: Never fabricate or hardcode customer scores, survey lifts, or financial impacts without grounding in submitted responses or verified telemetry.",
      "3. ZERO PHANTOM DRAFTS: Never auto-create blank assessment instances on disk or in localStorage on page load; persist drafts only after explicit user interaction.",
      "4. CANONICAL LIGHT ENTERPRISE THEME: Maintain unified high-contrast slate/white enterprise aesthetics (#f8fafc / #ffffff, #2563eb primary, #10b981 positive) across all portfolio and assessment surfaces.",
      "5. DETERMINISTIC FALLBACK TRANSPARENCY: Whenever an AI endpoint falls back to deterministic calculation, explicitly label the response mode so deterministic outputs never masquerade as live LLM evaluations."
    ].join("\n");

    console.log(JSON.stringify({
      injectSteps: [
        {
          ephemeralMessage: "\n\n[SCOREX ENTERPRISE ARCHITECTURAL GATEKEEPERS]:\n" + memory
        }
      ],
      hookSpecificOutput: {
        hookEventName: "PreInvocation",
        additionalContext: "\n\n[SCOREX ENTERPRISE ARCHITECTURAL GATEKEEPERS]:\n" + memory
      }
    }));
  } catch {
    console.log(JSON.stringify({}));
  }
});
