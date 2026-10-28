// ScoreX production bootstrap.
// Hydrates DATA_DIR from Google Cloud Storage (when SCOREX_GCS_STATE_BUCKET is configured
// in Cloud Run) BEFORE requiring indexCore.js so all synchronous DataStore and dossier
// repositories load durable state across scale-to-zero and container revisions.
const { hydrateDataDirFromGcs, isDurableGcsEnabled, resolveDataDir } = require('./utils/durableGcsPersistence');

function bootExpressApp() {
  const app = require('./indexCore');
  const { installSecurity } = require('./security/hardening');
  installSecurity(app);
  return app;
}

if (require.main === module && isDurableGcsEnabled()) {
  hydrateDataDirFromGcs(resolveDataDir())
    .catch((err) => {
      console.error(
        '⚠️ [ScoreX DurableGCS] Cold-start hydration warning (unhydrated merge guard active):',
        err.message
      );
    })
    .finally(() => {
      bootExpressApp();
    });
} else {
  module.exports = bootExpressApp();
}
