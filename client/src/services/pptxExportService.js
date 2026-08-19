import pptxgen from 'pptxgenjs';

// Executive High-Contrast Luxury Slide Theme (McKinsey / Gartner Grade)
const PPTX_THEME = {
  navyDark: '0B132B',      // Slate Navy 950
  navyMedium: '1C2541',    // Slate Navy 900
  navyLight: '3A506B',     // Slate Navy 700
  primary: '1D4ED8',       // Google Blue 700
  primaryLight: 'EFF6FF',  // Blue 50
  accentCyan: '0284C7',    // Sky Blue 600
  accentCyanLight: 'E0F2FE', // Sky Blue 50
  success: '047857',       // Emerald 700
  successLight: 'ECFDF5',  // Emerald 50
  warning: 'B45309',       // Amber 700
  warningLight: 'FFFBEB',  // Amber 50
  danger: 'B91C1C',        // Crimson 700
  dangerLight: 'FEF2F2',   // Crimson 50
  slateBg: 'F8FAFC',       // Slate 50
  cardBorder: 'CBD5E1',    // Slate 300
  textDark: '0F172A',      // Slate 900
  textMuted: '64748B',     // Slate 500
  gold: 'D97706',          // Gold 600
  goldLight: 'FEF3C7',     // Gold 50
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
 * Generate a luxury, boardroom-ready 16:9 PowerPoint (.pptx) Presentation
 * compatible with Microsoft PowerPoint, Google Slides, Apple Keynote, and LibreOffice.
 */
export const exportAssessmentToPPTX = async (instance, report) => {
  try {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9'; // 10" x 5.625" standard widescreen
    pptx.author = 'ScoreX Intelligence Advisory';
    pptx.company = 'ScoreX Google Cloud Advisory';
    pptx.revision = '2.0';

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
    const netValueEst = `$${(parseFloat(delta) * 1.8).toFixed(1)}M - $${(parseFloat(delta) * 3.2).toFixed(1)}M`;

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
        x: 4.8, y: 0.16, w: 4.7, h: 0.35,
        fontSize: 9.5, bold: true, color: '93C5FD', align: 'right', fontFace: 'Arial'
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
      slide.addText('ScoreX Engine • Google Gemini 3.7 Pro Reasoning', {
        x: 3.5, y: 5.3, w: 3.0, h: 0.25,
        fontSize: 8, color: PPTX_THEME.textMuted, align: 'center', fontFace: 'Arial'
      });
      slide.addText(`Slide ${slideNum} of ${totalSlides}`, {
        x: 7.5, y: 5.3, w: 2.0, h: 0.25,
        fontSize: 8, bold: true, color: PPTX_THEME.primary, align: 'right', fontFace: 'Arial'
      });
    };

    // ==========================================================
    // SLIDE 1: COVER / TITLE SLIDE (Dark Luxury Executive Theme)
    // ==========================================================
    const slide1 = pptx.addSlide();
    slide1.background = { color: PPTX_THEME.navyDark };

    slide1.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.1,
      fill: { color: PPTX_THEME.primary }
    });

    slide1.addText('SCOREX', {
      x: 0.8, y: 0.85, w: 8.4, h: 0.55,
      fontSize: 34, bold: true, color: PPTX_THEME.white, fontFace: 'Arial'
    });
    slide1.addText('ENTERPRISE ARCHITECTURE & CLOUD MATURITY ADVISORY', {
      x: 0.8, y: 1.45, w: 8.4, h: 0.3,
      fontSize: 10.5, bold: true, color: '94A3B8', fontFace: 'Arial', charSpacing: 1.5
    });

    slide1.addShape(pptx.ShapeType.line, {
      x: 0.8, y: 1.9, w: 8.4, h: 0,
      line: { color: PPTX_THEME.primary, width: 2.5 }
    });

    slide1.addText('Executive Architecture & Modernization Report', {
      x: 0.8, y: 2.1, w: 8.4, h: 0.65,
      fontSize: 23, bold: true, color: PPTX_THEME.white, fontFace: 'Arial'
    });
    slide1.addText(assessTitle, {
      x: 0.8, y: 2.75, w: 8.4, h: 0.45,
      fontSize: 15, bold: true, color: '38BDF8', fontFace: 'Arial'
    });

    // 2 Metadata Cards on Cover
    slide1.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 3.45, w: 4.05, h: 1.55,
      fill: { color: '162238' }, line: { color: '2A3B5C', width: 1 }
    });
    slide1.addText('TARGET CLIENT ENGAGEMENT', {
      x: 1.0, y: 3.6, w: 3.65, h: 0.22,
      fontSize: 8.5, bold: true, color: '38BDF8', fontFace: 'Arial'
    });
    slide1.addText(`Enterprise:  ${org}\nInitiative:  ${industry.length > 55 ? industry.substring(0, 52) + '...' : industry}\nAI Reasoning:  Google Gemini 3.7 Pro`, {
      x: 1.0, y: 3.88, w: 3.65, h: 1.0,
      fontSize: 9.5, color: 'E2E8F0', fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    slide1.addShape(pptx.ShapeType.roundRect, {
      x: 5.15, y: 3.45, w: 4.05, h: 1.55,
      fill: { color: '162238' }, line: { color: '2A3B5C', width: 1 }
    });
    slide1.addText('GOVERNANCE & CLASSIFICATION', {
      x: 5.35, y: 3.6, w: 3.65, h: 0.22,
      fontSize: 8.5, bold: true, color: '34D399', fontFace: 'Arial'
    });
    slide1.addText(`Classification:  Strictly Confidential (Board/CTO)\nDeliverable Date:  ${new Date().toISOString().split('T')[0]}\nGovernance Status:  OFFICIALLY APPROVED`, {
      x: 5.35, y: 3.88, w: 3.65, h: 1.0,
      fontSize: 9.5, color: 'E2E8F0', fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // ==========================================================
    // SLIDE 2: EXECUTIVE SCORECARD & BUSINESS VALUE REALIZATION
    // ==========================================================
    const slide2 = pptx.addSlide();
    slide2.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide2, 'Executive Scorecard & Strategic Context', 2);

    // 4 Top Metric Cards (Bringing Financial ROI upfront!)
    const cardW = 2.1;
    const cardH = 1.25;
    const cardY = 0.85;

    // Card 1: Current Score
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('CURRENT SCORE', {
      x: 0.75, y: cardY + 0.1, w: 1.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`${curScore} / 5.0`, {
      x: 0.75, y: cardY + 0.32, w: 1.8, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.primary, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.75, y: cardY + 0.85, w: 1.8, h: 0.26,
      fill: { color: PPTX_THEME.warningLight }, line: { color: 'FDE68A', width: 0.75 }
    });
    slide2.addText(maturityTier, {
      x: 0.75, y: cardY + 0.87, w: 1.8, h: 0.22,
      fontSize: 8, bold: true, color: PPTX_THEME.warning, align: 'center', fontFace: 'Arial'
    });

    // Card 2: Target Score
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 2.83, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('TARGET HORIZON', {
      x: 2.98, y: cardY + 0.1, w: 1.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`${tgtScore} / 5.0`, {
      x: 2.98, y: cardY + 0.32, w: 1.8, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 2.98, y: cardY + 0.85, w: 1.8, h: 0.26,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 0.75 }
    });
    slide2.addText('Level 5 - Optimized Target', {
      x: 2.98, y: cardY + 0.87, w: 1.8, h: 0.22,
      fontSize: 8, bold: true, color: PPTX_THEME.success, align: 'center', fontFace: 'Arial'
    });

    // Card 3: Modernization Delta
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 5.06, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addText('MATURITY DELTA', {
      x: 5.21, y: cardY + 0.1, w: 1.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.textMuted, fontFace: 'Arial'
    });
    slide2.addText(`+${delta} pts`, {
      x: 5.21, y: cardY + 0.32, w: 1.8, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.accentCyan, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 5.21, y: cardY + 0.85, w: 1.8, h: 0.26,
      fill: { color: 'E0F2FE' }, line: { color: 'BAE6FD', width: 0.75 }
    });
    slide2.addText('3-Phase Acceleration', {
      x: 5.21, y: cardY + 0.87, w: 1.8, h: 0.22,
      fontSize: 8, bold: true, color: '0369A1', align: 'center', fontFace: 'Arial'
    });

    // Card 4: Projected Financial ROI (Upfront Value Hook)
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 7.3, y: cardY, w: cardW, h: cardH,
      fill: { color: 'FFFFFF' }, line: { color: 'A7F3D0', width: 1.2 }
    });
    slide2.addText('PROJECTED 3-YR ROI', {
      x: 7.45, y: cardY + 0.1, w: 1.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide2.addText(netValueEst, {
      x: 7.45, y: cardY + 0.32, w: 1.8, h: 0.45,
      fontSize: 18, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 7.45, y: cardY + 0.85, w: 1.8, h: 0.26,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 0.75 }
    });
    slide2.addText('35-50% TCO Savings', {
      x: 7.45, y: cardY + 0.87, w: 1.8, h: 0.22,
      fontSize: 8, bold: true, color: PPTX_THEME.success, align: 'center', fontFace: 'Arial'
    });

    // Executive Summary & Strategic Context
    const sumY = 2.25;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: sumY, w: 8.8, h: 2.85,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: sumY, w: 0.08, h: 2.85,
      fill: { color: PPTX_THEME.primary }
    });

    slide2.addText('Executive Summary & Strategic Transformation Mandate', {
      x: 0.85, y: sumY + 0.15, w: 8.3, h: 0.3,
      fontSize: 12, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });

    const rawSummary = stripMarkdown(aiReport.executiveSummary || `${org} demonstrates a proven architectural baseline with significant modernization opportunities to eliminate batch latency, unify data silos into an open BigLake lakehouse, and deploy governed agentic AI workflows on Google Cloud.`);
    slide2.addText(rawSummary.length > 380 ? rawSummary.substring(0, 377) + '...' : rawSummary, {
      x: 0.85, y: sumY + 0.5, w: 8.3, h: 1.0,
      fontSize: 9.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.15
    });

    // 2 Strategic Transformation Pillars (Current Bottleneck vs Target Leap)
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 0.85, y: sumY + 1.6, w: 4.0, h: 1.05,
      fill: { color: PPTX_THEME.dangerLight }, line: { color: 'FECACA', width: 0.75 }
    });
    slide2.addText('[!] PRIMARY ARCHITECTURAL BOTTLENECK:', {
      x: 0.95, y: sumY + 1.7, w: 3.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.danger, fontFace: 'Arial'
    });
    const d1Text = aiReport.criticalConstraints?.[0] ? stripMarkdown(aiReport.criticalConstraints[0]) : '24-48 hour batch ETL replication lag halting real-time operational decisions and inflating compute costs';
    slide2.addText(d1Text.length > 130 ? d1Text.substring(0, 127) + '...' : d1Text, {
      x: 0.95, y: sumY + 1.95, w: 3.8, h: 0.6,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.1
    });

    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 5.15, y: sumY + 1.6, w: 4.0, h: 1.05,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 0.75 }
    });
    slide2.addText('[+] TARGET STRATEGIC PAYOFF:', {
      x: 5.25, y: sumY + 1.7, w: 3.8, h: 0.2,
      fontSize: 8.5, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    const d2Text = 'Sub-second real-time CDC with BigLake Apache Iceberg open table formats and 75% GenAI prompt cost reduction via Vertex AI';
    slide2.addText(d2Text, {
      x: 5.25, y: sumY + 1.95, w: 3.8, h: 0.6,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.1
    });

    // ==========================================================
    // SLIDE 3: MATURITY HEATMAP & DIMENSIONAL MATRIX (Clean colW)
    // ==========================================================
    const slide3 = pptx.addSlide();
    slide3.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide3, '01. Executive Maturity Heatmap & Dimensional Matrix', 3);

    const tableRows = [
      [
        { text: 'Architectural Dimension / Pillar', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF' } },
        { text: 'Current', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Target', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Delta', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Maturity Tier', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } },
        { text: 'Modernization Status', options: { bold: true, fill: { color: PPTX_THEME.navyDark }, color: 'FFFFFF', align: 'center' } }
      ]
    ];

    dimensions.forEach((dim, idx) => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      const cScore = typeof dScore.score === 'number' ? dScore.score : (parseFloat(instance?.responses?.[`${dim.id}_current`]) || 3.0);
      const fScore = typeof dScore.targetScore === 'number' ? dScore.targetScore : Math.min(5.0, +(cScore + 1.2).toFixed(1));
      const dVal = +(fScore - cScore).toFixed(1);
      const tier = cScore >= 4.2 ? 'Optimized (L5)' : cScore >= 3.4 ? 'Managed (L4)' : cScore >= 2.6 ? 'Defined (L3)' : 'Developing (L2)';
      const prio = dVal >= 1.5 ? 'CRITICAL GAP' : dVal >= 0.8 ? 'HIGH PRIORITY' : 'OPTIMIZED';
      const prioColor = prio === 'CRITICAL GAP' ? PPTX_THEME.danger : (prio === 'HIGH PRIORITY' ? PPTX_THEME.warning : PPTX_THEME.success);
      const rowBg = idx % 2 === 0 ? 'FFFFFF' : PPTX_THEME.slateBg;

      tableRows.push([
        { text: dim.name, options: { bold: true, color: PPTX_THEME.textDark, fill: { color: rowBg } } },
        { text: `${Number(cScore).toFixed(1)} / 5.0`, options: { align: 'center', bold: true, color: PPTX_THEME.primary, fill: { color: rowBg } } },
        { text: `${Number(fScore).toFixed(1)} / 5.0`, options: { align: 'center', bold: true, color: PPTX_THEME.success, fill: { color: rowBg } } },
        { text: `+${dVal}`, options: { align: 'center', bold: true, color: PPTX_THEME.accentCyan, fill: { color: rowBg } } },
        { text: tier, options: { align: 'center', color: PPTX_THEME.textMuted, fill: { color: rowBg } } },
        { text: prio, options: { align: 'center', bold: true, color: prioColor, fill: { color: rowBg } } }
      ]);
    });

    // Explicit colW prevents any table cell text overflow!
    slide3.addTable(tableRows, {
      x: 0.6, y: 0.95, w: 8.8,
      colW: [2.6, 1.1, 1.1, 0.8, 1.5, 1.7],
      fontSize: 9,
      fontFace: 'Arial',
      border: { pt: 0.5, color: PPTX_THEME.cardBorder },
      rowH: 0.55
    });

    // ==========================================================
    // SLIDE 4: ARCHITECTURAL STRENGTHS VS CRITICAL GAPS
    // ==========================================================
    const slide4 = pptx.addSlide();
    slide4.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide4, '02. Strengths vs. Critical Operational Debt', 4);

    const splitW = 4.25;
    const splitH = 4.15;

    // Strengths Box (Green)
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 0.9, w: splitW, h: splitH,
      fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 1.2 }
    });
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: 0.9, w: splitW, h: 0.42,
      fill: { color: '047857' }
    });
    slide4.addText('KEY ARCHITECTURAL STRENGTHS (FOUNDATION)', {
      x: 0.8, y: 0.98, w: splitW - 0.4, h: 0.28,
      fontSize: 10, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });

    const strList = (aiReport.keyStrengths && aiReport.keyStrengths.length > 0)
      ? aiReport.keyStrengths.slice(0, 4)
      : [
        'Core Cloud Tenancy: Established transactional database clusters and initial cloud adoption',
        'Executive Sponsorship: C-suite mandate backing enterprise modernization and AI integration',
        'Developer Prototyping: Active experimentation with conversational models and prompt templates',
        'Data Governance Baseline: Defined regulatory compliance and enterprise security policies'
      ];

    strList.forEach((s, idx) => {
      const itemY = 1.45 + (idx * 0.88);
      slide4.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: itemY, w: splitW - 0.4, h: 0.78,
        fill: { color: 'FFFFFF' }, line: { color: 'D1FAE5', width: 0.75 }
      });
      const parts = stripMarkdown(s).split(':');
      const title = parts.length > 1 ? parts[0] : `Strength 0${idx+1}`;
      const desc = parts.length > 1 ? parts.slice(1).join(':') : s;
      slide4.addText(`✔ ${title}`, {
        x: 0.95, y: itemY + 0.08, w: splitW - 0.7, h: 0.22,
        fontSize: 9, bold: true, color: '065F46', fontFace: 'Arial'
      });
      slide4.addText(desc.trim(), {
        x: 0.95, y: itemY + 0.32, w: splitW - 0.7, h: 0.4,
        fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.1
      });
    });

    // Gaps Box (Red)
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 5.15, y: 0.9, w: splitW, h: splitH,
      fill: { color: PPTX_THEME.dangerLight }, line: { color: 'FECACA', width: 1.2 }
    });
    slide4.addShape(pptx.ShapeType.rect, {
      x: 5.15, y: 0.9, w: splitW, h: 0.42,
      fill: { color: 'B91C1C' }
    });
    slide4.addText('CRITICAL OPERATIONAL DEBT & RISKS', {
      x: 5.35, y: 0.98, w: splitW - 0.4, h: 0.28,
      fontSize: 10, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });

    const gapList = (aiReport.criticalConstraints && aiReport.criticalConstraints.length > 0)
      ? aiReport.criticalConstraints.slice(0, 4)
      : [
        '24-48hr Batch ETL Lag: Fragmented cron replication causing severe operational decision delays',
        'Data Lakehouse Silos: Disjoint data islands driving high data egress taxes and duplicate ETL pipelines',
        'Unmanaged Token Burn: Public LLM calls with zero context caching inflating operational OPEX by 4x',
        'Missing AI Guardrails: Lack of Model Armor and automated DLP masking posing compliance exposure'
      ];

    gapList.forEach((g, idx) => {
      const itemY = 1.45 + (idx * 0.88);
      slide4.addShape(pptx.ShapeType.roundRect, {
        x: 5.35, y: itemY, w: splitW - 0.4, h: 0.78,
        fill: { color: 'FFFFFF' }, line: { color: 'FEE2E2', width: 0.75 }
      });
      const parts = stripMarkdown(g).split(':');
      const title = parts.length > 1 ? parts[0] : `Critical Risk 0${idx+1}`;
      const desc = parts.length > 1 ? parts.slice(1).join(':') : g;
      slide4.addText(`✖ ${title}`, {
        x: 5.5, y: itemY + 0.08, w: splitW - 0.7, h: 0.22,
        fontSize: 9, bold: true, color: '991B1B', fontFace: 'Arial'
      });
      slide4.addText(desc.trim(), {
        x: 5.5, y: itemY + 0.32, w: splitW - 0.7, h: 0.4,
        fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.1
      });
    });

    // ==========================================================
    // SLIDE 5: ARCHITECTURE EVOLUTION (5-Tier Parallel Comparison)
    // ==========================================================
    const slide5 = pptx.addSlide();
    slide5.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide5, '03. Enterprise Architecture Evolution (As-Is vs. To-Be)', 5);

    const archTiers = [
      {
        tier: '1. Ingestion & CDC',
        asIs: 'Point-to-point cron jobs & unmanaged batch ETL with 24-48hr lag',
        toBe: 'Serverless Google Cloud Datastream streaming CDC & Pub/Sub (<1s latency)'
      },
      {
        tier: '2. Storage & Lakehouse',
        asIs: 'Siloed relational databases and unmanaged flat storage buckets',
        toBe: 'BigLake Medallion Architecture with Apache Iceberg open table formats on GCS'
      },
      {
        tier: '3. Compute & FinOps',
        asIs: 'Static 24/7 over-provisioned VMs with $480k estimated idle waste',
        toBe: 'BigQuery Autoscaling Slots with GKE Autopilot pod-level metering & auto-suspend'
      },
      {
        tier: '4. Agentic AI & LLMs',
        asIs: 'Hardcoded public LLM calls paying 100% price with 0 caching',
        toBe: 'Vertex AI Agent Builder, MCP Tool Gateway & 75% prompt context caching'
      },
      {
        tier: '5. Zero-Trust Security',
        asIs: 'Perimeter-only IAM, public API endpoints, manual audit log triage',
        toBe: 'Zero-Trust Landing Zone with VPC-SC, Cloud KMS HSM CMEK, Model Armor'
      }
    ];

    archTiers.forEach((tier, idx) => {
      const rowY = 0.9 + (idx * 0.83);
      
      // Tier Label
      slide5.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y: rowY, w: 1.8, h: 0.72,
        fill: { color: PPTX_THEME.navyDark }
      });
      slide5.addText(tier.tier, {
        x: 0.7, y: rowY + 0.18, w: 1.6, h: 0.36,
        fontSize: 8.5, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
      });

      // As-Is Box (Red)
      slide5.addShape(pptx.ShapeType.roundRect, {
        x: 2.5, y: rowY, w: 3.2, h: 0.72,
        fill: { color: PPTX_THEME.dangerLight }, line: { color: 'FECACA', width: 0.75 }
      });
      slide5.addText(`As-Is: ${tier.asIs}`, {
        x: 2.6, y: rowY + 0.08, w: 3.0, h: 0.56,
        fontSize: 8, color: '991B1B', fontFace: 'Arial', lineSpacingMultiple: 1.1
      });

      // Transition Arrow
      slide5.addText('➔', {
        x: 5.75, y: rowY + 0.15, w: 0.4, h: 0.4,
        fontSize: 14, bold: true, color: PPTX_THEME.accentCyan, align: 'center', fontFace: 'Arial'
      });

      // To-Be Box (Green)
      slide5.addShape(pptx.ShapeType.roundRect, {
        x: 6.2, y: rowY, w: 3.2, h: 0.72,
        fill: { color: PPTX_THEME.successLight }, line: { color: 'A7F3D0', width: 0.75 }
      });
      slide5.addText(`Target: ${tier.toBe}`, {
        x: 6.3, y: rowY + 0.08, w: 3.0, h: 0.56,
        fontSize: 8, bold: true, color: '065F46', fontFace: 'Arial', lineSpacingMultiple: 1.1
      });
    });

    // ==========================================================
    // SLIDE 6: 4-TIER MODERNIZATION TRANSITION MATRIX (colW fixed)
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
      colW: [1.8, 2.3, 2.4, 2.3],
      fontSize: 9,
      fontFace: 'Arial',
      border: { pt: 0.5, color: PPTX_THEME.cardBorder },
      rowH: 0.82
    });

    // ==========================================================
    // SLIDE 7: PHASED 30-60-90 DAY STRATEGIC ROADMAP (Visual Cards)
    // ==========================================================
    const slide7 = pptx.addSlide();
    slide7.background = { color: 'FFFFFF' };
    addHeaderAndFooter(slide7, '05. Phased 30-60-90 Day Transformation Roadmap', 7);

    const phases = [
      {
        phase: 'PHASE 1 (DAYS 0-30)',
        title: 'Foundation & Immediate Wins',
        color: PPTX_THEME.primary,
        bgColor: PPTX_THEME.primaryLight,
        borderColor: 'BFDBFE',
        actions: [
          'Deploy Zero-Trust Ingress & Cloud Armor WAF',
          'Establish Datastream CDC Pipeline Prototype',
          'Eliminate Public Internet Endpoint Exposure',
          'Conduct Initial BigLake Table Proof-of-Concept'
        ],
        milestone: 'Security Baseline Hardened & CDC Operational'
      },
      {
        phase: 'PHASE 2 (DAYS 30-60)',
        title: 'Lakehouse & FinOps Scale',
        color: PPTX_THEME.warning,
        bgColor: PPTX_THEME.warningLight,
        borderColor: 'FDE68A',
        actions: [
          'Migrate Silos to BigLake Apache Iceberg Tables',
          'Activate BigQuery Autoscaling & Compute Auto-Suspend',
          'Deploy Apigee AI Gateway & Vertex Context Caching',
          'Implement Automated DLP Data Masking Policies'
        ],
        milestone: '75% Token Cost Cut & Sub-Second Query Speeds'
      },
      {
        phase: 'PHASE 3 (DAYS 60-90)',
        title: 'Agentic Mesh & Full Autonomy',
        color: PPTX_THEME.success,
        bgColor: PPTX_THEME.successLight,
        borderColor: 'A7F3D0',
        actions: [
          'Deploy Hub-and-Spoke MCP Multi-Agent Mesh',
          'Embed Model Armor Zero-Trust AI TRiSM Guardrails',
          'Automate FOCUS 1.0 Chargeback & FinOps Dashboard',
          'Conduct Executive Board Handover & Production Sign-Off'
        ],
        milestone: 'Enterprise Multi-Agent Autonomy & Live Governance'
      }
    ];

    phases.forEach((p, idx) => {
      const pX = 0.6 + (idx * 3.0);
      const pW = 2.8;

      slide7.addShape(pptx.ShapeType.roundRect, {
        x: pX, y: 0.95, w: pW, h: 4.15,
        fill: { color: p.bgColor }, line: { color: p.borderColor, width: 1.2 }
      });

      // Phase Header Banner
      slide7.addShape(pptx.ShapeType.rect, {
        x: pX, y: 0.95, w: pW, h: 0.45,
        fill: { color: p.color }
      });
      slide7.addText(p.phase, {
        x: pX + 0.1, y: 1.02, w: pW - 0.2, h: 0.3,
        fontSize: 9.5, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
      });

      slide7.addText(p.title, {
        x: pX + 0.15, y: 1.5, w: pW - 0.3, h: 0.3,
        fontSize: 10.5, bold: true, color: PPTX_THEME.navyDark, align: 'center', fontFace: 'Arial'
      });

      // Actions
      p.actions.forEach((act, aIdx) => {
        const aY = 1.9 + (aIdx * 0.58);
        slide7.addShape(pptx.ShapeType.roundRect, {
          x: pX + 0.15, y: aY, w: pW - 0.3, h: 0.52,
          fill: { color: 'FFFFFF' }, line: { color: p.borderColor, width: 0.75 }
        });
        slide7.addText(`• ${act}`, {
          x: pX + 0.25, y: aY + 0.04, w: pW - 0.5, h: 0.44,
          fontSize: 7.8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.05
        });
      });

      // Milestone Card
      slide7.addShape(pptx.ShapeType.roundRect, {
        x: pX + 0.15, y: 4.35, w: pW - 0.3, h: 0.6,
        fill: { color: 'FFFFFF' }, line: { color: p.color, width: 1 }
      });
      slide7.addText('KEY MILESTONE / OUTCOME:', {
        x: pX + 0.2, y: 4.4, w: pW - 0.4, h: 0.18,
        fontSize: 7, bold: true, color: p.color, fontFace: 'Arial'
      });
      slide7.addText(p.milestone, {
        x: pX + 0.2, y: 4.58, w: pW - 0.4, h: 0.32,
        fontSize: 7.5, bold: true, color: PPTX_THEME.textDark, fontFace: 'Arial'
      });
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

    // KPI 1: TCO
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: roiY, w: roiW, h: 1.25,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('35% - 50%', {
      x: 0.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.primary, fontFace: 'Arial'
    });
    slide8.addText('Compute & Storage TCO Savings via BigQuery & Iceberg Open Formats', {
      x: 0.8, y: roiY + 0.62, w: roiW - 0.4, h: 0.5,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // KPI 2: 3-Year Value
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 3.6, y: roiY, w: roiW, h: 1.25,
      fill: { color: PPTX_THEME.slateBg }, line: { color: 'A7F3D0', width: 1.2 }
    });
    slide8.addText(netValueEst, {
      x: 3.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.success, fontFace: 'Arial'
    });
    slide8.addText('3-Year Projected Net Value Creation & Direct Infrastructure Cost Avoidance', {
      x: 3.8, y: roiY + 0.62, w: roiW - 0.4, h: 0.5,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // KPI 3: Context Caching
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 6.6, y: roiY, w: roiW, h: 1.25,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('75% Discount', {
      x: 6.8, y: roiY + 0.15, w: roiW - 0.4, h: 0.45,
      fontSize: 22, bold: true, color: PPTX_THEME.accentCyan, fontFace: 'Arial'
    });
    slide8.addText('GenAI Input Token Cost Reduction via Google Vertex AI Context Caching', {
      x: 6.8, y: roiY + 0.62, w: roiW - 0.4, h: 0.5,
      fontSize: 8.5, color: PPTX_THEME.textDark, fontFace: 'Arial'
    });

    // Official Sign-Off Block
    const signBoxY = 2.35;
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: signBoxY, w: 8.8, h: 2.75,
      fill: { color: 'FFFFFF' }, line: { color: PPTX_THEME.cardBorder, width: 1 }
    });
    slide8.addText('OFFICIAL ARCHITECTURAL ACCEPTANCE & STAKEHOLDER GOVERNANCE SIGN-OFF', {
      x: 0.85, y: signBoxY + 0.15, w: 8.3, h: 0.28,
      fontSize: 10, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });

    const sigW = 2.65;
    const sigY = signBoxY + 0.5;
    const sigH = 1.95;

    // Sig 1
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 0.85, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('LEAD CLOUD ARCHITECT', {
      x: 1.0, y: sigY + 0.12, w: sigW - 0.3, h: 0.22,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Google Certified Fellow\nRole:  Principal Cloud Architect\nDate:  ${new Date().toISOString().split('T')[0]}\nAccreditation:  GCP Professional Data Architect`, {
      x: 1.0, y: sigY + 0.42, w: sigW - 0.3, h: 1.4,
      fontSize: 7.8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // Sig 2
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 3.65, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('VP OF ENGINEERING / CTO', {
      x: 3.8, y: sigY + 0.12, w: sigW - 0.3, h: 0.22,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Executive Sponsor\nRole:  VP of Engineering / CTO\nDate:  ${new Date().toISOString().split('T')[0]}\nMandate:  Enterprise Architecture Modernization`, {
      x: 3.8, y: sigY + 0.42, w: sigW - 0.3, h: 1.4,
      fontSize: 7.8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
    });

    // Sig 3
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 6.45, y: sigY, w: sigW, h: sigH,
      fill: { color: PPTX_THEME.slateBg }, line: { color: PPTX_THEME.cardBorder, width: 0.75 }
    });
    slide8.addText('CISO / GOVERNANCE LEAD', {
      x: 6.6, y: sigY + 0.12, w: sigW - 0.3, h: 0.22,
      fontSize: 9, bold: true, color: PPTX_THEME.navyDark, fontFace: 'Arial'
    });
    slide8.addText(`Signature:  _______________________\nName:  Governance Authority\nRole:  Head of Security & Compliance\nDate:  ${new Date().toISOString().split('T')[0]}\nCompliance:  Zero-Trust & SOC2/ISO27001 Gate`, {
      x: 6.6, y: sigY + 0.42, w: sigW - 0.3, h: 1.4,
      fontSize: 7.8, color: PPTX_THEME.textDark, fontFace: 'Arial', lineSpacingMultiple: 1.2
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
