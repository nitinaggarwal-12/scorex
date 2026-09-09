import os
import re

SERVER_FILE = "/Users/nitinagga/Documents/scorex/server/services/masterBlueprintCatalog.js"
CLIENT_FILE = "/Users/nitinagga/Documents/scorex/client/src/services/masterBlueprintCatalog.js"

from scratch.test_xml_builders import (
    build_legacy_genai_xml,
    build_legacy_finops_xml,
    build_legacy_edw_xml,
    build_legacy_agentic_xml
)

GENAI_BODY = build_legacy_genai_xml("Enterprise Organization")
FINOPS_BODY = build_legacy_finops_xml("Enterprise Organization")
EDW_BODY = build_legacy_edw_xml("Enterprise Organization")
AGENTIC_BODY = build_legacy_agentic_xml("Enterprise Organization")

JS_FUNCTIONS = f"""
// ===== Sourced from build_master_legacy_genai_stack.ts =====
function buildLegacyGenAiStackXml(cust = 'Enterprise Organization') {{
  return `{GENAI_BODY}`.trim();
}}

// ===== Sourced from build_master_legacy_finops_waste.ts =====
function buildLegacyFinOpsWasteXml(cust = 'Enterprise Organization') {{
  return `{FINOPS_BODY}`.trim();
}}

// ===== Sourced from build_master_legacy_edw_silos.ts =====
function buildLegacyEdwSiloXml(cust = 'Enterprise Organization') {{
  return `{EDW_BODY}`.trim();
}}

// ===== Sourced from build_master_legacy_agentic_fragility.ts =====
function buildLegacyAgenticXml(cust = 'Enterprise Organization') {{
  return `{AGENTIC_BODY}`.trim();
}}
"""

NEW_GET_MASTER = """/**
 * Dispatch bespoke, high-craft PromptCanvas Draw.io XML blueprints tailored to the assessment framework
 */
function getMasterArchitectureDiagrams(framework = {}, metadata = {}, scores = {}) {
  const key = (framework.typeKey || "").toLowerCase();
  const title = (framework.title || "").toLowerCase();
  const cust = metadata.customerName || "Enterprise Organization";
  const lvl = scores.overallScore ? Number(scores.overallScore).toFixed(1) : "2.7";
  const tgt = scores.overallScore ? Math.min(5.0, Number(scores.overallScore) + 1.8).toFixed(1) : "4.5";

  const isAgenticMesh = key.includes("agentic") || key.includes("mcp") || key.includes("banking") || title.includes("agentic") || title.includes("multi-agent") || title.includes("mcp");
  const isGenAIReadiness = (key.includes("genai") || title.includes("genai")) && !key.includes("openai") && !key.includes("mesh");
  const isOpenAI = key.includes("openai") || (key.includes("gemini") && key.includes("migration")) || title.includes("openai");
  const isSecurity = key.includes("security") || key.includes("zero_trust") || key.includes("ciso") || title.includes("security") || title.includes("zero trust");
  const isLakehouse = key.includes("lakehouse") || key.includes("bigquery") || key.includes("edw") || key.includes("snowflake") || key.includes("teradata") || title.includes("lakehouse") || title.includes("bigquery") || title.includes("snowflake");
  const isFinOps = key.includes("finops") || key.includes("cost") || key.includes("billing") || title.includes("finops") || title.includes("cost");

  // Helper to customize XML title with customer name and score
  const customizeXml = (xmlStr, curOrTgt, titleText) => {
    if (!xmlStr) return '';
    let res = xmlStr
      .replace(/Enterprise Organization/g, cust)
      .replace(/Acme Global/g, cust)
      .replace(/Acme Health Systems/g, cust)
      .replace(/Apex Health Systems/g, cust)
      .replace(/ENTERPRISE CLIENT/g, cust.toUpperCase());

    if (metadata.industry) {
      res = res.replace(/Retail & Consumer Goods/g, metadata.industry)
               .replace(/Healthcare & Life Sciences/g, metadata.industry);
    }

    if (metadata.detectedTechnologies && Array.isArray(metadata.detectedTechnologies) && metadata.detectedTechnologies.length > 0) {
      const topTechs = metadata.detectedTechnologies.slice(0, 4).join(', ');
      res = res.replace(/MySQL &amp; PostgreSQL/g, topTechs)
               .replace(/MySQL & PostgreSQL/g, topTechs);
    }
    return res;
  };

  // 1. OPENAI TO GEMINI ENTERPRISE MIGRATION
  if (isOpenAI) {
    return {
      currentTitle: `Current Baseline: Fragile OpenAI Endpoints & High Token Costs (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • ARCH-GENAI-01 OpenAI Wrapper • Unmanaged API Keys`,
      curReasoning: "Proprietary SDK hardcoding, unmanaged public egress endpoints, lack of prompt caching, and 8k token context fragmentation cause high token burn and vendor lock-in.",
      currentStateXml: customizeXml(buildLegacyGenAiStackXml(cust), 'current', 'OpenAI Legacy Stack'),
      targetTitle: `Target State: Google Vertex AI & Gemini Enterprise Agent Platform (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P4-AI-P-04 Agent Runtime • 2M Context • Model Armor`,
      targetStateXml: customizeXml(buildEnterpriseAgentRuntimeXml(), 'target', 'Vertex AI & Gemini Runtime'),
      transformations: [
        "Migrate brittle OpenAI API calls to Apigee Enterprise AI Gateway with VPC Service Controls (P4-AI-P-04)",
        "Replace 8k lossy RAG chunking with Vertex AI Gemini 2.5/3.7 native 2M long-context window processing",
        "Enable Vertex AI Context Caching for 75% input token discount and sub-200ms latency on cached system prompts",
        "Deploy Google Cloud Model Armor and Model Context Protocol (MCP) tool mesh for sandboxed multi-agent defense"
      ],
      blueprintKeys: ["P4-AI-P-04", "P3-AI-L-02", "ARCH-MCP-06", "P4-GOV-L-07"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 2. FINOPS & CLOUD COST OPTIMIZATION
  if (isFinOps) {
    return {
      currentTitle: `Current Baseline: Uncontrolled Multi-Cloud Spend & Idle Waste (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • P2-GOV-C-01 Waste Breakdown • 40% Untagged Resources`,
      curReasoning: "Missing resource tagging, static 24/7 cluster over-provisioning, unmanaged Kubernetes pods, and uncoordinated on-demand spend lead to severe cloud financial waste.",
      currentStateXml: customizeXml(buildLegacyFinOpsWasteXml(cust), 'current', 'FinOps Legacy Gaps'),
      targetTitle: `Target State: Automated FinOps Chargeback & Capacity Governor (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P2-GOV-C-01 FinOps Model • P5-AI-L-05 Quota Governor`,
      targetStateXml: customizeXml(buildPristineFinopsXml(), 'target', 'FinOps & Chargeback Model'),
      transformations: [
        "Automate multi-cloud billing export to partitioned BigQuery FOCUS 1.0 schema for 100% cost transparency (P2-GOV-C-01)",
        "Deploy OpenCost / Kubecost pod-level metering on GKE Autopilot to establish exact business unit chargeback",
        "Enforce automated resource rightsizing and 15-minute idle compute kill-switches with Cloud Functions",
        "Implement automated CUD optimization and real-time billing anomaly alerts with BigQuery ML forecasting"
      ],
      blueprintKeys: ["P2-GOV-C-01", "P5-AI-L-05", "P3-APP-C-01"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 3. AUTONOMOUS MULTI-AGENT AI MESH & MCP
  if (isAgenticMesh) {
    return {
      currentTitle: `Current Baseline: Siloed Single-Threaded Chatbots & Tool Fragility (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • ARCH-AGT-01 Fragmented Bots • Point-to-Point Scripts`,
      curReasoning: "Isolated departmental chatbots, hardcoded prompt templates, uncoordinated backend integrations, and absence of standardized tool protocols prevent enterprise scale.",
      currentStateXml: customizeXml(buildLegacyAgenticXml(cust), 'current', 'Siloed Chatbots'),
      targetTitle: `Target State: Autonomous Hub-and-Spoke Agent Mesh & MCP Gateway (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P3-AI-L-03 Agent Mesh • ARCH-MCP-06 MCP Gateway`,
      targetStateXml: customizeXml(buildHubAndSpokeAgentConfigXml(), 'target', 'Hub-and-Spoke Agent Mesh'),
      transformations: [
        "Deploy centralized Hub-and-Spoke Agent Mesh with Gemini 3.7 Super-Orchestrator and specialized sub-agents (P3-AI-L-03)",
        "Standardize tool execution on Model Context Protocol (MCP) microservices with Apigee governance (ARCH-MCP-06)",
        "Implement circular ReAct reasoning loop with Vertex AI Vector Search grounding and sub-500ms TTFT (P3-AI-L-02)",
        "Integrate Model Armor prompt injection shielding and human-in-the-loop (HITL) review gates for high-stakes actions"
      ],
      blueprintKeys: ["P3-AI-L-03", "ARCH-MCP-06", "P4-AI-P-04", "P4-GOV-L-06"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 4. EDW / SNOWFLAKE / TERADATA TO BIGQUERY
  if (isLakehouse) {
    return {
      currentTitle: `Current Baseline: Siloed Proprietary EDW & Egress Friction (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • ARCH-EDW-02 Legacy EDW Silos • 24h Batch Bottlenecks`,
      curReasoning: "Proprietary database lock-in (Teradata/Snowflake/Oracle), high inter-cloud egress fees, 24-hour batch replication lag, and disjoint data catalogs create operational bottlenecks.",
      currentStateXml: customizeXml(buildLegacyEdwSiloXml(cust), 'current', 'Legacy EDW Silos'),
      targetTitle: `Target State: GCP Enterprise Data Lakehouse & BigLake Medallion Mesh (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P3-DAT-L-04 Medallion Fabric • BigLake Iceberg`,
      targetStateXml: customizeXml(buildDataLakehouseXml(), 'target', 'BigLake Enterprise Lakehouse'),
      transformations: [
        "Replace legacy batch ETL with Datastream CDC and BigQuery Storage Write API for real-time replication (P4-DAT-P-13)",
        "Adopt BigLake Apache Iceberg open table formats (P3-DAT-L-04) to eliminate proprietary data lock-in and egress fees",
        "Consolidate compute on BigQuery Editions autoscaling slots and BigQuery Omni for cross-cloud querying",
        "Deploy Looker Semantic Layer and Dataplex Universal Catalog with automated row/column masking"
      ],
      blueprintKeys: ["P3-DAT-L-04", "P4-DAT-P-13", "P3-APP-C-01", "P3-DAT-C-06"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 5. ENTERPRISE AI & ZERO-TRUST SECURITY
  if (isSecurity) {
    return {
      currentTitle: `Current Baseline: Shadow AI Exposure & STRIDE Threat Vectors (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • ARCH-SEC-04 STRIDE Threat Matrix • Unfiltered Prompts`,
      curReasoning: "Unfiltered LLM API access, static API keys in code repositories, lack of prompt injection firewalls, and manual SOC2 audit compliance create high security risk.",
      currentStateXml: customizeXml(buildThreatModelingStrideXml(), 'current', 'STRIDE Threat Model'),
      targetTitle: `Target State: Zero-Trust Secure AI Deployment & TRiSM Defense Shield (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P4-SEC-P-01 Secure Topology • P4-GOV-L-07 TRiSM`,
      targetStateXml: customizeXml(buildSecureDeploymentTopologyXml(), 'target', 'Zero-Trust AI SASE & Deployment'),
      transformations: [
        "Establish Zero-Trust SASE perimeter with Cloud Armor WAF and Identity-Aware Proxy (IAP) (P4-SEC-P-01)",
        "Enforce AI TRiSM guardrails with Cloud DLP automated surrogate tokenization and Model Armor (P4-GOV-L-07)",
        "Implement Private GKE Autopilot clusters with gVisor sandboxing and Binary Authorization attestation",
        "Enforce hardware-backed Cloud KMS HSM CMEK encryption and Chronicle 24/7 AI security monitoring"
      ],
      blueprintKeys: ["ARCH-SEC-04", "P4-SEC-P-01", "P4-GOV-L-07", "P4-SEC-P-02"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 6. GENAI ENTERPRISE READINESS
  if (isGenAIReadiness) {
    return {
      currentTitle: `Current Baseline: Fragmented Departmental AI Sandboxes (${cust})`,
      currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • ARCH-GENAI-01 Departmental POCs • Ad-Hoc Evaluation`,
      curReasoning: "Disjointed departmental POCs, unbenchmarked LLM accuracy, lack of centralized model evaluation, and absent guardrails prevent production deployment.",
      currentStateXml: customizeXml(buildLegacyGenAiStackXml(cust), 'current', 'Departmental POCs'),
      targetTitle: `Target State: Enterprise GenAI Platform & Automated Evaluation Suite (${cust})`,
      targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P4-GOV-L-06 Evaluation Suite • Vertex Model Garden`,
      targetStateXml: customizeXml(buildEvalSafetyXml(), 'target', 'GenAI Platform & Evaluation'),
      transformations: [
        "Deploy enterprise GenAI gateway with Vertex AI Model Garden for multi-model access (P4-GOV-L-06)",
        "Implement automated LLM evaluation pipeline for hallucination detection, factuality, and safety metrics",
        "Deploy cognitive agentic RAG with Vertex Vector Search and multimodal embeddings (P3-AI-L-02)",
        "Standardize enterprise prompt templates and automated regression benchmarks in CI/CD"
      ],
      blueprintKeys: ["P4-GOV-L-06", "P3-AI-L-02", "P4-AI-P-04", "P4-GOV-L-07"],
      modelUsed: "gemini-3.7-flash",
      generatedAt: new Date().toISOString()
    };
  }

  // 7. FLAGSHIP ENTERPRISE DATA & AI MATURITY (DEFAULT)
  return {
    currentTitle: `Current Baseline: Legacy Data Silos & Fragile Dependencies (${cust})`,
    currentSubtitle: `Maturity Level ${lvl}/5.0 (Developing) • P1-APP-L-01 Silo Dependency • 24-48h Batch Lag`,
    curReasoning: "Fragmented legacy pipelines, on-prem databases (Oracle/SQL Server/Hadoop), and unmanaged cron jobs cause high failure rates, unmonitored infrastructure spend, and delayed business analytics.",
    currentStateXml: customizeXml(buildLegacyDataDependencyMapXml(), 'current', 'Legacy Silos & Dependencies'),
    targetTitle: `Target State: Total Unified Enterprise System Architecture & Medallion Mesh (${cust})`,
    targetSubtitle: `Target Maturity Level ${tgt}/5.0 (Optimized) • P3-APP-C-01 Panoramic Master Blueprint • BigLake Lakehouse`,
    targetStateXml: customizeXml(buildCompleteWellArchitectedGcpDrMasterXml(), 'target', 'Total Unified System View'),
    transformations: [
      "Transform on-prem legacy silos into a Panoramic Enterprise Architecture on Google Cloud (P3-APP-C-01)",
      "Unify batch and real-time streaming with Apache Iceberg / BigLake Medallion Lakehouse (P3-DAT-L-04)",
      "Deploy Vertex AI Agent Builder with compound multi-agent mesh and Model Context Protocol (P3-AI-L-03)",
      "Enforce Zero-Trust VPC Service Controls, Cloud KMS HSM CMEK, and continuous Dataplex governance (P4-SEC-P-02)"
    ],
    blueprintKeys: ["P1-APP-L-01", "P1-GOV-C-04", "P3-APP-C-01", "P3-DAT-L-04", "P2-GOV-C-01", "P4-SEC-P-02"],
    modelUsed: "gemini-3.7-flash",
    generatedAt: new Date().toISOString()
  };
}"""

def patch_file(filepath, is_client=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace getMasterArchitectureDiagrams block
    pattern_get_master = re.compile(
        r"/\*\*\s*\*\s*Dispatch bespoke, high-craft PromptCanvas Draw\.io XML blueprints tailored to the assessment framework\s*\*/\s*function getMasterArchitectureDiagrams\(framework = \{\}, metadata = \{\}, scores = \{\}\) \{.*?\n\}",
        re.DOTALL
    )
    if not pattern_get_master.search(content):
        print(f"❌ Could not find getMasterArchitectureDiagrams in {filepath}")
        return False

    # Prepend the new functions right before getMasterArchitectureDiagrams
    replacement = JS_FUNCTIONS + "\n" + NEW_GET_MASTER
    new_content = pattern_get_master.sub(replacement, content, count=1)

    # 2. Add new exports
    new_exports = """  buildLegacyGenAiStackXml,
  buildLegacyFinOpsWasteXml,
  buildLegacyEdwSiloXml,
  buildLegacyAgenticXml,"""

    if is_client:
        # In client, export { ... }
        if "buildLegacyGenAiStackXml" not in new_content:
            new_content = new_content.replace(
                "export {\n  getMasterArchitectureDiagrams,",
                f"export {{\n  getMasterArchitectureDiagrams,\n{new_exports}"
            )
    else:
        # In server, module.exports = { ... }
        if "buildLegacyGenAiStackXml" not in new_content:
            new_content = new_content.replace(
                "module.exports = {\n  getMasterArchitectureDiagrams,",
                f"module.exports = {{\n  getMasterArchitectureDiagrams,\n{new_exports}"
            )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ Patched {filepath} successfully!")
    return True

patch_file(SERVER_FILE, is_client=False)
patch_file(CLIENT_FILE, is_client=True)
