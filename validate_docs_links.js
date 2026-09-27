/**
 * Databricks Documentation Link Validator
 * 
 * This script validates all Databricks documentation links used in the system.
 * It checks if the links are accessible and returns the correct status codes.
 */

const https = require('https');
const http = require('http');

// All documentation links from intelligentRecommendationEngine_v2.js
const docsLinks = {
  'Unity Catalog': 'https://docs.databricks.com/en/data-governance/unity-catalog/index.html',
  'Audit Logs': 'https://docs.databricks.com/en/admin/account-settings/audit-logs.html',
  'Delta Sharing': 'https://docs.databricks.com/en/data-sharing/index.html',
  'Delta Live Tables': 'https://docs.databricks.com/en/delta-live-tables/index.html',
  'Lakehouse Monitoring': 'https://docs.databricks.com/en/lakehouse-monitoring/index.html',
  'Photon': 'https://docs.databricks.com/en/compute/photon.html',
  'Serverless SQL': 'https://docs.databricks.com/en/sql/admin/serverless.html',
  'Liquid Clustering': 'https://docs.databricks.com/en/delta/clustering.html',
  'MLflow': 'https://docs.databricks.com/en/mlflow/index.html',
  'Model Serving': 'https://docs.databricks.com/en/machine-learning/model-serving/index.html',
  'Vector Search': 'https://docs.databricks.com/en/generative-ai/vector-search.html',
  'AI Gateway': 'https://docs.databricks.com/en/generative-ai/ai-gateway.html',
  'Workflows': 'https://docs.databricks.com/en/jobs/index.html',
  'Auto Loader': 'https://docs.databricks.com/en/ingestion/auto-loader/index.html',
  'Databricks Asset Bundles': 'https://docs.databricks.com/en/dev-tools/bundles/index.html',
  'Feature Store': 'https://docs.databricks.com/en/machine-learning/feature-store/index.html',
  'Databricks Academy': 'https://www.databricks.com/learn/training',
  'System Tables': 'https://docs.databricks.com/en/admin/system-tables/index.html',
  'Cluster Policies': 'https://docs.databricks.com/en/admin/clusters/policies.html',
  'Row-Level Security': 'https://docs.databricks.com/en/data-governance/unity-catalog/row-and-column-filters.html',
  'Column Masking': 'https://docs.databricks.com/en/data-governance/unity-catalog/row-and-column-filters.html',
  'Data Lineage': 'https://docs.databricks.com/en/data-governance/unity-catalog/data-lineage.html',
  'Data Classification': 'https://docs.databricks.com/en/data-governance/unity-catalog/tags.html',
  'Clean Rooms': 'https://docs.databricks.com/en/data-sharing/clean-rooms.html'
};

/**
 * Check if a URL is accessible
 */
function checkLink(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkValidator/1.0)'
      }
    };

    const req = protocol.request(url, options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        location: res.headers.location || null,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message,
        ok: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        error: 'Request timeout',
        ok: false
      });
    });

    req.end();
  });
}

/**
 * Validate all links
 */
async function validateAllLinks() {
  console.log('🔍 Validating Databricks Documentation Links...\n');
  console.log(`Total links to validate: ${Object.keys(docsLinks).length}\n`);

  const results = [];
  const broken = [];
  const redirects = [];

  for (const [feature, url] of Object.entries(docsLinks)) {
    console.log(`Checking: ${feature}...`);
    const result = await checkLink(url);
    results.push({ feature, ...result });

    if (!result.ok) {
      broken.push({ feature, url, status: result.status, error: result.error });
      console.log(`  ❌ BROKEN (${result.status}${result.error ? ': ' + result.error : ''})`);
    } else if (result.location) {
      redirects.push({ feature, url, redirectsTo: result.location });
      console.log(`  ⚠️  REDIRECT (${result.status}) → ${result.location}`);
    } else {
      console.log(`  ✅ OK (${result.status})`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(80));

  const okCount = results.filter(r => r.ok && !r.location).length;
  const redirectCount = redirects.length;
  const brokenCount = broken.length;

  console.log(`\n✅ Working Links: ${okCount}/${results.length}`);
  console.log(`⚠️  Redirected Links: ${redirectCount}/${results.length}`);
  console.log(`❌ Broken Links: ${brokenCount}/${results.length}`);

  if (redirects.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('⚠️  REDIRECTED LINKS (Should be updated):');
    console.log('-'.repeat(80));
    redirects.forEach(({ feature, url, redirectsTo }) => {
      console.log(`\n${feature}:`);
      console.log(`  Old: ${url}`);
      console.log(`  New: ${redirectsTo}`);
    });
  }

  if (broken.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('❌ BROKEN LINKS (Must be fixed):');
    console.log('-'.repeat(80));
    broken.forEach(({ feature, url, status, error }) => {
      console.log(`\n${feature}:`);
      console.log(`  URL: ${url}`);
      console.log(`  Status: ${status}`);
      if (error) console.log(`  Error: ${error}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  
  // Return results for programmatic use
  return {
    total: results.length,
    ok: okCount,
    redirects: redirectCount,
    broken: brokenCount,
    results,
    brokenLinks: broken,
    redirectedLinks: redirects
  };
}

// Run validation if executed directly
if (require.main === module) {
  validateAllLinks()
    .then((summary) => {
      if (summary.broken > 0 || summary.redirects > 0) {
        console.log(`\n⚠️  Action required: ${summary.broken} broken link(s) and ${summary.redirects} redirect(s) found.`);
        process.exit(1);
      } else {
        console.log('\n✅ All links are valid!');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('\n❌ Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { validateAllLinks, checkLink, docsLinks };

