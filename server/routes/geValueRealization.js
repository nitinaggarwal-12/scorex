const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
  EVIDENCE_FACTORS,
  GE_MODULES,
  RESPONDENT_FORMS,
  KPA_DEFINITIONS,
  RUBRIC_TEMPLATES,
  GE_QUESTIONS,
  DEFAULT_BIONOVA_WORKFLOWS,
  DEFAULT_BIONOVA_GEOGRAPHIES,
  createInitialGeDossier,
  evaluateGeValueRealization
} = require('../data/geValueRealizationFramework');
const {
  ALL_SOURCE_TYPES,
  TIME_PRESETS,
  searchSalesforceCustomers,
  pickRandomSalesforceCustomer,
  resolveSalesforceAccount,
  ingestCustomerMultiSourceDossier,
  generateGeminiAssessmentReport
} = require('../services/geCustomerMultiSourceIngestor');

const DOSSIERS_FILE = path.join(__dirname, '../../data/ge_value_realization_dossiers.json');

function loadServerDossiers() {
  try {
    if (fs.existsSync(DOSSIERS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DOSSIERS_FILE, 'utf8'));
      if (parsed && Object.keys(parsed).length > 0) {
        const primaryEntry = parsed['ge_vr_acc-1001-aerovg'] || parsed['inst_aerovanguard_ge_value_realization'];
        const hasCandidateOptions = Array.isArray(primaryEntry?.questionResponses?.C01?.candidateOptions);
        const hasNormalizedTelemetry = primaryEntry?.adoptionTelemetry?.geminiAssistWau7d !== undefined;
        if (hasCandidateOptions && hasNormalizedTelemetry) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Could not read ge_value_realization_dossiers.json:', e.message);
  }
  const seededAeroVanguard = ingestCustomerMultiSourceDossier({
    sfdcAccountId: 'ACC-1001-AEROVG',
    timePreset: 'ytd_2026',
    prefillMode: 'evidence'
  });
  const seededBioNova = ingestCustomerMultiSourceDossier({
    sfdcAccountId: 'ACC-1002-BIONOVA',
    timePreset: 'ytd_2026',
    prefillMode: 'evidence'
  });
  const initialMap = {
    [seededAeroVanguard.id]: seededAeroVanguard,
    [seededBioNova.id]: seededBioNova
  };
  saveServerDossiers(initialMap);
  return initialMap;
}

function saveServerDossiers(dossiers) {
  try {
    const dir = path.dirname(DOSSIERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DOSSIERS_FILE, JSON.stringify(dossiers, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write ge_value_realization_dossiers.json:', e.message);
  }
}

router.get('/framework', (req, res) => {
  return res.json({
    success: true,
    framework: {
      EVIDENCE_FACTORS,
      GE_MODULES,
      RESPONDENT_FORMS,
      KPA_DEFINITIONS,
      RUBRIC_TEMPLATES,
      GE_QUESTIONS,
      DEFAULT_BIONOVA_WORKFLOWS,
      DEFAULT_BIONOVA_GEOGRAPHIES,
      ALL_SOURCE_TYPES,
      TIME_PRESETS
    }
  });
});

/**
 * Search Enterprise GE Customers by Customer Name, Alias, Industry, or Account ID (ACC-...)
 */
router.get('/customers/search', (req, res) => {
  try {
    const q = req.query.q || '';
    const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 25));
    const customers = searchSalesforceCustomers(q, limit);
    return res.json({
      success: true,
      query: q,
      count: customers.length,
      customers,
      allSources: ALL_SOURCE_TYPES,
      timePresets: TIME_PRESETS
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Pick a random customer from the synthetic enterprise catalog
 */
router.get('/customers/random', (req, res) => {
  try {
    const poolMode = req.query.pool || 'active_enterprise';
    const excludeId = req.query.exclude || '';
    const customer = pickRandomSalesforceCustomer(poolMode, excludeId);
    return res.json({
      success: true,
      customer
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Ingest & Reconcile Multi-Source Evidence for ANY Enterprise Customer Name or Account ID (ACC-...)
 * filtered by Time Period (startDate -> endDate / timePreset) across all 8 Enterprise Sources,
 * and populate the 82-question questionnaire (supports prefillMode: 'evidence' | 'random' | 'clean').
 */
router.post('/ingest-customer', (req, res) => {
  try {
    const {
      customerQuery = '',
      sfdcAccountId = '',
      timePreset = 'ytd_2026',
      startDate = '',
      endDate = '',
      sources,
      prefillMode = 'evidence',
      randomCustomer = false,
      randomPoolMode = 'active_enterprise',
      customCustomerDetails = null
    } = req.body || {};

    const ingestedDossier = ingestCustomerMultiSourceDossier({
      customerQuery,
      sfdcAccountId,
      timePreset,
      startDate,
      endDate,
      sources,
      prefillMode,
      randomCustomer,
      randomPoolMode,
      customCustomerDetails
    });

    const dossiers = loadServerDossiers();
    dossiers[ingestedDossier.id] = ingestedDossier;
    saveServerDossiers(dossiers);

    return res.json({
      success: true,
      dossier: ingestedDossier,
      ingestionAudit: ingestedDossier.ingestionAudit
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Submit All 82 Questions & Selected Options to Gemini API to Regenerate the Executive Value Realization Report
 */
router.post('/generate-gemini-report', async (req, res) => {
  try {
    const incomingDossier = req.body?.dossier || req.body || {};
    const updatedDossier = await generateGeminiAssessmentReport(incomingDossier);

    const dossiers = loadServerDossiers();
    const id = updatedDossier.id || 'ge_vr_acc-1001-aerovg';
    dossiers[id] = updatedDossier;
    saveServerDossiers(dossiers);

    return res.json({
      success: true,
      dossier: updatedDossier,
      geminiReport: updatedDossier.geminiReport,
      evaluation: updatedDossier.evaluation
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/dossiers', (req, res) => {
  try {
    const dossiers = loadServerDossiers();
    return res.json({
      success: true,
      dossiers: Object.values(dossiers)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/dossiers/:id', (req, res) => {
  try {
    const dossiers = loadServerDossiers();
    const id = req.params.id;
    let dossier = dossiers[id];

    if (!dossier && (id === 'aerovanguard_default' || id === 'inst_aerovanguard_ge_value_realization')) {
      dossier = dossiers['ge_vr_acc-1001-aerovg'] || ingestCustomerMultiSourceDossier({
        sfdcAccountId: 'ACC-1001-AEROVG',
        timePreset: 'ytd_2026'
      });
      dossiers[dossier.id] = dossier;
      saveServerDossiers(dossiers);
    } else if (!dossier && (id === 'inst_bionova_ge_value_realization' || id === 'bionova_ge_vr_2026_q2' || id === 'bionova')) {
      dossier = dossiers['ge_vr_acc-1002-bionova'] || ingestCustomerMultiSourceDossier({
        sfdcAccountId: 'ACC-1002-BIONOVA',
        timePreset: 'ytd_2026'
      });
      dossiers[dossier.id] = dossier;
      saveServerDossiers(dossiers);
    } else if (!dossier && id === 'clean_intake') {
      dossier = createInitialGeDossier('clean');
      dossier.id = 'clean_intake';
      dossier.evaluation = evaluateGeValueRealization(dossier);
    } else if (!dossier && id.startsWith('ge_vr_')) {
      const extractedSfdcId = id.replace(/^ge_vr_/i, '');
      dossier = ingestCustomerMultiSourceDossier({
        sfdcAccountId: extractedSfdcId,
        timePreset: 'ytd_2026'
      });
      dossiers[dossier.id] = dossier;
      saveServerDossiers(dossiers);
    }

    if (!dossier) {
      return res.status(404).json({ success: false, error: 'Dossier not found' });
    }

    // Refresh if older cached dossier lacks candidateOptions on questionResponses
    if ((!dossier.ingestionAudit || !Array.isArray(dossier.questionResponses?.A01?.candidateOptions)) && dossier.meta?.vectorAccountId) {
      const refreshed = ingestCustomerMultiSourceDossier({
        sfdcAccountId: dossier.meta.vectorAccountId,
        timePreset: 'ytd_2026'
      });
      dossier = {
        ...refreshed,
        id: dossier.id
      };
      dossiers[id] = dossier;
      saveServerDossiers(dossiers);
    }

    dossier.evaluation = evaluateGeValueRealization(dossier);
    return res.json({
      success: true,
      dossier
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dossiers/:id', (req, res) => {
  try {
    const dossiers = loadServerDossiers();
    const id = req.params.id;
    const incoming = req.body || {};
    const existing = dossiers[id] || createInitialGeDossier(incoming.mode || 'bionova_draft');

    const updated = {
      ...existing,
      ...incoming,
      id
    };
    updated.evaluation = evaluateGeValueRealization(updated);

    dossiers[id] = updated;
    saveServerDossiers(dossiers);

    return res.json({
      success: true,
      dossier: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/evaluate', (req, res) => {
  try {
    const dossier = req.body || createInitialGeDossier('bionova_draft');
    const evaluation = evaluateGeValueRealization(dossier);
    return res.json({
      success: true,
      evaluation
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/dossiers/:id', (req, res) => {
  try {
    const dossiers = loadServerDossiers();
    const id = req.params.id;
    if (dossiers[id]) {
      delete dossiers[id];
      saveServerDossiers(dossiers);
    }
    return res.json({ success: true, deletedId: id });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
