const path = require('path');
const mammoth = require('mammoth');
const geminiService = require('./geminiService');

class DocumentExtractionService {
  /**
   * Determine document type and extract content or prepare multimodal payload
   */
  async processFile(fileBuffer, mimeType = '', filename = '') {
    const ext = path.extname(filename || '').toLowerCase();
    const cleanMime = (mimeType || '').toLowerCase();

    console.log(`📄 [DocExtract] Processing file: "${filename}" (ext: ${ext}, mime: ${cleanMime}, size: ${fileBuffer.length} bytes)`);

    // 1. PDF Documents -> Direct native Gemini multimodal
    if (cleanMime === 'application/pdf' || ext === '.pdf') {
      return {
        mode: 'multimodal',
        mimeType: 'application/pdf',
        base64: fileBuffer.toString('base64'),
        filename,
        displayType: 'PDF Document'
      };
    }

    // 2. Images (Architecture Diagrams, Whiteboards, Topology Screenshots) -> Direct native Gemini multimodal
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'];
    if (cleanMime.startsWith('image/') || imageExtensions.includes(ext)) {
      let finalMime = cleanMime;
      if (!finalMime.startsWith('image/')) {
        if (ext === '.png') finalMime = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') finalMime = 'image/jpeg';
        else if (ext === '.webp') finalMime = 'image/webp';
        else finalMime = 'image/png';
      }
      return {
        mode: 'multimodal',
        mimeType: finalMime,
        base64: fileBuffer.toString('base64'),
        filename,
        displayType: 'Architecture Diagram / Image'
      };
    }

    // 3. Word Documents (.docx) -> Extract raw text & tables using mammoth
    if (
      ext === '.docx' ||
      cleanMime.includes('wordprocessingml') ||
      cleanMime.includes('msword') ||
      ext === '.doc'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        const text = (result.value || '').trim();
        if (!text) {
          throw new Error('Word document appears to be empty or contains only unsupported embedded elements.');
        }
        return {
          mode: 'text',
          text,
          filename,
          displayType: 'Word Document (.docx)'
        };
      } catch (err) {
        console.warn(`⚠️ [DocExtract] Mammoth parsing warning for ${filename}:`, err.message);
        // Fallback: Attempt plain text extraction if possible
        const rawString = fileBuffer.toString('utf-8');
        return {
          mode: 'text',
          text: rawString,
          filename,
          displayType: 'Word Document (Fallback)'
        };
      }
    }

    // 4. Text, Markdown, CSV, JSON, YAML, SQL
    const textExtensions = ['.txt', '.md', '.markdown', '.csv', '.json', '.yaml', '.yml', '.sql', '.xml'];
    if (
      cleanMime.startsWith('text/') ||
      cleanMime.includes('json') ||
      cleanMime.includes('csv') ||
      textExtensions.includes(ext)
    ) {
      return {
        mode: 'text',
        text: fileBuffer.toString('utf-8'),
        filename,
        displayType: 'Text / Markdown Specification'
      };
    }

    // Default fallback: Try reading as UTF-8 string
    const fallbackString = fileBuffer.toString('utf-8');
    if (/[\x00-\x08\x0E-\x1F]/.test(fallbackString.slice(0, 1000))) {
      throw new Error(`Unsupported binary file format "${ext || cleanMime}". Supported formats: PDF (.pdf), Word (.docx), Architecture Images (.png, .jpg, .webp), and Text/Markdown (.txt, .md, .csv, .json).`);
    }

    return {
      mode: 'text',
      text: fallbackString,
      filename,
      displayType: 'Text Document'
    };
  }

  /**
   * Auto-extract assessment responses and maturity ratings from an uploaded document
   * @param {Buffer} fileBuffer - Raw file buffer
   * @param {string} mimeType - MIME type
   * @param {string} filename - Original filename
   * @param {object} framework - Standard or Dynamic Assessment Framework
   * @param {object} options - Customer name, industry override, use case
   */
  async extractAssessmentFromDocument(fileBuffer, mimeType, filename, framework, options = {}) {
    if (!geminiService.isAvailable()) {
      throw new Error('Gemini API is not configured. Please verify your GEMINI_API_KEY environment variable.');
    }

    const processed = await this.processFile(fileBuffer, mimeType, filename);
    console.log(`🤖 [DocExtract] Sending ${processed.displayType} to Gemini for maturity extraction...`);

    // Prepare framework schema description for prompt
    const frameworkSummary = this._buildFrameworkSummary(framework);

    const systemInstruction = `You are a Principal Enterprise Cloud & AI Solutions Architect conducting an automated Data & AI Maturity Assessment based on an uploaded enterprise document (architecture topology diagram, cloud specification, technical RFC, data strategy memo, or system audit).

Your mission is to rigorously analyze the uploaded artifact, identify evidence of current architecture maturity, detect technical debt and pain points, and accurately populate the assessment questionnaire.

RULES FOR GROUNDED MATURITY RATING:
1. Ground every rating strictly in the provided document or architecture diagram.
2. Determine Current State Level (1 to 5):
   - Level 1 (Explore): Ad-hoc, manual, isolated silos, unmanaged scripts, no catalog.
   - Level 2 (Experiment): Departmental tools, partial pipelines, basic cloud storage, emerging standards.
   - Level 3 (Formalize): Documented standards, centralized warehouse/lakehouse, CI/CD, defined data contracts.
   - Level 4 (Optimize): Automated governance, declarative streaming pipelines, serverless compute auto-suspend, production MLOps/LLM guardrails.
   - Level 5 (Transform): Industry-leading autonomous agent mesh, zero-copy data sharing, real-time CDC, proactive FinOps.
3. Propose a pragmatic, aspirational Target State Level (typically Current State + 1 or 2, max 5).
4. Select matching Technical Pain Points and Business Pain Points from the framework's available options where evidence of friction exists.
5. In each question's comment box, provide a concrete evidence citation quoting or pointing to the specific diagram component or section in the document.
6. If the document does not explicitly mention a specific dimension, make an informed architectural inference from the organization's overall tech stack and explicitly state: "Inferred from overall architectural posture: [rationale]".
7. Identify the client Organization Name (if visible, otherwise use "${options.customerName || 'Enterprise Client'}"), industry, and list of detected technologies.

Return a strictly valid JSON object matching the requested schema.`;

    const extractionPrompt = `DOCUMENT INFORMATION:
- Filename: ${filename}
- Document Type: ${processed.displayType}
- Target Customer (if known): ${options.customerName || 'Auto-detect from document'}
- Initiative / Use Case: ${options.useCase || 'Enterprise Architecture Modernization'}

ASSESSMENT FRAMEWORK TO POPULATE:
Framework Title: "${framework.title || framework.name || 'Enterprise Data & AI Maturity Assessment'}"
Dimensions & Questions:
${JSON.stringify(frameworkSummary, null, 2)}

TASK:
Analyze the uploaded document thoroughly. Return a JSON object with this exact structure:
{
  "organizationName": "<Extracted or inferred company name, e.g. Acme Corp>",
  "industry": "<Inferred industry, e.g. Financial Services, Retail, Healthcare, Technology>",
  "detectedTechnologies": ["<Tech 1, e.g. Apache Kafka>", "<Tech 2, e.g. PostgreSQL>", "<Tech 3, e.g. BigQuery>", "<Tech 4, e.g. dbt>"],
  "overallMaturityEstimate": <number 1.0 - 5.0>,
  "executiveSummary": "<3-4 paragraph CTO-level narrative synthesizing current state architecture findings, major bottlenecks, and target transformation horizon>",
  "responses": {
    "<questionId>_current_state": <number 1 - 5>,
    "<questionId>_future_state": <number 1 - 5>,
    "<questionId>_technical_pain": ["<pain_point_value_1>", "<pain_point_value_2>"],
    "<questionId>_business_pain": ["<pain_point_value_1>"],
    "<questionId>_comment": "Evidence: '<exact quote or visual diagram element>' - <rationale>"
  },
  "evidenceMap": {
    "<questionId>": {
      "question": "<question text>",
      "score": <number 1 - 5>,
      "targetScore": <number 1 - 5>,
      "confidence": "<high|medium|low>",
      "evidenceQuote": "<quote or diagram citation>",
      "rationale": "<explanation of rating>"
    }
  },
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "keyBottlenecks": ["<bottleneck 1>", "<bottleneck 2>"],
  "transformationPriorities": ["<priority 1>", "<priority 2>", "<priority 3>"]
}`;

    // Build Gemini contents array (multimodal or text)
    let contents;
    if (processed.mode === 'multimodal') {
      contents = [
        extractionPrompt,
        {
          inlineData: {
            mimeType: processed.mimeType,
            data: processed.base64
          }
        }
      ];
    } else {
      contents = `${extractionPrompt}\n\n=== UPLOADED DOCUMENT CONTENT (${processed.filename}) ===\n\n${processed.text.slice(0, 100000)}`;
    }

    const result = await geminiService._generateWithFallback(
      contents,
      systemInstruction,
      0.3, // Low temperature for high precision evidence extraction
      'application/json'
    );

    let parsed = null;
    try {
      parsed = JSON.parse(result.text);
    } catch (err) {
      const match = result.text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse Gemini extraction output as JSON: ' + result.text.slice(0, 200));
      }
    }

    console.log(`✅ [DocExtract] Successfully extracted responses for ${Object.keys(parsed.responses || {}).length} keys (Model: ${result.modelUsed})`);

    return {
      success: true,
      extractedData: parsed,
      modelUsed: result.modelUsed,
      sourceDocument: {
        filename,
        displayType: processed.displayType,
        extractedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Helper to build a concise summary of the framework questions and valid pain point keys
   */
  _buildFrameworkSummary(framework) {
    // 1. Standard Framework (assessmentAreas array)
    if (Array.isArray(framework.assessmentAreas)) {
      return framework.assessmentAreas.map(area => ({
        pillarId: area.id,
        pillarName: area.name,
        dimensions: (area.dimensions || []).map(dim => ({
          dimensionId: dim.id,
          dimensionName: dim.name,
          questions: (dim.questions || []).map(q => {
            const techPain = q.perspectives?.find(p => p.id === 'technical_pain')?.options || [];
            const bizPain = q.perspectives?.find(p => p.id === 'business_pain')?.options || [];
            return {
              questionId: q.id,
              question: q.question,
              technicalPainOptions: techPain.map(o => ({ value: o.value, label: o.label })),
              businessPainOptions: bizPain.map(o => ({ value: o.value, label: o.label }))
            };
          })
        }))
      }));
    }

    // 2. Dynamic Framework (dimensions array)
    if (Array.isArray(framework.dimensions)) {
      return framework.dimensions.map(dim => ({
        dimensionId: dim.id,
        dimensionName: dim.name,
        questions: (dim.questions || []).map(q => ({
          questionId: q.id,
          question: q.text || q.question,
          painPointOptions: (q.painPoints || []).map(p => ({ value: p.id || p.value || p, label: p.label || p }))
        }))
      }));
    }

    return framework;
  }
}

module.exports = new DocumentExtractionService();
