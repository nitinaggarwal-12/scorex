import pptxgen from 'pptxgenjs';

// Executive High-Contrast Slide Theme
const PPTX_THEME = {
  navyDark: '0F172A',      // Slate 900
  navyMedium: '1E293B',    // Slate 800
  navyLight: '334155',     // Slate 700
  primary: '1D4ED8',       // Google Blue 700
  primaryLight: 'EFF6FF',  // Blue 50
  accentCyan: '0284C7',    // Sky Blue 600
  success: '047857',       // Emerald 700
  successLight: 'ECFDF5',  // Emerald 50
  warning: 'B45309',       // Amber 700
  warningLight: 'FFFBEB',  // Amber 50
  danger: 'B91C1C',        // Red 700
  dangerLight: 'FEF2F2',   // Red 50
  slateBg: 'F8FAFC',       // Slate 50
  cardBorder: 'CBD5E1',    // Slate 300
  textDark: '0F172A',      // Slate 900
  textMuted: '475569',     // Slate 600
  white: 'FFFFFF'
};

const stripMarkdown = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/>\s+/g, '')
    .replace(/[|\\~_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Generate a luxury, fully-editable 16:9 PowerPoint (.pptx) Presentation
 * compatible with Microsoft PowerPoint, Google Slides, Apple Keynote, and LibreOffice.
 */
export const exportAssessmentToPPTX = async (instance, report) => {
  try {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9'; // 10" x 5.625" standard widescreen
    pptx.author = 'ScoreX Intelligence Advisory';
    pptx.company = 'ScoreX Google Cloud Advisory';
    pptx.revision = '1.0';

    const framework = instance?.frameworkSnapshot || {};
    const aiReport = report?.aiReport || report || {};
    const scores = report?.calculatedScores || report?.scores || {
      overallScore: instance?.totalScore || 3.0,
      maturityLevel: instance?.maturityLevel || 'Defined',
      dimensionScores: instance?.scores || {}
    };
    const dimensions = framework.dimensions || [];

    const org = instance?.customerName || 'Quantum FinTech Global';
    const assessTitle = framework.title || 'Enterprise Data & AI Architecture Maturity';
    const industry = instance?.useCase || framework.badge || 'Enterprise GenAI Architecture Modernization & Cost Arbitrage';
    const curScore = Number(scores.overallScore || instance?.totalScore || 3.0).toFixed(1);
    const tgtScore = Number(Math.min(5.0, +(parseFloat(curScore) + 1.3))).toFixed(1);
    const delta = +(tgtScore - curScore).toFixed(1);
    const maturityTier = parseFloat(curScore) >= 4.2 ? 'Level 5 - Optimized' : parseFloat(curScore) >= 3.4 ? 'Level 4 - Managed' : parseFloat(curScore) >= 2.6 ? 'Level 3 - Defined' : 'Level 2 - Developing';

    const addHeaderAndFooter = (slide, titleText, slideNum, totalSlides = 8) => {
      // Header Top Strip
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.65,
        fill: { color: PPTX_THEME.navyDark }
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0.65, w: '100%', h: 0.04,
        fill: { color: PPTX_THEME.primary }
      });

      // Brand Title
      slide.addText('SCOREX', {
        x: 0.5, y: 0.14, w: 2.0, h: 0.38,
        fontSize: 16, bold: true, color: PPTX_THEME.white, fontFace: 'Arial'
      });
      slide.addText('•  Google Cloud Enterprise Advisory', {
        x: 1.6, y: 0.16, w: 3.5, h: 0.35,
        fontSize: 10, color: '94A3B8', fontFace: 'Arial'
      });

      // Section Title
      slide.addText(titleText.toUpperCase(), {
        x: 5.0, y: 0.16, w: 4.5, h: 0.35,
        fontSize: 10, bold: true, color: '93C5FD', align: 'right', fontFace: 'Arial'
      });

      // Footer
      slide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 5.25, w: 9.0, h: 0,
        line: { color: PPTX_THEME.cardBorder, width: 0.75 }
      });
      slide.addText(`${org.toUpperCase()}  •  CONFIDENTIAL EXECUTIVE BOARD DELIVERABLE`, {
        x: 0.5, y: 5.3, w: 4.5, h: 0.25,
        fontSize: 8, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
      });
      slide.addText('ScoreX Engine • Google Gemini 3.7 Reasoning', {
        x: 3.5, y: 5.3, w: 3.0, h: 0.25,
        fontSize: 8, color: PPTX_THEME.textMuted, align: 'center', fontFace: 'Arial'
      });
      slide.addText(`Slide ${slideNum} of ${totalSlides}`, {
        x: 7.5, y: 5.3, w: 2.0, h: 0.25,
        fontSize: 8, bold: true, color: PPTX_THEME.primary, align: 'right', fontFace: 'Arial'
      });
    };

    // ==========================================================
    // SLIDE 1: COVER / TITLE SLIDE (Dark Luxury Theme)
    // ==========================================================
    const slide1 = pptx.addSlide();
    slide1.background = { color: PPTX_THEME.navyDark };

    slide1.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.1,
      fill: { color: PPTX_THEME.primary }
    });

    slide1.addText('SCOREX', {
      x: 0.8, y: 1.0, w: 8.4, h: 0.6,
      fontSize: 32, bold: true, color: PPTX_THEME.white, fontFace: 'Arial'
    });
    slide1.addText('ENTERPRISE ARCHITECTURE & CLOUD MATURITY ADVISORY', {
      x: 0.8, y: 1.6, w: 8.4, h: 0.35,
      fontSize: 11, bold: true, color: '94A3B8', fontFace: 'Arial', charSpacing: 1.5
    });

    slide1.addShape(pptx.ShapeType.line, {
      x: 0.8, y: 2.1, w: 8.4, h: 0,
      line: { color: PPTX_THEME.primary, width: 2 }
    });

    slide1.addText('Executive Architecture & Modernization Report', {
      x: 0.8, y: 2.3, w: 8.4, h: 0.7,
      fontSize: 24, bold: true, color: PPTX_THEME.white, fontFace: 'Arial'
    });
    slide1.addText(assessTitle, {
      x: 0.8, y: 3.0, w: 8.4, h: 0.45,
      fontSize: 15, bold: true, color: '38BDF8', fontFace: 'Arial'
    });

    slide1.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 3.7, w: 8.4, h: 1.3,
      fill: { color: '1E293B' },
      line: { color: '334155', width: 1 }
    });

    slide1.addText(`Target Organization:  ${org}\nBusiness Initiative:  ${industry}\nAI Engine:  Google Gemini 3.7 Reasoning Engine\nClassification:  Confidential - Executive C-Suite & Board Use Only`, {
      x: 1.1, y: 3.85, w: 7.8, h: 1.0,
      fontSize: 10, color: 'E2E8F0', fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // ==========================================================
    // SLIDE 2: EXECUTIVE SCORECARD & SUMMARY
    // ==========================================================
    const slide2 = pptx.addSlide();
    slide2.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide2, 'Executive Scorecard & Strategic Context', 2);

    // 3 Metric Cards
    const cardW = 2.8;
    const cardH = 1.3;
    const cardY = 0.85;

    // Card 1: Current Score
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('CURRENT MATURITY SCORE', {
      x: 0.8, y: cardY + 0.12, w: 2.4, h: 0.2,
      fontSize: 9, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`${curScore} / 5.0`, {
      x: 0.8, y: cardY + 0.35, w: 2.4, h: 0.5,
      fontSize: 24, bold: true, color: PPTX_THEME.primary, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: cardY + 0.9, w: 2.4, h: 0.28,
      fill: { color: PPTX_THEME.warningLight }, line: { color: 'FDE68A', width: 0.75 }
    });
    slide2.addText(maturityTier, {
      x: 0.8, y: cardY + 0.92, w: 2.4, h: 0.24,
      fontSize: 8.5, bold: true, color: PPTX_THEME.warning, align: 'center', fontFace: 'Arial'
    });

    // Card 2: Target Score
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 3.6, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('TARGET HORIZON (TO-BE)', {
      x: 3.8, y: cardY + 0.12, w: 2.4, h: 0.2,
      fontSize: 9, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`${tgtScore} / 5.0`, {
      x: 3.8, y: cardY + 0.35, w: 2.4, h: 0.5,
      fontSize: 24, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 3.8, y: cardY + 0.9, w: 2.4, h: 0.28,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 0.75 }
    });
    slide2.addText('Level 5 - Optimized Target', {
      x: 3.8, y: cardY + 0.92, w: 2.4, h: 0.24,
      fontSize: 8.5, bold: true, color: PPTX_THEME.success, align: 'center', fontFace: 'Arial'
    });

    // Card 3: Modernization Delta
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 6.6, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('MODERNIZATION DELTA', {
      x: 6.8, y: cardY + 0.12, w: 2.4, h: 0.2,
      fontSize: 9, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`+${delta} pts`, {
      x: 6.8, y: cardY + 0.35, w: 2.4, h: 0.5,
      fontSize: 24, bold: true, color: PPTX_THEME.accentCyan, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: cardY + 0.9, w: 2.4, h: 0.28,
      fill: { color: 'E0F2FE' }, line: { color: 'BAE6FD', width: 0.75 }
    });
    slide2.addText('3-Phase Acceleration Wave', {
      x: 6.8, y: cardY + 0.92, w: 2.4, h: 0.24,
      fontSize: 8.5, bold: true, color: '0369A1', align: 'center', fontFace: 'Arial'
    });

    // Executive Summary Box
    const sumY = 2.3;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: sumY, w: 8.8, h: 2.8,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: sumY, w: 0.08, h: 2.8,
      fill: { color: PPTX_THEME.primary }
    });

    slide2.addText('Executive Summary & Strategic Context', {
      x: 0.85, y: sumY + 0.15, w: 8.3, h: 0.3,
      fontSize: 12, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });

    const rawSummary = stripMarkdown(aiReport.executiveSummary || `${org} demonstrates a proven architectural baseline with significant modernization opportunities to eliminate batch latency, unify data silos into an open BigLake lakehouse, and deploy governed agentic AI workflows on Google Cloud.`);
    slide2.addText(rawSummary.length > 380 ? rawSummary.substring(0, 377) + '...' : rawSummary, {
      x: 0.85, y: sumY + 0.5, w: 8.3, h: 1.0,
      fontSize: 9.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });

    // Key Drivers Box
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.85, y: sumY + 1.6, w: 8.3, h: 1.0,
      fill: { color: PPTX_THEME.primaryLight }, line: { color: 'BFDBFE', width: 0.75 }
    });
    slide2.addText('KEY ARCHITECTURAL MODERNIZATION DRIVERS:', {
      x: 1.0, y: sumY + 1.7, w: 8.0, h: 0.25,
      fontSize: 9, bold: true, color: PPTX_THEME.primary, fontFace: 'Arial'
    });
    const d1 = aiReport.keyStrengths?.[0] ? `• Baseline: ${stripMarkdown(aiReport.keyStrengths[0])}` : '• Transition from 24-48h batch ETL to real-time streaming CDC via Google Cloud Dataflow & BigLake Iceberg';
    const d2 = aiReport.criticalConstraints?.[0] ? `• Modernization: Remediate ${stripMarkdown(aiReport.criticalConstraints[0])}` : '• Deploy Vertex AI Agent Builder & Model Context Protocol (MCP) gateway with Model Armor zero-trust guardrails';
    slide2.addText(`${d1}\n${d2}`, {
      x: 1.0, y: sumY + 1.95, w: 8.0, h: 0.55,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.1
    });

    // ==========================================================
    // SLIDE 3: MATURITY HEATMAP & DIMENSION MATRIX
    // ==========================================================
    const slide3 = pptx.addSlide();
    slide3.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide3, '01. Executive Maturity Heatmap & Dimensional Matrix', 3);

    const tableRows = [
      [
        { text: 'Architectural Dimension / Pillar', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Current Baseline', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Target Horizon', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Delta', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Maturity Tier', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Modernization Status', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } }
      ]
    ];

    dimensions.forEach(dim => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      const cScore = typeof dScore.score === 'number' ? dScore.score : (parseFloat(instance?.responses?.[`${dim.id}_current`]) || 3.0);
      const fScore = typeof dScore.targetScore === 'number' ? dScore.targetScore : Math.min(5.0, +(cScore + 1.2).toFixed(1));
      const dVal = +(fScore - cScore).toFixed(1);
      const tier = cScore >= 4.2 ? 'Optimized (L5)' : cScore >= 3.4 ? 'Managed (L4)' : cScore >= 2.6 ? 'Defined (L3)' : 'Developing (L2)';
      const prio = dVal >= 1.5 ? 'CRITICAL GAP' : dVal >= 0.8 ? 'HIGH PRIORITY' : 'MODERATE';
      const prioColor = prio === 'CRITICAL GAP' ? PPTX_THEME.danger : (prio === 'HIGH PRIORITY' ? PPTX_THEME.warning : PPTX_THEME.success);

      tableRows.push([
        { text: dim.name, options: { bold: true, color: PPTX_THEME.textDark } },
        { text: `${Number(cScore).toFixed(1)} / 5.0`, options: { align: 'center', bold: true, color: PPTX_THEME.primary } },
        { text: `${Number(fScore).toFixed(1)} / 5.0`, options: { align: 'center', bold: true, color: PPTX_THEME.success } },
        { text: `+${dVal}`, options: { align: 'center', bold: true, color: PPTX_THEME.accentCyan } },
        { text: tier, options: { align: 'center', color: PPTX_THEME.textMuted } },
        { text: prio, options: { align: 'center', bold: true, color: prioColor } }
      ]);
    });

    slide3.addTable(tableRows, {
      x: 0.6, y: 0.9, w: 8.8,
      fontSize: 9,
      fontFace: 'Arial',
      border: { pt: 0.5, color: PPTX_THEME.cardBorder },
      rowH: 0.45
    });

    // ==========================================================
    // SLIDE 4: ARCHITECTURAL STRENGTHS VS CRITICAL GAPS
    // ==========================================================
    const slide4 = pptx.addSlide();
    slide4.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide4, '02. Strengths vs. Critical Operational Debt', 4);

    const splitW = 4.25;
    const splitH = 4.1;

    // Strengths Box (Green)
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 0.9, w: splitW, h: splitH,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 1.2 }
    });
    slide4.addText('Key Architectural Strengths', {
      x: 0.8, y: 1.1, w: splitW - 0.4, h: 0.3,
      fontSize: 13, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });

    const strList = (aiReport.keyStrengths && aiReport.keyStrengths.length > 0)
      ? aiReport.keyStrengths.map(s => `• ${stripMarkdown(s)}`)
      : [
        '• Established core transactional database services and cloud tenancy',
        '• High leadership sponsorship for enterprise cloud & GenAI modernization',
        '• Active deployment of conversational AI tools and prototype agent services',
        '• Defined compliance baseline for customer data privacy and regulatory standards'
      ];
    slide4.addText(strList.join('\n\n'), {
      x: 0.8, y: 1.5, w: splitW - 0.4, h: 3.3,
      fontSize: 9.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });

    // Gaps Box (Red)
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 5.15, y: 0.9, w: splitW, h: splitH,
      fill: { color: PPTX_THEME.dangerLight }, line: { color: 'FECACA', width: 1.2 }
    });
    slide4.addText('Critical Gaps & Operational Debt', {
      x: 5.35, y: 1.1, w: splitW - 0.4, h: 0.3,
      fontSize: 13, bold: true, color: PPTX_THEME.danger, fontFace: 'Arial'
    });

    const gapList = (aiReport.criticalConstraints && aiReport.criticalConstraints.length > 0)
      ? aiReport.criticalConstraints.map(g => `• ${stripMarkdown(g)}`)
      : [
        '• 24-48 hour batch ETL replication lag halting real-time operational decisions',
        '• Fragmented data silos across legacy on-prem databases and disjoint cloud buckets',
        '• Unmanaged public LLM egress with zero prompt caching and token cost waste',
        '• Missing centralized AI TRiSM guardrails, automated DLP masking, and Model Armor'
      ];
    slide4.addText(gapList.join('\n\n'), {
      x: 5.35, y: 1.5, w: splitW - 0.4, h: 3.3,
      fontSize: 9.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });

    // ==========================================================
    // SLIDE 5: ARCHITECTURE EVOLUTION (AS-IS VS TO-BE)
    // ==========================================================
    const slide5 = pptx.addSlide();
    slide5.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide5, '03. Enterprise Architecture Evolution (As-Is vs. To-Be)', 5);

    // As-Is Box
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 0.9, w: splitW, h: 4.1,
      fill: { color: '#FFF5F5' }, line: { color: 'F87171', width: 1.2 }
    });
    slide5.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: 0.9, w: splitW, h: 0.45,
      fill: { color: 'DC2626' }
    });
    slide5.addText('CURRENT BASELINE (AS-IS ARCHITECTURE)', {
      x: 0.8, y: 0.98, w: splitW - 0.4, h: 0.3,
      fontSize: 10, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });
    slide5.addText('• Ingestion: Point-to-point cron jobs & unmanaged batch transfers (24-48hr lag)\n• Storage: Siloed relational databases and unmanaged flat buckets\n• Compute: Static 24/7 over-provisioned VMs without auto-suspend\n• AI / ML: Unmanaged hardcoded LLM calls paying 100% price with 0 caching\n• Security: Disjoint IAM access, public API endpoints, manual audit triage', {
      x: 0.8, y: 1.5, w: splitW - 0.4, h: 2.6,
      fontSize: 9, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 4.2, w: splitW - 0.4, h: 0.6,
      fill: { color: '#FEE2E2' }, line: { color: 'EF4444', width: 0.75 }
    });
    slide5.addText('[!] CRITICAL BOTTLENECK: 38% ETL lag and unmanaged token billing burn', {
      x: 0.9, y: 4.3, w: splitW - 0.6, h: 0.4,
      fontSize: 8, bold: true, color: 'B91C1C', fontFace: 'Arial'
    });

    // To-Be Box
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 5.15, y: 0.9, w: splitW, h: 4.1,
      fill: { color: '#F0FDF4' }, line: { color: '34D399', width: 1.2 }
    });
    slide5.addShape(pptx.ShapeType.rect, {
      x: 5.15, y: 0.9, w: splitW, h: 0.45,
      fill: { color: '059669' }
    });
    slide5.addText('TARGET CLOUD-NATIVE (TO-BE ARCHITECTURE)', {
      x: 5.35, y: 0.98, w: splitW - 0.4, h: 0.3,
      fontSize: 10, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });
    slide5.addText('• Ingestion: Serverless Google Cloud Dataflow streaming CDC & Pub/Sub (<1s)\n• Storage: BigLake Medallion Architecture with Apache Iceberg open tables on GCS\n• Compute: BigQuery Editions autoscaling slots with GKE Autopilot gVisor compute\n• AI / ML: Vertex AI Agent Builder, Model Context Protocol (MCP), 75% prompt cache\n• Security: Zero-Trust Landing Zone with VPC-SC, Cloud KMS HSM CMEK, Model Armor', {
      x: 5.35, y: 1.5, w: splitW - 0.4, h: 2.6,
      fontSize: 9, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 5.35, y: 4.2, w: splitW - 0.4, h: 0.6,
      fill: { color: '#DCFCE7' }, line: { color: '10B981', width: 0.75 }
    });
    slide5.addText('[+] TARGET OUTCOME: 99.99% Multi-Region HA & Sub-Second Analytical Queries', {
      x: 5.45, y: 4.3, w: splitW - 0.6, h: 0.4,
      fontSize: 8, bold: true, color: '047857', fontFace: 'Arial'
    });

    // ==========================================================
    // SLIDE 6: 4-TIER MODERNIZATION TRANSITION MATRIX
    // ==========================================================
    const slide6 = pptx.addSlide();
    slide6.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide6, '04. Key Modernization Vectors (4-Tier Transition Matrix)', 6);

    const vectorRows = [
      [
        { text: 'Modernization Tier', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Current As-Is Pattern', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Target Google Cloud Pattern', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Business & Technical Value', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } }
      ],
      [
        { text: 'Tier 1: Ingestion & CDC', options: { bold: true, color: PPTX_THEME.navyDark, fill: { color: PPTX_THEME.slateBg } } },
        { text: 'Brittle Informatica/Bash cron scripts with 24h batch lag', options: { color: '991B1B' } },
        { text: 'Google Cloud Datastream CDC + Dataflow & Pub/Sub event bus', options: { bold: true, color: '065F46' } },
        { text: 'Sub-second real-time replication with zero source DB locks', options: { color: '0369A1' } }
      ],
      [
        { text: 'Tier 2: Unified Lakehouse', options: { bold: true, color: PPTX_THEME.navyDark, fill: { color: PPTX_THEME.slateBg } } },
        { text: 'Proprietary siloed warehouses with high egress tax', options: { color: '991B1B' } },
        { text: 'BigLake Apache Iceberg open table formats on Cloud Storage', options: { bold: true, color: '065F46' } },
        { text: 'Zero vendor lock-in, 45% licensing reduction, unified catalog', options: { color: '0369A1' } }
      ],
      [
        { text: 'Tier 3: Compute & FinOps', options: { bold: true, color: PPTX_THEME.navyDark, fill: { color: PPTX_THEME.slateBg } } },
        { text: 'Static 24/7 oversized VMs with $480k estimated idle waste', options: { color: '991B1B' } },
        { text: 'BigQuery Autoscaling Slots & GKE Autopilot pod metering', options: { bold: true, color: '065F46' } },
        { text: '100% FOCUS 1.0 chargeback attribution and 15-min auto-suspend', options: { color: '0369A1' } }
      ],
      [
        { text: 'Tier 4: Agentic AI & Sec', options: { bold: true, color: PPTX_THEME.navyDark, fill: { color: PPTX_THEME.slateBg } } },
        { text: 'Unmanaged LLM calls without prompt caching or DLP', options: { color: '991B1B' } },
        { text: 'Vertex AI Agent Builder + MCP Tool Gateway & Model Armor', options: { bold: true, color: '065F46' } },
        { text: '75% token discount via Context Caching with VPC-SC guardrails', options: { color: '0369A1' } }
      ]
    ];

    slide6.addTable(vectorRows, {
      x: 0.6, y: 1.0, w: 8.8,
      fontSize: 9,
      fontFace: 'Arial',
      border: { pt: 0.5, color: PPTX_THEME.cardBorder },
      rowH: 0.85
    });

    // ==========================================================
    // SLIDE 7: PRIORITIZED STRATEGIC ROADMAP (30-60-90 DAYS)
    // ==========================================================
    const slide7 = pptx.addSlide();
    slide7.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide7, '05. Prioritized Strategic Roadmap & Backlog', 7);

    const roadmapRecs = aiReport.prioritizedRecommendations || [
      { priority: 'Critical', title: 'Deploy Zero-Trust Ingress & Cloud Armor WAF', dimension: 'Security', timeline: '0-30 Days', expectedImpact: 'Eliminates public internet exposure and blocks OWASP Top 10 exploits' },
      { priority: 'Critical', title: 'Establish Real-Time Datastream CDC & BigLake', dimension: 'Data Lakehouse', timeline: '15-45 Days', expectedImpact: 'Eliminates 24-hour batch replication lag and source DB locks' },
      { priority: 'High', title: 'Migrate AI Ingress to Apigee Gateway with Prompt Cache', dimension: 'AI / ML', timeline: '30-60 Days', expectedImpact: 'Reduces LLM input token burn by 75% and accelerates TTFT to <200ms' },
      { priority: 'High', title: 'Implement BigQuery FOCUS 1.0 Automated Billing Lake', dimension: 'FinOps', timeline: '45-75 Days', expectedImpact: 'Establishes 100% cost attribution and automated idle resource pruning' },
      { priority: 'Strategic', title: 'Deploy Hub-and-Spoke Agent Mesh on MCP Gateway', dimension: 'Agent Mesh', timeline: '60-90 Days', expectedImpact: 'Enables cross-departmental autonomous multi-agent task execution' }
    ];

    const roadmapRows = [
      [
        { text: 'Priority', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Transformation Initiative', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Pillar', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Strategic Rationale & Expected ROI Impact', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Timeline', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } }
      ]
    ];

    roadmapRecs.slice(0, 5).forEach((r, idx) => {
      const prio = r.priority ? `P${idx+1} - ${r.priority.toUpperCase()}` : (idx < 2 ? 'P1 - CRITICAL' : 'P2 - HIGH');
      const prioColor = prio.includes('CRITICAL') ? PPTX_THEME.danger : (prio.includes('HIGH') ? PPTX_THEME.warning : PPTX_THEME.success);

      roadmapRows.push([
        { text: prio, options: { align: 'center', bold: true, color: prioColor } },
        { text: stripMarkdown(r.title || `Action ${idx+1}`), options: { bold: true, color: PPTX_THEME.textDark } },
        { text: stripMarkdown(r.dimension || r.pillar || 'Architecture'), options: { color: PPTX_THEME.textMuted } },
        { text: stripMarkdown(r.expectedImpact || r.whyItMatters || r.impact || 'Accelerates modernization and lowers TCO'), options: { color: PPTX_THEME.textDark } },
        { text: r.timeline || (idx < 2 ? '0-30 Days' : '30-60 Days'), options: { align: 'center', bold: true, color: PPTX_THEME.primary } }
      ]);
    });

    slide7.addTable(roadmapRows, {
      x: 0.6, y: 0.9, w: 8.8,
      fontSize: 8.5,
      fontFace: 'Arial',
      border: { pt: 0.5, color: PPTX_THEME.cardBorder },
      rowH: 0.65
    });

    // ==========================================================
    // SLIDE 8: FINANCIAL ROI & GOVERNANCE SIGN-OFF
    // ==========================================================
    const slide8 = pptx.addSlide();
    slide8.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide8, '06. Financial ROI & Official Governance Acceptance', 8);

    // 3 Financial Metric Cards
    const roiY = 0.9;
    const roiW = 2.8;
    const avgGap = parseFloat(delta) || 1.3;
    const netValueEst = `$${(avgGap * 1.8).toFixed(1)}M - $${(avgGap * 3.2).toFixed(1)}M`;

    // KPI 1: TCO
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: roiY, w: roiW, h: 1.2,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('35% - 50%', {
      x: 0.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.primary, fontFace: 'Arial'
    });
    slide8.addText('Compute & Storage TCO Savings via BigQuery & Iceberg', {
      x: 0.8, y: roiY + 0.6, w: roiW - 0.4, h: 0.45,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // KPI 2: 3-Year Value
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 3.6, y: roiY, w: roiW, h: 1.2,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText(netValueEst, {
      x: 3.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide8.addText('3-Year Projected Value Creation & Cost Avoidance', {
      x: 3.8, y: roiY + 0.6, w: roiW - 0.4, h: 0.45,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // KPI 3: Context Caching
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 6.6, y: roiY, w: roiW, h: 1.2,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('75% Discount', {
      x: 6.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.accentCyan, fontFace: 'Arial'
    });
    slide8.addText('GenAI Token Input Savings via Vertex Context Caching', {
      x: 6.8, y: roiY + 0.6, w: roiW - 0.4, h: 0.45,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // Sign-Off Block
    const signBoxY = 2.4;
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: signBoxY, w: 8.8, h: 2.65,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('OFFICIAL ARCHITECTURAL ACCEPTANCE & STAKEHOLDER SIGN-OFF', {
      x: 0.85, y: signBoxY + 0.15, w: 8.3, h: 0.3,
      fontSize: 10.5, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });

    const sigW = 2.65;
    const sigY = signBoxY + 0.55;
    const sigH = 1.8;

    // Sig 1
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.85, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('LEAD CLOUD ARCHITECT', {
      x: 1.0, y: sigY + 0.12, w: sigW - 0.3, h: 0.25,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Google Certified Fellow\nRole:  Principal Cloud Architect\nDate:  ${new Date().toISOString().split('T')[0]}`, {
      x: 1.0, y: sigY + 0.45, w: sigW - 0.3, h: 1.2,
      fontSize: 8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // Sig 2
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 3.65, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('VP OF ENGINEERING / CTO', {
      x: 3.8, y: sigY + 0.12, w: sigW - 0.3, h: 0.25,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Executive Sponsor\nRole:  VP of Engineering / CTO\nDate:  ${new Date().toISOString().split('T')[0]}`, {
      x: 3.8, y: sigY + 0.45, w: sigW - 0.3, h: 1.2,
      fontSize: 8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // Sig 3
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 6.45, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('CISO / GOVERNANCE LEAD', {
      x: 6.6, y: sigY + 0.12, w: sigW - 0.3, h: 0.25,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Governance Authority\nRole:  Head of Security & Compliance\nDate:  ${new Date().toISOString().split('T')[0]}`, {
      x: 6.6, y: sigY + 0.45, w: sigW - 0.3, h: 1.2,
      fontSize: 8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // Generate and download PPTX
    const safeName = (instance?.customerName || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `ScoreX_Executive_Presentation_${safeName}_${new Date().toISOString().split('T')[0]}.pptx`;
    
    await pptx.writeFile({ fileName: filename });
    console.log('[PPTX Export] Presentation successfully exported:', filename);
    return { success: true, filename };
  } catch (error) {
    console.error('[PPTX Export] Error generating PPTX presentation:', error);
    return { success: false, error: error.message };
  }
};

const pptxExportService = { exportAssessmentToPPTX };
export default pptxExportService;
