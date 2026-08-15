# 🧬 ScoreX • Google Cloud Enterprise AI Scoping Suite

> **Accelerating AI Scoping, Architecture Validation, and TCO Payback Estimation for Regulated Industries.**

[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Model](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-orange?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)

The **ScoreX Enterprise AI Scoping Suite** is a consultative scoping and qualification application designed for Customer Engineers (CEs), Solution Architects (SAs), and Google Field Teams to accelerate enterprise Generative AI discovery and architectural validation. Tailored specifically for HCLS, biopharma, and other highly regulated industries, it computes multi-dimensional readiness scores, generates joint technical roadmaps, and estimates TCO economics.

---

## 🏛️ Assessment Categories

The suite organizes consultative workflows into 4 functional groups:

1. **Discovery & Intake**: Rapid use case qualification and operational context intake.
2. **Maturity & Enterprise Readiness**: Flagship 25-pillar readiness audit with real-time Vertex AI synthesis and GxP compliance scoring.
3. **Financial ROI & Feasibility**: Multi-workload unit economics, token cost estimation, and payback modeling.
4. **Technical Scoping & Architecture**: Interactive Draw.io topology blueprinting and migration scoping.

---

## 🚀 Getting Started

The application runs as a unified full-stack Node.js and React service with PostgreSQL persistence and dual-write flat-file resilience.

### Prerequisites
* Node.js (v18+) via NVM
* PostgreSQL (Optional — automatic flat-file dual-write fallback is included)
* `GEMINI_API_KEY` or Google Cloud Application Default Credentials (ADC)

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run the frontend development server
npm run dev

# 3. (Optional) Run the production Express backend & API service
npm start
```

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Repository Structure

```
├── public/                  # Static assets and icons
├── server.js                # Express API backend & PostgreSQL persistence
├── src/                     # React Frontend Application
│   ├── App.jsx              # Application shell, router, and state manager
│   ├── components/          # Assessor modules and UI components
│   ├── data/                # Assessment catalog metadata
│   └── services/            # Vertex AI & Gemini synthesis client
├── vite.config.js           # Build and dev server configuration
└── deploy_to_cloudtop.sh    # Remote workstation deployment automation
```
