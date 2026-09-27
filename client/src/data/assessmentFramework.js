// Simplified assessment framework for client-side use
// Contains only pillar structure (no detailed questions)

const assessmentFramework = {
  assessmentAreas: [
    {
      id: 'platform_governance',
      name: 'Platform & Governance',
      description: 'Establish trust in data to accelerate & improve decisions',
      order: 1
    },
    {
      id: 'data_engineering',
      name: 'Data Engineering & Integration',
      description: 'Ingest, transform, and deliver high-quality data',
      order: 2
    },
    {
      id: 'analytics_bi',
      name: 'Analytics & BI',
      description: 'Enable fast, data-driven decision making at scale',
      order: 3
    },
    {
      id: 'machine_learning',
      name: 'Machine Learning',
      description: 'Accelerate ML model development & deployment to production',
      order: 4
    },
    {
      id: 'generative_ai',
      name: 'Generative AI',
      description: 'Build, govern and deploy generative AI applications',
      order: 5
    },
    {
      id: 'operational_excellence',
      name: 'Operational Excellence',
      description: 'Optimize performance, cost, and reliability',
      order: 6
    }
  ]
};

module.exports = assessmentFramework;
