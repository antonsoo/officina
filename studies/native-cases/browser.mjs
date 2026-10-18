// Search the real catalogue for the native workflows surfaced by this update.
/* global document, innerWidth */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';
import { resolve } from 'node:path';
const [url, outArg] = process.argv.slice(2); assert.ok(url && outArg);
const out = resolve(outArg); await mkdir(out, { recursive: true });
const catalogue = JSON.parse(await readFile(new URL('../../public/projects.json', import.meta.url)));
const inputs = [['Zod', 'mcplint'], ['MCP URLs', 'contextscope'], ['HAR credentials', 'veil'], ['quoted W&B CSV', 'trainspotter']];
const results = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
 const browser = await launcher.launch();
 try {
  for (const width of [1440, 375]) {
   const context = await browser.newContext({ viewport: { width, height: 1000 } });
   try {
    const page = await context.newPage(), errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url); await page.locator('.card').first().waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode(); })); }); await page.waitForLoadState('networkidle');
    await context.setOffline(true); context.on('request', request => requests.push(request.url()));
    const cases = [];
    for (const [query, name] of inputs) {
     const search = page.getByRole('searchbox', { name: 'Find a tool' });
     await search.fill(query); await search.focus(); await page.keyboard.press('Enter');
     const card = page.locator('.card:visible'); assert.equal(await card.count(), 1);
     const data = catalogue.find(p => p.name === name);
     assert.equal(await card.locator('h3').innerText(), name);
     assert.equal(await card.getByRole('link', { name: 'Live demo', exact: true }).getAttribute('href'), data.demoUrl);
     await card.scrollIntoViewIfNeeded();
     await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
     assert.equal(await card.locator('.card-study a').getAttribute('href'), data.study.url);
     assert.ok((await card.innerText()).includes(data.study.finding));
     assert.equal(await search.evaluate(el => document.activeElement === el), true);
     assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
     await page.evaluate(async () => { globalThis.scrollTo(0, 0); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
     await page.screenshot({ fullPage: true, path: resolve(out, `${engine}-${width}-${name}.png`) });
     cases.push({ query, name, evidenceUrl: data.study.url, finding: data.study.finding, exactCard: true });
    }
    assert.deepEqual(errors, []); assert.deepEqual(requests, []);
    results.push({ engine, version: browser.version(), width, cases, offlineFilteringAfterThumbnailWarmup: true, errors, requests });
   } finally { await context.close(); }
  }
 } finally { await browser.close(); }
}
await writeFile(resolve(out, 'browser.json'), JSON.stringify({ url, results }, null, 2) + '\n');
console.log(JSON.stringify({ views: 16, engines: ['chromium', 'firefox'], widths: [1440, 375] }));
