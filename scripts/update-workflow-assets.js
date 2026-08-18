#!/usr/bin/env node

/**
 * ScoreX Automated Workflow Assets & GIF Generator
 * Automatically crawls the live portal, captures high-resolution frames for each persona,
 * updates the frame manifests, and compiles animated GIFs.
 * 
 * Usage:
 *   npm run update:workflows
 *   TEST_URL=https://scorex.up.railway.app npm run update:workflows
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

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(FRAMES_BASE_DIR)) fs.mkdirSync(FRAMES_BASE_DIR, { recursive: true });

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
    ctx.roundRect(width / 2 - 200, height - 42, 400, 32, 16);
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
  
  fs.writeFileSync(path.join(pDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`✅ [${personaName}] Successfully updated ${steps.length} frames and GIF -> ${gifPath}`);
  return manifest;
}

(async () => {
  console.log(`🚀 Starting ScoreX Workflow Automation against target: ${BASE_URL}...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1600, height: 1000 });

  try {
    // 1. CLOUD ARCHITECT WORKFLOW
    console.log('\n--- 1/4: Crawling Cloud & AI Solutions Architect Workflow ---');
    const architectSteps = [];

    await page.goto(`${BASE_URL}/assessments`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    architectSteps.push({
      title: 'Assessments Catalog Hub',
      desc: 'Browse multi-cloud architectures, GenAI migrations, and lakehouse blueprints.',
      action: 'Click "Start Assessment" or "Try Sample"',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/assessments/runner/openai_to_gemini_enterprise_migration`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    architectSteps.push({
      title: 'Interactive Diagnostic Question',
      desc: 'Move Baseline and Target sliders from Level 1 to 5 to evaluate technical capabilities.',
      action: 'Drag rating sliders across current vs future horizons',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb, idx) => { if (idx < 3) cb.click(); });
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.value = '42 production microservices running hardcoded OpenAI API keys, experiencing $185k/mo unmanaged cost spikes.';
    });
    await sleep(1000);
    architectSteps.push({
      title: 'Identify Pain Points & Architect Notes',
      desc: 'Select specific technical friction bottlenecks and enter operational environment context.',
      action: 'Select 5 Friction Checkboxes + Enter Context Note',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    architectSteps.push({
      title: 'Dimensional Gap Radar',
      desc: 'Analyze dimensional maturity gaps across 5 pillars against industry baseline benchmarks.',
      action: 'Tab 1: Executive Overview & Radar Polygon',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => window.scrollTo(0, 750));
    await sleep(800);
    architectSteps.push({
      title: '2D Capability vs. Risk Matrix',
      desc: 'Audit critical capability exposures, high-risk bottlenecks, and dimension health scores.',
      action: 'Audit 8 Identified Bottlenecks on Matrix',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Architecture Evolution'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: 'Draw.io Architecture Evolution',
      desc: 'Examine side-by-side Baseline Legacy Stack vs Desired Vertex AI Gemini Target Topology.',
      action: 'Tab 2: Compare Side-by-Side Architectures',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => window.scrollTo(0, 350));
    await sleep(1000);
    architectSteps.push({
      title: 'Target Topology Deep-Dive',
      desc: 'Inspect Gemini 2M Long-Context, Prompt Context Caching (75% savings), and Model Armor.',
      action: 'Inspect Target Mesh Node Specifications',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => window.scrollTo(0, 1000));
    await sleep(1000);
    architectSteps.push({
      title: '1-Click Terraform IaC Deployer',
      desc: 'Auto-generate production-grade Terraform HCL for Vertex AI, CMEK, and Apigee AI Gateway.',
      action: 'Review and Copy Terraform Infrastructure Code',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Roadmap & Persona Blueprints'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: 'Engineering Roadmap & Milestones',
      desc: 'Review 3-phase transformation execution plan with timeline gates and deliverables.',
      action: 'Tab 4: Roadmap & Transformation Blueprints',
      buffer: await page.screenshot()
    });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.innerText.includes('Question Responses Audit'));
      if (tab) tab.click();
    });
    await sleep(1500);
    architectSteps.push({
      title: 'Granular Question & Friction Audit',
      desc: 'Review all questions, rating baselines, technical friction tags, and operational notes in Light Theme.',
      action: 'Tab 5: Light-Theme Granular Audit Record',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('01_cloud_architect_workflow', 'Cloud Architect Workflow', architectSteps);

    // 2. VP ENGINEERING & AUTHOR WORKFLOW
    console.log('\n--- 2/4: Crawling VP Engineering & Author Workflow ---');
    const authorSteps = [];

    await page.goto(`${BASE_URL}/assessments/ai-generator`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: 'AI Assessment Generator',
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
      title: 'Prompt Architecture & Depth Selection',
      desc: 'Choose diagnostic depth tier (Tier 1 Rapid, Tier 2 Deep-Dive, or Tier 3 Enterprise Audit).',
      action: 'Set Tier 2 (10-14 Questions) + Input Prompt',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/admin/questions`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: 'Collaborative Question Manager',
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
      title: 'Edit Scoring Criteria & Pain Points',
      desc: 'Fine-tune question text, add bespoke enterprise pain points, and adjust recommendations.',
      action: 'Modal: Edit Question Details',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/assessments`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: 'Semantic Version Increments',
      desc: 'Publishing edits automatically increments framework versions (v2.0 -> v2.1) to preserve audit trails.',
      action: 'Inspect Framework Versioning Badges',
      buffer: await page.screenshot()
    });

    await page.goto(`${BASE_URL}/feedback`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    authorSteps.push({
      title: 'Stakeholder Feedback Collection',
      desc: 'Collect multi-stakeholder ratings, usability scores, and qualitative review comments.',
      action: 'Route: /feedback',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('02_vp_engineering_author_workflow', 'VP Engineering & Author', authorSteps);

    // 3. CISO & SECOPS WORKFLOW
    console.log('\n--- 3/4: Crawling CISO & SecOps Workflow ---');
    const cisoSteps = [];

    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 750));
    await sleep(800);
    cisoSteps.push({
      title: '2D Enterprise Risk Matrix',
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
      title: 'Granular Technical Friction Audit',
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
      title: 'Zero-Trust Perimeter & CMEK IaC',
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
      title: 'SecOps Playbook & Compliance Sign-Off',
      desc: 'Review security controls for Model Armor, HIPAA/GDPR data masking, and IAM service accounts.',
      action: 'Tab 4: Architect & SecOps Playbook',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('03_ciso_secops_workflow', 'CISO & SecOps Lead', cisoSteps);

    // 4. C-SUITE & FINOPS WORKFLOW
    console.log('\n--- 4/4: Crawling C-Suite Executive & FinOps Workflow ---');
    const execSteps = [];

    await page.goto(`${BASE_URL}/assessments/report/${INST_ID}`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    execSteps.push({
      title: 'AI Executive Audio Briefing',
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
      title: 'Quantified TCO & 4.6 Mo Payback',
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
      title: 'What-If Scenario Simulator',
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
      title: 'Fullscreen Board Pitch Deck Mode',
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
      title: '1-Click Deliverables Export',
      desc: 'Export executive PDF, Excel financial model, CSV datasets, Draw.io XML graph, and ZIP bundle.',
      action: 'Header: Click "Executive PDF" / "Excel" / "Bundle"',
      buffer: await page.screenshot()
    });

    await saveFramesAndGif('04_csuite_finops_workflow', 'C-Suite & FinOps', execSteps);

    console.log('\n🎉 ALL SCOREX WORKFLOW ASSETS UPDATED & SYNCHRONIZED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during workflow asset update:', err);
  } finally {
    await browser.close();
  }
})();
