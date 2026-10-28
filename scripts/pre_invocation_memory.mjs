#!/usr/bin/env node
// SCOREX 5-SUBSYSTEM ARCHITECTURAL INVARIANTS memory injector (v3.1)
let inputData = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => { inputData += chunk; });

process.stdin.on("end", () => {
  try {
    const memory = [
      "1. FIVE-SUBSYSTEM PARITY (Rule 50H–50J): ScoreX comprises Subsystem 1 (Gemini Enterprise Value Realization — 82 questions / 10 modules / 8 evidence sources / 10 CRM accounts), Subsystem 2 (Dynamic Blueprints — 6 canonical frameworks & 6 starter instances), Subsystem 3 (Core 6-Pillar Enterprise Maturity Assessment — 4 starter assessments), Subsystem 4 (GenAI Technical Readiness — 32 questions / 160-pt scale / 3 starter assessments), and Subsystem 5 (EU AI Act Compliance — Regulation (EU) 2024/1689, 20 statutory questions).",
      "2. PERMANENT PERSISTENCE & ZERO BOOT OVERWRITE: Never unconditionally overwrite valid user edits on server boot across any of the 5 repositories; keep client/server GE frameworks 100% synchronized; recalculate both totalScore and overallScore on every mutation; and use atomic .sync.tmp file writes.",
      "3. EVIDENCE BEFORE CONCLUSIONS: Never fabricate or hardcode customer scores, survey lifts, or financial impacts without grounding in submitted responses or verified telemetry.",
      "4. ZERO PHANTOM DRAFTS: Never auto-create blank assessment instances on disk or in localStorage on page load; persist drafts only after explicit user interaction.",
      "5. CANONICAL LIGHT ENTERPRISE THEME & FLUID WIDTH (Rule 50A/54): Maintain unified high-contrast slate/white enterprise aesthetics (#f8fafc / #ffffff, #2563eb primary, #10b981 positive) and 100% fluid edge-to-edge width across all portfolio and assessment surfaces.",
      "6. DETERMINISTIC FALLBACK TRANSPARENCY: Whenever an AI endpoint falls back to deterministic calculation, explicitly label the response mode so deterministic outputs never masquerade as live LLM evaluations."
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
