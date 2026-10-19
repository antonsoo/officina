/* global window, document, innerWidth */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const [url, directory, phase] = process.argv.slice(2);
assert(url && directory && ["before", "after"].includes(phase));
const output = resolve(directory);
await mkdir(output, { recursive: true });
const workflows = [];
for (const [engine, type] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await type.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: width === 375 ? "light" : "dark",
        reducedMotion: "reduce",
      });
      const errors = [],
        catalogueRequests = [];
      context.on("page", (p) => p.on("pageerror", (error) => errors.push(error.message)));
      await context.addInitScript(() => {
        window.nextBatchPolicy = [];
        document.addEventListener("securitypolicyviolation", (event) =>
          window.nextBatchPolicy.push(event.violatedDirective),
        );
      });
      try {
        const page = await context.newPage();
        await page.goto(url);
        await page.locator('[data-project="am-i-unlucky"]').waitFor();
        page.on("request", (request) => {
          if (request.url().includes("projects.json")) catalogueRequests.push(request.url());
        });
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        await search.fill("community-logged");
        await expect(page.locator(".card:visible")).toHaveCount(1);
        await expect(page.locator('[data-project="am-i-unlucky"]')).toBeVisible();
        await search.fill("weekly reset");
        await expect(page.locator(".card:visible")).toHaveCount(phase === "before" ? 0 : 1);
        let finding, studyUrl, demoUrl;
        let navigationCatalogueRequests = [];
        if (phase === "after") {
          const card = page.locator('[data-project="am-i-unlucky"]');
          await expect(card).toBeVisible();
          await card.locator("img").evaluate((image) => image.decode());
          finding = await card.locator(".card-study").innerText();
          studyUrl = await card.locator(".card-study a").getAttribute("href");
          assert.match(studyUrl, /\/tree\/[a-f0-9]{40}\/studies\/next-batch$/);
          const demo = card.getByRole("link", { name: "Live demo", exact: true });
          demoUrl = await demo.getAttribute("href");
          await demo.scrollIntoViewIfNeeded();
          await card.evaluate((node) => node.scrollIntoView({ block: "center" }));
          await page.evaluate(() => document.fonts.ready);
          const shot = (engine === "chromium" && width === 1440) || (engine === "firefox" && width === 375);
          if (shot) await page.screenshot({ path: join(output, `${engine}-${width}-card.png`) });
          assert.deepEqual(catalogueRequests, []);
          assert.deepEqual(await page.evaluate(() => window.nextBatchPolicy), []);
          await Promise.all([page.waitForURL(demoUrl), demo.click()]);
          const child = page;
          await expect(child.getByTestId("expected-days")).toHaveText("9 days");
          await expect(child.getByLabel("First batch (day)", { exact: true })).toHaveValue("2");
          await expect(child.getByTestId("budget-chance")).toHaveText("50%");
          await expect(child.getByTestId("p90")).toHaveText("23 days");
          assert.equal(await child.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          assert.deepEqual(await child.evaluate(() => window.nextBatchPolicy), []);
          await child.evaluate(() => document.fonts.ready);
          if (shot)
            await child.screenshot({ path: join(output, `${engine}-${width}-app.png`), fullPage: true });
          await page.goBack();
          await page.locator('[data-project="am-i-unlucky"]').waitFor();
          // Returning may restore the document or reload its catalogue. Those
          // navigation requests are separate from local search filtering.
          navigationCatalogueRequests = catalogueRequests.splice(0);
          await search.fill("weekly reset");
          await page.locator('[data-project="am-i-unlucky"] img').evaluate((image) => image.decode());
          assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
          await context.setOffline(true);
          await search.fill("weekly");
          await search.fill("weekly reset");
          await expect(page.locator(".card:visible")).toHaveCount(1);
        }
        assert.deepEqual(errors, []);
        assert.deepEqual(catalogueRequests, []);
        assert.deepEqual(await page.evaluate(() => window.nextBatchPolicy), []);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        workflows.push({
          engine,
          version: browser.version(),
          width,
          query: "weekly reset",
          visibleProjects: phase === "before" ? 0 : 1,
          finding,
          studyUrl,
          demoUrl,
          actualLinkedAppMean: phase === "after" ? "9 days" : null,
          actualLinkedAppFirstDay: phase === "after" ? 2 : null,
          actualLinkedAppBudgetChance: phase === "after" ? "50%" : null,
          offlineRefilter: phase === "after",
          priorLoggedPityDiscoveryRetained: true,
          navigationCatalogueRequests,
          errors,
          catalogueRequests,
          csp: [],
          overflow: false,
        });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  join(output, "receipt.json"),
  JSON.stringify(
    {
      checkedAtUtc: new Date().toISOString(),
      url,
      phase,
      scope:
        "Actual catalogue searches and clicked public-demo navigation, not mocked links or app responses. Linked input is a constructed independent weekly model, not game history.",
      workflows,
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify({ phase, workflows: workflows.length, linkedAppVerified: phase === "after" }));
