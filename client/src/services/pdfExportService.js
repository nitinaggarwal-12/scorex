import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Professional Databricks brand colors
const COLORS = {
  primary: '#FF3621',      // Databricks Red
  secondary: '#00A972',    // Databricks Green
  accent: '#1B3139',       // Dark Blue
  text: '#2C2C2C',
  lightGray: '#F5F5F5',
  mediumGray: '#CCCCCC',
  darkGray: '#666666',
  white: '#FFFFFF',
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F59E0B',
  red: '#EF4444'
};

// Maturity level colors
const MATURITY_COLORS = {
  1: '#EF4444',
  2: '#F59E0B',
  3: '#FFAA00',
  4: '#10B981',
  5: '#00A972'
};

// Pillar icons (text-based, no emojis)
const PILLAR_ICONS = {
  platform_governance: 'PLATFORM',
  data_engineering: 'DATA',
  analytics_bi: 'ANALYTICS',
  machine_learning: 'ML',
  generative_ai: 'GENAI',
  operational_excellence: 'OPS'
};

class ProfessionalPDFExporter {
  constructor(results, assessmentInfo) {
    this.doc = new jsPDF('p', 'pt', 'a4');
    this.results = results;
    this.assessmentInfo = assessmentInfo;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 40;
    this.contentWidth = this.pageWidth - 2 * this.margin;
    this.lineHeight = 16;
  }

  // Generate the complete report
  generate() {
    this.addCoverPage();
    this.addExecutiveSummary();
    this.addMaturityOverview();
    this.addCurrentVsFuture();
    this.addPillarDetails();
    this.addRecommendations();
    this.addMethodology();
    
    // Add page numbers and footers
    this.addPageNumbers();
    
    return this.doc;
  }

  // Add header to pages (except cover)
  addHeader() {
    this.doc.setFontSize(10);
    this.doc.setTextColor(COLORS.primary);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DATABRICKS', this.margin, 25);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(COLORS.darkGray);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Technical Maturity Assessment Report', this.pageWidth - this.margin, 25, { align: 'right' });
    
    this.doc.setDrawColor(COLORS.mediumGray);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 32, this.pageWidth - this.margin, 32);
  }

  // Add footer with page numbers
  addPageNumbers() {
    const totalPages = this.doc.internal.getNumberOfPages();
    
    for (let i = 2; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(COLORS.mediumGray);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.pageHeight - 30, this.pageWidth - this.margin, this.pageHeight - 30);
      
      this.doc.setFontSize(8);
      this.doc.setTextColor(COLORS.mediumGray);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth / 2,
        this.pageHeight - 18,
        { align: 'center' }
      );
      
      this.doc.text(
        'Confidential',
        this.margin,
        this.pageHeight - 18
      );
      
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      this.doc.text(
        date,
        this.pageWidth - this.margin,
        this.pageHeight - 18,
        { align: 'right' }
      );
    }
  }

  // Cover Page
  addCoverPage() {
    // Red header band
    this.doc.setFillColor(COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, 120, 'F');
    
    // Title
    this.doc.setTextColor(COLORS.white);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Databricks', this.pageWidth / 2, 55, { align: 'center' });
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Technical Maturity Assessment', this.pageWidth / 2, 90, { align: 'center' });
    
    // Organization info box
    let yPos = 160;
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(this.margin, yPos, this.contentWidth, 120, 'F');
    
    this.doc.setTextColor(COLORS.text);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    yPos += 25;
    
    // Safely extract maturity level (handle both string and object formats)
    const getMaturityLevelText = () => {
      if (!this.results.overall?.level) return 'Not Assessed';
      if (typeof this.results.overall.level === 'string') return this.results.overall.level;
      if (typeof this.results.overall.level === 'object' && this.results.overall.level.level) {
        return this.results.overall.level.level;
      }
      return 'Not Assessed';
    };
    
    const infoItems = [
      ['Organization:', this.assessmentInfo.organizationName || 'Not Specified'],
      ['Assessment Date:', new Date(this.assessmentInfo.startedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
      ['Completion:', `${this.assessmentInfo.completionPercentage || 0}% (${this.assessmentInfo.questionsAnswered || 0}/${this.assessmentInfo.totalQuestions || 0} questions)`],
      ['Overall Maturity:', `Level ${this.results.overall?.currentScore || 0}/5 - ${getMaturityLevelText()}`]
    ];
    
    infoItems.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(label, this.margin + 20, yPos);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(value, this.margin + 150, yPos);
      yPos += 22;
    });
    
    // Key highlights box
    yPos = 320;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.accent);
    this.doc.text('Assessment Highlights', this.margin, yPos);
    
    yPos += 25;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(COLORS.text);
    
    const highlights = [
      `${this.assessmentInfo.completedPillars || 0} of ${this.assessmentInfo.totalPillars || 6} pillars completed`,
      `${this.assessmentInfo.questionsAnswered || 0} questions answered across ${this.assessmentInfo.pillarsWithResponses || 0} pillar areas`,
      `${(this.results.prioritizedActions?.length || 0)} priority actions identified for improvement`,
      `Target maturity level: ${this.results.overall?.futureScore || 0}/5`
    ];
    
    highlights.forEach(highlight => {
      this.doc.text('• ' + highlight, this.margin + 10, yPos);
      yPos += 20;
    });
    
    // Footer
    this.doc.setFontSize(9);
    this.doc.setTextColor(COLORS.mediumGray);
    this.doc.text(
      'Prepared by Databricks Technical Maturity Assessment Platform',
      this.pageWidth / 2,
      this.pageHeight - 30,
      { align: 'center' }
    );
  }

  // Executive Summary
  addExecutiveSummary() {
    this.doc.addPage();
    this.addHeader();
    
    let yPos = 55;
    
    this.addSectionTitle('Executive Summary', yPos);
    yPos += 35;
    
    // Key Findings box
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(this.margin, yPos, this.contentWidth, 100, 'F');
    
    yPos += 20;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.text);
    this.doc.text('Key Findings', this.margin + 15, yPos);
    
    yPos += 20;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Safely extract maturity level
    const maturityLevel = (() => {
      if (!this.results.overall?.level) return 'Not Assessed';
      if (typeof this.results.overall.level === 'string') return this.results.overall.level;
      if (typeof this.results.overall.level === 'object' && this.results.overall.level.level) {
        return this.results.overall.level.level;
      }
      return 'Not Assessed';
    })();
    
    const keyPoints = [
      `Overall maturity level: ${maturityLevel} (${this.results.overall?.currentScore || 0}/5)`,
      `${this.assessmentInfo.completedPillars || 0}/${this.assessmentInfo.totalPillars || 6} pillars completed`,
      `${this.assessmentInfo.questionsAnswered || 0} questions answered across ${this.assessmentInfo.pillarsWithResponses || 0} pillar areas`,
      `${this.results.prioritizedActions?.length || 0} priority actions identified`
    ];
    
    keyPoints.forEach(point => {
      this.doc.text('• ' + point, this.margin + 20, yPos);
      yPos += 16;
    });
    
    yPos += 30;
    
    // Summary text - handle both string and object formats
    let summaryText = '';
    if (this.results.executiveSummary) {
      if (typeof this.results.executiveSummary === 'string') {
        summaryText = this.results.executiveSummary;
      } else if (typeof this.results.executiveSummary === 'object' && this.results.executiveSummary !== null) {
        // Extract text from object (handle various possible fields)
        summaryText = this.results.executiveSummary.summary || 
                     this.results.executiveSummary.strategicSituation || 
                     this.results.executiveSummary.keyInsights || '';
        
        // If still empty, try to build from other fields
        if (!summaryText) {
          const parts = [];
          if (this.results.executiveSummary.currentState) parts.push(this.results.executiveSummary.currentState);
          if (this.results.executiveSummary.desiredState) parts.push(this.results.executiveSummary.desiredState);
          if (this.results.executiveSummary.gap) parts.push(this.results.executiveSummary.gap);
          summaryText = parts.join(' ') || JSON.stringify(this.results.executiveSummary);
        }
      }
    }
    
    // Ensure summaryText is always a string
    if (!summaryText || typeof summaryText !== 'string' || summaryText === '{}' || summaryText === '[object Object]' || summaryText === 'null' || summaryText === 'undefined') {
      summaryText = 'This assessment provides a comprehensive evaluation of your Databricks technical maturity across six key pillars. ' +
        'The findings reveal structured processes with opportunities for optimization through automation, governance integration, and AI enablement.';
    }
    
    // Truncate and wrap text - ensure it's a string before calling substring
    if (typeof summaryText === 'string' && summaryText.length > 800) {
      summaryText = summaryText.substring(0, 800);
    }
    const summaryLines = this.doc.splitTextToSize(summaryText, this.contentWidth - 40);
    this.doc.text(summaryLines, this.margin + 20, yPos);
  }

  // Maturity Overview
  addMaturityOverview() {
    this.doc.addPage();
    this.addHeader();
    
    let yPos = 55;
    
    this.addSectionTitle('Maturity Overview', yPos);
    yPos += 45;
    
    // Overall score indicator
    const scoreX = this.pageWidth / 2 - 40;
    const scoreY = yPos;
    const overallScore = this.results.overall?.currentScore || 0;
    
    this.doc.setFillColor(MATURITY_COLORS[Math.round(overallScore)] || COLORS.mediumGray);
    this.doc.circle(scoreX, scoreY, 35, 'F');
    
    this.doc.setTextColor(COLORS.white);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(overallScore.toString(), scoreX, scoreY + 10, { align: 'center' });
    
    this.doc.setFontSize(11);
    this.doc.setTextColor(COLORS.text);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('out of 5', scoreX, scoreY + 55, { align: 'center' });
    
    yPos += 110;
    
    // Maturity level description
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.results.overall?.level?.level || 'Not Assessed', this.pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 20;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const descText = this.results.overall?.level?.description || 'Assessment in progress';
    const descLines = this.doc.splitTextToSize(descText, this.contentWidth - 100);
    this.doc.text(descLines, this.pageWidth / 2, yPos, { align: 'center', maxWidth: this.contentWidth - 100 });
    
    yPos += descLines.length * 14 + 30;
    
    // Pillar summary table
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.accent);
    this.doc.text('Pillar Maturity Distribution', this.margin, yPos);
    yPos += 20;
    
    const pillarData = [];
    const categoryDetails = this.results.categoryDetails || {};
    
    Object.keys(categoryDetails).forEach(pillarId => {
      const pillar = categoryDetails[pillarId];
      pillarData.push([
        pillar.name || 'Unknown',
        `${pillar.currentScore || 0}/5`,
        `${pillar.futureScore || 0}/5`,
        pillar.level?.level || 'Not Assessed',
        pillar.isPartial ? 'In Progress' : 'Complete'
      ]);
    });
    
    if (pillarData.length > 0) {
      autoTable(this.doc, {
        startY: yPos,
        head: [['Pillar', 'Current', 'Future', 'Maturity Level', 'Status']],
        body: pillarData,
        margin: { left: this.margin, right: this.margin },
        theme: 'grid',
        headStyles: {
          fillColor: [27, 49, 57],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [44, 44, 44]
        },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { halign: 'center', cellWidth: 60 },
          2: { halign: 'center', cellWidth: 60 },
          3: { halign: 'center', cellWidth: 100 },
          4: { halign: 'center', cellWidth: 75 }
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        }
      });
    }
  }

  // Current vs Future State Analysis
  addCurrentVsFuture() {
    this.doc.addPage();
    this.addHeader();
    
    let yPos = 55;
    
    this.addSectionTitle('Current vs Future State Analysis', yPos);
    yPos += 35;
    
    // Intro text
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(COLORS.text);
    const introText = 'This analysis compares your current capabilities against your future vision, highlighting areas for improvement and investment.';
    const introLines = this.doc.splitTextToSize(introText, this.contentWidth);
    this.doc.text(introLines, this.margin, yPos);
    yPos += 30;
    
    // Gap analysis table
    const comparisonData = [];
    const categoryDetails = this.results.categoryDetails || {};
    
    Object.keys(categoryDetails).forEach(pillarId => {
      const pillar = categoryDetails[pillarId];
      const currentScore = pillar.currentScore || 0;
      const futureScore = pillar.futureScore || 0;
      const gap = futureScore - currentScore;
      const gapText = gap > 0 ? `+${gap}` : gap.toString();
      const priority = gap >= 2 ? 'High' : gap >= 1 ? 'Medium' : 'Low';
      
      comparisonData.push([
        pillar.name || 'Unknown',
        currentScore.toString(),
        futureScore.toString(),
        gapText,
        priority
      ]);
    });
    
    if (comparisonData.length > 0) {
      autoTable(this.doc, {
        startY: yPos,
        head: [['Pillar', 'Current', 'Future', 'Gap', 'Priority']],
        body: comparisonData,
        margin: { left: this.margin, right: this.margin },
        theme: 'grid',
        headStyles: {
          fillColor: [27, 49, 57],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [44, 44, 44],
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 150, halign: 'left' },
          1: { cellWidth: 70 },
          2: { cellWidth: 70 },
          3: { cellWidth: 70, fontStyle: 'bold' },
          4: { cellWidth: 90 }
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        didParseCell: (data) => {
          if (data.column.index === 4 && data.section === 'body') {
            const priority = data.cell.raw;
            if (priority === 'High') {
              data.cell.styles.textColor = [239, 68, 68];
              data.cell.styles.fontStyle = 'bold';
            } else if (priority === 'Medium') {
              data.cell.styles.textColor = [245, 158, 11];
              data.cell.styles.fontStyle = 'bold';
            } else {
              data.cell.styles.textColor = [16, 185, 129];
            }
          }
        }
      });
    }
  }

  // Pillar Details
  addPillarDetails() {
    const categoryDetails = this.results.categoryDetails || {};
    
    Object.keys(categoryDetails).forEach((pillarId, index) => {
      const pillar = categoryDetails[pillarId];
      
      this.doc.addPage();
      this.addHeader();
      
      let yPos = 55;
      
      // Pillar title
      this.addSectionTitle(`${PILLAR_ICONS[pillarId] || ''} ${pillar.name || 'Unknown Pillar'}`, yPos);
      yPos += 45;
      
      // Score indicators
      const leftX = this.margin + 80;
      const rightX = this.pageWidth - this.margin - 80;
      
      // Current Score
      this.doc.setFillColor(59, 130, 246);
      this.doc.circle(leftX, yPos, 30, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(20);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text((pillar.currentScore || 0).toString(), leftX, yPos + 7, { align: 'center' });
      
      this.doc.setTextColor(COLORS.text);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Current State', leftX, yPos + 45, { align: 'center' });
      
      // Future Score
      this.doc.setFillColor(16, 185, 129);
      this.doc.circle(rightX, yPos, 30, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(20);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text((pillar.futureScore || 0).toString(), rightX, yPos + 7, { align: 'center' });
      
      this.doc.setTextColor(COLORS.text);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Future Vision', rightX, yPos + 45, { align: 'center' });
      
      yPos += 75;
      
      // Description
      if (pillar.description) {
        this.doc.setFontSize(9);
        const descLines = this.doc.splitTextToSize(pillar.description || 'No description available', this.contentWidth);
        this.doc.text(descLines, this.margin, yPos);
        yPos += Math.min(descLines.length * 12, 40);
      }
      
      yPos += 15;
      
      // Maturity level box
      this.doc.setFillColor(245, 245, 245);
      this.doc.rect(this.margin, yPos, this.contentWidth, 30, 'F');
      
      // Safely extract maturity level for pillar
      const pillarLevel = (() => {
        if (!pillar.level) return 'Not Assessed';
        if (typeof pillar.level === 'string') return pillar.level;
        if (typeof pillar.level === 'object') {
          return pillar.level.level || pillar.level.name || 'Not Assessed';
        }
        return 'Not Assessed';
      })();
      
      const pillarLevelDesc = (() => {
        if (pillar.level && typeof pillar.level === 'object' && pillar.level.description) {
          return pillar.level.description;
        }
        return 'Assessment in progress';
      })();
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.text);
      this.doc.text('Maturity Level:', this.margin + 15, yPos + 19);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `${pillarLevel} - ${pillarLevelDesc}`,
        this.margin + 110,
        yPos + 19
      );
      
      yPos += 45;
      
      // Recommendations
      if (this.results.recommendations && this.results.recommendations[pillarId]) {
        const rec = this.results.recommendations[pillarId];
        
        this.doc.setFontSize(11);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(COLORS.primary);
        this.doc.text('Key Recommendations', this.margin, yPos);
        yPos += 20;
        
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(COLORS.text);
        
        const recText = rec.description || rec.title || 'No specific recommendations available';
        const recLines = this.doc.splitTextToSize(recText, this.contentWidth - 30);
        this.doc.text(recLines, this.margin + 15, yPos);
      }
    });
  }

  // Priority Recommendations
  addRecommendations() {
    this.doc.addPage();
    this.addHeader();
    
    let yPos = 55;
    
    this.addSectionTitle('Priority Recommendations', yPos);
    yPos += 35;
    
    // Quick wins section
    if (this.results.quickWins && this.results.quickWins.length > 0) {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.accent);
      this.doc.text('Quick Wins', this.margin, yPos);
      yPos += 20;
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(COLORS.text);
      
      this.results.quickWins.slice(0, 5).forEach((win, index) => {
        const winText = typeof win === 'string' ? win : win.action || win.title || 'Action item';
        const winLines = this.doc.splitTextToSize(`${index + 1}. ${winText}`, this.contentWidth - 20);
        this.doc.text(winLines, this.margin + 10, yPos);
        yPos += Math.max(winLines.length * 12, 16);
      });
      
      yPos += 20;
    }
    
    // Priority actions table
    if (this.results.prioritizedActions && this.results.prioritizedActions.length > 0) {
      if (yPos + 100 > this.pageHeight - 60) {
        this.doc.addPage();
        this.addHeader();
        yPos = 55;
      }
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(COLORS.accent);
      this.doc.text('Priority Actions', this.margin, yPos);
      yPos += 20;
      
      const actionData = this.results.prioritizedActions.slice(0, 12).map((action, index) => [
        (index + 1).toString(),
        action.category || action.pillarName || 'General',
        action.action || action.title || 'Action item',
        action.priority || 'Medium'
      ]);
      
      autoTable(this.doc, {
        startY: yPos,
        head: [['#', 'Area', 'Action', 'Priority']],
        body: actionData,
        margin: { left: this.margin, right: this.margin },
        theme: 'grid',
        headStyles: {
          fillColor: [27, 49, 57],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [44, 44, 44]
        },
        columnStyles: {
          0: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 80 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 60, halign: 'center' }
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        didParseCell: (data) => {
          if (data.column.index === 3 && data.section === 'body') {
            const priority = data.cell.raw;
            if (priority === 'high' || priority === 'High') {
              data.cell.styles.textColor = [239, 68, 68];
              data.cell.styles.fontStyle = 'bold';
            } else if (priority === 'medium' || priority === 'Medium') {
              data.cell.styles.textColor = [245, 158, 11];
            }
          }
        }
      });
    }
  }

  // Methodology
  addMethodology() {
    this.doc.addPage();
    this.addHeader();
    
    let yPos = 55;
    
    this.addSectionTitle('Methodology', yPos);
    yPos += 35;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(COLORS.text);
    
    const methodologyText = `This assessment evaluates your organization's Databricks technical maturity across six key pillars. Each pillar contains multiple dimensions with specific questions designed to assess current capabilities and future aspirations.

The maturity framework uses a 5-level scale:
• Level 1 (Explore): Ad-hoc processes, limited capabilities
• Level 2 (Experiment): Some processes defined, basic capabilities  
• Level 3 (Formalize): Structured approach with established processes
• Level 4 (Optimize): Quantitatively managed, advanced capabilities
• Level 5 (Transform): Continuous improvement, innovation-driven

Scores are calculated based on your responses across four perspectives:
• Current State: Your existing capabilities
• Future Vision: Your desired target state
• Technical Pain Points: Technical challenges identified
• Business Pain Points: Business impact areas

The overall maturity score is a weighted average across all completed pillars, with each pillar weighted by its number of questions. Recommendations are generated based on capability gaps, pain points, and industry best practices.`;
    
    const methodLines = this.doc.splitTextToSize(methodologyText, this.contentWidth);
    this.doc.text(methodLines, this.margin, yPos);
    yPos += methodLines.length * 12 + 30;
    
    // Assessment statistics
    if (yPos + 150 > this.pageHeight - 60) {
      this.doc.addPage();
      this.addHeader();
      yPos = 55;
    }
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.accent);
    this.doc.text('Assessment Statistics', this.margin, yPos);
    yPos += 20;
    
    const statsData = [
      ['Total Questions', (this.assessmentInfo.totalQuestions || 0).toString()],
      ['Questions Answered', (this.assessmentInfo.questionsAnswered || 0).toString()],
      ['Completion Percentage', `${this.assessmentInfo.completionPercentage || 0}%`],
      ['Pillars Assessed', `${this.assessmentInfo.pillarsWithResponses || 0}/${this.assessmentInfo.totalPillars || 6}`],
      ['Pillars Completed', `${this.assessmentInfo.completedPillars || 0}/${this.assessmentInfo.totalPillars || 6}`],
      ['Overall Maturity Score', `${this.results.overall?.currentScore || 0}/5`],
      ['Assessment Date', new Date(this.assessmentInfo.startedAt || Date.now()).toLocaleDateString()]
    ];
    
    autoTable(this.doc, {
      startY: yPos,
      body: statsData,
      margin: { left: this.margin, right: this.margin },
      theme: 'plain',
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 44, 44]
      },
      columnStyles: {
        0: { cellWidth: 180, fontStyle: 'bold', fillColor: [245, 245, 245] },
        1: { cellWidth: 'auto', halign: 'right' }
      }
    });
  }

  // Helper: Add section title
  addSectionTitle(title, yPos) {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(title, this.margin, yPos);
    
    this.doc.setDrawColor(COLORS.primary);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, yPos + 5, this.margin + 120, yPos + 5);
  }
}

// Export function
export const generateProfessionalReport = (results, assessmentInfo) => {
  try {
    console.log('[PDF Export] Starting generation with results:', results);
    console.log('[PDF Export] Assessment info:', assessmentInfo);
    
    const exporter = new ProfessionalPDFExporter(results, assessmentInfo);
    const doc = exporter.generate();
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const orgName = (assessmentInfo.organizationName || 'Organization').replace(/[^a-z0-9]/gi, '_');
    const filename = `Databricks_Maturity_Assessment_${orgName}_${date}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('[PDF Export] PDF generated successfully:', filename);
    return { success: true, filename };
  } catch (error) {
    console.error('[PDF Export] Error generating PDF report:', error);
    return { success: false, error: error.message };
  }
};

export default { generateProfessionalReport };
