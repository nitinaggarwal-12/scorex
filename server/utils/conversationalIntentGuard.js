/**
 * Mandatory 4-Category Conversational & Non-Mutation Intent Gate
 * Prevents casual greetings, identity/capability queries, courtesies,
 * and short ambiguous phrases (<= 2 words) from triggering unintended
 * framework generation, catalog persistence, or architecture diagram mutations.
 */

const GREETING_RE = /^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening)|greetings|howdy|yo|sup)[!.,?\s]*$/i;
const IDENTITY_RE = /^(?:who\s+are\s+you|what\s+are\s+you|what\s+can\s+you\s+do|help|help\s+me|capabilities|how\s+does\s+this\s+work|what\s+is\s+scorex)[!.,?\s]*$/i;
const COURTESY_RE = /^(?:thanks|thank\s+you|thx|ty|ok|okay|got\s+it|understood|cool|great|awesome|nice|perfect|sounds\s+good|ack)[!.,?\s]*$/i;

function classifyConversationalIntent(rawInput) {
  const text = String(rawInput || '').trim();
  if (!text) {
    return { isConversational: true, category: 'empty', mutated: false };
  }

  if (GREETING_RE.test(text)) {
    return {
      isConversational: true,
      category: 'greeting',
      mutated: false,
      reply:
        'Hello! I am the **ScoreX Enterprise AI Architect & Governance Copilot** (powered by **Gemini 3.8 Flash** and **Gemini 3.1 Pro**). Tell me what cloud, data, security, FinOps, or regulatory domain you would like to evaluate or architect, and I will synthesize a tailored framework or executive analysis.'
    };
  }

  if (IDENTITY_RE.test(text)) {
    return {
      isConversational: true,
      category: 'identity_capability',
      mutated: false,
      reply:
        'I am the **ScoreX Enterprise AI Copilot**. Here is what I can do across the 3 Core Engines:\n\n' +
        '1. **Dynamic Architecture & AI Blueprints**: Generate custom multi-pillar maturity frameworks, 3-stage Draw.io architecture blueprints (Current, Transition, Target), Terraform HCL, and CFO-ready TCO/ROI business cases.\n' +
        '2. **EU AI Act Statutory Compliance (Regulation 2024/1689)**: Classify high-risk AI systems, draft Annex IV technical documentation, and run multi-model statutory cross-examinations.\n' +
        '3. **Gemini Enterprise Value Realization**: Reconcile multi-source telemetry, workflow time savings, and 5-column MECE financial ledgers.'
    };
  }

  if (COURTESY_RE.test(text)) {
    return {
      isConversational: true,
      category: 'courtesy',
      mutated: false,
      reply:
        'You are welcome! Let me know whenever you are ready to generate a new assessment framework, refine an architecture blueprint, or audit a regulatory control.'
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 2 && text.length < 24) {
    return {
      isConversational: true,
      category: 'short_ambiguous',
      mutated: false,
      reply:
        `I noticed your prompt (**"${text}"**) is very brief, so I did not modify or generate any assessment artifacts yet. Please provide a descriptive sentence—for example: *"Create a Zero-Trust AI Security & Governance assessment for Financial Services covering VPC Service Controls, CMEK encryption, and DLP guardrails."*`
    };
  }

  return {
    isConversational: false,
    category: 'actionable',
    mutated: true,
    reply: null
  };
}

module.exports = {
  classifyConversationalIntent
};
