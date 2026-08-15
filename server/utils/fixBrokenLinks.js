/**
 * Fix all broken documentation links in the feature mapper
 * Replace speculative/broken links with actual working Databricks documentation
 */

const fs = require('fs');
const path = require('path');

const brokenLinks = {
  // Links that 404
  'lakebase/index.html': 'delta-live-tables/index.html',
  'lakebase/synced-tables.html': 'ingestion/index.html',
  'sql/language-manual/functions/ai_parse_document.html': 'sql/language-manual/sql-ref-functions-builtin.html',
  'partners/power-platform.html': 'integrations/partners.html',
  'sql/route-optimization.html': 'sql/admin/query-optimization.html',
  'machine-learning/foundation-models/gpt-5.html': 'machine-learning/foundation-models/index.html',
  'administration-guide/cloud-configurations/aws/capacity-blocks.html': 'compute/configure.html',
  'machine-learning/foundation-models/qwen3.html': 'machine-learning/foundation-models/index.html',
  'notebooks/minimap.html': 'notebooks/index.html',
  'data-sharing/row-filters.html': 'data-sharing/index.html',
  'data-sharing/mount-shares.html': 'data-sharing/read-data.html',
  'generative-ai/vector-search/compliance.html': 'generative-ai/vector-search.html',
  'machine-learning/foundation-models/claude-caching.html': 'machine-learning/foundation-models/claude.html',
  'assistant/edit-mode.html': 'assistant/index.html',
  'assistant/compute-integration.html': 'assistant/index.html',
  'repos/git-identity.html': 'repos/index.html',
  'repos/github-app.html': 'repos/repos-setup.html',
  'delta-live-tables/timeline.html': 'delta-live-tables/observability.html',
  'delta-live-tables/run-as-user.html': 'delta-live-tables/index.html',
  'clusters/single-node.html': 'clusters/configure.html',
  'administration-guide/workspace/legacy-features.html': 'workspace/index.html',
  'serverless/base-environments.html': 'serverless-compute/index.html',
  'security/network/serverless-privatelink.html': 'security/network/classic/privatelink.html',
  'delta-live-tables/python-custom-sources.html': 'delta-live-tables/python-ref.html',
  'delta-live-tables/stream-metrics.html': 'delta-live-tables/observability.html',
  'delta-live-tables/scd.html': 'delta-live-tables/cdc.html',
  'ai/explore-llm.html': 'machine-learning/foundation-models/index.html',
  'delta/partition-metadata.html': 'delta/table-details.html',
  'sql/mcp-server.html': 'integrations/index.html',
  'workflows/unified-runs.html': 'workflows/index.html',
  'data-sharing/delta-sharing-federation.html': 'data-sharing/index.html',
  'data-sharing/default-storage.html': 'data-sharing/index.html',
  'machine-learning/serverless-gpu.html': 'machine-learning/train-model/index.html',
  'jobs/serverless-gpu-scheduling.html': 'compute/serverless.html',
  'machine-learning/mlflow-system-tables.html': 'machine-learning/manage-model-lifecycle/index.html',
  'generative-ai/mcp-servers.html': 'generative-ai/agent-framework/index.html',
  'generative-ai/genie-apps.html': 'integrations/genie.html',
  'generative-ai/agent-framework/authorize-user.html': 'generative-ai/agent-framework/index.html',
  'assistant/data-science-agent.html': 'assistant/index.html',
  'data-governance/certification.html': 'data-governance/unity-catalog/index.html',
};

const filePath = path.join(__dirname, '../services/databricksFeatureMapper.js');
let content = fs.readFileSync(filePath, 'utf8');

let replacements = 0;
for (const [broken, fixed] of Object.entries(brokenLinks)) {
  const brokenUrl = `https://docs.databricks.com/${broken}`;
  const fixedUrl = `https://docs.databricks.com/${fixed}`;
  
  if (content.includes(brokenUrl)) {
    content = content.replace(new RegExp(brokenUrl.replace(/\//g, '\\/'), 'g'), fixedUrl);
    replacements++;
    console.log(`✅ Fixed: ${broken} → ${fixed}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 Fixed ${replacements} broken documentation links!`);






