// Databricks Maturity Assessment Framework
// Updated to match user's 6-pillar, 5-dimension, 2-question structure

// Import all pillar definitions
const platformGovernancePillar = require('./pillars/pillar1-platform-governance');
const dataEngineeringPillar = require('./pillars/pillar2-data-engineering');
const analyticsBIPillar = require('./pillars/pillar3-analytics-bi');
const machineLearningPillar = require('./pillars/pillar4-machine-learning');
const generativeAIPillar = require('./pillars/pillar5-generative-ai');
const operationalExcellencePillar = require('./pillars/pillar6-operational-excellence');

const assessmentFramework = {
  assessmentAreas: [
    platformGovernancePillar,
    dataEngineeringPillar,
    analyticsBIPillar,
    machineLearningPillar,
    generativeAIPillar,
    operationalExcellencePillar
  ],

  maturityLevels: {
    1: {
      level: 'Explore',
      description: 'Ad-hoc, manual processes with limited standardization',
      color: '#ff4444'
    },
    2: {
      level: 'Experiment',
      description: 'Basic implementation with some repeatability',
      color: '#ff8800'
    },
    3: {
      level: 'Formalize',
      description: 'Documented standards and processes consistently followed',
      color: '#ffaa00'
    },
    4: {
      level: 'Optimize',
      description: 'Advanced automation and continuous improvement',
      color: '#88cc00'
    },
    5: {
      level: 'Transform',
      description: 'Industry-leading practices with AI-driven optimization',
      color: '#00cc44'
    }
  }
};

module.exports = assessmentFramework;