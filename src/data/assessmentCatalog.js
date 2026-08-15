/**
 * Central catalog for every active assessment in the suite.
 *
 * This is the single source of truth for:
 *  - which logical group an assessment belongs to (drives grouping on
 *    the home page and in the sidebar)
 *  - which visual `variant` its introduction page renders with (see
 *    AssessmentLanding.jsx for the variant templates)
 *  - the actual what/why/where/how/value/differentiator content
 */

export const GROUPS = [
  {
    id: 'discovery',
    name: 'Discovery & Qualification',
    description: 'Structured entry points for initial conversations and agentic workload qualification.',
  },
  {
    id: 'maturity',
    name: 'Maturity & Enterprise Readiness',
    description: 'Production sign-off gates, GxP compliance boundaries, and ML operational maturity baselines.',
  },
  {
    id: 'financial',
    name: 'Financial ROI & Economics',
    description: 'Unit economics, compute tokenomics, and TCO payback timeline models.',
  },
  {
    id: 'technical',
    name: 'Technical Scoping & Architecture',
    description: 'Live interactive architecture co-design on Google Cloud and Vertex AI.',
  },
];

export const ASSESSMENTS = {
  intake: {
    id: 'intake',
    group: 'discovery',
    variant: 'story',
    accent: 'var(--google-blue)',
    icon: 'FileText',
    name: 'Use Case Discovery Intake',
    tagline: 'The structured starting record every other assessment builds on.',
    what: 'A five-step guided intake covering business context, current data stack, strategic sponsorship, and timeline urgency — a symmetrical, repeatable question set rather than an open-ended conversation.',
    why: 'Discovery conversations drift without structure, and what gets discussed rarely gets written down consistently. This makes the first conversation produce a real record, not just notes in someone’s head.',
    where: 'The very first meeting with a prospective use case — before any scoring, architecture, or ROI work begins.',
    how: 'Fill it live on the call, or pre-fill it from your own notes beforehand and walk through it for confirmation.',
    valueCustomer: 'A clear, shared record of what was discussed — so the second meeting doesn’t start by re-explaining everything from the first.',
    valueVendor: 'Structured data that every downstream assessment can read from automatically, instead of re-asking the same qualifying questions in each one.',
    differentiator: 'The only step in the suite that is pure data capture — no scoring, no verdict. Everything else reads from what gets entered here.',
  },
  option7: {
    id: 'option7',
    group: 'discovery',
    variant: 'blueprint',
    accent: 'var(--google-purple)',
    icon: 'Sparkles',
    name: 'Agentic AI Discovery',
    tagline: 'Discovery for use cases where the AI takes actions, not just answers questions.',
    what: 'A guided, path-based discovery flow that walks the customer through selecting their agentic use-case pattern, then generates a draft target architecture on Vertex AI.',
    why: 'Agentic use cases — multi-step, tool-using AI that acts on the customer’s systems — need a different discovery path than a simple chat or summarization use case. Generic intake questions miss the risk surface that matters here.',
    where: 'As soon as the customer’s ask involves an agent taking actions (calling tools, writing to systems, multi-step planning), not just producing text.',
    how: 'Select the closest-matching use case path, answer path-specific questions, and the tool generates a first-draft architecture blueprint live.',
    valueCustomer: 'Leaves the conversation with an actual draft architecture diagram, not just a score — something concrete to bring back to their own engineering team.',
    valueVendor: 'Produces a real leave-behind artifact for the next meeting instead of a verbal summary.',
    differentiator: 'The only assessment in the suite whose primary output is an architecture diagram rather than a score or report.',
  },

  option12: {
    id: 'option12',
    group: 'maturity',
    variant: 'dossier',
    accent: '#3b82f6',
    icon: 'Sparkles',
    name: 'Enterprise Readiness Assessor',
    tagline: 'The production sign-off gate for regulated industries — the flagship assessment in the suite.',
    what: 'A comprehensive 25-pillar production-readiness and compliance assessment covering GxP validation status, CMEK encryption, data sovereignty, and security posture with real-time Vertex AI synthesis.',
    why: 'In regulated industries like biopharma and healthcare, technical readiness means very little if the compliance and security posture isn’t production-grade. This is the assessment that answers "can this actually go live."',
    where: 'The primary gate before a production or GA commitment — after the use case, architecture, and financial case are understood.',
    how: 'A compliance and security question set covering the regulated-workload checklist, producing a documented sign-off record, live radar chart, and executive dossier.',
    valueCustomer: 'A defensible, documentable readiness record their own QA, compliance, and security functions can review and sign off on.',
    valueVendor: 'De-risks the engagement by surfacing compliance blockers early before they derail late-stage deployments.',
    differentiator: 'The flagship 25-dimension consultative readiness engine with real-time Vertex AI reasoning stream and dynamic radar plotting.',
  },
  option5: {
    id: 'option5',
    group: 'maturity',
    variant: 'blueprint',
    accent: 'var(--google-blue)',
    icon: 'Compass',
    name: 'ML & MLOps Maturity Assessor',
    tagline: 'How ready is their engineering organization, independent of any single use case?',
    what: 'A structured maturity questionnaire scoring the customer’s existing ML/AI operational practices — data pipelines, model versioning, evaluation rigor, deployment automation — against defined maturity tiers.',
    why: 'A customer’s AI ambitions often outpace their operational maturity. A great use case idea can still stall in delivery if the underlying engineering practices aren’t there yet.',
    where: 'Mid-engagement, once the use case is understood and you want to gauge delivery risk before scoping a SOW.',
    how: 'Structured questionnaire across the org’s ML engineering practices, scored against maturity tiers with specific remediation steps per gap.',
    valueCustomer: 'An honest maturity baseline they can bring to their own leadership to justify investing in foundations, not just the visible model work.',
    valueVendor: 'Flags implementation and delivery risk early, before a statement of work gets signed on assumptions that don’t hold.',
    differentiator: 'Scores the organization’s general operational maturity, not any specific use case’s ROI, architecture, or compliance posture.',
  },

  option6: {
    id: 'option6',
    group: 'financial',
    variant: 'editorial',
    accent: 'var(--google-green)',
    icon: 'Activity',
    name: 'Financial ROI Assessor',
    tagline: 'The number a CFO can actually evaluate.',
    what: 'Calculates FTE hours saved, process automation rate, compute cost, and a TCO payback-period chart for the specific proposed use case.',
    why: 'Every deal eventually needs a number, not a feeling. A well-scoped use case with no financial model attached is much harder to move through a customer’s budget process than one with a defensible payback timeline.',
    where: 'Once the use case and a rough architecture are understood, ahead of final business-case sign-off.',
    how: 'Guided inputs on process volume, current manual time spent, and expected automation rate — the tool produces a payback-period chart from those inputs.',
    valueCustomer: 'A defensible business case they can take to their own finance function, rather than a qualitative pitch they have to translate into numbers themselves.',
    valueVendor: 'Turns "this seems valuable" into a quantitative case that survives a budget review.',
    differentiator: 'The only assessment whose primary output is a financial chart rather than a readiness score, architecture diagram, or compliance record.',
  },

  option4: {
    id: 'option4',
    group: 'technical',
    variant: 'canvas',
    accent: 'var(--google-green)',
    icon: 'Sparkles',
    name: 'Architecture Blueprint Canvas',
    tagline: 'Design the architecture together, live, on a shared diagram.',
    what: 'An interactive, editable systems-topology canvas covering both current-state and target-state architecture, embedded directly in the app for live co-design with the customer’s technical team.',
    why: 'Architecture conversations go better with a shared, editable diagram on screen than with a static slide one side prepared in advance.',
    where: 'Technical deep-dive sessions with the customer’s architects or engineers, once the use case and rough scope are agreed.',
    how: 'A live, drawable canvas both sides can edit together during the call, saved and exported afterward.',
    valueCustomer: 'Walks away with the same diagram their own team helped edit, not a vendor-produced diagram to interpret and push back on later.',
    valueVendor: 'Produces genuine buy-in during the session itself, instead of discovering disagreement after the diagram is already "final."',
    differentiator: 'The only assessment in the suite that is a drawing tool, not a questionnaire — everything else here produces a score or a report; this produces a diagram.',
  },
};

export function assessmentsByGroup(groupId) {
  return Object.values(ASSESSMENTS).filter((a) => a.group === groupId);
}
