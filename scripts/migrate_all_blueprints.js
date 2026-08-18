/**
 * Migration Script: Propagate PromptCanvas Master Architecture Blueprints across ALL stored assessments
 */
const fs = require('fs');
const path = require('path');
const masterCatalog = require('../server/services/masterBlueprintCatalog');

const instancesPath = path.join(__dirname, '../data/dynamic_assessments.json');
const typesPath = path.join(__dirname, '../data/custom_assessment_types.json');

console.log('🔄 Starting Blueprint Migration across all assessment data files...');

let migratedInstancesCount = 0;
if (fs.existsSync(instancesPath)) {
  const instancesData = JSON.parse(fs.readFileSync(instancesPath, 'utf8'));
  for (const id of Object.keys(instancesData)) {
    const inst = instancesData[id];
    const fw = inst.frameworkSnapshot || {};
    const metadata = {
      customerName: inst.customerName || 'Enterprise Client',
      useCase: inst.useCase || 'Platform Modernization'
    };
    const scores = {
      overallScore: inst.totalScore || 2.8,
      targetScore: 4.5
    };

    const blueprints = masterCatalog.getMasterArchitectureDiagrams(fw, metadata, scores);

    // Update instance executive report diagrams and root diagrams
    if (!inst.executiveReport) inst.executiveReport = {};
    inst.executiveReport.architectureDiagrams = blueprints;
    inst.architectureDiagrams = blueprints;
    migratedInstancesCount++;
  }
  fs.writeFileSync(instancesPath, JSON.stringify(instancesData, null, 2), 'utf8');
  console.log(`✅ Successfully migrated ${migratedInstancesCount} instances in data/dynamic_assessments.json!`);
} else {
  console.warn('⚠️ instancesPath does not exist:', instancesPath);
}

let migratedTypesCount = 0;
if (fs.existsSync(typesPath)) {
  const typesData = JSON.parse(fs.readFileSync(typesPath, 'utf8'));
  for (const key of Object.keys(typesData)) {
    const tpl = typesData[key];
    const fw = tpl.framework || {};
    const blueprints = masterCatalog.getMasterArchitectureDiagrams(fw, { customerName: 'Enterprise Client' }, { overallScore: 2.8, targetScore: 4.5 });
    tpl.architectureDiagrams = blueprints;
    if (tpl.framework) {
      tpl.framework.architectureDiagrams = blueprints;
    }
    migratedTypesCount++;
  }
  fs.writeFileSync(typesPath, JSON.stringify(typesData, null, 2), 'utf8');
  console.log(`✅ Successfully migrated ${migratedTypesCount} templates in data/custom_assessment_types.json!`);
}

console.log('🎉 All blueprints successfully propagated across all assessments!');
