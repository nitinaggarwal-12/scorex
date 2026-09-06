const express = require('express');
const router = express.Router();

const providers = require('../providers');

/**
 * Coverage metadata for the provider landing pages.
 *
 * Read-only and vendor-scoped: a request for one provider never loads the other's
 * module, so there is no path by which one vendor's content reaches the other's page.
 */
router.get('/:provider/coverage', (req, res) => {
  const provider = providers.normalizeProvider(req.params.provider);

  if (!provider) {
    return res.status(404).json({
      error: 'Unknown provider',
      supported: providers.VALID_PROVIDERS
    });
  }

  try {
    const module_ = providers.loadProviderModule(provider);
    return res.json({ success: true, ...module_.describeCoverage() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load provider', provider });
  }
});

module.exports = router;
