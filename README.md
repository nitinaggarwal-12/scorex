# ScoreX — Enterprise Data, AI Maturity, Value Realization & Statutory Compliance Platform (`v3.5.0`)

Enterprise-grade platform for evaluating technical maturity, CFO value realization, and statutory AI regulatory compliance across **3 Canonical Assessment Engines**, powered by the **5-Tier Google / Gemini / DeepMind Model Stack** and deployed on **Google Cloud Run (Argolis: `https://scorex-app-522233290860.us-central1.run.app`)**.

---

## 🏛️ 3 Canonical Assessment Engines

1. **Engine 1 — Dynamic Assessment Blueprints Engine** (`/assessments`, `/assessments/generator`, `/assessments/run/:typeKey`, `/assessments/run/instance/:instanceId`, `/assessments/report/:instanceId`)
   - **6 Production-Ready Enterprise Frameworks & Complete Demo Dossiers**:
     - `enterprise_data_ai_maturity` (`inst_enterprise_data_ai_demo` — ConnectPlus Telecom): Enterprise Data & AI Technical Maturity (6 Pillars / 30 Weighted Dimensions)
     - `genai_rag_readiness` (`inst_genai_rag_demo` — Apex Financial Partners): GenAI & Agentic RAG Production Readiness
     - `finops_cost_governance` (`inst_finops_demo` — Helios Retail Group): Cloud & AI FinOps Cost Governance
     - `cloud_migration_modernization` (`inst_cloud_migration_demo` — NovaBio Health Systems): Enterprise Cloud Migration & Lakehouse Modernization
     - `zero_trust_cyber_resilience` (`inst_zero_trust_demo` — ConnectPlus Telecom): Zero-Trust Security & Cyber Resilience
     - `mlops_agentic_ai_governance` (`inst_mlops_agentic_demo` — Apex Financial Partners): MLOps & Agentic AI Lifecycle Governance
   - **Infinite AI Custom Blueprint Generator**: Synthesize new domain-specific maturity rubrics in `< 2.5s` via `Gemini 3.8 Flash` (`gemini-3.8-flash`) and `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`), protected by the 4-Category Conversational Non-Mutation Guard (`server/utils/conversationalIntentGuard.js`).
   - **Multimodal Evidence & Architecture Decompilation**: Upload PDFs, architecture diagrams, or spreadsheets to auto-populate maturity scores, Draw.io architecture blueprints, and executive reports.

2. **Engine 2 — GE Value Realization Engine** (`/ge-value-realization`, `/roi-calculator`, `/tco-calculator`, with `/value-realization` redirecting to `/ge-value-realization`)
   - **5-Column CFO Value Realization Bridge**: Business Objective $\rightarrow$ Strategic KPI $\rightarrow$ Baseline vs. Target $\rightarrow$ AI Capability Enabler $\rightarrow$ Risk-Adjusted Annualized Value ($M).
   - **3-Horizon Value Roadmap & 5-KPA Scorecard**: Quick Wins (0–3 Months), Foundation Scale (3–9 Months), and Autonomous Transformation (9–18 Months) across all 5 Key Process Areas (`KPA-01`..`KPA-05`) and 15 industry workflows.
   - **Integrated ROI & TCO Calculators**: Interactive `/roi-calculator` and `/tco-calculator` financial modeling.

3. **Engine 3 — EU AI Act Statutory Compliance Engine** (`/eu-ai-act`, `/eu-ai-act/system/:id`)
   - **Statutory Risk Pyramid Classification**: Regulation (EU) 2024/1689 Article 5 (Prohibited), Article 6 & Annex III (High-Risk), Article 50 (Transparency), and Articles 51–55 (GPAI / Systemic Risk).
   - **Annex IV Conformity Dossier Generator**: Automated technical documentation, conformity checklists, and penalty exposure calculation via `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`) and audited by `Google Omni 1.1` (`google-omni-1.1`).

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
- **Backend**: Node.js, Express, `@google/genai` Unified 5-Tier Gemini Service (`server/services/geminiService.js`), 4-Category Conversational Non-Mutation Guard (`server/utils/conversationalIntentGuard.js`)
- **Database**: PostgreSQL (`PGHOST` / `PGDATABASE: scorex_postgres`) & Deterministic File-Backed Store (`data/dynamic_assessments.json`, `db-sync/export-data.json`)
- **Primary Deployment (Google Cloud Run — Argolis)**: `https://scorex-app-522233290860.us-central1.run.app` (Project: `gcp-sandbox-field-eng`, Region: `us-central1`, Service: `scorex-app`)
- **Secondary Deployment (Railway)**: `https://scorex.up.railway.app/`

---

## 📦 Local Setup & Execution

```bash
# 1. Install dependencies
npm install
npm install --prefix client

# 2. Configure environment
cp env.example .env
# Add GEMINI_API_KEY and optional model overrides in .env

# 3. Build React production bundle & sync static workflows
npm run build --prefix client
cp -r client/public/workflows client/build/workflows

# 4. Start server on port 5001
PORT=5001 node server/index.js
```

---

## 🧪 End-to-End Forensic & Quality Gate Verification

Run the automated Harness Engineering Stop Quality Gate and E2E Forensic Audit:

```bash
node scripts/stop_quality_gate.mjs
node scratch/run_e2e_forensic_blindspot_audit.mjs
```

---

## 🔐 Privacy & Universal Single-Source Governance (`v3.5.0`)

- **100% Fictitious Enterprise Demo Personas**: Seeded portfolios use strictly synthetic benchmark organizations (`ConnectPlus Telecom`, `Apex Financial Partners`, `Helios Retail Group`, `NovaBio Health Systems`).
- **Universal Single-Source Governance Lockstep**: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.agents/AGENTS.md`, `skills.md`, `skills.json`, `hooks.json`, and `.agents/hooks.json` are symlinked directly to `/Users/nitinagga/.gemini/config/` with zero discrepancy.
