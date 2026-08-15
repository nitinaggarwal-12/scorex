/**
 * Generative AI Readiness Framework
 * Comprehensive assessment of an organization's readiness for GenAI initiatives
 */

const genAIReadinessFramework = {
  title: "Generative AI Readiness Assessment",
  description: "Evaluate your organization's readiness to successfully deploy Generative AI solutions",
  version: "1.0.0",
  totalPoints: 160,
  
  dimensions: [
    {
      id: "strategy",
      name: "Strategy",
      description: "GenAI vision, goals, and strategic alignment",
      maxScore: 25,
      weight: 1.0,
      questions: [
        {
          id: "strategy_1",
          text: "Does your organization have a clearly defined GenAI strategy aligned with business objectives?",
          options: [
            { value: 1, label: "No strategy defined", score: 1 },
            { value: 2, label: "Initial discussions, no formal strategy", score: 2 },
            { value: 3, label: "Draft strategy exists, not yet approved", score: 3 },
            { value: 4, label: "Approved strategy with some clear objectives", score: 4 },
            { value: 5, label: "Comprehensive strategy with measurable KPIs and executive buy-in", score: 5 }
          ]
        },
        {
          id: "strategy_2",
          text: "How well does your leadership understand the potential impact and risks of GenAI?",
          options: [
            { value: 1, label: "Limited awareness", score: 1 },
            { value: 2, label: "Basic understanding of capabilities", score: 2 },
            { value: 3, label: "Good understanding with some concerns", score: 3 },
            { value: 4, label: "Strong understanding with active engagement", score: 4 },
            { value: 5, label: "Expert-level understanding driving strategic initiatives", score: 5 }
          ]
        },
        {
          id: "strategy_3",
          text: "Have you identified specific business outcomes you want to achieve with GenAI?",
          options: [
            { value: 1, label: "No specific outcomes identified", score: 1 },
            { value: 2, label: "Vague goals (e.g., 'be innovative')", score: 2 },
            { value: 3, label: "Some specific outcomes for 1-2 areas", score: 3 },
            { value: 4, label: "Clear outcomes for multiple business areas", score: 4 },
            { value: 5, label: "Comprehensive outcome framework with metrics and timelines", score: 5 }
          ]
        },
        {
          id: "strategy_4",
          text: "What is your organization's approach to GenAI investment and budget allocation?",
          options: [
            { value: 1, label: "No budget allocated", score: 1 },
            { value: 2, label: "Minimal exploratory budget", score: 2 },
            { value: 3, label: "Dedicated POC budget", score: 3 },
            { value: 4, label: "Significant budget with ROI expectations", score: 4 },
            { value: 5, label: "Strategic investment with multi-year roadmap", score: 5 }
          ]
        },
        {
          id: "strategy_5",
          text: "How do you plan to measure success of GenAI initiatives?",
          options: [
            { value: 1, label: "No measurement plan", score: 1 },
            { value: 2, label: "Basic qualitative feedback", score: 2 },
            { value: 3, label: "Some quantitative metrics defined", score: 3 },
            { value: 4, label: "Comprehensive KPI framework", score: 4 },
            { value: 5, label: "Advanced analytics with continuous optimization", score: 5 }
          ]
        }
      ]
    },
    {
      id: "use_cases",
      name: "Use Cases",
      description: "Identification and prioritization of GenAI applications",
      maxScore: 30,
      weight: 1.0,
      questions: [
        {
          id: "use_cases_1",
          text: "Have you identified specific use cases where GenAI can add value?",
          options: [
            { value: 1, label: "No use cases identified", score: 1 },
            { value: 2, label: "1-2 generic ideas", score: 3 },
            { value: 3, label: "3-5 specific use cases", score: 5 },
            { value: 4, label: "Comprehensive use case portfolio (6-10)", score: 7 },
            { value: 5, label: "Prioritized roadmap with 10+ validated use cases", score: 10 }
          ]
        },
        {
          id: "use_cases_2",
          text: "How well do you understand the technical feasibility of your identified use cases?",
          options: [
            { value: 1, label: "No technical assessment done", score: 1 },
            { value: 2, label: "Basic feasibility check", score: 2 },
            { value: 3, label: "Detailed technical evaluation for priority use cases", score: 3 },
            { value: 4, label: "POCs completed for key use cases", score: 4 },
            { value: 5, label: "Production pilots with validated ROI", score: 5 }
          ]
        },
        {
          id: "use_cases_3",
          text: "Have you prioritized use cases based on business impact and feasibility?",
          options: [
            { value: 1, label: "No prioritization framework", score: 1 },
            { value: 2, label: "Informal prioritization", score: 2 },
            { value: 3, label: "Structured framework (e.g., value vs. effort)", score: 3 },
            { value: 4, label: "Data-driven prioritization with stakeholder alignment", score: 4 },
            { value: 5, label: "Dynamic roadmap with continuous re-prioritization", score: 5 }
          ]
        },
        {
          id: "use_cases_4",
          text: "Do you have a process to continuously identify new GenAI opportunities?",
          options: [
            { value: 1, label: "No process in place", score: 1 },
            { value: 2, label: "Ad-hoc suggestions", score: 2 },
            { value: 3, label: "Regular brainstorming sessions", score: 3 },
            { value: 4, label: "Structured innovation program", score: 4 },
            { value: 5, label: "Center of Excellence with continuous discovery", score: 5 }
          ]
        },
        {
          id: "use_cases_5",
          text: "How well do you understand the data requirements for your use cases?",
          options: [
            { value: 1, label: "No data assessment done", score: 1 },
            { value: 2, label: "Basic understanding", score: 2 },
            { value: 3, label: "Data inventory completed", score: 3 },
            { value: 4, label: "Data quality assessed and gaps identified", score: 4 },
            { value: 5, label: "Data pipelines established with governance", score: 5 }
          ]
        }
      ]
    },
    {
      id: "people",
      name: "People",
      description: "Skills, roles, and organizational readiness",
      maxScore: 25,
      weight: 1.0,
      questions: [
        {
          id: "people_1",
          text: "Do you have data scientists or ML engineers with GenAI experience?",
          options: [
            { value: 1, label: "No GenAI skills in-house", score: 1 },
            { value: 2, label: "1-2 people with basic LLM knowledge", score: 2 },
            { value: 3, label: "Small team with practical experience", score: 3 },
            { value: 4, label: "Dedicated GenAI team with proven track record", score: 4 },
            { value: 5, label: "Center of Excellence with deep expertise", score: 5 }
          ]
        },
        {
          id: "people_2",
          text: "What is the level of GenAI awareness across your organization?",
          options: [
            { value: 1, label: "Minimal awareness", score: 1 },
            { value: 2, label: "Awareness limited to tech teams", score: 2 },
            { value: 3, label: "Business leaders are aware", score: 3 },
            { value: 4, label: "Broad awareness with some training completed", score: 4 },
            { value: 5, label: "Organization-wide literacy with ongoing enablement", score: 5 }
          ]
        },
        {
          id: "people_3",
          text: "Do you have a training and upskilling program for GenAI?",
          options: [
            { value: 1, label: "No training program", score: 1 },
            { value: 2, label: "Ad-hoc learning resources", score: 2 },
            { value: 3, label: "Formal training for tech teams", score: 3 },
            { value: 4, label: "Comprehensive program for multiple roles", score: 4 },
            { value: 5, label: "Continuous learning culture with certifications", score: 5 }
          ]
        },
        {
          id: "people_4",
          text: "Have you defined roles and responsibilities for GenAI initiatives?",
          options: [
            { value: 1, label: "No defined roles", score: 1 },
            { value: 2, label: "Informal responsibilities", score: 2 },
            { value: 3, label: "Key roles identified (e.g., GenAI lead)", score: 3 },
            { value: 4, label: "Clear RACI matrix for GenAI projects", score: 4 },
            { value: 5, label: "Dedicated GenAI organization with career paths", score: 5 }
          ]
        },
        {
          id: "people_5",
          text: "How do you manage change and adoption for GenAI solutions?",
          options: [
            { value: 1, label: "No change management plan", score: 1 },
            { value: 2, label: "Basic communication about changes", score: 2 },
            { value: 3, label: "Structured change management for key initiatives", score: 3 },
            { value: 4, label: "Comprehensive adoption program with success metrics", score: 4 },
            { value: 5, label: "Cultural transformation with champions network", score: 5 }
          ]
        }
      ]
    },
    {
      id: "process",
      name: "Process",
      description: "Workflows, methodologies, and operational practices",
      maxScore: 25,
      weight: 1.0,
      questions: [
        {
          id: "process_1",
          text: "Do you have a defined process for GenAI project ideation to production?",
          options: [
            { value: 1, label: "No formal process", score: 1 },
            { value: 2, label: "Basic project management practices", score: 2 },
            { value: 3, label: "Defined workflow for POCs", score: 3 },
            { value: 4, label: "End-to-end process with gates and reviews", score: 4 },
            { value: 5, label: "Mature MLOps/LLMOps with automation", score: 5 }
          ]
        },
        {
          id: "process_2",
          text: "How do you manage prompt engineering and model optimization?",
          options: [
            { value: 1, label: "No structured approach", score: 1 },
            { value: 2, label: "Ad-hoc prompt testing", score: 2 },
            { value: 3, label: "Prompt library and versioning", score: 3 },
            { value: 4, label: "Systematic testing and evaluation framework", score: 4 },
            { value: 5, label: "Automated prompt optimization and A/B testing", score: 5 }
          ]
        },
        {
          id: "process_3",
          text: "How do you integrate GenAI into existing business workflows?",
          options: [
            { value: 1, label: "No integration plan", score: 1 },
            { value: 2, label: "Standalone experiments", score: 2 },
            { value: 3, label: "Integration for 1-2 workflows", score: 3 },
            { value: 4, label: "Systematic integration across key processes", score: 4 },
            { value: 5, label: "GenAI embedded in core business operations", score: 5 }
          ]
        },
        {
          id: "process_4",
          text: "Do you have processes for monitoring and improving GenAI model performance?",
          options: [
            { value: 1, label: "No monitoring", score: 1 },
            { value: 2, label: "Basic logging", score: 2 },
            { value: 3, label: "Performance metrics tracked", score: 3 },
            { value: 4, label: "Automated monitoring with alerts", score: 4 },
            { value: 5, label: "Continuous learning and model retraining", score: 5 }
          ]
        },
        {
          id: "process_5",
          text: "How do you handle feedback and iteration for GenAI solutions?",
          options: [
            { value: 1, label: "No feedback mechanism", score: 1 },
            { value: 2, label: "Manual feedback collection", score: 2 },
            { value: 3, label: "Structured feedback loops", score: 3 },
            { value: 4, label: "Automated feedback analysis", score: 4 },
            { value: 5, label: "Real-time improvement pipeline", score: 5 }
          ]
        }
      ]
    },
    {
      id: "platform",
      name: "Platform",
      description: "Technology infrastructure and tooling",
      maxScore: 30,
      weight: 1.0,
      questions: [
        {
          id: "platform_1",
          text: "What is your current GenAI technology stack maturity?",
          options: [
            { value: 1, label: "No platform or tools", score: 1 },
            { value: 2, label: "Using external APIs only (OpenAI, etc.)", score: 3 },
            { value: 3, label: "Mix of external APIs and some self-hosted models", score: 5 },
            { value: 4, label: "Established platform with model management", score: 7 },
            { value: 5, label: "Enterprise GenAI platform with full MLOps", score: 10 }
          ]
        },
        {
          id: "platform_2",
          text: "How do you manage data access and preparation for GenAI?",
          options: [
            { value: 1, label: "No data infrastructure", score: 1 },
            { value: 2, label: "Manual data extraction and preparation", score: 2 },
            { value: 3, label: "Basic data pipelines", score: 3 },
            { value: 4, label: "Automated pipelines with data lakehouse", score: 4 },
            { value: 5, label: "Advanced feature stores and vector databases", score: 5 }
          ]
        },
        {
          id: "platform_3",
          text: "What is your approach to model deployment and serving?",
          options: [
            { value: 1, label: "No deployment capability", score: 1 },
            { value: 2, label: "Manual deployment to notebooks/scripts", score: 2 },
            { value: 3, label: "Basic API endpoints", score: 3 },
            { value: 4, label: "Scalable serving infrastructure", score: 4 },
            { value: 5, label: "Enterprise-grade with auto-scaling and monitoring", score: 5 }
          ]
        },
        {
          id: "platform_4",
          text: "How do you handle model versioning and experimentation?",
          options: [
            { value: 1, label: "No versioning", score: 1 },
            { value: 2, label: "Manual tracking in spreadsheets", score: 2 },
            { value: 3, label: "Git-based versioning", score: 3 },
            { value: 4, label: "MLflow or similar experiment tracking", score: 4 },
            { value: 5, label: "Comprehensive lineage and governance", score: 5 }
          ]
        },
        {
          id: "platform_5",
          text: "Do you have infrastructure for vector search and embeddings?",
          options: [
            { value: 1, label: "Not implemented", score: 1 },
            { value: 2, label: "Using external vector DB service", score: 2 },
            { value: 3, label: "Basic vector search capability", score: 3 },
            { value: 4, label: "Integrated vector database", score: 4 },
            { value: 5, label: "Advanced RAG with hybrid search", score: 5 }
          ]
        }
      ]
    },
    {
      id: "governance",
      name: "Governance",
      description: "Policies, compliance, and risk management",
      maxScore: 25,
      weight: 1.0,
      questions: [
        {
          id: "governance_1",
          text: "Do you have policies and guidelines for responsible GenAI use?",
          options: [
            { value: 1, label: "No policies defined", score: 1 },
            { value: 2, label: "Basic acceptable use policy", score: 2 },
            { value: 3, label: "Documented guidelines for specific use cases", score: 3 },
            { value: 4, label: "Comprehensive policy framework with enforcement", score: 4 },
            { value: 5, label: "Industry-leading responsible AI framework", score: 5 }
          ]
        },
        {
          id: "governance_2",
          text: "How do you manage data privacy and security for GenAI?",
          options: [
            { value: 1, label: "No specific controls", score: 1 },
            { value: 2, label: "Basic data classification", score: 2 },
            { value: 3, label: "Data access controls implemented", score: 3 },
            { value: 4, label: "Encryption and PII detection", score: 4 },
            { value: 5, label: "Zero-trust architecture with audit trails", score: 5 }
          ]
        },
        {
          id: "governance_3",
          text: "Do you have processes to identify and mitigate GenAI risks (bias, hallucinations, etc.)?",
          options: [
            { value: 1, label: "No risk assessment", score: 1 },
            { value: 2, label: "Aware of risks but no mitigation plan", score: 2 },
            { value: 3, label: "Risk assessment for major use cases", score: 3 },
            { value: 4, label: "Systematic testing and guardrails", score: 4 },
            { value: 5, label: "Automated risk detection with human oversight", score: 5 }
          ]
        },
        {
          id: "governance_4",
          text: "How do you ensure compliance with regulations (GDPR, CCPA, industry-specific)?",
          options: [
            { value: 1, label: "No compliance framework", score: 1 },
            { value: 2, label: "Basic awareness of requirements", score: 2 },
            { value: 3, label: "Compliance review process", score: 3 },
            { value: 4, label: "Integrated compliance checks", score: 4 },
            { value: 5, label: "Automated compliance with auditing", score: 5 }
          ]
        },
        {
          id: "governance_5",
          text: "Do you have an AI ethics review board or similar oversight?",
          options: [
            { value: 1, label: "No oversight structure", score: 1 },
            { value: 2, label: "Informal review by leadership", score: 2 },
            { value: 3, label: "Ethics committee for major initiatives", score: 3 },
            { value: 4, label: "Regular ethics board with clear mandate", score: 4 },
            { value: 5, label: "Multi-stakeholder board with transparent processes", score: 5 }
          ]
        }
      ]
    }
  ],
  
  maturityLevels: [
    { min: 0, max: 50, level: "Initial", label: "Low", color: "#dc3545", description: "Early exploration phase with significant gaps" },
    { min: 51, max: 80, level: "Developing", label: "Medium-Low", color: "#fd7e14", description: "Foundation building with key initiatives underway" },
    { min: 81, max: 110, level: "Defined", label: "Medium", color: "#ffc107", description: "Structured approach with growing capabilities" },
    { min: 111, max: 135, level: "Managed", label: "Medium-High", color: "#20c997", description: "Well-established practices with measurable outcomes" },
    { min: 136, max: 160, level: "Optimizing", label: "High", color: "#28a745", description: "Industry-leading with continuous innovation" }
  ],
  
  recommendations: {
    strategy: {
      low: [
        "Conduct executive workshop on GenAI opportunities and risks",
        "Develop 6-month GenAI exploration roadmap with clear milestones",
        "Identify executive sponsor and form cross-functional steering committee",
        "Assess competitive landscape and industry GenAI trends"
      ],
      medium: [
        "Refine strategy with specific OKRs and success metrics",
        "Establish GenAI investment framework with ROI expectations",
        "Create communication plan to build organizational awareness",
        "Develop partnership strategy (vendors, academia, consultants)"
      ],
      high: [
        "Expand strategy to include ecosystem and platform plays",
        "Implement strategic portfolio management for GenAI initiatives",
        "Build thought leadership through industry participation",
        "Explore GenAI monetization and new business models"
      ]
    },
    use_cases: {
      low: [
        "Conduct use case discovery workshops with business stakeholders",
        "Create use case inventory with business value estimates",
        "Prioritize 2-3 quick wins for initial POCs",
        "Document data and infrastructure requirements for priority use cases"
      ],
      medium: [
        "Implement systematic use case validation process",
        "Build use case templates and best practices library",
        "Develop ROI model for GenAI investments",
        "Create innovation pipeline from ideation to production"
      ],
      high: [
        "Scale successful use cases across business units",
        "Build reusable GenAI components and accelerators",
        "Establish metrics-driven portfolio optimization",
        "Explore advanced use cases (agentic AI, multi-modal)"
      ]
    },
    people: {
      low: [
        "Assess current skills and identify critical gaps",
        "Partner with external experts for knowledge transfer",
        "Launch GenAI awareness program for leadership and key teams",
        "Create learning pathways for different roles (technical, business, leadership)"
      ],
      medium: [
        "Implement comprehensive GenAI training curriculum",
        "Establish internal champions and community of practice",
        "Define career paths for GenAI roles",
        "Build cross-functional collaboration rituals"
      ],
      high: [
        "Create GenAI Center of Excellence",
        "Implement internal certification programs",
        "Build talent marketplace for GenAI skills",
        "Establish thought leadership and external engagement"
      ]
    },
    process: {
      low: [
        "Document current AI/ML processes and identify gaps",
        "Define GenAI project lifecycle (ideation → production)",
        "Establish basic prompt engineering practices",
        "Create evaluation framework for GenAI outputs"
      ],
      medium: [
        "Implement LLMOps practices (versioning, testing, deployment)",
        "Build systematic prompt engineering and optimization process",
        "Create reusable integration patterns",
        "Establish performance monitoring and SLAs"
      ],
      high: [
        "Implement advanced LLMOps with automated pipelines",
        "Build continuous improvement loops with user feedback",
        "Create self-service GenAI platform for business users",
        "Establish benchmarking and competitive analysis processes"
      ]
    },
    platform: {
      low: [
        "Assess current infrastructure capabilities and gaps",
        "Select GenAI platform (Databricks, Azure OpenAI, etc.)",
        "Establish data lakehouse foundation",
        "Implement basic model serving infrastructure"
      ],
      medium: [
        "Build vector database and RAG capabilities",
        "Implement model management and versioning (MLflow)",
        "Establish scalable inference infrastructure",
        "Create data engineering pipelines for GenAI"
      ],
      high: [
        "Implement advanced features (fine-tuning, RLHF)",
        "Build multi-model orchestration and routing",
        "Establish cost optimization and resource management",
        "Create GenAI development platform for teams"
      ]
    },
    governance: {
      low: [
        "Establish GenAI ethics principles and acceptable use policy",
        "Conduct risk assessment for planned use cases",
        "Implement basic data classification and access controls",
        "Create incident response plan for GenAI issues"
      ],
      medium: [
        "Build comprehensive responsible AI framework",
        "Implement bias detection and mitigation practices",
        "Establish model cards and documentation standards",
        "Create compliance review checkpoints"
      ],
      high: [
        "Implement automated guardrails and safety systems",
        "Build transparency and explainability capabilities",
        "Establish AI ethics board with regular reviews",
        "Create industry-leading responsible AI practices"
      ]
    }
  }
};

module.exports = genAIReadinessFramework;


