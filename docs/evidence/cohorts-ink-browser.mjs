// Inspect the changed catalogue cards after loading both thumbnails, then offline.
// node docs/evidence/cohorts-ink-browser.mjs BASE_URL OUTPUT_DIR
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const [base, output] = process.argv.slice(2);
assert(base && output, "BASE_URL OUTPUT_DIR");
await mkdir(output, { recursive: true });
const catalogue = JSON.parse(await readFile(new URL("../../public/projects.json", import.meta.url)));
const targets = ["errorbars", "fieldproof"].map(name => catalogue.find(project => project.name === name));
const views = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: width === 1440 ? "light" : "dark" });
      try {
        const page = await context.newPage(), errors = [], requests = [];
        let offline = false;
        page.on("pageerror", error => errors.push(error.message));
        page.on("request", request => { if (offline) requests.push(request.url()); });
        await page.addInitScript(() => {
          window.catalogueCsp = [];
          document.addEventListener("securitypolicyviolation", event => window.catalogueCsp.push(event.violatedDirective));
        });
        await page.goto(base);
        for (const project of targets) {
          await page.locator("#tool-search").fill(project.name);
          await page.locator(`[data-project="${project.name}"] img`).evaluate(async image => { await image.decode(); });
        }
        await page.evaluate(() => document.fonts.ready);
        await context.setOffline(true); offline = true;
        const cards = [];
        for (const project of targets) {
          await page.locator("#tool-search").fill(project.name === "errorbars" ? "441/500" : "fieldproof");
          const card = page.locator(`[data-project="${project.name}"]`);
          await expect(page.locator(".card:visible")).toHaveCount(1);
          await expect(card.locator(".card-desc")).toHaveText(project.description);
          await expect(card.locator(".card-study a")).toHaveAttribute("href", project.study.url);
          await expect(card.locator(".card-study")).toContainText(project.study.finding);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map(item => item.id), []);
          await card.screenshot({ path: resolve(output, `${engine}-${width}-${project.name}.png`) });
          cards.push({ name: project.name, finding: project.study.finding, source: project.study.url });
        }
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        assert.deepEqual(await page.evaluate(() => window.catalogueCsp), []);
        views.push({ engine, width, theme: width === 1440 ? "light" : "dark", cards, offlineRequests: requests, pageErrors: errors, cspViolations: [], axeViolations: [] });
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
}
await writeFile(resolve(output, "browser.json"), JSON.stringify({ base, scope: "Two visited catalogue cards; search and source links offline after loading both thumbnails and fonts.", views }, null, 2) + "\n");
console.log(JSON.stringify(views.map(({ engine, width, cards }) => ({ engine, width, cards: cards.map(card => card.name) }))));
