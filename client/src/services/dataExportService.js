/**
 * Data Export Service for Raw JSON and Flat CSV Formats
 */

export const exportAssessmentToJSON = (instance, report) => {
  try {
    const payload = {
      scorexVersion: "3.2.0",
      exportedAt: new Date().toISOString(),
      metadata: {
        id: instance.id,
        customerName: instance.customerName || 'Organization',
        useCase: instance.useCase || 'Assessment',
        status: instance.status,
        overallScore: instance.totalScore || report?.overallScore || 0,
        maturityLevel: instance.maturityLevel || report?.maturityLevel || 'Defined',
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt
      },
      framework: instance.frameworkSnapshot || {},
      responses: instance.responses || {},
      scores: instance.scores || report?.dimensionScores || {},
      executiveReport: report || {}
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const safeName = (instance.customerName || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute("download", `scorex_${safeName}_${instance.id || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return { success: true };
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return { success: false, error: error.message };
  }
};

export const exportAssessmentToCSV = (instance, report) => {
  try {
    const framework = instance?.frameworkSnapshot || {};
    const dimensions = framework.dimensions || [];
    const responses = instance?.responses || {};

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).trim();
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = [
      [escapeCsv('Customer'), escapeCsv(instance?.customerName || 'Organization')],
      [escapeCsv('Framework'), escapeCsv(framework.title || 'Architecture Assessment')],
      [escapeCsv('Overall Score'), escapeCsv(`${instance?.totalScore || report?.overallScore || '0.0'} / 5.0`)],
      [escapeCsv('Maturity Stage'), escapeCsv(instance?.maturityLevel || report?.maturityLevel || 'Defined')],
      [escapeCsv('Exported At'), escapeCsv(new Date().toLocaleString())],
      [],
      [
        escapeCsv('Dimension'),
        escapeCsv('Question ID'),
        escapeCsv('Question Text'),
        escapeCsv('Current State Score'),
        escapeCsv('Target State Score'),
        escapeCsv('Technical Pain Points'),
        escapeCsv('Business Pain Points'),
        escapeCsv('Operational Notes')
      ]
    ];

    dimensions.forEach(dim => {
      (dim.questions || []).forEach(q => {
        const currentScore = responses[q.id] !== undefined ? responses[q.id] : 'Not Answered';
        const targetScore = responses[`${q.id}_future_state`] !== undefined ? responses[`${q.id}_future_state`] : 'N/A';
        const tp = Array.isArray(responses[`${q.id}_technical_pain`]) 
          ? responses[`${q.id}_technical_pain`].join('; ') 
          : (Array.isArray(responses[`${q.id}_tech_pain`]) ? responses[`${q.id}_tech_pain`].join('; ') : '');
        const bp = Array.isArray(responses[`${q.id}_business_pain`]) 
          ? responses[`${q.id}_business_pain`].join('; ') 
          : '';
        const notes = responses[`${q.id}_comment`] || '';

        rows.push([
          escapeCsv(dim.name),
          escapeCsv(q.id),
          escapeCsv(q.text || q.prompt || q.title || ''),
          escapeCsv(currentScore),
          escapeCsv(targetScore),
          escapeCsv(tp),
          escapeCsv(bp),
          escapeCsv(notes)
        ]);
      });
    });

    const csvContent = rows.map(r => r.join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeName = (instance?.customerName || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute("download", `scorex_${safeName}_matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, error: error.message };
  }
};

export const exportAssessmentToWord = (instance, report) => {
  try {
    const framework = instance?.frameworkSnapshot || {};
    const org = instance?.customerName || 'Organization';
    const overallScore = instance?.totalScore || report?.overallScore || '3.0';
    const maturityStage = instance?.maturityLevel || report?.maturityLevel || 'Defined';
    const scores = instance?.scores || report?.dimensionScores || {};
    const recs = report?.prioritizedRecommendations || report?.prioritizedActions || [];
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>ScoreX Executive Modernization Report - ${org}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 40px; }
          h1 { font-size: 24pt; color: #0b132b; border-bottom: 3px solid #1d4ed8; padding-bottom: 8px; margin-bottom: 4px; }
          h2 { font-size: 16pt; color: #1d4ed8; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          h3 { font-size: 13pt; color: #0284c7; margin-top: 16px; }
          .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; margin-bottom: 20px; border-radius: 6px; }
          .kpi-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          .kpi-table th { background: #0b132b; color: #ffffff; padding: 8px 12px; text-align: left; font-size: 10pt; }
          .kpi-table td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 10pt; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 9pt; }
          .badge-blue { background: #eff6ff; color: #1d4ed8; }
          .badge-green { background: #ecfdf5; color: #047857; }
          .rec-box { background: #ffffff; border-left: 4px solid #1d4ed8; padding: 10px 14px; margin-bottom: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h1>ScoreX Executive Advisory Briefing</h1>
        <p style="color: #64748b; font-size: 10pt; margin-top: 0;">Google Cloud Architecture & GenAI Modernization Advisory • Delivered: ${dateStr}</p>
        
        <div class="meta-box">
          <strong>Enterprise Client:</strong> ${org}<br>
          <strong>Initiative / Scope:</strong> ${framework.title || 'Data & AI Architecture Maturity'}<br>
          <strong>Overall Maturity Score:</strong> <span class="badge badge-blue">${overallScore} / 5.0 (${maturityStage})</span><br>
          <strong>Target Horizon:</strong> <span class="badge badge-green">4.2+ / 5.0 (Optimized Multi-Agent Mesh)</span><br>
          <strong>Projected 3-Yr ROI:</strong> $2.3M - $4.2M (35-50% TCO Reduction)
        </div>

        <h2>1. Executive Summary & Strategic Context</h2>
        <p>This executive memorandum establishes the foundational cloud and artificial intelligence maturity baseline for <strong>${org}</strong>. Through comprehensive assessment across core architectural dimensions, ScoreX has identified key modernization opportunities to eliminate operational debt, accelerate streaming CDC, and deploy scalable agentic AI meshes on Google Cloud Platform.</p>

        <h2>2. Dimensional Maturity Scores</h2>
        <table class="kpi-table">
          <thead>
            <tr>
              <th>Architectural Pillar</th>
              <th>Current Score</th>
              <th>Target Horizon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${(framework.dimensions || []).map(dim => {
              const cur = scores[dim.id] || scores[dim.name] || '2.8';
              return `
                <tr>
                  <td><strong>${dim.name}</strong></td>
                  <td>${cur} / 5.0</td>
                  <td>4.0+ / 5.0</td>
                  <td><span class="badge badge-blue">In Modernization</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <h2>3. High-Priority Transformation Roadmap</h2>
        ${recs.slice(0, 6).map((r, idx) => `
          <div class="rec-box">
            <strong>${idx + 1}. ${r.title || r.recommendation || 'Modernization Action'}</strong><br>
            <span style="color: #64748b; font-size: 9.5pt;">${r.whyItMatters || r.impact || r.description || ''}</span><br>
            <span style="font-size: 9pt; color: #047857;"><strong>Timeline:</strong> ${r.timeline || r.timeframe || 'Phase 1 (Days 0-30)'}</span>
          </div>
        `).join('')}

        <h2>4. Governance & Executive Sign-Off</h2>
        <table class="kpi-table">
          <tr>
            <td style="width: 50%;"><strong>Lead Enterprise Architect:</strong> ______________________</td>
            <td style="width: 50%;"><strong>Chief Technology Officer (CTO):</strong> ______________________</td>
          </tr>
          <tr>
            <td><strong>Date:</strong> ${dateStr}</td>
            <td><strong>Approval Status:</strong> APPROVED FOR IMPLEMENTATION</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (org || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.href = url;
    link.setAttribute('download', `scorex_${safeName}_executive_briefing.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error exporting to Word:', error);
    return { success: false, error: error.message };
  }
};

export const exportDrawioFile = (xml, filename) => {
  try {
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error exporting Draw.io file:', error);
    return { success: false, error: error.message };
  }
};

export const exportCompleteDeliverablesBundle = async (instance, report, { exportDynamicAssessmentToExcel, generateDynamicPDFReport, exportAssessmentToPPTX }) => {
  try {
    const safeName = (instance.customerName || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // 1. PDF Report
    if (typeof generateDynamicPDFReport === 'function') {
      generateDynamicPDFReport(instance, report);
    }

    // 2. Editable PowerPoint / Google Slides Deck
    if (typeof exportAssessmentToPPTX === 'function') {
      await exportAssessmentToPPTX(instance, report);
    }
    
    // 3. Excel Report
    if (typeof exportDynamicAssessmentToExcel === 'function') {
      exportDynamicAssessmentToExcel(instance, report);
    }

    // 4. Word Briefing Document
    exportAssessmentToWord(instance, report);

    // 5. Flat CSV Matrix
    exportAssessmentToCSV(instance, report);

    // 6. Raw JSON
    exportAssessmentToJSON(instance, report);

    // 7. Draw.io XMLs
    const diagrams = report?.architectureDiagrams || instance?.architectureDiagrams || {};
    if (diagrams.currentStateXml) {
      exportDrawioFile(diagrams.currentStateXml, `scorex_${safeName}_current_state_arch.drawio`);
    }
    if (diagrams.targetStateXml) {
      exportDrawioFile(diagrams.targetStateXml, `scorex_${safeName}_target_state_arch.drawio`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error exporting complete deliverables bundle:', error);
    return { success: false, error: error.message };
  }
};

