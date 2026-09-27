const https = require('https');
const http = require('http');

class NotificationService {
  /**
   * Dispatch webhook or Slack notification when an assessment report is generated
   */
  async dispatchAssessmentCompletionWebhook(instance, calculatedScores, aiReport) {
    const webhookUrl = process.env.SCOREX_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('ℹ️  No SCOREX_WEBHOOK_URL configured, skipping webhook dispatch.');
      return;
    }

    try {
      const framework = instance.frameworkSnapshot || {};
      const company = instance.customerName || 'Enterprise Organization';
      const score = calculatedScores?.overallScore || 3.0;
      const level = calculatedScores?.maturityLevel || 'Defined';

      const payload = {
        text: `🎯 *ScoreX Assessment Completed:* ${company} - ${framework.title}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `🎯 Assessment Completed: ${company}`,
              emoji: true
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Framework:*\n${framework.title || 'Dynamic Assessment'}`
              },
              {
                type: "mrkdwn",
                text: `*Overall Score:*\n*${score} / 5.0* (${level} Stage)`
              },
              {
                type: "mrkdwn",
                text: `*Initiative:*\n${instance.useCase || 'Architecture Modernization'}`
              },
              {
                type: "mrkdwn",
                text: `*Completed At:*\n${new Date().toLocaleString()}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Executive Summary:*\n${(aiReport?.executiveSummary || '').substring(0, 300)}...`
            }
          }
        ]
      };

      const urlObj = new URL(webhookUrl);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;

      const bodyData = JSON.stringify(payload);

      const req = client.request(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyData)
        }
      }, (res) => {
        console.log(`📡 Assessment webhook dispatched. Status: ${res.statusCode}`);
      });

      req.on('error', (err) => {
        console.warn('⚠️  Webhook dispatch error:', err.message);
      });

      req.write(bodyData);
      req.end();
    } catch (err) {
      console.warn('⚠️  Failed to construct assessment webhook payload:', err.message);
    }
  }
}

module.exports = new NotificationService();
