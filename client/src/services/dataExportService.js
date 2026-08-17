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
    const framework = instance.frameworkSnapshot || {};
    const dimensions = framework.dimensions || [];
    const responses = instance.responses || {};

    const rows = [
      ['Customer', instance.customerName || 'Organization'],
      ['Framework', framework.title || 'Architecture Assessment'],
      ['Overall Score', `${instance.totalScore || '0.0'} / 5.0`],
      ['Maturity Stage', instance.maturityLevel || 'Defined'],
      ['Exported At', new Date().toLocaleString()],
      [],
      ['Dimension', 'Question ID', 'Question Text', 'Current State Score', 'Target State Score', 'Technical Pain Points', 'Business Pain Points', 'Operational Notes']
    ];

    dimensions.forEach(dim => {
      (dim.questions || []).forEach(q => {
        const currentScore = responses[q.id] !== undefined ? responses[q.id] : 'Not Answered';
        const targetScore = responses[`${q.id}_future_state`] !== undefined ? responses[`${q.id}_future_state`] : 'N/A';
        const techPains = (responses[`${q.id}_tech_pain`] || []).join('; ');
        const bizPains = (responses[`${q.id}_business_pain`] || []).join('; ');
        const notes = (responses[`${q.id}_comment`] || '').replace(/"/g, '""');

        rows.push([
          `"${dim.name.replace(/"/g, '""')}"`,
          `"${q.id}"`,
          `"${q.text.replace(/"/g, '""')}"`,
          currentScore,
          targetScore,
          `"${techPains.replace(/"/g, '""')}"`,
          `"${bizPains.replace(/"/g, '""')}"`,
          `"${notes}"`
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const safeName = (instance.customerName || 'assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute("download", `scorex_${safeName}_matrix.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { success: true };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, error: error.message };
  }
};
