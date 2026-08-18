import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Executive High-Contrast Luxury Print Palette
const COLORS = {
  navyDark: '#0F172A',        // Slate 900 (High-contrast header background)
  navyMedium: '#1E293B',      // Slate 800
  navyLight: '#334155',       // Slate 700 (Crisp dark body text)
  primary: '#1D4ED8',         // Blue 700 (Strong brand primary)
  primaryDark: '#1E40AF',     // Deep Blue 800
  primaryLight: '#EFF6FF',    // Light Blue 50 Fill
  primaryBorder: '#BFDBFE',   // Blue 200
  accentCyan: '#0284C7',      // Sky Blue 600
  success: '#047857',         // Emerald 700 (High-contrast green)
  successLight: '#ECFDF5',    // Emerald 50 Fill
  successBorder: '#A7F3D0',   // Emerald 200
  warning: '#B45309',         // Amber 700 (High-contrast amber)
  warningLight: '#FFFBEB',    // Amber 50 Fill
  warningBorder: '#FDE68A',   // Amber 200
  danger: '#B91C1C',          // Red 700 (High-contrast red)
  dangerLight: '#FEF2F2',     // Red 50 Fill
  dangerBorder: '#FECACA',    // Red 200
  slateBg: '#F8FAFC',         // Slate 50 Fill
  cardBorder: '#CBD5E1',      // Slate 300
  cardBorderLight: '#E2E8F0', // Slate 200
  textDark: '#0F172A',        // Slate 900 (Primary crisp text)
  textBody: '#1E293B',        // Slate 800 (Secondary crisp text)
  textMuted: '#475569',       // Slate 600 (Legible muted text)
  white: '#FFFFFF'
};

export class ExecutivePDFExporter {
  constructor(results = {}, assessmentInfo = {}) {
    this.doc = new jsPDF('p', 'pt', 'a4');
    this.results = results || {};
    this.assessmentInfo = assessmentInfo || {};
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 36;
    this.contentWidth = this.pageWidth - (2 * this.margin);
    
    // Normalize data structures
    this._normalizeData();
  }

  _stripMarkdown(text) {
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
  }

  _normalizeData() {
    const aiReport = this.assessmentInfo.aiReport || this.results.aiReport || {};
    const framework = this.assessmentInfo.frameworkSnapshot || this.results.frameworkSnapshot || {};
    const dimensions = framework.dimensions || [];
    const scores = this.results.scores || this.results.dimensionScores || this.assessmentInfo.scores || {};
    const dimInsights = aiReport.dimensionInsights || [];

    // 1. Normalize Category / Dimension Details dynamically
    const synthesized = {};
    dimensions.forEach((dim, idx) => {
      const dScore = scores[dim.id] || scores[dim.name];
      const curScore = typeof dScore === 'number' ? dScore : (typeof dScore?.score === 'number' ? dScore.score : (parseFloat(this.results.responses?.[`${dim.id}_current`]) || (3.0 + (idx % 3) * 0.4)));
      const futScore = typeof dScore?.targetScore === 'number' ? dScore.targetScore : Math.min(5.0, +(curScore + 1.2).toFixed(1));
      
      const insight = dimInsights.find(di => di.dimensionId === dim.id || di.dimensionName === dim.name);

      const strengths = insight?.findings 
        ? [this._stripMarkdown(insight.findings)]
        : (dim.questions?.[0]?.options?.[3]?.text 
          ? [`Established capability: ${dim.questions[0].options[3].text}`] 
          : [`Standardized baseline capability and operational runbooks established for ${dim.name}.`]);

      const challenges = insight?.priorityAction
        ? [`Identified bottleneck: ${this._stripMarkdown(insight.priorityAction)}`]
        : (dim.questions?.[0]?.technicalPainPoints?.[0]
          ? [`Technical debt: ${dim.questions[0].technicalPainPoints[0]}`]
          : [`Operational friction and latency bottlenecks identified in ${dim.name} pipeline.`]);

      const rec = insight?.priorityAction 
        ? this._stripMarkdown(insight.priorityAction)
        : `Modernize ${dim.name} architecture towards automated, governed cloud workflows on Google Cloud.`;

      synthesized[dim.id] = {
        id: dim.id,
        name: dim.name,
        currentScore: curScore,
        futureScore: futScore,
        description: dim.description || `Assessment of architecture maturity, automation, and governance for ${dim.name}.`,
        level: { level: curScore >= 4.2 ? 'Optimized' : curScore >= 3.4 ? 'Managed' : curScore >= 2.6 ? 'Defined' : 'Developing' },
        strengths,
        challenges,
        recommendations: [rec]
      };
    });

    this.results.categoryDetails = Object.keys(synthesized).length > 0 ? synthesized : (this.results.categoryDetails || {});

    // 2. Normalize Overall Score
    const rawScore = this.results.overall?.currentScore || this.results.totalScore || this.assessmentInfo.totalScore || 3.2;
    const curScore = Number(rawScore);
    const futScore = Number(this.results.overall?.futureScore || Math.min(5.0, +(curScore + 1.3).toFixed(1)));
    
    this.results.overall = {
      currentScore: curScore,
      futureScore: futScore,
      gap: +(futScore - curScore).toFixed(1),
      level: {
        level: curScore >= 4.2 ? 'Optimized' : curScore >= 3.4 ? 'Managed' : curScore >= 2.6 ? 'Defined' : 'Developing',
        description: aiReport.executiveSummary || this.results.overall?.level?.description || 'Architecture transformation roadmap synthesized with Gemini 3.7 Flash Reasoning Engine.'
      }
    };
  }

  generate() {
    // PAGE 1: Executive Cover Page & Scorecard Hub
    this.addCoverPage();

    // PAGE 2: Executive Maturity Matrix & Dimension Audit
    this.doc.addPage();
    this.addHeader('01. Executive Maturity Matrix & Dimension Audit');
    this.addMaturityMatrixPage();

    // PAGE 3: Architecture Evolution Blueprint (As-Is vs To-Be)
    this.doc.addPage();
    this.addHeader('02. Architectural Evolution Blueprint');
    this.addArchitectureEvolutionPage();

    // PAGE 4: Prioritized Strategic Roadmap & Execution Backlog
    this.doc.addPage();
    this.addHeader('03. Strategic Roadmap & Backlog');
    this.addRoadmapPage();

    // PAGE 5: Dimensional Deep-Dive & Findings
    this.doc.addPage();
    this.addHeader('04. Dimensional Deep-Dive Findings');
    this.addDimensionalAuditPage();

    // PAGE 6: Governance, Methodology & Executive Sign-off
    this.doc.addPage();
    this.addHeader('05. Governance & Executive Sign-off');
    this.addGovernanceAndSignOffPage();

    // Add Page Numbers & Footers
    this.addPageNumbersAndFooters();

    return this.doc;
  }

  // ==========================================
  // PAGE HEADERS & FOOTERS (High-Contrast, Zero Collision)
  // ==========================================
  addHeader(sectionTitle = '') {
    this.doc.setFillColor(COLORS.navyDark);
    this.doc.rect(0, 0, this.pageWidth, 34, 'F');
    
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 34, this.pageWidth, 2.5, 'F');

    // Logo & Short Platform Tag
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(COLORS.white);
    this.doc.text('SCOREX', this.margin, 21);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor('#94A3B8');
    this.doc.text('Enterprise Architecture Advisory', this.margin + 56, 21);

    if (sectionTitle) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor('#93C5FD');
      this.doc.text(sectionTitle.toUpperCase(), this.pageWidth - this.margin, 21, { align: 'right' });
    }
  }

  addPageNumbersAndFooters() {
    const totalPages = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (i === 1) continue; // Skip cover footer

      // Footer divider line
      this.doc.setDrawColor(COLORS.cardBorder);
      this.doc.setLineWidth(0.75);
      this.doc.line(this.margin, this.pageHeight - 26, this.pageWidth - this.margin, this.pageHeight - 26);

      // Left: Org / Classification
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(COLORS.textMuted);
      this.doc.text('CONFIDENTIAL EXECUTIVE DELIVERABLE', this.margin, this.pageHeight - 14);

      // Center: Platform & Engine Attribution
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textMuted);
      this.doc.text('ScoreX Platform • Gemini 3.7 Reasoning', this.pageWidth / 2, this.pageHeight - 14, { align: 'center' });

      // Right: Page number
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.primaryDark);
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 14, { align: 'right' });
    }
  }

  // ==========================================
  // PAGE 1: EXECUTIVE COVER & SCORECARD
  // ==========================================
  addCoverPage() {
    const org = this.assessmentInfo.organizationName || 'Quantum FinTech Global';
    const assessTitle = this.assessmentInfo.assessmentName || 'Enterprise Data & AI Architecture Maturity';
    const industry = this.assessmentInfo.industry || 'Enterprise GenAI Architecture Modernization & Cost Arbitrage';
    const curScore = Number(this.results.overall?.currentScore || 3.0).toFixed(1);
    const tgtScore = Number(this.results.overall?.futureScore || 4.5).toFixed(1);
    const delta = +(tgtScore - curScore).toFixed(1);
    const scoreNum = parseFloat(curScore);
    const maturityTier = scoreNum >= 4.2 ? 'Level 5 - Optimized' : scoreNum >= 3.4 ? 'Level 4 - Managed' : scoreNum >= 2.6 ? 'Level 3 - Defined' : 'Level 2 - Developing';

    // 1. Full-Width Solid Dark Banner
    this.doc.setFillColor(COLORS.navyDark);
    this.doc.rect(0, 0, this.pageWidth, 185, 'F');

    // Accent line
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 185, this.pageWidth, 4, 'F');

    // Brand Header
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(26);
    this.doc.setTextColor(COLORS.white);
    this.doc.text('SCOREX', this.margin, 52);

    this.doc.setFontSize(9.5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor('#94A3B8');
    this.doc.text('ENTERPRISE ARCHITECTURE & CLOUD MATURITY ADVISORY', this.margin, 70);

    // Document Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.doc.setTextColor(COLORS.white);
    this.doc.text('Executive Architecture & Modernization Report', this.margin, 115);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor('#38BDF8');
    this.doc.text(assessTitle, this.margin, 138);

    this.doc.setFontSize(9);
    this.doc.setTextColor('#CBD5E1');
    this.doc.text(`Prepared for: ${org} • ${industry}`, this.margin, 158);

    // 2. Three High-Contrast Metric Cards
    const cardY = 204;
    const cardW = (this.contentWidth - 24) / 3;
    const cardH = 92;

    // Card 1: Current Maturity Score
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.setLineWidth(1.2);
    this.doc.roundedRect(this.margin, cardY, cardW, cardH, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('CURRENT MATURITY SCORE', this.margin + 14, cardY + 22);

    this.doc.setFontSize(28);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(`${curScore}`, this.margin + 14, cardY + 56);

    this.doc.setFontSize(13);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('/ 5.0', this.margin + 68, cardY + 56);

    // Badge Pill
    this.doc.setFillColor(COLORS.warningLight);
    this.doc.setDrawColor(COLORS.warningBorder);
    this.doc.roundedRect(this.margin + 12, cardY + 66, cardW - 24, 18, 4, 4, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.warning);
    this.doc.text(maturityTier, this.margin + (cardW / 2), cardY + 78, { align: 'center' });

    // Card 2: Target Horizon Score
    const card2X = this.margin + cardW + 12;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(card2X, cardY, cardW, cardH, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('TARGET HORIZON (TO-BE)', card2X + 14, cardY + 22);

    this.doc.setFontSize(28);
    this.doc.setTextColor(COLORS.success);
    this.doc.text(`${tgtScore}`, card2X + 14, cardY + 56);

    this.doc.setFontSize(13);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('/ 5.0', card2X + 68, cardY + 56);

    // Badge Pill
    this.doc.setFillColor(COLORS.successLight);
    this.doc.setDrawColor(COLORS.successBorder);
    this.doc.roundedRect(card2X + 12, cardY + 66, cardW - 24, 18, 4, 4, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.success);
    this.doc.text('Level 5 - Optimized Target', card2X + (cardW / 2), cardY + 78, { align: 'center' });

    // Card 3: Modernization Delta
    const card3X = card2X + cardW + 12;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(card3X, cardY, cardW, cardH, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('MODERNIZATION DELTA', card3X + 14, cardY + 22);

    this.doc.setFontSize(28);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text(`+${delta}`, card3X + 14, cardY + 56);

    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('pts gap', card3X + 80, cardY + 56);

    // Badge Pill
    this.doc.setFillColor('#E0F2FE');
    this.doc.setDrawColor('#BAE6FD');
    this.doc.roundedRect(card3X + 12, cardY + 66, cardW - 24, 18, 4, 4, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor('#0369A1');
    this.doc.text('3-Phase Acceleration Wave', card3X + (cardW / 2), cardY + 78, { align: 'center' });

    // 3. Dynamic Executive Summary Panel
    let yPos = 312;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 192, 5, 5, 'FD');

    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(this.margin, yPos, 4.5, 192, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Executive Summary & Strategic Context', this.margin + 16, yPos + 24);

    const aiReport = this.assessmentInfo.aiReport || this.results.aiReport || {};
    const rawSummary = this._stripMarkdown(aiReport.executiveSummary || 
      this.results.overall?.level?.description || 
      `This comprehensive enterprise assessment evaluates ${org}'s architectural baseline across data platforms, multi-agent AI ecosystems, cloud cost governance, and zero-trust security perimeters. The current architecture demonstrates a proven foundation with strategic modernization frontiers to eliminate legacy batch latency, unify siloed data warehouses into an open BigLake lakehouse, and deploy governed agentic AI workflows on Google Cloud.`);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(COLORS.textDark);
    const summaryLines = this.doc.splitTextToSize(rawSummary, this.contentWidth - 34);
    this.doc.text(summaryLines.slice(0, 7), this.margin + 16, yPos + 44);

    // Dynamic Key Drivers Box
    const subBoxY = yPos + 122;
    this.doc.setFillColor(COLORS.primaryLight);
    this.doc.setDrawColor(COLORS.primaryBorder);
    this.doc.roundedRect(this.margin + 14, subBoxY, this.contentWidth - 28, 58, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.primaryDark);
    this.doc.text('KEY ARCHITECTURAL MODERNIZATION DRIVERS:', this.margin + 24, subBoxY + 18);

    const driver1 = aiReport.keyStrengths?.[0] 
      ? `• Foundation: ${this._stripMarkdown(aiReport.keyStrengths[0])}`
      : '• Transition from 24-48h batch ETL to real-time streaming CDC via Google Cloud Dataflow & BigLake Iceberg';
    const driver2 = aiReport.criticalConstraints?.[0]
      ? `• Critical Modernization: Remediate ${this._stripMarkdown(aiReport.criticalConstraints[0])}`
      : '• Deploy Vertex AI Agent Builder & Model Context Protocol (MCP) gateway with Model Armor zero-trust guardrails';

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text(this.doc.splitTextToSize(driver1, this.contentWidth - 60)[0] || '', this.margin + 24, subBoxY + 33);
    this.doc.text(this.doc.splitTextToSize(driver2, this.contentWidth - 60)[0] || '', this.margin + 24, subBoxY + 47);

    // 4. Assessment Metadata Grid
    yPos = 520;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Assessment Engagement Parameters', this.margin, yPos + 10);

    const dimsCount = Object.keys(this.results.categoryDetails || {}).length || 5;
    const questionsCount = this.assessmentInfo.totalQuestions || (dimsCount * 2);
    const dateStr = new Date(this.assessmentInfo.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const metaData = [
      ['Target Organization', org, 'Assessment Date', dateStr],
      ['Engagement Scope', assessTitle, 'Architecture Pillars', `${dimsCount} Evaluated Dimensions`],
      ['Total Questions Evaluated', `${questionsCount} Rigorous Questions`, 'Validation Standard', 'Google Cloud Well-Architected Framework'],
      ['AI Architecture Model', 'Gemini 3.7 Reasoning Engine', 'Classification', 'Confidential - Executive Use Only']
    ];

    autoTable(this.doc, {
      startY: yPos + 20,
      body: metaData,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.75
      },
      columnStyles: {
        0: { cellWidth: 135, fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [51, 65, 85] },
        1: { cellWidth: 'auto', fontStyle: 'normal', textColor: [15, 23, 42] },
        2: { cellWidth: 125, fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [51, 65, 85] },
        3: { cellWidth: 'auto', fontStyle: 'normal', textColor: [15, 23, 42] }
      }
    });

    // 5. Signature & Sign-off strip
    const signY = 724;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, signY, this.contentWidth, 68, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('ENGAGEMENT GOVERNANCE & DELIVERY SIGN-OFF', this.margin + 14, signY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('Lead Cloud Solution Architect: Google Cloud Certified Fellow', this.margin + 14, signY + 36);
    this.doc.text('Executive Sponsor: Enterprise Technology Advisory & Strategy Board', this.margin + 14, signY + 52);

    this.doc.text('Status: Official Final Deliverable', this.pageWidth - this.margin - 160, signY + 36);
    this.doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, this.pageWidth - this.margin - 160, signY + 52);
  }

  // ==========================================
  // PAGE 2: DIMENSIONAL MATURITY MATRIX
  // ==========================================
  addMaturityMatrixPage() {
    let yPos = 50;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Executive Maturity Heatmap & Dimensional Matrix', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Quantitative capability scoring across all architectural pillars with target 18-month horizon benchmarks.', this.margin, yPos + 14);

    yPos += 26;

    // Table Data
    const dims = this.results.categoryDetails || {};
    const tableRows = [];

    Object.keys(dims).forEach(k => {
      const d = dims[k];
      const cur = Number(d.currentScore || 3.0).toFixed(1);
      const tgt = Number(d.futureScore || 4.5).toFixed(1);
      const delta = +(tgt - cur).toFixed(1);
      const curNum = parseFloat(cur);
      const tier = curNum >= 4.2 ? 'Optimized (L5)' : curNum >= 3.4 ? 'Managed (L4)' : curNum >= 2.6 ? 'Defined (L3)' : 'Developing (L2)';
      const priority = delta >= 1.5 ? 'CRITICAL GAP' : delta >= 0.8 ? 'HIGH PRIORITY' : 'MODERATE';

      tableRows.push([
        d.name || k,
        `${cur} / 5.0`,
        `${tgt} / 5.0`,
        `+${delta}`,
        tier,
        priority
      ]);
    });

    autoTable(this.doc, {
      startY: yPos,
      head: [['Architectural Dimension / Pillar', 'Current Baseline', 'Target Horizon', 'Delta', 'Maturity Tier', 'Modernization Status']],
      body: tableRows,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 7
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.75
      },
      columnStyles: {
        0: { cellWidth: 175, fontStyle: 'bold', textColor: [15, 23, 42] },
        1: { cellWidth: 65, halign: 'center', fontStyle: 'bold', textColor: [29, 78, 216] },
        2: { cellWidth: 65, halign: 'center', fontStyle: 'bold', textColor: [4, 120, 87] },
        3: { cellWidth: 45, halign: 'center', fontStyle: 'bold', textColor: [2, 132, 199] },
        4: { cellWidth: 85, halign: 'center', textColor: [51, 65, 85] },
        5: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'CRITICAL GAP') {
            data.cell.styles.textColor = [185, 28, 28];
            data.cell.styles.fillColor = [254, 242, 242];
          } else if (data.cell.raw === 'HIGH PRIORITY') {
            data.cell.styles.textColor = [180, 83, 9];
            data.cell.styles.fillColor = [255, 251, 235];
          } else {
            data.cell.styles.textColor = [4, 120, 87];
            data.cell.styles.fillColor = [236, 253, 245];
          }
        }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 16;

    // 2. Strengths vs Gaps Comparison Callout Boxes
    const colW = (this.contentWidth - 14) / 2;
    const boxH = 190;
    const aiReport = this.assessmentInfo.aiReport || this.results.aiReport || {};

    // Left Box: Key Strengths
    this.doc.setFillColor(COLORS.successLight);
    this.doc.setDrawColor(COLORS.successBorder);
    this.doc.setLineWidth(1.2);
    this.doc.roundedRect(this.margin, yPos, colW, boxH, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor('#065F46');
    this.doc.text('Key Architectural Strengths', this.margin + 14, yPos + 22);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textDark);

    const strengths = (aiReport.keyStrengths && aiReport.keyStrengths.length > 0)
      ? aiReport.keyStrengths.map(s => `• ${this._stripMarkdown(s)}`)
      : [
        '• Established core transactional database services and automated infrastructure',
        '• High leadership sponsorship for enterprise cloud & GenAI modernization',
        '• Active deployment of conversational AI tools and prototype agent services',
        '• Defined compliance baseline for customer data privacy and regulatory standards'
      ];
    
    let strY = yPos + 42;
    strengths.slice(0, 4).forEach(s => {
      const lines = this.doc.splitTextToSize(s, colW - 28);
      this.doc.text(lines, this.margin + 14, strY);
      strY += lines.length * 11.5 + 5;
    });

    // Right Box: Critical Gaps & Technical Debt
    const rightX = this.margin + colW + 14;
    this.doc.setFillColor(COLORS.dangerLight);
    this.doc.setDrawColor(COLORS.dangerBorder);
    this.doc.roundedRect(rightX, yPos, colW, boxH, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor('#991B1B');
    this.doc.text('Critical Gaps & Operational Debt', rightX + 14, yPos + 22);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textDark);

    const gaps = (aiReport.criticalConstraints && aiReport.criticalConstraints.length > 0)
      ? aiReport.criticalConstraints.map(g => `• ${this._stripMarkdown(g)}`)
      : [
        '• 24-48 hour batch ETL replication lag halting real-time operational decisions',
        '• Fragmented data silos across legacy on-prem databases and disjoint cloud buckets',
        '• Unmanaged public LLM egress with zero prompt caching and token cost waste',
        '• Missing centralized AI TRiSM guardrails, automated DLP masking, and Model Armor'
      ];
    
    let gapY = yPos + 42;
    gaps.slice(0, 4).forEach(g => {
      const lines = this.doc.splitTextToSize(g, colW - 28);
      this.doc.text(lines, rightX + 14, gapY);
      gapY += lines.length * 11.5 + 5;
    });

    // 3. Dynamic TCO / ROI Strip (Clean Multi-line text wrapping without overlap)
    yPos += boxH + 16;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 80, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('PROJECTED MODERNIZATION ROI & EFFICIENCY GAINS (18-MONTH HORIZON)', this.margin + 16, yPos + 18);

    const kpiW = (this.contentWidth - 32) / 3;
    const avgGap = this.results.overall?.gap || 1.3;
    const tcoSavingRange = avgGap > 1.2 ? '35% - 50%' : '25% - 40%';
    const netValueEst = `$${(avgGap * 1.8).toFixed(1)}M - $${(avgGap * 3.2).toFixed(1)}M`;
    
    // KPI 1: TCO Savings
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(tcoSavingRange, this.margin + 16, yPos + 40);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    const kpi1Lines = this.doc.splitTextToSize('Compute & Storage TCO Reduction via BigQuery & Iceberg', kpiW - 12);
    this.doc.text(kpi1Lines, this.margin + 16, yPos + 54);

    // KPI 2: Value Creation
    const k2X = this.margin + 16 + kpiW;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(COLORS.success);
    this.doc.text(netValueEst, k2X, yPos + 40);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    const kpi2Lines = this.doc.splitTextToSize('3-Year Value Creation & Cost Avoidance Benefit', kpiW - 12);
    this.doc.text(kpi2Lines, k2X, yPos + 54);

    // KPI 3: GenAI Token Discount
    const k3X = k2X + kpiW;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text('75% Discount', k3X, yPos + 40);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    const kpi3Lines = this.doc.splitTextToSize('GenAI Token Input Savings via Vertex Context Caching', kpiW - 12);
    this.doc.text(kpi3Lines, k3X, yPos + 54);
  }

  // ==========================================
  // PAGE 3: ARCHITECTURE EVOLUTION BLUEPRINT
  // ==========================================
  addArchitectureEvolutionPage() {
    let yPos = 50;
    const org = this.assessmentInfo.organizationName || 'Enterprise Organization';

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Enterprise Architecture Evolution: As-Is vs. To-Be', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text(`Comparative architectural shift from legacy technical debt to Google Cloud target architecture for ${org}.`, this.margin, yPos + 14);

    yPos += 26;

    const colW = (this.contentWidth - 14) / 2;
    const cardH = 265;
    const diagrams = this.assessmentInfo?.architectureDiagrams || this.results?.architectureDiagrams || this.assessmentInfo?.aiReport?.architectureDiagrams || {};
    const curTitle = diagrams.currentTitle || 'CURRENT BASELINE (AS-IS ARCHITECTURE)';
    const curSub = diagrams.currentSubtitle || 'Blueprint Ref: P1-APP-L-01 (Legacy Dependency Map)';
    const tgtTitle = diagrams.targetTitle || 'TARGET CLOUD-NATIVE (TO-BE ARCHITECTURE)';
    const tgtSub = diagrams.targetSubtitle || 'Blueprint Ref: P3-APP-C-01 & P3-DAT-L-04 (BigLake Fabric)';

    // LEFT CARD: AS-IS CURRENT STATE
    this.doc.setFillColor('#FFF5F5');
    this.doc.setDrawColor('#F87171');
    this.doc.setLineWidth(1.2);
    this.doc.roundedRect(this.margin, yPos, colW, cardH, 5, 5, 'FD');

    // Title Strip
    this.doc.setFillColor('#DC2626');
    this.doc.roundedRect(this.margin, yPos, colW, 28, 5, 5, 'F');
    this.doc.rect(this.margin, yPos + 22, colW, 6, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.white);
    this.doc.text(curTitle.length > 42 ? curTitle.substring(0, 40) + '...' : curTitle, this.margin + 12, yPos + 18);

    let curY = yPos + 44;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor('#991B1B');
    this.doc.text(curSub.length > 55 ? curSub.substring(0, 53) + '...' : curSub, this.margin + 12, curY);

    curY += 16;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textDark);

    const asIsItems = [
      '• Ingestion: Point-to-point cron jobs & unmanaged batch transfers with 24-48hr latency',
      '• Storage: Siloed relational databases and unmanaged flat storage buckets',
      '• Compute: Static 24/7 over-provisioned VMs without automated auto-suspend policies',
      '• AI & Serving: Unmanaged hardcoded LLM calls paying 100% price with zero prompt caching',
      '• Security: Disjoint IAM access, public API endpoints, and manual audit triage'
    ];

    asIsItems.forEach(item => {
      const lines = this.doc.splitTextToSize(item, colW - 24);
      this.doc.text(lines, this.margin + 12, curY);
      curY += lines.length * 11 + 4;
    });

    // High-Contrast Warning Badge (ASCII safe)
    this.doc.setFillColor('#FEE2E2');
    this.doc.setDrawColor('#EF4444');
    this.doc.roundedRect(this.margin + 10, yPos + cardH - 42, colW - 20, 32, 4, 4, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#B91C1C');
    const warnLines = this.doc.splitTextToSize('[!] CRITICAL BOTTLENECK: 38% ETL lag and unmanaged token billing burn', colW - 32);
    this.doc.text(warnLines, this.margin + 16, yPos + cardH - 24);

    // RIGHT CARD: TO-BE TARGET STATE
    const rightX = this.margin + colW + 14;
    this.doc.setFillColor('#F0FDF4');
    this.doc.setDrawColor('#34D399');
    this.doc.roundedRect(rightX, yPos, colW, cardH, 5, 5, 'FD');

    // Title Strip
    this.doc.setFillColor('#059669');
    this.doc.roundedRect(rightX, yPos, colW, 28, 5, 5, 'F');
    this.doc.rect(rightX, yPos + 22, colW, 6, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.white);
    this.doc.text(tgtTitle.length > 42 ? tgtTitle.substring(0, 40) + '...' : tgtTitle, rightX + 12, yPos + 18);

    let tgtY = yPos + 44;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor('#065F46');
    this.doc.text(tgtSub.length > 55 ? tgtSub.substring(0, 53) + '...' : tgtSub, rightX + 12, tgtY);

    tgtY += 16;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textDark);

    const toBeItems = [
      '• Ingestion: Serverless Google Cloud Dataflow streaming CDC & Pub/Sub messaging bus (<1s)',
      '• Storage: BigLake Medallion Architecture with Apache Iceberg open table formats on GCS',
      '• Compute: BigQuery Editions autoscaling slots with GKE Autopilot gVisor sandboxed compute',
      '• AI & Serving: Vertex AI Agent Builder, Model Context Protocol (MCP), and 75% context caching',
      '• Security: Zero-Trust Landing Zone with VPC-SC, Cloud KMS HSM CMEK, Model Armor'
    ];

    toBeItems.forEach(item => {
      const lines = this.doc.splitTextToSize(item, colW - 24);
      this.doc.text(lines, rightX + 12, tgtY);
      tgtY += lines.length * 11 + 4;
    });

    // High-Contrast Success Badge (ASCII safe)
    this.doc.setFillColor('#DCFCE7');
    this.doc.setDrawColor('#10B981');
    this.doc.roundedRect(rightX + 10, yPos + cardH - 42, colW - 20, 32, 4, 4, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#047857');
    const succLines = this.doc.splitTextToSize('[+] TARGET OUTCOME: 99.99% Multi-Region HA & Sub-Second Analytical Queries', colW - 32);
    this.doc.text(succLines, rightX + 16, yPos + cardH - 24);

    // 2. Modernization Transformation Table
    yPos += cardH + 18;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Key Architectural Modernization Vectors (4-Tier Transition Matrix)', this.margin, yPos);

    yPos += 8;

    const vectorData = [
      [
        'Tier 1: Ingestion & CDC',
        'Brittle Informatica/Bash cron scripts with 24h batch lag',
        'Google Cloud Datastream CDC + Dataflow & Pub/Sub event bus',
        'Sub-second real-time replication with zero source DB locks'
      ],
      [
        'Tier 2: Unified Lakehouse',
        'Proprietary siloed warehouses with high egress tax',
        'BigLake Apache Iceberg open table formats on Cloud Storage',
        'Zero vendor lock-in, 45% licensing reduction, unified catalog'
      ],
      [
        'Tier 3: Compute & FinOps',
        'Static 24/7 oversized VMs with $480k estimated idle waste',
        'BigQuery Autoscaling Slots & GKE Autopilot pod metering',
        '100% FOCUS 1.0 chargeback attribution and 15-min auto-suspend'
      ],
      [
        'Tier 4: Agentic AI & Sec',
        'Unmanaged LLM calls without prompt caching or DLP',
        'Vertex AI Agent Builder + MCP Tool Gateway & Model Armor',
        '75% token discount via Context Caching with VPC-SC guardrails'
      ]
    ];

    autoTable(this.doc, {
      startY: yPos + 6,
      head: [['Modernization Tier', 'Current As-Is Pattern', 'Target Google Cloud Pattern', 'Business & Technical Value']],
      body: vectorData,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        cellPadding: 6
      },
      styles: {
        fontSize: 8,
        cellPadding: 6,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.75
      },
      columnStyles: {
        0: { cellWidth: 110, fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [15, 23, 42] },
        1: { cellWidth: 135, textColor: [153, 27, 27] },
        2: { cellWidth: 145, textColor: [6, 95, 70], fontStyle: 'bold' },
        3: { cellWidth: 'auto', textColor: [3, 105, 161] }
      }
    });
  }

  // ==========================================
  // PAGE 4: PRIORITIZED ROADMAP & BACKLOG
  // ==========================================
  addRoadmapPage() {
    let yPos = 50;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Prioritized Strategic Roadmap & 30-60-90 Day Backlog', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Sequenced transformation initiatives structured by priority, expected business impact, and execution horizon.', this.margin, yPos + 14);

    yPos += 26;

    // Roadmap Table
    const aiReport = this.assessmentInfo.aiReport || this.results.aiReport || {};
    const rawRecs = aiReport.prioritizedRecommendations || this.results.recommendations || [];
    const roadmapRows = [];

    const defaultRoadmap = [
      {
        p: 'P1 - CRITICAL',
        title: 'Deploy Zero-Trust Ingress & Cloud Armor WAF',
        dim: 'Security & Perimeter',
        impact: 'Eliminates public internet exposure and blocks OWASP Top 10 exploits',
        time: 'Day 0 - 30 (Wave 1)'
      },
      {
        p: 'P1 - CRITICAL',
        title: 'Establish Real-Time Datastream CDC & BigLake Ingestion',
        dim: 'Data Lakehouse',
        impact: 'Eliminates 24-hour batch replication lag and source database locking',
        time: 'Day 15 - 45 (Wave 1)'
      },
      {
        p: 'P2 - HIGH',
        title: 'Migrate AI Ingress to Apigee Gateway with Prompt Caching',
        dim: 'AI & Machine Learning',
        impact: 'Reduces LLM input token burn by 75% and accelerates TTFT to <200ms',
        time: 'Day 30 - 60 (Wave 2)'
      },
      {
        p: 'P2 - HIGH',
        title: 'Implement BigQuery FOCUS 1.0 Automated Billing Lake',
        dim: 'FinOps Governance',
        impact: 'Establishes 100% cost attribution and automated idle resource pruning',
        time: 'Day 45 - 75 (Wave 2)'
      },
      {
        p: 'P3 - STRATEGIC',
        title: 'Deploy Hub-and-Spoke Agent Mesh with MCP Tool Services',
        dim: 'Agentic Ecosystem',
        impact: 'Enables cross-departmental autonomous multi-agent task execution',
        time: 'Day 60 - 90 (Wave 3)'
      },
      {
        p: 'P3 - STRATEGIC',
        title: 'Consolidate Looker Governed Semantic BI Model',
        dim: 'Analytics & BI',
        impact: 'Unifies corporate KPI metrics with zero extract lag and instant load',
        time: 'Day 75 - 90 (Wave 3)'
      }
    ];

    const sourceRoadmap = rawRecs.length >= 3 ? rawRecs.slice(0, 6).map((r, i) => ({
      p: r.priority ? `P${i+1} - ${r.priority.toUpperCase()}` : (i < 2 ? 'P1 - CRITICAL' : i < 4 ? 'P2 - HIGH' : 'P3 - STRATEGIC'),
      title: this._stripMarkdown(r.title || `Strategic Action Item ${i+1}`),
      dim: this._stripMarkdown(r.pillar || r.dimension || 'Architecture'),
      impact: this._stripMarkdown(r.impact || r.expectedImpact || r.whyItMatters || 'Accelerates cloud modernization and reduces operational TCO'),
      time: r.timeline || (i < 2 ? 'Day 0 - 30 (Wave 1)' : i < 4 ? 'Day 30 - 60 (Wave 2)' : 'Day 60 - 90 (Wave 3)')
    })) : defaultRoadmap;

    sourceRoadmap.forEach(r => {
      roadmapRows.push([
        r.p,
        r.title,
        r.dim,
        r.impact,
        r.time
      ]);
    });

    autoTable(this.doc, {
      startY: yPos,
      head: [['Priority', 'Transformation Initiative', 'Target Pillar', 'Strategic Rationale & Expected ROI Impact', 'Execution Horizon']],
      body: roadmapRows,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        cellPadding: 7
      },
      styles: {
        fontSize: 8,
        cellPadding: 6,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.75
      },
      columnStyles: {
        0: { cellWidth: 85, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 135, fontStyle: 'bold', textColor: [15, 23, 42] },
        2: { cellWidth: 90, textColor: [51, 65, 85] },
        3: { cellWidth: 'auto', textColor: [15, 23, 42] },
        4: { cellWidth: 95, halign: 'center', fontStyle: 'bold', textColor: [29, 78, 216] }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          if (data.cell.raw.includes('CRITICAL')) {
            data.cell.styles.textColor = [185, 28, 28];
            data.cell.styles.fillColor = [254, 242, 242];
          } else if (data.cell.raw.includes('HIGH')) {
            data.cell.styles.textColor = [180, 83, 9];
            data.cell.styles.fillColor = [255, 251, 235];
          } else {
            data.cell.styles.textColor = [4, 120, 87];
            data.cell.styles.fillColor = [236, 253, 245];
          }
        }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 18;

    // Google Cloud Adoption Framework (GCAF) Alignment Section
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 160, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Google Cloud Adoption Framework (GCAF) Strategic Phasing', this.margin + 14, yPos + 22);

    const phaseW = (this.contentWidth - 36) / 3;
    const phaseY = yPos + 36;
    const phaseH = 110;

    // Phase 1: Learn & Foundations
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin + 12, phaseY, phaseW, phaseH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text('WAVE 1: FOUNDATIONS (0-30d)', this.margin + 20, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• Shared VPC & Landing Zone\n• Cloud Armor WAF Perimeter\n• Datastream CDC Ingestion\n• Cloud KMS CMEK Keys Setup', this.margin + 20, phaseY + 36);

    // Phase 2: Lead & Industrialize
    const p2X = this.margin + 12 + phaseW + 6;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(p2X, phaseY, phaseW, phaseH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text('WAVE 2: INDUSTRIALIZE (30-60d)', p2X + 10, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• BigLake Apache Iceberg Fabric\n• Dataplex Universal Catalog\n• Apigee AI Gateway & Caching\n• Automated FinOps Chargeback', p2X + 10, phaseY + 36);

    // Phase 3: Scale & Autonomy
    const p3X = p2X + phaseW + 6;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(p3X, phaseY, phaseW, phaseH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.success);
    this.doc.text('WAVE 3: AUTONOMOUS AI (60-90d)', p3X + 10, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• Hub-and-Spoke Agent Mesh\n• MCP Tool Microservices\n• Looker Governed Semantics\n• Real-Time Chronicle SIEM', p3X + 10, phaseY + 36);
  }

  // ==========================================
  // PAGE 5: DIMENSIONAL DEEP-DIVE (DENSE CARDS)
  // ==========================================
  addDimensionalAuditPage() {
    let yPos = 50;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Detailed Dimensional Audit & Technical Findings', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('In-depth evaluation of baseline capabilities, critical risks, and prescribed remediations per dimension.', this.margin, yPos + 14);

    yPos += 26;

    const dims = this.results.categoryDetails || {};
    const dimKeys = Object.keys(dims);

    dimKeys.forEach((k, idx) => {
      const d = dims[k];
      const cur = Number(d.currentScore || 3.0).toFixed(1);
      const tgt = Number(d.futureScore || 4.5).toFixed(1);
      const curNum = parseFloat(cur);
      const tier = curNum >= 4.2 ? 'Optimized' : curNum >= 3.4 ? 'Managed' : curNum >= 2.6 ? 'Defined' : 'Developing';

      const cardHeight = 108;
      if (yPos + cardHeight > this.pageHeight - 45) {
        this.doc.addPage();
        this.addHeader('04. Dimensional Deep-Dive Findings (Cont.)');
        yPos = 50;
      }

      this.doc.setFillColor(COLORS.white);
      this.doc.setDrawColor(COLORS.cardBorder);
      this.doc.setLineWidth(1.2);
      this.doc.roundedRect(this.margin, yPos, this.contentWidth, cardHeight, 5, 5, 'FD');

      // Header strip inside card
      this.doc.setFillColor(COLORS.slateBg);
      this.doc.roundedRect(this.margin, yPos, this.contentWidth, 26, 5, 5, 'F');
      this.doc.rect(this.margin, yPos + 20, this.contentWidth, 6, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(COLORS.navyDark);
      this.doc.text(`PILLAR ${idx + 1}: ${d.name?.toUpperCase() || k.toUpperCase()}`, this.margin + 12, yPos + 17);

      // Score Pills on Right (Zero overlap)
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(COLORS.primary);
      this.doc.text(`Baseline: ${cur}/5.0 (${tier})`, this.pageWidth - this.margin - 95, yPos + 17, { align: 'right' });

      this.doc.setTextColor(COLORS.success);
      this.doc.text(`Target: ${tgt}/5.0`, this.pageWidth - this.margin - 12, yPos + 17, { align: 'right' });

      let cY = yPos + 38;

      // Description / Context
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(COLORS.textDark);
      const desc = d.description || `Assessment of capabilities, architecture standards, and operational controls for ${d.name}.`;
      const descLines = this.doc.splitTextToSize(desc, this.contentWidth - 24);
      this.doc.text(descLines.slice(0, 2), this.margin + 12, cY);
      cY += descLines.slice(0, 2).length * 10 + 4;

      // Strengths & Challenges row
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor('#065F46');
      this.doc.text('Key Strength: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const strengthText = Array.isArray(d.strengths) && d.strengths[0] ? d.strengths[0] : `Foundational capability in place with documented operational runbooks.`;
      const strWrapped = this.doc.splitTextToSize(strengthText, this.contentWidth - 95);
      this.doc.text(strWrapped[0] || '', this.margin + 80, cY);

      cY += 14;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor('#991B1B');
      this.doc.text('Critical Gap: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const challengeText = Array.isArray(d.challenges) && d.challenges[0] ? d.challenges[0] : `Legacy manual bottlenecks and lack of automated policy enforcement.`;
      const chWrapped = this.doc.splitTextToSize(challengeText, this.contentWidth - 95);
      this.doc.text(chWrapped[0] || '', this.margin + 80, cY);

      cY += 14;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.primaryDark);
      this.doc.text('Prescribed Action: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const recText = Array.isArray(d.recommendations) && d.recommendations[0] 
        ? (typeof d.recommendations[0] === 'string' ? d.recommendations[0] : (d.recommendations[0].title || d.recommendations[0].description)) 
        : `Modernize to cloud-native managed architecture with automated telemetry and governance.`;
      const recWrapped = this.doc.splitTextToSize(recText, this.contentWidth - 115);
      this.doc.text(recWrapped[0] || '', this.margin + 105, cY);

      yPos += cardHeight + 12;
    });
  }

  // ==========================================
  // PAGE 6: GOVERNANCE, METHODOLOGY & SIGN-OFF
  // ==========================================
  addGovernanceAndSignOffPage() {
    let yPos = 50;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Governance Framework, Blueprint Index & Executive Sign-off', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Scoring rubric definitions, ScoreX master blueprint catalog cross-references, and governance sign-off.', this.margin, yPos + 14);

    yPos += 26;

    // 1. Scoring Rubric Table
    const rubricData = [
      ['Level 1: Initial / Ad-Hoc', '0.0 - 1.9', 'Unstructured processes, point-to-point scripts, unmonitored spending, and severe silo fragmentation.'],
      ['Level 2: Developing / Siloed', '2.0 - 2.7', 'Basic cloud tenancy established; daily batch processing, fragmented tool licensing, and initial departmental POCs.'],
      ['Level 3: Defined / Standardized', '2.8 - 3.5', 'Documented architecture standards, automated CI/CD pipelines, initial CDC streaming, and role-based IAM governance.'],
      ['Level 4: Managed / Integrated', '3.6 - 4.3', 'Quantitative telemetry, BigLake open table formats, centralized AI gateway with prompt caching, and FinOps chargeback.'],
      ['Level 5: Optimized / Autonomous', '4.4 - 5.0', 'Continuous self-healing, autonomous multi-agent mesh (MCP), sub-second analytics, and Zero-Trust SASE perimeters.']
    ];

    autoTable(this.doc, {
      startY: yPos,
      head: [['Maturity Tier', 'Score Range', 'Capability & Architectural Characteristics']],
      body: rubricData,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        cellPadding: 6
      },
      styles: {
        fontSize: 8,
        cellPadding: 5.5,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.75
      },
      columnStyles: {
        0: { cellWidth: 145, fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [15, 23, 42] },
        1: { cellWidth: 75, halign: 'center', fontStyle: 'bold', textColor: [29, 78, 216] },
        2: { cellWidth: 'auto', textColor: [15, 23, 42] }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 16;

    // 2. ScoreX Enterprise Blueprint Index
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 125, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('ScoreX Reference Architecture Blueprint Catalog Index', this.margin + 14, yPos + 20);

    const bpCols = [
      ['P1-APP-L-01', 'Legacy Silos to Modern Migration Map'],
      ['P1-GOV-C-04', 'Split-Screen As-Is vs To-Be Process Flow'],
      ['P2-GOV-C-01', 'Cloud FinOps & Chargeback Model'],
      ['P3-APP-C-01', 'Total Panoramic Unified System View'],
      ['P3-DAT-L-04', 'BigLake Apache Iceberg Lakehouse Mesh'],
      ['P3-AI-L-03', 'Hub-and-Spoke Agent Configuration Map'],
      ['ARCH-MCP-06', 'Model Context Protocol (MCP) Tool Gateway'],
      ['P4-SEC-P-01', 'Zero-Trust Secure Deployment Topology'],
      ['P4-SEC-P-02', 'Shared VPC Landing Zone & Perimeter'],
      ['ARCH-SEC-04', 'Zero-Trust STRIDE Threat Boundary Map']
    ];

    let bpY = yPos + 38;
    const colHalf = (this.contentWidth - 28) / 2;

    for (let i = 0; i < bpCols.length; i += 2) {
      const left = bpCols[i];
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(COLORS.primary);
      this.doc.text(`[${left[0]}]`, this.margin + 14, bpY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      this.doc.text(left[1], this.margin + 90, bpY);

      if (bpCols[i + 1]) {
        const right = bpCols[i + 1];
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(COLORS.primary);
        this.doc.text(`[${right[0]}]`, this.margin + 14 + colHalf, bpY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(COLORS.textDark);
        this.doc.text(right[1], this.margin + 90 + colHalf, bpY);
      }

      bpY += 16;
    }

    // 3. Official Executive Sign-off Grid
    yPos += 140;

    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 140, 5, 5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('OFFICIAL ARCHITECTURAL ACCEPTANCE & STAKEHOLDER SIGN-OFF', this.margin + 14, yPos + 22);

    const sigW = (this.contentWidth - 42) / 3;
    const sigY = yPos + 38;
    const sigH = 88;

    // Sig 1
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin + 10, sigY, sigW, sigH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('LEAD CLOUD ARCHITECT', this.margin + 18, sigY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('Signature: _______________________', this.margin + 18, sigY + 44);
    this.doc.text('Name: Google Certified Fellow', this.margin + 18, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, this.margin + 18, sigY + 74);

    // Sig 2
    const s2X = this.margin + 10 + sigW + 11;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(s2X, sigY, sigW, sigH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('VP OF ENGINEERING / CTO', s2X + 10, sigY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('Signature: _______________________', s2X + 10, sigY + 44);
    this.doc.text('Name: Executive Sponsor', s2X + 10, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, s2X + 10, sigY + 74);

    // Sig 3
    const s3X = s2X + sigW + 11;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(s3X, sigY, sigW, sigH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('CISO / GOVERNANCE LEAD', s3X + 10, sigY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('Signature: _______________________', s3X + 10, sigY + 44);
    this.doc.text('Name: Governance Authority', s3X + 10, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, s3X + 10, sigY + 74);
  }
}

// Export functions
export const generateProfessionalReport = (results, assessmentInfo) => {
  try {
    console.log('[PDF Export] Starting Executive PDF generation...', { results, assessmentInfo });
    const exporter = new ExecutivePDFExporter(results, assessmentInfo);
    const doc = exporter.generate();
    
    const date = new Date().toISOString().split('T')[0];
    const orgName = (assessmentInfo.organizationName || 'Organization').replace(/[^a-z0-9]/gi, '_');
    const filename = `ScoreX_Executive_Architecture_Report_${orgName}_${date}.pdf`;
    
    doc.save(filename);
    console.log('[PDF Export] PDF successfully generated:', filename);
    return { success: true, filename };
  } catch (error) {
    console.error('[PDF Export] Error generating Executive PDF report:', error);
    return { success: false, error: error.message };
  }
};

export const generateDynamicPDFReport = (instance, report) => {
  try {
    const framework = instance?.frameworkSnapshot || {};
    const aiReport = report?.aiReport || report || {};
    const scores = report?.calculatedScores || report?.scores || {
      overallScore: instance?.totalScore || 3.0,
      maturityLevel: instance?.maturityLevel || 'Defined',
      dimensionScores: instance?.scores || {}
    };
    const dimensions = framework.dimensions || [];
    const dimInsights = aiReport.dimensionInsights || [];

    const categoryDetails = {};
    dimensions.forEach(dim => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      const curScore = typeof dScore.score === 'number' ? dScore.score : (parseFloat(instance.responses?.[`${dim.id}_current`]) || 3.0);
      const futScore = typeof dScore.targetScore === 'number' ? dScore.targetScore : Math.min(5.0, +(curScore + 1.2).toFixed(1));
      
      const insight = dimInsights.find(di => di.dimensionId === dim.id || di.dimensionName === dim.name);

      categoryDetails[dim.id] = {
        id: dim.id,
        name: dim.name,
        currentScore: curScore,
        futureScore: futScore,
        description: dim.description || `Assessment of ${dim.name} baseline efficiency and architecture automation.`,
        level: {
          level: curScore >= 4.2 ? 'Optimized' : curScore >= 3.4 ? 'Managed' : curScore >= 2.6 ? 'Defined' : 'Developing'
        },
        strengths: insight?.findings 
          ? [insight.findings]
          : [`Baseline capability established for ${dim.name} with documented operational runbooks.`],
        challenges: insight?.priorityAction
          ? [insight.priorityAction]
          : [`Operational friction and latency bottlenecks identified in ${dim.name} workflow.`],
        recommendations: [
          insight?.priorityAction || `Modernize ${dim.name} architecture towards automated, governed cloud workflows on Google Cloud.`
        ]
      };
    });

    const rawRecs = aiReport.prioritizedRecommendations || aiReport.prioritizedActions || [];
    const recommendations = rawRecs.map((rec, idx) => ({
      title: rec.title || `Strategic Recommendation ${idx + 1}`,
      pillar: rec.dimension || rec.pillar || 'Platform',
      description: rec.whyItMatters || rec.description || '',
      impact: rec.expectedImpact || rec.businessImpact || 'Accelerates time-to-value and reduces cloud TCO',
      priority: rec.priority || (idx < 2 ? 'Critical' : 'High'),
      timeline: rec.timeline || (idx < 2 ? 'Day 0 - 30 (Wave 1)' : 'Day 30 - 60 (Wave 2)')
    }));

    const curOverall = scores.overallScore || instance?.totalScore || 3.0;
    const tgtOverall = Math.min(5.0, +(curOverall + 1.3).toFixed(1));

    const results = {
      overall: {
        currentScore: curOverall,
        futureScore: tgtOverall,
        gap: +(tgtOverall - curOverall).toFixed(1),
        level: {
          level: scores.maturityLevel || instance?.maturityLevel || 'Defined',
          description: aiReport.executiveSummary || 'Architecture transformation roadmap synthesized with Gemini 3.7 Flash.'
        }
      },
      categoryDetails,
      architectureDiagrams: aiReport.architectureDiagrams || instance?.architectureDiagrams || {},
      responses: instance?.responses || {},
      recommendations: recommendations.length > 0 ? recommendations : [
        {
          title: 'Establish Enterprise Data & AI Foundation',
          pillar: 'Architecture',
          description: 'Consolidate fragmented pipelines and establish automated governance.',
          impact: 'Reduces operational overhead and cloud spend by 30-40%',
          priority: 'Critical',
          timeline: 'Day 0 - 30 (Wave 1)'
        }
      ]
    };

    const assessmentInfo = {
      organizationName: instance?.customerName || 'Quantum FinTech Global',
      assessmentName: framework.title || 'Dynamic Architecture Assessment',
      industry: instance?.useCase || framework.badge || 'Enterprise Cloud & AI Modernization',
      createdAt: instance?.completedAt || instance?.createdAt || new Date().toISOString(),
      updatedAt: instance?.updatedAt || new Date().toISOString(),
      totalQuestions: framework.dimensions?.reduce((acc, d) => acc + (d.questions?.length || 2), 0) || 10,
      frameworkSnapshot: framework,
      aiReport: aiReport,
      scores: scores.dimensionScores || {},
      responses: instance?.responses || {}
    };

    return generateProfessionalReport(results, assessmentInfo);
  } catch (error) {
    console.error('[PDF Export] Error in generateDynamicPDFReport:', error);
    return { success: false, error: error.message };
  }
};

const pdfExportService = { generateProfessionalReport, generateDynamicPDFReport };
export default pdfExportService;
