const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const dynamicEngine = require(path.join(ROOT, 'server/services/dynamicAssessmentEngine'));
const audioService = require(path.join(ROOT, 'server/services/audioNarrationService'));
const customRepo = require(path.join(ROOT, 'server/db/customAssessmentRepository'));

test('canonical 6 assessments have zero diagram truncations, consistent financial math, and grounded audio scripts', async () => {
  const dynData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/dynamic_assessments.json'), 'utf8'));
  const instances = Object.values(dynData);
  assert.equal(instances.length, 6);

  for (const inst of instances) {
    const key = inst.typeKey;
    const report = inst.aiReport;
    assert.ok(report && typeof report === 'object', `${key}: Missing aiReport`);

    const diags = report.architectureDiagrams || inst.architectureDiagrams;
    assert.ok(diags && typeof diags === 'object', `${key}: Missing architectureDiagrams`);
    for (const stage of ['currentStateXml', 'transitionStateXml', 'targetStateXml']) {
      const xml = String(diags[stage] || '');
      assert.ok(xml.length > 1000, `${key}.${stage}: XML too short`);
      const dots = xml.match(/[^<>"]*\.\.[^<>"]*/g) || [];
      assert.equal(dots.length, 0, `${key}.${stage}: Found '..' truncation: ${dots[0]}`);
      for (const tier of ['L1 CHANNELS', 'L2 WORKBENCH', 'L3 DATA &amp; MEM', 'L4 EVENT MESH', 'L5 CLOUD INFRA', 'L6 ZERO-TRUST']) {
        assert.ok(xml.includes(tier), `${key}.${stage}: Missing tier ${tier}`);
      }
    }

    const fin = report.financialAnalysis;
    assert.ok(fin && Array.isArray(fin.valueDrivers) && fin.valueDrivers.length === 3, `${key}: Expected 3 valueDrivers`);
    const sumAmountUsd = fin.valueDrivers.reduce((acc, d) => acc + (Number(d.amountUsd) || 0), 0);
    assert.ok(sumAmountUsd > 0, `${key}: Expected positive sum of valueDrivers[i].amountUsd`);
    assert.ok(
      Math.abs(sumAmountUsd - Number(fin.annualSavingsUsd)) <= 5,
      `${key}: Sum of valueDrivers[i].amountUsd ($${sumAmountUsd}) !== fin.annualSavingsUsd ($${fin.annualSavingsUsd})`
    );

    const scriptObj = await audioService.buildDirectorScript(inst, report);
    const script = typeof scriptObj === 'string' ? scriptObj : JSON.stringify(scriptObj);
    assert.ok(!script.includes('Core Architectural Foundation'), `${key}: Audio script fell back to generic 'Core Architectural Foundation'`);
    assert.ok(!script.includes('Strategic Target Capability'), `${key}: Audio script fell back to generic 'Strategic Target Capability'`);
    assert.ok(!/\b[1-5](\.[0-9])?\s+percent\b/i.test(script), `${key}: Audio script misformatted 1-5 score as percent`);
    assert.ok(script.includes('out of 5.0'), `${key}: Audio script missing 'out of 5.0' score scale`);
  }
});

test('vendor-neutral custom assessments across all 6 domains produce zero unmentioned vendor hallucinations or truncations', async () => {
  const types = await customRepo.getAllAssessmentTypes();
  const forbiddenUnmentionedVendors = [
    /\bPinecone\b/i,
    /\bLangChain\b/i,
    /\bTeradata\b/i,
    /\bNetezza\b/i,
    /\bSnowflake\b/i,
    /\bBTEQ\b/i,
    /\bInformatica\b/i,
    /\bTableau\b/i,
    /\bAutosys\b/i,
    /\bSplunk\b/i,
    /\bCrowdStrike\b/i,
    /\bWiz\b/i,
    /\bApptio\b/i,
    /\bCloudHealth\b/i
  ];

  for (const tpl of types) {
    const fw = { ...tpl.framework, typeKey: tpl.typeKey };
    const neutralResponses = {
      baseline_annual_spend_usd: 2500000,
      engineering_fte_count: 30,
      loaded_hourly_rate_usd: 150
    };
    const neutralPains = ['Manual operational workflows', 'Delayed visibility into system telemetry'];
    (fw.dimensions || []).forEach((dim) => {
      (dim.questions || []).forEach((q) => {
        neutralResponses[q.id] = 2;
        neutralResponses[`${q.id}_current_state`] = 2;
        neutralResponses[`${q.id}_future_state`] = 4;
        neutralResponses[`${q.id}_technical_pain`] = ['Manual operational workflows'];
        neutralResponses[`${q.id}_business_pain`] = ['Delayed visibility into system telemetry'];
        neutralResponses[`${q.id}_comment`] = 'Assessed internal enterprise workloads; currently using custom scripts and legacy relational databases.';
      });
    });

    const calc = dynamicEngine.calculateScores(neutralResponses, fw);
    const meta = {
      typeKey: tpl.typeKey,
      customerName: 'Neutral Corp',
      useCase: 'Vendor-Neutral Architecture Modernization',
      responses: neutralResponses
    };
    const rep = dynamicEngine._generateDeterministicReportFallback(fw, meta, calc, neutralPains);
    const { architectureDiagrams, ...reportTextOnly } = rep;
    const serializedReport = JSON.stringify(reportTextOnly);

    for (const rx of forbiddenUnmentionedVendors) {
      const m = serializedReport.match(rx);
      assert.equal(m, null, `${tpl.typeKey} (vendor-neutral report): Hallucinated unmentioned vendor matching ${rx}`);
    }

    for (const stage of ['currentStateXml', 'transitionStateXml', 'targetStateXml']) {
      const xml = String(architectureDiagrams?.[stage] || '');
      for (const rx of forbiddenUnmentionedVendors) {
        const m = xml.match(rx);
        assert.equal(m, null, `${tpl.typeKey}.${stage} (vendor-neutral diagram): Hallucinated unmentioned vendor matching ${rx}`);
      }
      const dots = xml.match(/[^<>"]*\.\.[^<>"]*/g) || [];
      assert.equal(dots.length, 0, `${tpl.typeKey}.${stage} (vendor-neutral diagram): Found '..' truncation: ${dots[0]}`);
    }
  }
});

test('explicit vendor mentions ground EDW report in mentioned vendors without hallucinating unmentioned vendors', async () => {
  const types = await customRepo.getAllAssessmentTypes();
  const edwTpl = types.find(t => t.typeKey === 'edw_lakehouse_to_bigquery_modernization');
  const edwFw = { ...edwTpl.framework, typeKey: edwTpl.typeKey };
  const snowflakeResponses = {
    baseline_annual_spend_usd: 4000000,
    engineering_fte_count: 40,
    loaded_hourly_rate_usd: 150
  };
  (edwFw.dimensions || []).forEach(dim => {
    (dim.questions || []).forEach(q => {
      snowflakeResponses[q.id] = 2;
      snowflakeResponses[`${q.id}_current_state`] = 2;
      snowflakeResponses[`${q.id}_future_state`] = 4;
      snowflakeResponses[`${q.id}_comment`] = 'Migrating from Snowflake and Informatica PowerCenter to Google Cloud BigQuery.';
    });
  });
  const sfCalc = dynamicEngine.calculateScores(snowflakeResponses, edwFw);
  const sfRep = dynamicEngine._generateDeterministicReportFallback(edwFw, {
    typeKey: edwTpl.typeKey,
    customerName: 'Snowflake Customer',
    useCase: 'Snowflake to BigQuery Migration',
    responses: snowflakeResponses
  }, sfCalc, ['High warehouse credit burn']);
  const { architectureDiagrams, ...sfText } = sfRep;
  const sfJson = JSON.stringify(sfText);
  assert.ok(sfJson.includes('Snowflake'));
  assert.ok(sfJson.includes('Informatica'));
  assert.ok(!/Teradata/i.test(sfJson));
  assert.ok(!/BTEQ/i.test(sfJson));
});
