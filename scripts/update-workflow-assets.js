#!/usr/bin/env node

/**
 * ScoreX Automated Workflow Assets & GIF Generator
 * Crawls full end-to-end user workflows:
 * Hub -> Questions -> Sliders -> Selecting Pain Points -> Next Question -> Submit
 * -> Generation Progress Screen -> Report Tab 1 (Radar + 2D Risk Heatmap)
 * -> Tab 2 (Draw.io Architecture Evolution + 1-Click IaC)
 * -> Tab 3 (Financial Impact ROI & Payback)
 * -> Tab 4 (Persona Roadmap Blueprints)
 * -> Tab 5 (Question Audit Light Theme)
 * -> What-If Simulator -> Present Deck Mode -> Multi-Format Export
 */

const puppeteer = require('/Users/nitinagga/Documents/PromptCanvas/node_modules/puppeteer');
const GIFEncoder = require('../scratch/node_modules/gif-encoder-2');
const { createCanvas, loadImage } = require('../scratch/node_modules/canvas');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.TEST_URL || 'http://localhost:5001';
const INST_ID = process.env.SAMPLE_ID || 'bb883a5f-cb0f-4dc4-be5d-79e84d23ef49';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FRAMES_BASE_DIR = path.join(process.cwd(), 'client/public/workflows/frames');
const OUTPUT_DIR = path.join(process.cwd(), 'client/public/workflows');
const ARTIFACT_DIR = path.join(process.cwd(), 'scratch/gifs');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(FRAMES_BASE_DIR)) fs.mkdirSync(FRAMES_BASE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveFramesAndGif(personaKey, personaName, steps, width = 960, height = 540) {
  const pDir = path.join(FRAMES_BASE_DIR, personaKey);
  if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });

  const encoder = new GIFEncoder(width, height, 'octree', false);
  encoder.setDelay(1600);
  encoder.setRepeat(0);
  encoder.setQuality(10);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const gifPath = path.join(OUTPUT_DIR, `${personaKey}.gif`);
  const stream = fs.createWriteStream(gifPath);
  encoder.createReadStream().pipe(stream);
  encoder.start();

  const manifest = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const frameFilename = `frame_${String(i + 1).padStart(2, '0')}.png`;
    const framePath = path.join(pDir, frameFilename);
    
    fs.writeFileSync(framePath, Buffer.from(step.buffer));

    const img = await loadImage(Buffer.from(step.buffer));
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Sleek progress bar at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 220, height - 42, 440, 32, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${personaName} • ${i + 1}/${steps.length}: ${step.title}`, width / 2, height - 22);

    encoder.addFrame(ctx);

    manifest.push({
      index: i + 1,
      frameSrc: `/workflows/frames/${personaKey}/${frameFilename}`,
      title: step.title,
      description: step.desc,
      targetAction: step.action
    });
  }

  encoder.finish();
  await new Promise((res) => stream.on('finish', res));
  
  fs.copyFileSync(gifPath, path.join(ARTIFACT_DIR, `${personaKey}.gif`));
  fs.writeFileSync(path.join(pDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`✅ [${personaName}] Successfully updated ${steps.length} frames and GIF -> ${gifPath}`);
  return manifest;
}

(async () => {
  console.log(`🚀 Starting Full End-to-End Workflow Capture against ${BASE_URL}...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1600, height: 1000 });

  try {
    // =========================================================================
    // 1. CLOUD & AI SOLUTIONS ARCHITECT (14 Complete E2E Steps)
    // =========================================================================
    console.log('\n--- 1/4: Recording Cloud & AI Solutions Architect E2E Workflow ---');
    const architectSteps = [];

    // 1. Hub
    await page.goto(`${BASE_URL}/assessments`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    architectSteps.push({
      title: '1. Select Assessment Framework',
      desc: 'Browse multi-cloud architectures, GenAI migrations, and lakehouse templates.',
      action: 'Click "Start Assessment" on OpenAI to Gemini Migration',
      buffer: await page.screenshot()
    });

    // 2. Question 1 Rating Sliders
    await page.goto(`${BASE_URL}/assessments/runner/openai_to_gemini_enterprise_migration`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    architectSteps.push({
      title: '2. Q1: Drag Maturity Sliders',
      desc: 'Evaluate Current Baseline (L2.5) vs Desired Target Horizon (L4.5) on Prompt & API Parity.',
      action: 'Drag rating sliders across current vs future horizons',
      buffer: await page.screenshot()
    });

    // 3. Q1 Select 5 Pain Points & Context Notes
    await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb, idx) => { if (idx < 3) cb.click(); });
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.value = '42 production microservices running hardcoded OpenAI API keys, experiencing $185k/mo unmanaged cost spikes.';
    });
    await sleep(1000);
    architectSteps.push({
      title: '3. Q1: Identify Bottlenecks & Operational Notes',
      desc: 'Select 5 critical technical & business pain points and enter lead architect context notes.',
      action: 'Select 5 Friction Checkboxes + Enter Context Note',
      buffer: await page.screenshot()
    });

    // 4. Next Question: Q2 Long-Context & Chunked RAG
    await page.evaluate(() => {
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next Question') || b.innerText.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await sleep(1200);
    architectSteps.push({
      title: '4. Q2: Next Question (Long-Context vs RAG)',
      desc: 'Navigate to Question 2, rate ultra-long context window adoption, and pick RAG loss friction.',
      action: 'Click "Next Question" -> Rate Q2',
      buffer: await page.screenshot()
    });

    // 5. Submit Assessment & Trigger Gemini Synthesis
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Generate Report') || b.innerText.includes('Submit') || b.innerText.includes('Complete'));
      if (submitBtn) submitBtn.click();
    });
    await sleep(1000);
    architectSteps.push({
      title: '5. Submit Assessment & Synthesize',
      desc: 'Click Submit to trigger Gemini 3.7 Flash synthesis of Draw.io XML and ROI models.',
      action: 'Click "Generate AI Maturity Report"',
      buffer: await page.screenshot()
    });

    // 6. Report Landing: Tab 1 Radar & Overview
    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    architectSteps.push({
      title: '6. Tab 1: Dimensional Gap Radar',
      desc: 'Analyze capability polygon gaps across 5 pillars against industry baseline benchmarks.',
      action: 'Tab 1: Executive Overview & Radar Polygon',
      buffer: await page.screenshot()
    });

    // 7. Tab 1: 2D Enterprise Risk Heatmap Matrix
    await page.evaluate(() => window.scrollTo(0, 750));
    await sleep(800);
    architectSteps.push({
      title: '7. Tab 1: 2D Risk Heatmap Matrix',
      desc: 'Audit critical capability exposures, high-risk bottlenecks (8 Bottlenecks), and scores.',
      action: 'Audit 8 Identified Bottlenecks on Risk Matrix',
      buffer: await page.screenshot()
    });

    // 8. Tab 2: Architecture Evolution (Baseline vs Target)
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Architecture Evolution'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: '8. Tab 2: Side-by-Side Draw.io Graph',
      desc: 'Examine side-by-side Baseline Legacy Stack vs Desired Vertex AI Gemini Target Topology.',
      action: 'Tab 2: Compare Side-by-Side Architectures',
      buffer: await page.screenshot()
    });

    // 9. Tab 2: Target Mesh Node Deep-Dive
    await page.evaluate(() => window.scrollTo(0, 350));
    await sleep(1000);
    architectSteps.push({
      title: '9. Tab 2: Target Topology Deep-Dive',
      desc: 'Inspect Gemini 2M Long-Context, Prompt Context Caching (75% savings), and Model Armor.',
      action: 'Inspect Target Mesh Node Specifications',
      buffer: await page.screenshot()
    });

    // 10. Tab 2: 1-Click Terraform Cloud Deployer
    await page.evaluate(() => window.scrollTo(0, 1000));
    await sleep(1000);
    architectSteps.push({
      title: '10. Tab 2: 1-Click Terraform IaC Deployer',
      desc: 'Auto-generate production-grade Terraform HCL for Vertex AI, CMEK, and Apigee AI Gateway.',
      action: 'Review and Copy Terraform Infrastructure Code',
      buffer: await page.screenshot()
    });

    // 11. Tab 3: Financial Impact & TCO Savings
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Financial Impact & TCO'));
      if (tab) tab.click();
    });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 450));
    await sleep(800);
    architectSteps.push({
      title: '11. Tab 3: Financial ROI & 4.6 Mo Payback',
      desc: 'Examine 3-year net value creation ($1.94M), annual savings ($360k), and rapid capital recovery.',
      action: 'Tab 3: Financial Impact & TCO Card',
      buffer: await page.screenshot()
    });

    // 12. Tab 4: Roadmap & Transformation Blueprints
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Roadmap & Persona Blueprints'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: '12. Tab 4: Roadmap & Milestones Playbook',
      desc: 'Review 3-phase transformation execution plan with timeline gates and deliverables.',
      action: 'Tab 4: Roadmap & Transformation Blueprints',
      buffer: await page.screenshot()
    });

    // 13. Tab 5: Granular Question Responses Audit (Light Theme)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Question Responses Audit'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: '13. Tab 5: Granular Question Audit (Light)',
      desc: 'Review all questions, rating baselines, technical friction tags, and operational notes.',
      action: 'Tab 5: Light-Theme Granular Audit Record',
      buffer: await page.screenshot()
    });

    // 14. What-If Simulator & 16:9 Present Deck Mode
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const presentBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Present Deck'));
      if (presentBtn) presentBtn.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: '14. 1-Click Board Presentation Mode',
      desc: 'Transform assessment findings into executive board slides in 1 click.',
      action: 'Header: Click "Present Deck"',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('01_cloud_architect_workflow', 'Cloud Architect Workflow', architectSteps);

    // =========================================================================
    // 2. VP ENGINEERING & ASSESSMENT AUTHOR (8 Steps)
    // =========================================================================
    console.log('\n--- 2/4: Recording VP Engineering & Author E2E Workflow ---');
    const authorSteps = [];

    await page.goto(`${BASE_URL}/assessments/ai-generator`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: '1. AI Assessment Generator',
      desc: 'Describe any custom architecture, technology stack, or business discipline in natural language.',
      action: 'Route: /assessments/ai-generator',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const txt = document.querySelector('textarea');
      if (txt) txt.value = 'Design a FinOps and Cloud Cost Optimization assessment covering BigQuery slot commitments, compute rightsizing, and anomaly alerts.';
      const tiers = Array.from(document.querySelectorAll('div')).filter(d => d.innerText && d.innerText.includes('Tier 2: Deep-Dive'));
      if (tiers.length) tiers[0].click();
    });
    await sleep(1000);
    authorSteps.push({
      title: '2. Prompt Architecture & Depth Selection',
      desc: 'Choose diagnostic depth tier (Tier 1 Rapid, Tier 2 Deep-Dive, or Tier 3 Enterprise Audit).',
      action: 'Set Tier 2 (10-14 Questions) + Input Prompt',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/admin/questions`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: '3. Collaborative Question Manager',
      desc: 'Manage custom questions, adjust weighting, and define maturity level 1-5 criteria.',
      action: 'Route: /admin/questions',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const editBtn = document.querySelector('button[title*="Edit"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Edit'));
      if (editBtn) editBtn.click();
    });
    await sleep(1000);
    authorSteps.push({
      title: '4. Edit Scoring Criteria & Pain Points',
      desc: 'Fine-tune question text, add bespoke enterprise pain points, and adjust recommendations.',
      action: 'Modal: Edit Question Details',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/assessments`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: '5. Semantic Version Increments (v2.0 -> v2.1)',
      desc: 'Publishing edits automatically increments framework versions to preserve audit trails.',
      action: 'Inspect Framework Versioning Badges',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: '6. Stakeholder Feedback Collection',
      desc: 'Collect multi-stakeholder ratings, usability scores, and qualitative review comments.',
      action: 'Route: /feedback',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('02_vp_engineering_author_workflow', 'VP Engineering & Author', authorSteps);

    // =========================================================================
    // 3. CISO & ENTERPRISE SECOPS LEAD (6 Steps)
    // =========================================================================
    console.log('\n--- 3/4: Recording CISO & SecOps E2E Workflow ---');
    const cisoSteps = [];

    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 750));
    await sleep(800);
    cisoSteps.push({
      title: '1. 2D Enterprise Risk Matrix',
      desc: 'Identify critical security exposures and high-friction vulnerabilities across all pillars.',
      action: 'Tab 1: Capability vs Operational Risk Heatmap',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Question Responses Audit'));
      if (tab) tab.click();
    });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 300));
    await sleep(800);
    cisoSteps.push({
      title: '2. Granular Technical Friction Audit',
      desc: 'Examine unmanaged API keys, lack of DLP filtering, and prompt injection vulnerabilities.',
      action: 'Tab 5: Audit Technical Friction Callouts',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Architecture Evolution'));
      if (tab) tab.click();
    });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 1100));
    await sleep(800);
    cisoSteps.push({
      title: '3. Zero-Trust Perimeter & CMEK IaC',
      desc: 'Verify Terraform resources for VPC Service Controls perimeter and Cloud KMS encryption keyring.',
      action: 'Tab 2: Zero-Trust Security Perimeter Blueprint',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Roadmap & Persona Blueprints'));
      if (tab) tab.click();
    });
    await sleep(1500);
    await page.evaluate(() => {
      const secBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Architect & SecOps Playbook'));
      if (secBtn) secBtn.click();
    });
    await sleep(1000);
    cisoSteps.push({
      title: '4. SecOps Playbook & Compliance Sign-Off',
      desc: 'Review security controls for Model Armor, HIPAA/GDPR data masking, and IAM service accounts.',
      action: 'Tab 4: Architect & SecOps Playbook',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('03_ciso_secops_workflow', 'CISO & SecOps Lead', cisoSteps);

    // =========================================================================
    // 4. C-SUITE EXECUTIVE & FINOPS DIRECTOR (6 Steps)
    // =========================================================================
    console.log('\n--- 4/4: Recording C-Suite Executive & FinOps E2E Workflow ---');
    const execSteps = [];

    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    execSteps.push({
      title: '1. AI Executive Audio Briefing',
      desc: 'Listen to a 90-second synthesized C-suite narrative summarizing key ROI and risk mitigations.',
      action: 'Header: Click "Play Briefing"',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Financial Impact & TCO'));
      if (tab) tab.click();
    });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 450));
    await sleep(800);
    execSteps.push({
      title: '2. Quantified TCO & 4.6 Mo Payback',
      desc: 'Examine 3-year net value creation ($1.94M), annual savings ($360k), and rapid capital recovery.',
      action: 'Tab 3: Financial Impact & TCO Card',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const simBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('What-If Scenario Simulator'));
      if (simBtn) simBtn.click();
    });
    await sleep(1500);
    execSteps.push({
      title: '3. What-If Scenario Simulator',
      desc: 'Simulate live adjustments in prompt caching discounts and compute right-sizing.',
      action: 'Modal: Interactive What-If ROI Simulator',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Close') || b.innerText.includes('×'));
      if (closeBtn) closeBtn.click();
    });
    await sleep(800);
    await page.evaluate(() => {
      const presentBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Present Deck'));
      if (presentBtn) presentBtn.click();
    });
    await sleep(1500);
    execSteps.push({
      title: '4. Fullscreen Board Pitch Deck Mode',
      desc: 'Transform assessment findings into executive board slides ready for executive alignment.',
      action: 'Header: Click "Present Deck"',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const exitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Exit') || b.innerText.includes('Close') || b.innerText.includes('Back'));
      if (exitBtn) exitBtn.click();
    });
    await sleep(1000);
    execSteps.push({
      title: '5. 1-Click Deliverables Export',
      desc: 'Export executive PDF, Excel financial model, CSV datasets, Draw.io XML graph, and ZIP bundle.',
      action: 'Header: Click "Executive PDF" / "Excel" / "Bundle"',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('04_csuite_finops_workflow', 'C-Suite & FinOps', execSteps);

    console.log('\n🎉 ALL SCOREX DETAILED WORKFLOW FRAMES & GIFS RE-GENERATED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during workflow asset update:', err);
  } finally {
    await browser.close();
  }
})();
