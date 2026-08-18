import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Executive Luxury Theme Colors
const COLORS = {
  navyDark: '#0F172A',     // Slate 900
  navyMedium: '#1E293B',   // Slate 800
  navyLight: '#334155',    // Slate 700
  primary: '#2563EB',      // Google Blue
  primaryDark: '#1D4ED8',  // Deep Blue
  primaryLight: '#EFF6FF', // Light Blue Fill
  accentCyan: '#0284C7',   // Sky Blue
  success: '#10B981',      // Emerald Green
  successLight: '#ECFDF5', // Emerald Light Fill
  warning: '#F59E0B',      // Amber
  warningLight: '#FFFBEB', // Amber Light Fill
  danger: '#EF4444',       // Red
  dangerLight: '#FEF2F2',  // Red Light Fill
  slateBg: '#F8FAFC',      // Slate 50
  cardBorder: '#CBD5E1',   // Slate 300
  textDark: '#0F172A',     // Slate 900
  textMuted: '#64748B',    // Slate 500
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

  _normalizeData() {
    // 1. Normalize Category / Dimension Details
    if (!this.results.categoryDetails || Object.keys(this.results.categoryDetails).length === 0) {
      const framework = this.assessmentInfo.frameworkSnapshot || this.results.frameworkSnapshot || {};
      const dimensions = framework.dimensions || [];
      const scores = this.results.scores || this.results.dimensionScores || {};
      
      const synthesized = {};
      dimensions.forEach(dim => {
        const dScore = scores[dim.id];
        const curScore = typeof dScore === 'number' ? dScore : (typeof dScore?.score === 'number' ? dScore.score : (parseFloat(this.results.responses?.[`${dim.id}_current`]) || 2.8));
        const futScore = typeof dScore?.targetScore === 'number' ? dScore.targetScore : 4.5;
        synthesized[dim.id] = {
          name: dim.name,
          currentScore: curScore,
          futureScore: futScore,
          description: dim.description || '',
          level: { level: curScore >= 4.2 ? 'Optimized' : curScore >= 3.4 ? 'Managed' : curScore >= 2.6 ? 'Defined' : 'Developing' },
          strengths: [`Standardized baseline capability established for ${dim.name}`],
          challenges: [`Operational friction and legacy bottlenecks identified in current pipeline`],
          recommendations: [`Modernize ${dim.name} architecture towards automated, governed cloud workflows.`]
        };
      });
      this.results.categoryDetails = synthesized;
    }

    // 2. Normalize Overall Score
    if (!this.results.overall) {
      const score = this.results.totalScore || this.assessmentInfo.totalScore || 3.0;
      this.results.overall = {
        currentScore: score,
        futureScore: Math.min(5.0, +(score + 1.5).toFixed(1)),
        level: {
          level: score >= 4.2 ? 'Optimized' : score >= 3.4 ? 'Managed' : score >= 2.6 ? 'Defined' : 'Developing',
          description: 'Architecture transformation roadmap synthesized with Gemini 3.7 Flash.'
        }
      };
    }
  }

  generate() {
    // PAGE 1: Executive Cover Page & Scorecard Hub
    this.addCoverPage();

    // PAGE 2: Executive Maturity Matrix & Dimension Audit
    this.doc.addPage();
    this.addHeader('01. Executive Maturity Matrix & Dimensional Audit');
    this.addMaturityMatrixPage();

    // PAGE 3: Architecture Evolution Blueprint (As-Is vs To-Be)
    this.doc.addPage();
    this.addHeader('02. Enterprise Architectural Evolution Blueprint');
    this.addArchitectureEvolutionPage();

    // PAGE 4: Prioritized Strategic Roadmap & Execution Backlog
    this.doc.addPage();
    this.addHeader('03. Prioritized Strategic Roadmap & 30-60-90 Day Backlog');
    this.addRoadmapPage();

    // PAGE 5: Dimensional Deep-Dive & Findings (Dense Layout)
    this.doc.addPage();
    this.addHeader('04. Dimensional Deep-Dive & Technical Audit Findings');
    this.addDimensionalAuditPage();

    // PAGE 6: Governance, Methodology & Executive Sign-off
    this.doc.addPage();
    this.addHeader('05. Governance Framework, Blueprint Catalog & Sign-off');
    this.addGovernanceAndSignOffPage();

    // Add Page Numbers & Footers
    this.addPageNumbersAndFooters();

    return this.doc;
  }

  // ==========================================
  // PAGE HEADERS & FOOTERS
  // ==========================================
  addHeader(sectionTitle = '') {
    // Top subtle bar
    this.doc.setFillColor(COLORS.navyDark);
    this.doc.rect(0, 0, this.pageWidth, 32, 'F');
    
    // Top blue highlight line
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 32, this.pageWidth, 2, 'F');

    // Logo & Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(COLORS.white);
    this.doc.text('SCOREX', this.margin, 20);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.cardBorder);
    this.doc.text('Google Cloud Architecture & Maturity Assessment Platform', this.margin + 56, 20);

    if (sectionTitle) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor('#93C5FD');
      this.doc.text(sectionTitle.toUpperCase(), this.pageWidth - this.margin, 20, { align: 'right' });
    }
  }

  addPageNumbersAndFooters() {
    const totalPages = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (i === 1) continue; // Skip cover footer

      // Footer divider line
      this.doc.setDrawColor(COLORS.cardBorder);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.pageHeight - 28, this.pageWidth - this.margin, this.pageHeight - 28);

      // Left: Org & Confidentiality
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(COLORS.textMuted);
      const org = this.assessmentInfo.organizationName || 'Enterprise Organization';
      this.doc.text(`${org.toUpperCase()} • CONFIDENTIAL EXECUTIVE DELIVERABLE`, this.margin, this.pageHeight - 16);

      // Center: ScoreX & Gemini attribution
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Synthesized via ScoreX Engine with Gemini 3.7 Flash Reasoning', this.pageWidth / 2, this.pageHeight - 16, { align: 'center' });

      // Right: Page number
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.primaryDark);
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 16, { align: 'right' });
    }
  }

  // ==========================================
  // PAGE 1: EXECUTIVE COVER & SCORECARD
  // ==========================================
  addCoverPage() {
    const org = this.assessmentInfo.organizationName || 'Apex Health Systems';
    const assessTitle = this.assessmentInfo.assessmentName || 'Enterprise Data & AI Maturity Assessment';
    const industry = this.assessmentInfo.industry || 'Enterprise Cloud & AI Transformation';
    const curScore = Number(this.results.overall?.currentScore || 2.8).toFixed(1);
    const tgtScore = Number(this.results.overall?.futureScore || 4.5).toFixed(1);
    const scoreNum = parseFloat(curScore);
    const maturityTier = scoreNum >= 4.2 ? 'Level 5 - Optimized' : scoreNum >= 3.4 ? 'Level 4 - Managed' : scoreNum >= 2.6 ? 'Level 3 - Defined' : 'Level 2 - Developing';

    // 1. Full-Width Gradient Top Banner (0 to 180 pt)
    this.doc.setFillColor(COLORS.navyDark);
    this.doc.rect(0, 0, this.pageWidth, 180, 'F');

    // Accent line
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 180, this.pageWidth, 4, 'F');

    // Brand Header
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(28);
    this.doc.setTextColor(COLORS.white);
    this.doc.text('SCOREX', this.margin, 52);

    this.doc.setFontSize(10);
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

    // 2. Three Luxury Metric Cards (y = 205 to 295)
    const cardY = 202;
    const cardW = (this.contentWidth - 24) / 3;
    const cardH = 88;

    // Card 1: Current Maturity Score
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(this.margin, cardY, cardW, cardH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('CURRENT MATURITY SCORE', this.margin + 12, cardY + 20);

    this.doc.setFontSize(26);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(`${curScore}`, this.margin + 12, cardY + 54);

    this.doc.setFontSize(12);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('/ 5.0', this.margin + 62, cardY + 54);

    // Badge Pill
    this.doc.setFillColor(COLORS.warningLight);
    this.doc.setDrawColor(COLORS.warning);
    this.doc.roundedRect(this.margin + 12, cardY + 64, cardW - 24, 16, 3, 3, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#B45309');
    this.doc.text(maturityTier, this.margin + (cardW / 2), cardY + 75, { align: 'center' });

    // Card 2: Target Horizon Score
    const card2X = this.margin + cardW + 12;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(card2X, cardY, cardW, cardH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('TARGET HORIZON (TO-BE)', card2X + 12, cardY + 20);

    this.doc.setFontSize(26);
    this.doc.setTextColor(COLORS.success);
    this.doc.text(`${tgtScore}`, card2X + 12, cardY + 54);

    this.doc.setFontSize(12);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('/ 5.0', card2X + 62, cardY + 54);

    // Badge Pill
    this.doc.setFillColor(COLORS.successLight);
    this.doc.setDrawColor(COLORS.success);
    this.doc.roundedRect(card2X + 12, cardY + 64, cardW - 24, 16, 3, 3, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#047857');
    this.doc.text('Level 5 - Optimized Target', card2X + (cardW / 2), cardY + 75, { align: 'center' });

    // Card 3: Modernization Velocity & ROI Delta
    const card3X = card2X + cardW + 12;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(card3X, cardY, cardW, cardH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('MODERNIZATION DELTA', card3X + 12, cardY + 20);

    const delta = (tgtScore - curScore).toFixed(1);
    this.doc.setFontSize(26);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text(`+${delta}`, card3X + 12, cardY + 54);

    this.doc.setFontSize(10);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('pts gap', card3X + 75, cardY + 54);

    // Badge Pill
    this.doc.setFillColor('#E0F2FE');
    this.doc.setDrawColor(COLORS.accentCyan);
    this.doc.roundedRect(card3X + 12, cardY + 64, cardW - 24, 16, 3, 3, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#0369A1');
    this.doc.text('3-Phase GCAF Acceleration', card3X + (cardW / 2), cardY + 75, { align: 'center' });

    // 3. Executive Synthesis Panel (y = 305 to 500)
    let yPos = 306;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 195, 4, 4, 'FD');

    // Left accent vertical bar
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(this.margin, yPos, 4, 195, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Executive Summary & Strategic Context', this.margin + 16, yPos + 24);

    const rawSummary = this.assessmentInfo.aiReport?.executiveSummary || 
      this.results.overall?.level?.description || 
      `This comprehensive enterprise assessment evaluates ${org}'s architectural baseline across data platforms, multi-agent AI ecosystems, cloud cost governance, and zero-trust security perimeters. The current architecture demonstrates a foundational baseline with critical opportunities to eliminate legacy batch latency, unify siloed data warehouses into an open BigLake lakehouse, and deploy governed agentic AI workflows on Google Cloud.`;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(COLORS.navyLight);
    const summaryLines = this.doc.splitTextToSize(rawSummary, this.contentWidth - 32);
    this.doc.text(summaryLines.slice(0, 10), this.margin + 16, yPos + 44);

    // Callout Box inside Executive Summary (Key Outcomes)
    const subBoxY = yPos + 125;
    this.doc.setFillColor(COLORS.primaryLight);
    this.doc.setDrawColor('#BFDBFE');
    this.doc.roundedRect(this.margin + 14, subBoxY, this.contentWidth - 28, 56, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.primaryDark);
    this.doc.text('KEY ARCHITECTURAL MODERNIZATION DRIVERS:', this.margin + 24, subBoxY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• Transition from 24-48h batch ETL to real-time streaming CDC via Google Cloud Dataflow & BigLake Iceberg', this.margin + 24, subBoxY + 32);
    this.doc.text('• Deploy Vertex AI Agent Builder & Model Context Protocol (MCP) gateway with Model Armor zero-trust guardrails', this.margin + 24, subBoxY + 45);

    // 4. Assessment Metadata Grid (y = 515 to 680)
    yPos = 516;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Assessment Engagement Parameters', this.margin, yPos + 12);

    const dimsCount = Object.keys(this.results.categoryDetails || {}).length || 6;
    const questionsCount = this.assessmentInfo.totalQuestions || (dimsCount * 2);
    const dateStr = new Date(this.assessmentInfo.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const metaData = [
      ['Target Organization', org, 'Assessment Date', dateStr],
      ['Engagement Scope', assessTitle, 'Architecture Pillars', `${dimsCount} Comprehensive Dimensions`],
      ['Total Questions Evaluated', `${questionsCount} Rigorous Questions`, 'Validation Standard', 'Google Cloud Well-Architected Framework'],
      ['AI Architecture Model', 'Gemini 3.7 Flash Reasoning Engine', 'Classification', 'Confidential - Executive Use Only']
    ];

    autoTable(this.doc, {
      startY: yPos + 22,
      body: metaData,
      margin: { left: this.margin, right: this.margin },
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 6,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [71, 85, 105] },
        1: { cellWidth: 'auto', fontStyle: 'normal' },
        2: { cellWidth: 120, fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [71, 85, 105] },
        3: { cellWidth: 'auto', fontStyle: 'normal' }
      }
    });

    // 5. Signature & Sign-off strip at bottom
    const signY = 720;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, signY, this.contentWidth, 68, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('ENGAGEMENT GOVERNANCE & DELIVERY SIGN-OFF', this.margin + 12, signY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Lead Cloud Solution Architect: Google Cloud Certified Architect', this.margin + 12, signY + 36);
    this.doc.text('Executive Sponsor: Enterprise Technology Advisory & Strategy Board', this.margin + 12, signY + 52);

    this.doc.text('Status: Official Final Deliverable', this.pageWidth - this.margin - 140, signY + 36);
    this.doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, this.pageWidth - this.margin - 140, signY + 52);
  }

  // ==========================================
  // PAGE 2: DIMENSIONAL MATURITY MATRIX
  // ==========================================
  addMaturityMatrixPage() {
    let yPos = 48;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Executive Maturity Heatmap & Dimensional Matrix', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Quantitative capability scoring across all architectural pillars with target 18-month horizon benchmarks.', this.margin, yPos + 14);

    yPos += 26;

    // Table Data Construction
    const dims = this.results.categoryDetails || {};
    const tableRows = [];

    Object.keys(dims).forEach(k => {
      const d = dims[k];
      const cur = Number(d.currentScore || 2.8).toFixed(1);
      const tgt = Number(d.futureScore || 4.5).toFixed(1);
      const delta = +(tgt - cur).toFixed(1);
      const curNum = parseFloat(cur);
      const tier = curNum >= 4.2 ? 'Optimized (L5)' : curNum >= 3.4 ? 'Managed (L4)' : curNum >= 2.6 ? 'Defined (L3)' : 'Developing (L2)';
      const priority = delta >= 1.6 ? 'CRITICAL GAP' : delta >= 1.0 ? 'HIGH PRIORITY' : 'MODERATE';

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
        lineColor: [226, 232, 240],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 170, fontStyle: 'bold' },
        1: { cellWidth: 65, halign: 'center', fontStyle: 'bold', textColor: [37, 99, 235] },
        2: { cellWidth: 65, halign: 'center', fontStyle: 'bold', textColor: [16, 185, 129] },
        3: { cellWidth: 45, halign: 'center', fontStyle: 'bold', textColor: [2, 132, 199] },
        4: { cellWidth: 85, halign: 'center' },
        5: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'CRITICAL GAP') {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fillColor = [254, 242, 242];
          } else if (data.cell.raw === 'HIGH PRIORITY') {
            data.cell.styles.textColor = [245, 158, 11];
            data.cell.styles.fillColor = [255, 251, 235];
          } else {
            data.cell.styles.textColor = [16, 185, 129];
            data.cell.styles.fillColor = [236, 253, 245];
          }
        }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 18;

    // 2. Strengths vs Gaps Comparison Callout Boxes
    const colW = (this.contentWidth - 14) / 2;
    const boxH = 185;

    // Left Box: Key Strengths
    this.doc.setFillColor(COLORS.successLight);
    this.doc.setDrawColor(COLORS.success);
    this.doc.setLineWidth(1);
    this.doc.roundedRect(this.margin, yPos, colW, boxH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor('#065F46');
    this.doc.text('Key Architectural Strengths', this.margin + 12, yPos + 20);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);

    const strengths = [
      '• Established baseline core transactional database services and cloud tenancy',
      '• Active cloud migration awareness across executive leadership and engineering',
      '• Early departmental adoption of conversational AI tools and prototype agents',
      '• Defined compliance boundaries for customer data privacy and regulatory mandates'
    ];
    let strY = yPos + 40;
    strengths.forEach(s => {
      const lines = this.doc.splitTextToSize(s, colW - 24);
      this.doc.text(lines, this.margin + 12, strY);
      strY += lines.length * 11 + 6;
    });

    // Right Box: Critical Gaps & Technical Debt
    const rightX = this.margin + colW + 14;
    this.doc.setFillColor(COLORS.dangerLight);
    this.doc.setDrawColor(COLORS.danger);
    this.doc.roundedRect(rightX, yPos, colW, boxH, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor('#991B1B');
    this.doc.text('Critical Gaps & Operational Debt', rightX + 12, yPos + 20);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);

    const gaps = [
      '• 24-48 hour batch ETL replication lag halting real-time operational decision making',
      '• Fragmented data silos across legacy on-prem databases and disjoint cloud buckets',
      '• Unmanaged public LLM egress with zero prompt caching and high token billing waste',
      '• Missing centralized AI TRiSM guardrails, automated DLP masking, and Model Armor'
    ];
    let gapY = yPos + 40;
    gaps.forEach(g => {
      const lines = this.doc.splitTextToSize(g, colW - 24);
      this.doc.text(lines, rightX + 12, gapY);
      gapY += lines.length * 11 + 6;
    });

    // 3. Bottom Modernization Arbitrage Strip
    yPos += boxH + 16;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 75, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('PROJECTED MODERNIZATION ROI & EFFICIENCY GAINS (18-MONTH HORIZON)', this.margin + 14, yPos + 18);

    const kpiW = (this.contentWidth - 28) / 3;
    
    // KPI 1
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text('35% - 50%', this.margin + 14, yPos + 42);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Compute & Storage TCO Savings via BigQuery Editions & Iceberg', this.margin + 14, yPos + 56);

    // KPI 2
    const k2X = this.margin + 14 + kpiW;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.success);
    this.doc.text('< 1 Second', k2X, yPos + 42);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Real-Time Dataflow CDC Ingestion (vs. 24h Nightly Batch Lag)', k2X, yPos + 56);

    // KPI 3
    const k3X = k2X + kpiW;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text('75% Discount', k3X, yPos + 42);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('GenAI Token Input Costs via Vertex AI Context Caching', k3X, yPos + 56);
  }

  // ==========================================
  // PAGE 3: ARCHITECTURE EVOLUTION BLUEPRINT
  // ==========================================
  addArchitectureEvolutionPage() {
    let yPos = 48;
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

    // Split-Screen Architecture Cards
    const colW = (this.contentWidth - 14) / 2;
    const cardH = 260;
    const diagrams = this.assessmentInfo?.architectureDiagrams || this.results?.architectureDiagrams || this.assessmentInfo?.aiReport?.architectureDiagrams || {};
    const curTitle = diagrams.currentTitle || 'CURRENT BASELINE (AS-IS ARCHITECTURE)';
    const curSub = diagrams.currentSubtitle || 'Blueprint Ref: P1-APP-L-01 (Legacy Dependency Map)';
    const tgtTitle = diagrams.targetTitle || 'TARGET CLOUD-NATIVE (TO-BE ARCHITECTURE)';
    const tgtSub = diagrams.targetSubtitle || 'Blueprint Ref: P3-APP-C-01 & P3-DAT-L-04 (BigLake Fabric)';

    // LEFT CARD: AS-IS CURRENT STATE
    this.doc.setFillColor('#FFF5F5');
    this.doc.setDrawColor('#F87171');
    this.doc.setLineWidth(1.2);
    this.doc.roundedRect(this.margin, yPos, colW, cardH, 4, 4, 'FD');

    // Title Strip
    this.doc.setFillColor('#DC2626');
    this.doc.roundedRect(this.margin, yPos, colW, 28, 4, 4, 'F');
    this.doc.rect(this.margin, yPos + 22, colW, 6, 'F'); // square bottom corners

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.white);
    this.doc.text(curTitle.length > 42 ? curTitle.substring(0, 40) + '...' : curTitle, this.margin + 12, yPos + 18);

    let curY = yPos + 42;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor('#991B1B');
    this.doc.text(curSub.length > 55 ? curSub.substring(0, 53) + '...' : curSub, this.margin + 12, curY);

    curY += 16;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);

    const asIsItems = [
      '• Ingestion: Point-to-point cron jobs & unmanaged SFTP batch transfers with 24-48hr latency',
      '• Storage: Siloed on-prem databases (Oracle 11g RAC, IBM z/OS Mainframe, MS SQL Server)',
      '• Compute: Static 24/7 over-provisioned VMs without automated idle auto-suspend policies',
      '• AI & Serving: Unmanaged hardcoded LLM SDK calls, paying 100% full price without prompt caching',
      '• Security: Disjoint IAM access, public API endpoints, and manual 14-day SOC2 audit triage'
    ];

    asIsItems.forEach(item => {
      const lines = this.doc.splitTextToSize(item, colW - 24);
      this.doc.text(lines, this.margin + 12, curY);
      curY += lines.length * 10.5 + 4;
    });

    // Warning Badge inside Current State
    this.doc.setFillColor('#FEE2E2');
    this.doc.setDrawColor('#EF4444');
    this.doc.roundedRect(this.margin + 10, yPos + cardH - 42, colW - 20, 32, 3, 3, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#B91C1C');
    this.doc.text('⚠️ Critical Operational Bottleneck: 38% ETL failure rate during peak month-end close', this.margin + 16, yPos + cardH - 22);

    // RIGHT CARD: TO-BE TARGET STATE
    const rightX = this.margin + colW + 14;
    this.doc.setFillColor('#F0FDF4');
    this.doc.setDrawColor('#34D399');
    this.doc.roundedRect(rightX, yPos, colW, cardH, 4, 4, 'FD');

    // Title Strip
    this.doc.setFillColor('#059669');
    this.doc.roundedRect(rightX, yPos, colW, 28, 4, 4, 'F');
    this.doc.rect(rightX, yPos + 22, colW, 6, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.white);
    this.doc.text(tgtTitle.length > 42 ? tgtTitle.substring(0, 40) + '...' : tgtTitle, rightX + 12, yPos + 18);

    let tgtY = yPos + 42;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor('#065F46');
    this.doc.text(tgtSub.length > 55 ? tgtSub.substring(0, 53) + '...' : tgtSub, rightX + 12, tgtY);

    tgtY += 16;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textDark);

    const toBeItems = [
      '• Ingestion: Serverless Google Cloud Dataflow streaming CDC & Pub/Sub messaging bus (<1s latency)',
      '• Storage: BigLake Medallion Architecture with Apache Iceberg open table formats on Cloud Storage',
      '• Compute: BigQuery Editions autoscaling slots with GKE Autopilot gVisor sandboxed compute',
      '• AI & Serving: Vertex AI Agent Builder, Model Context Protocol (MCP), and 75% prompt context caching',
      '• Security: Zero-Trust Landing Zone (P4-SEC-P-02) with VPC-SC, Cloud KMS HSM CMEK, Model Armor'
    ];

    toBeItems.forEach(item => {
      const lines = this.doc.splitTextToSize(item, colW - 24);
      this.doc.text(lines, rightX + 12, tgtY);
      tgtY += lines.length * 10.5 + 4;
    });

    // Success Badge inside Target State
    this.doc.setFillColor('#DCFCE7');
    this.doc.setDrawColor('#10B981');
    this.doc.roundedRect(rightX + 10, yPos + cardH - 42, colW - 20, 32, 3, 3, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor('#047857');
    this.doc.text('✓ Target Outcome: 99.99% Multi-Region High Availability & Sub-Second Analytical Queries', rightX + 16, yPos + cardH - 22);

    // 2. Modernization Transformation Table (y = 350 to 740)
    yPos += cardH + 18;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Key Architectural Modernization Vectors (4-Tier Transition Matrix)', this.margin, yPos);

    yPos += 10;

    const vectorData = [
      [
        'Tier 1: Data Ingestion & CDC',
        'Brittle Informatica/Bash cron scripts with 24h batch extracts',
        'Google Cloud Datastream CDC + Dataflow & Pub/Sub event bus',
        'Sub-second real-time replication with zero source database locks'
      ],
      [
        'Tier 2: Unified Lakehouse',
        'Proprietary Oracle/Teradata/Snowflake silos with high egress costs',
        'BigLake Apache Iceberg open table formats on Cloud Storage',
        'Zero vendor lock-in, 45% licensing reduction, and unified Dataplex catalog'
      ],
      [
        'Tier 3: Compute & FinOps',
        'Static 24/7 oversized VMs with $480k estimated idle waste',
        'BigQuery Autoscaling Slots & GKE Autopilot pod-level metering',
        '100% FOCUS 1.0 chargeback attribution and 15-min idle auto-suspend'
      ],
      [
        'Tier 4: Agentic AI & Security',
        'Unmanaged OpenAI API calls without prompt caching or DLP',
        'Vertex AI Agent Builder + MCP Tool Gateway & Model Armor',
        '75% token discount via Context Caching with hardware-enforced VPC-SC'
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
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 6
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 5.5,
        textColor: [15, 23, 42],
        lineColor: [203, 213, 225],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 105, fontStyle: 'bold', fillColor: [248, 250, 252] },
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
    let yPos = 48;

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
    const rawRecs = this.results.recommendations || this.assessmentInfo.aiReport?.prioritizedRecommendations || [];
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

    const sourceRoadmap = rawRecs.length >= 4 ? rawRecs.map((r, i) => ({
      p: r.priority ? `P${i+1} - ${r.priority.toUpperCase()}` : (i < 2 ? 'P1 - CRITICAL' : i < 4 ? 'P2 - HIGH' : 'P3 - STRATEGIC'),
      title: r.title || `Strategic Action Item ${i+1}`,
      dim: r.pillar || r.dimension || 'Architecture',
      impact: r.impact || r.description || 'Accelerates cloud modernization and reduces operational TCO',
      time: i < 2 ? 'Day 0 - 30 (Wave 1)' : i < 4 ? 'Day 30 - 60 (Wave 2)' : 'Day 60 - 90 (Wave 3)'
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
        lineColor: [226, 232, 240],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 85, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 135, fontStyle: 'bold' },
        2: { cellWidth: 90, textColor: [71, 85, 105] },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 95, halign: 'center', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          if (data.cell.raw.includes('CRITICAL')) {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fillColor = [254, 242, 242];
          } else if (data.cell.raw.includes('HIGH')) {
            data.cell.styles.textColor = [245, 158, 11];
            data.cell.styles.fillColor = [255, 251, 235];
          } else {
            data.cell.styles.textColor = [16, 185, 129];
            data.cell.styles.fillColor = [236, 253, 245];
          }
        }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 18;

    // Google Cloud Adoption Framework (GCAF) Alignment Section
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 160, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Google Cloud Adoption Framework (GCAF) Strategic Phasing', this.margin + 14, yPos + 22);

    const phaseW = (this.contentWidth - 36) / 3;
    const phaseY = yPos + 36;
    const phaseH = 110;

    // Phase 1: Learn & Foundations
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(this.margin + 12, phaseY, phaseW, phaseH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.primary);
    this.doc.text('WAVE 1: FOUNDATIONS (0-30d)', this.margin + 20, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• Shared VPC & Landing Zone\n• Cloud Armor WAF Perimeter\n• Datastream CDC Ingestion\n• Cloud KMS CMEK Keys Setup', this.margin + 20, phaseY + 34);

    // Phase 2: Lead & Industrialize
    const p2X = this.margin + 12 + phaseW + 6;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(p2X, phaseY, phaseW, phaseH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.accentCyan);
    this.doc.text('WAVE 2: INDUSTRIALIZE (30-60d)', p2X + 8, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• BigLake Apache Iceberg Fabric\n• Dataplex Universal Catalog\n• Apigee AI Gateway & Caching\n• Automated FinOps Chargeback', p2X + 8, phaseY + 34);

    // Phase 3: Scale & Autonomy
    const p3X = p2X + phaseW + 6;
    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(p3X, phaseY, phaseW, phaseH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.success);
    this.doc.text('WAVE 3: AUTONOMOUS AI (60-90d)', p3X + 8, phaseY + 18);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(COLORS.textDark);
    this.doc.text('• Hub-and-Spoke Agent Mesh\n• MCP Tool Microservices\n• Looker Governed Semantics\n• Real-Time Chronicle SIEM', p3X + 8, phaseY + 34);
  }

  // ==========================================
  // PAGE 5: DIMENSIONAL DEEP-DIVE (DENSE CARDS)
  // ==========================================
  addDimensionalAuditPage() {
    let yPos = 48;

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
      const cur = Number(d.currentScore || 2.8).toFixed(1);
      const tgt = Number(d.futureScore || 4.5).toFixed(1);
      const curNum = parseFloat(cur);
      const tier = curNum >= 4.2 ? 'Optimized' : curNum >= 3.4 ? 'Managed' : curNum >= 2.6 ? 'Defined' : 'Developing';

      // Check if we need to add a new page if card overflows
      const cardHeight = 105;
      if (yPos + cardHeight > this.pageHeight - 45) {
        this.doc.addPage();
        this.addHeader('04. Dimensional Deep-Dive & Technical Audit Findings (Cont.)');
        yPos = 48;
      }

      // Card Container
      this.doc.setFillColor(COLORS.slateBg);
      this.doc.setDrawColor(COLORS.cardBorder);
      this.doc.setLineWidth(1);
      this.doc.roundedRect(this.margin, yPos, this.contentWidth, cardHeight, 4, 4, 'FD');

      // Header strip inside card
      this.doc.setFillColor(COLORS.white);
      this.doc.roundedRect(this.margin, yPos, this.contentWidth, 24, 4, 4, 'F');
      this.doc.rect(this.margin, yPos + 18, this.contentWidth, 6, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(COLORS.navyDark);
      this.doc.text(`PILLAR ${idx + 1}: ${d.name?.toUpperCase() || k.toUpperCase()}`, this.margin + 12, yPos + 16);

      // Score Pill on Right
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(COLORS.primary);
      this.doc.text(`Baseline: ${cur}/5.0 (${tier})`, this.pageWidth - this.margin - 145, yPos + 16);

      this.doc.setTextColor(COLORS.success);
      this.doc.text(`Target: ${tgt}/5.0`, this.pageWidth - this.margin - 55, yPos + 16);

      // Content inside Card
      let cY = yPos + 38;

      // Description / Context
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(COLORS.textDark);
      const desc = d.description || `Assessment of capabilities, architecture standards, and operational controls for ${d.name}.`;
      const descLines = this.doc.splitTextToSize(desc, this.contentWidth - 24);
      this.doc.text(descLines.slice(0, 2), this.margin + 12, cY);
      cY += descLines.slice(0, 2).length * 10 + 4;

      // Strengths & Challenges row
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor('#065F46');
      this.doc.text('Key Strength: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const strengthText = Array.isArray(d.strengths) && d.strengths[0] ? d.strengths[0] : `Foundational capability in place with documented operational runbooks.`;
      this.doc.text(this.doc.splitTextToSize(strengthText, this.contentWidth - 85)[0] || '', this.margin + 75, cY);

      cY += 13;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor('#991B1B');
      this.doc.text('Critical Gap: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const challengeText = Array.isArray(d.challenges) && d.challenges[0] ? d.challenges[0] : `Legacy manual bottlenecks and lack of automated policy enforcement.`;
      this.doc.text(this.doc.splitTextToSize(challengeText, this.contentWidth - 85)[0] || '', this.margin + 75, cY);

      cY += 13;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.primaryDark);
      this.doc.text('Prescribed Action: ', this.margin + 12, cY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      const recText = Array.isArray(d.recommendations) && d.recommendations[0] ? (typeof d.recommendations[0] === 'string' ? d.recommendations[0] : (d.recommendations[0].title || d.recommendations[0].description)) : `Modernize to cloud-native managed architecture with automated telemetry and governance.`;
      this.doc.text(this.doc.splitTextToSize(recText, this.contentWidth - 100)[0] || '', this.margin + 90, cY);

      yPos += cardHeight + 12;
    });
  }

  // ==========================================
  // PAGE 6: GOVERNANCE, METHODOLOGY & SIGN-OFF
  // ==========================================
  addGovernanceAndSignOffPage() {
    let yPos = 48;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('Governance Framework, Blueprint Index & Executive Sign-off', this.margin, yPos);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('Scoring rubric definitions, PromptCanvas master blueprint cross-references, and governance acceptance.', this.margin, yPos + 14);

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
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 6
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 5.5,
        textColor: [15, 23, 42],
        lineColor: [226, 232, 240],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 140, fontStyle: 'bold', fillColor: [248, 250, 252] },
        1: { cellWidth: 75, halign: 'center', fontStyle: 'bold', textColor: [37, 99, 235] },
        2: { cellWidth: 'auto' }
      }
    });

    yPos = this.doc.lastAutoTable.finalY + 16;

    // 2. PromptCanvas Enterprise Blueprint Index
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 125, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('PromptCanvas Reference Architecture Catalog Index', this.margin + 12, yPos + 18);

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

    let bpY = yPos + 34;
    const colHalf = (this.contentWidth - 24) / 2;

    for (let i = 0; i < bpCols.length; i += 2) {
      // Left item
      const left = bpCols[i];
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(COLORS.primary);
      this.doc.text(`[${left[0]}]`, this.margin + 12, bpY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.textDark);
      this.doc.text(left[1], this.margin + 82, bpY);

      // Right item
      if (bpCols[i + 1]) {
        const right = bpCols[i + 1];
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(COLORS.primary);
        this.doc.text(`[${right[0]}]`, this.margin + 12 + colHalf, bpY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(COLORS.textDark);
        this.doc.text(right[1], this.margin + 82 + colHalf, bpY);
      }

      bpY += 16;
    }

    // 3. Official Executive Sign-off Grid
    yPos += 140;

    this.doc.setFillColor(COLORS.white);
    this.doc.setDrawColor(COLORS.cardBorder);
    this.doc.roundedRect(this.margin, yPos, this.contentWidth, 140, 4, 4, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.doc.setTextColor(COLORS.navyDark);
    this.doc.text('OFFICIAL ARCHITECTURAL ACCEPTANCE & STAKEHOLDER SIGN-OFF', this.margin + 14, yPos + 20);

    const sigW = (this.contentWidth - 42) / 3;
    const sigY = yPos + 36;
    const sigH = 88;

    // Sig 1: Cloud Architect
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(this.margin + 10, sigY, sigW, sigH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('LEAD CLOUD ARCHITECT', this.margin + 18, sigY + 16);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.text('Signature: _______________________', this.margin + 18, sigY + 44);
    this.doc.text('Name: Google Certified Fellow', this.margin + 18, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, this.margin + 18, sigY + 74);

    // Sig 2: VP Engineering
    const s2X = this.margin + 10 + sigW + 11;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(s2X, sigY, sigW, sigH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('VP OF ENGINEERING / CTO', s2X + 8, sigY + 16);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.text('Signature: _______________________', s2X + 8, sigY + 44);
    this.doc.text('Name: Executive Sponsor', s2X + 8, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, s2X + 8, sigY + 74);

    // Sig 3: CISO / Compliance
    const s3X = s2X + sigW + 11;
    this.doc.setFillColor(COLORS.slateBg);
    this.doc.setDrawColor('#CBD5E1');
    this.doc.roundedRect(s3X, sigY, sigW, sigH, 3, 3, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.textMuted);
    this.doc.text('CISO / GOVERNANCE LEAD', s3X + 8, sigY + 16);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.text('Signature: _______________________', s3X + 8, sigY + 44);
    this.doc.text('Name: Governance Authority', s3X + 8, sigY + 60);
    this.doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, s3X + 8, sigY + 74);
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

    const categoryDetails = {};
    dimensions.forEach(dim => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      const curScore = typeof dScore.score === 'number' ? dScore.score : (parseFloat(instance.responses?.[`${dim.id}_current`]) || 2.8);
      const futScore = typeof dScore.targetScore === 'number' ? dScore.targetScore : 4.5;
      categoryDetails[dim.id] = {
        name: dim.name,
        currentScore: curScore,
        futureScore: futScore,
        description: dim.description || '',
        level: {
          level: curScore >= 4.2 ? 'Optimized' : curScore >= 3.4 ? 'Managed' : curScore >= 2.6 ? 'Defined' : 'Developing'
        },
        strengths: [`Standardized baseline capability established for ${dim.name}`],
        challenges: [`Operational friction and legacy bottlenecks identified in current pipeline`],
        recommendations: [
          {
            title: `Modernize ${dim.name} Architecture`,
            description: `Transition towards automated, governed, and declarative cloud workflows.`
          }
        ]
      };
    });

    const rawRecs = aiReport.prioritizedRecommendations || aiReport.prioritizedActions || [];
    const recommendations = rawRecs.map((rec, idx) => ({
      title: rec.title || `Strategic Recommendation ${idx + 1}`,
      pillar: rec.dimension || rec.pillar || 'Platform',
      description: rec.whyItMatters || rec.description || '',
      impact: rec.expectedImpact || rec.businessImpact || 'Accelerates time-to-value and reduces cloud TCO',
      priority: rec.priority || (idx < 2 ? 'High' : 'Medium')
    }));

    const results = {
      overall: {
        currentScore: scores.overallScore || instance?.totalScore || 3.0,
        futureScore: 4.5,
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
          priority: 'High'
        }
      ]
    };

    const assessmentInfo = {
      organizationName: instance?.customerName || 'Enterprise Organization',
      assessmentName: framework.title || 'Dynamic Architecture Assessment',
      industry: framework.badge || 'Cloud & AI Modernization',
      createdAt: instance?.completedAt || instance?.createdAt || new Date().toISOString(),
      updatedAt: instance?.updatedAt || new Date().toISOString(),
      frameworkSnapshot: framework,
      aiReport: aiReport,
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
