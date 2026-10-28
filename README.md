# ScoreX — Enterprise Data, AI Maturity, Value Realization & Statutory Compliance Platform (`v3.8.0`)

Enterprise-grade platform for evaluating technical maturity, CFO value realization, and statutory AI regulatory compliance across **3 Canonical Assessment Engines**, powered by the **5-Tier Google / Gemini / DeepMind Model Stack** and deployed on **Google Cloud Run (Canonical BeyondCorp URL: `https://scorex-248990048888.cr.gclb.goog` in `ramp-portal-dev` / `us-west1`, and Argolis: `https://scorex-638420508320.us-central1.run.app` & `https://scorex-app-638420508320.us-central1.run.app` in `nitinagga-ge-2` / `us-central1`)**.

---

## 🏛️ 3 Canonical Assessment Engines

1. **Engine 1 — Dynamic Assessment Blueprints Engine** (`/assessments`, `/assessments/hub`, `/assessments/ai-generator`, `/assessments/run/:typeKey`, `/assessments/run/instance/:instanceId`, `/assessments/report/:instanceId`)
   - **6 Production-Ready Enterprise Frameworks & Complete Demo Dossiers (`data/dynamic_assessments.json`)**:
     - `enterprise_data_ai_maturity` (`inst_enterprise_data_ai_maturity_demo` — `ConnectPlus Telecom Global`): Enterprise Data & AI Technical Maturity (6 Pillars / 30 Weighted Dimensions)
     - `openai_to_gemini_enterprise_migration` (`inst_openai_to_gemini_enterprise_migration_demo` — `Quantum FinTech Global`): OpenAI to Gemini Enterprise Migration Readiness
     - `finops_cloud_cost_optimization` (`inst_finops_cloud_cost_optimization_demo` — `Nova Retail & E-Commerce Group`): Cloud & AI FinOps Cost Optimization & Governance
     - `agentic_ai_mesh_mcp_banking_readiness` (`inst_agentic_ai_mesh_mcp_banking_readiness_demo` — `Apex Global Banking & Wealth`): Agentic AI Mesh, A2A & MCP Banking Readiness
     - `edw_lakehouse_to_bigquery_modernization` (`inst_edw_lakehouse_to_bigquery_modernization_demo` — `Global Logistics Alliance`): EDW & Lakehouse to BigQuery Autonomous Modernization
     - `enterprise_ai_zero_trust_security` (`inst_enterprise_ai_zero_trust_security_demo` — `CyberShield Health & Life Sciences`): Enterprise AI Zero-Trust Security & Model Armor Governance
   - **Infinite AI Custom Blueprint Generator (`/assessments/ai-generator`)**: Synthesize new domain-specific maturity rubrics in `< 2.5s` via `Gemini 3.8 Flash` (`gemini-3.8-flash`) and `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`), protected by the 4-Category Conversational Non-Mutation Guard (`server/utils/conversationalIntentGuard.js`).
   - **Multimodal Evidence & Template 05 3-Zone Architecture Compiler (`dynamicAssessmentDiagramCompiler.js` ↔ `template05DiagramCompiler.js`)**: Upload PDFs, architecture diagrams, or spreadsheets to auto-populate maturity scores, executive reports, and Draw.io / SVG 3-Zone architecture blueprints with 100% bijective 1-to-1 horizontal tier-to-bridge alignment (`L1 CHANNELS`..`L6 ZERO-TRUST`), 6/6 unique As-Is pain badges, domain-differentiated Left/Middle/Right/Bottom zones across all 6 canonical frameworks, unskewed composite score math, and zero `..` mid-word truncations across all 18 Stage 1/2/3 diagrams.

2. **Engine 2 — Gemini Enterprise Value Realization Engine** (`/ge-value-realization`, `/ge-value-realization/:dossierId`, `/roi-calculator`, `/tco-calculator`, with `/value-realization` redirecting to `/ge-value-realization`)
   - **82-Question / 10-Module (`C`·`P`·`A`·`W`·`T`·`Q`·`U`·`L`·`R`·`F`) / 8-Source Enterprise Evidence & Value Realization Framework**: Pre-seeded multi-source dossiers across all 10 enterprise accounts (`ACC-1001-AEROVG`..`ACC-1010-BLDRGHT`, including `ACC-1001-AEROVG` AeroVanguard Defense Systems, `ACC-1002-BIONOVA` BioNova Therapeutics, and `ACC-1006-VANGUARD` Vanguard Global Advisory Corp), plus verified NorthAM Vector accounts for **Mars, Incorporated (`0014M00001hqyrvQAA`)** and **H-E-B, LP (`0014M00001hcTvLQAU`)**.
   - **100% Fluid Edge-to-Edge Layout, 10-Module Tab Bar & 3-Column Question Input Grid (`Rule 50A`–`Rule 50J` / `UI Integrity Gates 1–16`)**: Full-width responsive container (`padding: ... clamp(16px, 1.8vw, 28px)`), live Telemetry Grounding cluster, strict sequential card ordering (`C01` $\rightarrow$ `C02` $\rightarrow$ `C03`), 10-Module Horizontal Tab Bar (`#ge-module-tabs-bar`: `C`·`P`·`A`·`W`·`T`·`Q`·`U`·`L`·`R`·`F`), balanced 3-column question input row (`2.15fr` Answer / `0.9fr` Tier A–E / `0.75fr` Score) with `0` duplicate 4th column, 3 functional DOM tabs (`1. Question Matrix & Inputs`, `2. Executive Readout` with Minto SCR, Signals & Dynamic Exhibit 1B CFO Bridge, `3. System of Record Provenance Ledger`), `F01 = $120/hr ($187,200/yr fully loaded)` rate parity, and zero synthetic third-party consulting brands (`McKinsey`, `BCG`, `Bain`, `Stratagem`, `Deloitte`, `Quantiphi`, `Accenture`, `PwC`, `Slalom`, `KPMG`).
   - **Rule 25F Non-Blocking Slide-Over Drawers & Inline Input**: Zero thread-blocking `window.prompt()` or `alert()` calls. Dynamic Salesforce ID entry uses an inline input mode (`#ge-custom-sfdc-inline-input`), and answer adjustments open a 480px slide-over drawer on the right.
   - **5-Column CFO Value Realization Bridge & 3-Horizon Roadmap**: Business Objective $\rightarrow$ Strategic KPI $\rightarrow$ Baseline vs. Target $\rightarrow$ AI Capability Enabler $\rightarrow$ Risk-Adjusted Annualized Value ($M) across Quick Wins (0–3 Months), Foundation Scale (3–9 Months), and Autonomous Transformation (9–18 Months) and all 5 Key Process Areas (`KPA-01`..`KPA-05`).
   - **Immutable Master Templates & Cloned Customer Instance Versions**: Supports immutable `v1.0` Master Templates and cloned `v2.0+` Customer Instance Versions (`server/routes/instanceVersions.js`).
   - **Integrated ROI & TCO Calculators**: Interactive `/roi-calculator` and `/tco-calculator` financial modeling.

3. **Engine 3 — EU AI Act Statutory Compliance Engine** (`/eu-ai-compliance`, `/eu-ai-compliance/:id`, `/eu-ai-act`, `/eu-ai-act/system/:id`)
   - **20 Statutory Questions & Risk Pyramid Classification**: Regulation (EU) 2024/1689 Article 5 (Prohibited Practices), Article 6 & Annex III (High-Risk AI Systems), Articles 9–15 (Risk Management, Data Governance, Human Oversight), Article 50 (Transparency), and Articles 51–55 (GPAI / Systemic Risk).
   - **Annex IV Conformity Dossier Generator**: Pre-seeded with `EUAIA-2026-HR4902` (`TalentPulse HR Screening & Candidate Ranking AI`), featuring automated technical documentation, conformity checklists, and penalty exposure calculation via `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`) and audited by `Google Omni 1.1` (`google-omni-1.1`).

---

## 🧠 Canonical 5-Tier Google / Gemini / DeepMind Model Stack

| Tier | Role & Capability | Canonical Model IDs |
| :--- | :--- | :--- |
| **Tier 1** | **Master Orchestrator & Multimodal Forensic Judge** | `Google Omni 1.1` (`google-omni-1.1` / `gemini-omni-1.1-flash`) |
| **Tier 2** | **Deep Reasoning, CFO Value Synthesis, Annex IV & Vision** | `Gemini 3.1 Pro` (`gemini-3.1-pro-preview` with `thinkingConfig` + `responseSchema`) |
| **Tier 3** | **High-Throughput Classifier, Evidence Extraction & Blueprint Compiler** | `Gemini 3.8 Flash` (`gemini-3.8-flash` with Function Calling) |
| **Tier 4** | **Real-Time Bidirectional & Sub-Second Copilot Streaming** | `Gemini Flash Live` (`gemini-3.1-flash-live-preview`) |
| **Tier 5** | **Native DeepMind Multimodal Media, Embeddings & Enterprise Mesh** | `Google DeepMind Veo 3.1` (`veo-3.1-generate-preview`), `DeepMind Lyria 3.5` (`lyria-3.5` / `models/lyria-3-pro-preview`), `Google DeepMind Neural Audio` (`gemini-3.1-flash-tts-preview`), `Google DeepMind Imagen 3` (`gemini-3.1-flash-image-preview` / `models/imagen-3.0-generate-002`), `Gemini Embedding 001` & `Text Embedding 005` (`gemini-embedding-001` / `text-embedding-005`), `BigQuery Property Graphs (ISO GQL)`, `Google ADK Sidecar`, `Gemini Data Analytics API`, `Google Cloud Model Armor` |

---

## 🚀 Tech Stack & Cloud Deployment

- **Frontend**: React 18, React Router v6, Recharts, Framer Motion, Lucide Icons, PPTX/PDF/Excel/Word Executive Exporters
- **Backend**: Node.js 22 LTS (`>=22.12.0` with native V8 `require(esm)` single-source `geValueRealizationFramework.js`), Express, `@google/genai` Unified 5-Tier Gemini Service (`server/services/geminiService.js`), 4-Category Conversational Non-Mutation Guard (`server/utils/conversationalIntentGuard.js`)
- **Database & Multi-Instance Durable Cloud Persistence**: PostgreSQL (`PGHOST` / `PGDATABASE: scorex_postgres`, including `ge_value_realization_dossiers` and `eu_ai_dossiers` JSONB tables via `023_ge_and_eu_ai_dossiers.sql`) & Deterministic Atomic File-Backed Stores (`data/*.json`) backed by `server/utils/durableGcsPersistence.js` generation-pinned cold-start hydration, `?ifGenerationMatch` Compare-And-Swap (`CAS`) `HTTP 412` 3-way structural ancestor merge (`threeWayMergeJsonState`), and cross-instance peer hot-reload (`createGcsFreshnessMiddleware`) on versioned Google Cloud Storage (`gs://scorex-durable-state-bbar-138hf0` in `us-west1`).
- **Canonical Verified BeyondCorp URL (`google.com`)**: `https://scorex-248990048888.cr.gclb.goog` (Project: `ramp-portal-dev` / `248990048888`, Region: `us-west1`, Service: `scorex`)
- **Argolis Google Cloud Run (`nitinagga-ge-2`)**: `https://scorex-638420508320.us-central1.run.app` & `https://scorex-app-638420508320.us-central1.run.app` (Project: `nitinagga-ge-2` / `638420508320`, Region: `us-central1`)

---

## 📦 Local Setup & Execution

```bash
# 1. Install dependencies
npm install
npm install --prefix client

# 2. Configure environment
cp env.example .env
# Add GEMINI_API_KEY and optional model overrides in .env

# 3. Build React production bundle (strict CI=true zero-warning gate) & sync static workflows
npm run build --prefix client
cp -r client/public/workflows client/build/workflows

# 4. Start server on port 5001
PORT=5001 node server/index.js
```

---

## 🧪 End-to-End Forensic & Quality Gate Verification

Run the automated Harness Engineering Stop Quality Gate, Governance Lockstep Enforcer, and Security Test Suite (`46/46` tests & `20/20` UI Integrity Gates):

```bash
npm test
npm run quality-gate
node scripts/guards/enforce_universal_single_source_trinity.mjs --verify-only
node scripts/guards/jetski_hook_handler.mjs --self-test
```

---

## 🔐 Privacy & Universal Single-Source Governance (`v3.8.0`)

- **100% Fictitious Enterprise Demo Personas**: Seeded portfolios use strictly synthetic benchmark organizations (`ConnectPlus Telecom Global`, `Quantum FinTech Global`, `Nova Retail & E-Commerce Group`, `Apex Global Banking & Wealth`, `Global Logistics Alliance`, `CyberShield Health & Life Sciences`, `AeroVanguard Defense Systems`, `BioNova Therapeutics`, `Vanguard Global Advisory Corp`).
- **Universal Single-Source Governance Lockstep & Jetski Realpath Deduplication**: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.agents/AGENTS.md`, `skills.md`, `.agents/skills.md`, `skills.json`, `.agents/skills.json`, `hooks.json`, `.agents/hooks.json`, and all 15 `.agents/rules/*.md` files are symlinked directly to `/Users/nitinagga/.gemini/config/` with 100% SHA-256 and `realpath` parity (eliminating duplicate `<RULE>` prompt injections).
- **Native Jetski Customizations (`agent-hooks`, `agent-skills`, `agent-swarm`, `review-agent`)**: Enforces `PreToolUse` (`{"decision": "allow"|"deny"}`), `PostToolUse` (`{}`), and `Stop` (`{"decision": "continue"}` on gate failure) via `scripts/guards/jetski_hook_handler.mjs`, progressive-disclosure skill `scorex-forensic-gate` (`references/rule50_forensic_checklist.md`), and 3-Arm Review Subagent `scorex-forensic-auditor.md`.

