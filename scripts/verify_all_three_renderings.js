const puppeteer = require('/Users/nitinagga/Documents/PromptCanvas/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1200']
  });

  const testCases = [
    {
      name: '01_lakehouse_target_state_render',
      url: 'http://localhost:5001/assessments/report/inst_edw_lakehouse_to_bigquery_modernization_demo'
    },
    {
      name: '02_finops_target_state_render',
      url: 'http://localhost:5001/assessments/report/inst_finops_cloud_cost_optimization_demo'
    },
    {
      name: '03_agentic_target_state_render',
      url: 'http://localhost:5001/assessments/report/inst_agentic_ai_mesh_mcp_banking_readiness_demo'
    }
  ];

  for (const tc of testCases) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1200 });

    console.log(`Navigating to ${tc.url}...`);
    await page.goto(tc.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Click "Target Architecture" tab
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('Target Architecture')) {
        await tab.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));

    // Click "Desired Future State Diagram" button to switch from split view to 100% full view
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Desired Future State Diagram')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to diagram
    await page.evaluate(() => window.scrollBy(0, 450));
    await new Promise(r => setTimeout(r, 1000));

    const outPath = `scratch/screenshots_blueprints/${tc.name}.png`;
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${outPath}`);
    await page.close();
  }

  await browser.close();
  process.exit(0);
})();
