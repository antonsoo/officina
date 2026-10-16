// Follow the actual catalogue link and compare the hosted offline download.
// node docs/evidence/prompt-pacing-browser.mjs BASE OUT_DIR
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { chromium, firefox } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const [base, output] = process.argv.slice(2);
await mkdir(output, { recursive: true });
const expectedUrl = "https://raw.githubusercontent.com/antonsoo/stutterscope/a66f2cbe27fd410fc41d0900c4d62cd89e46c298/studies/present-clock/results/after.json";
const response = await fetch(expectedUrl); assert(response.ok);
const expectedBytes = Buffer.from(await response.arrayBuffer());
const expected = JSON.parse(expectedBytes).cases.find(c => c.name === "test_case_5_v1-exclude-dropped").report;
const source = { ...expected.source, fileName: "filtered-presents.csv" };
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const views = [];
for (const [engine, type] of [["chromium", chromium], ["firefox", firefox]]) {
  const browser = await type.launch();
  for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: width === 1440 ? "dark" : "light" });
    const page = await context.newPage(), errors = [], csp = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", e => {
      window.__cspErrors = [...(window.__cspErrors ?? []), e.violatedDirective];
    }));
    await page.goto(base);
    await page.locator('[data-project="contextscope"] .card-desc').filter({ hasText: "media" }).waitFor();
    await page.locator("#tool-search").fill("filtered");
    const card = page.locator('[data-project="stutterscope"]');
    await card.waitFor(); await page.evaluate(() => document.fonts.ready);
    assert.equal(await card.getByRole("link", { name: "Live demo", exact: true }).getAttribute("href"), "https://antonsoo.github.io/stutterscope/?example=filtered-presents");
    await card.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`) });
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map(v => v.id), []);
    csp.push(...await page.evaluate(() => window.__cspErrors ?? []));
    await card.getByRole("link", { name: "Live demo", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".run-meta strong")?.textContent === "filtered-presents.csv" && !document.querySelector("#apply-settings-btn")?.disabled);
    await page.evaluate(() => document.fonts.ready);
    await context.setOffline(true);
    const pending = page.waitForEvent("download"); await page.locator("#export-json-btn").click();
    const bytes = await readFile(await (await pending).path()), actual = JSON.parse(bytes);
    assert.deepEqual(actual.source, source);
    for (const key of ["analysis", "episodes", "schemaVersion"]) assert.deepEqual(actual[key], expected[key]);
    assert.deepEqual(actual.metrics, expected.summary);
    await writeFile(resolve(output, `${engine}-${width}.json`), bytes);
    await page.locator(".timing-note summary").click();
    await page.locator(".timing-note").screenshot({ path: resolve(output, `${engine}-${width}-witnesses.png`) });
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations.map(v => v.id), []);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    csp.push(...await page.evaluate(() => window.__cspErrors ?? []));
    assert(fits); assert.deepEqual(errors, []); assert.deepEqual(csp, []);
    views.push({ engine, width, catalogueLinkFollowed: true, hostedInput: "filtered-presents.csv", completeReportMatches: true,
      offlineJsonSha256: hash(bytes), pacing: actual.metrics.pacingCoverage, witnessCount: actual.source.presentClockEvidence.witnesses.length,
      omittedWitnesses: actual.source.presentClockEvidence.omittedWitnesses, axeViolations: [], noPageOverflow: fits, pageErrors: errors, cspViolations: csp });
    await context.close();
  }
  await browser.close();
}
await writeFile(resolve(output, "browser.json"), JSON.stringify({ base, expectedUrl, expectedSha256: hash(expectedBytes), views }, null, 2) + "\n");
console.log(JSON.stringify(views.map(v => ({ engine: v.engine, width: v.width, pacing: v.pacing, completeReportMatches: v.completeReportMatches }))));
