// URL OUTPUT before|after: actual catalogue searches for published native workflows.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox } from "@playwright/test";

const [base, output, phase] = process.argv.slice(2);
assert(base && output && ["before", "after"].includes(phase));
await mkdir(output, { recursive: true });
const queries = [
  ["MLflow", "trainspotter"],
  ["native NUnit", "flakemap"],
  ["PresentMon 2.6", "stutterscope"],
];
const records = [];
for (const [engine, launch] of Object.entries({ chromium, firefox })) {
  const browser = await launch.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        const page = await context.newPage(),
          errors = [],
          catalogueRequests = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(base);
        await page.locator('[data-project="trainspotter"]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        page.on("request", (request) => {
          if (request.url().includes("projects.json")) catalogueRequests.push(request.url());
        });
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        const cases = [];
        for (const [query, name] of queries) {
          await search.fill(query);
          await page.evaluate(
            () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
          );
          assert.equal(await page.locator(".card:visible").count(), phase === "before" ? 0 : 1);
          let finding, studyUrl;
          if (phase === "after") {
            const card = page.locator(`[data-project="${name}"]`);
            await card.scrollIntoViewIfNeeded();
            await card.locator("img").evaluate((image) => image.decode());
            await card.locator(".card-links").scrollIntoViewIfNeeded();
            await card.evaluate((node) => node.scrollIntoView({ block: "center" }));
            await page.evaluate(
              () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
            );
            finding = await card.locator(".card-study").innerText();
            studyUrl = await card.locator(".card-study a").getAttribute("href");
            assert.match(studyUrl, /github\.com\/antonsoo\/[^/]+\/tree\/[a-f0-9]{40}\/studies\//);
            assert.equal(
              await card.locator(".card-links a").evaluateAll((links) =>
                links.every((link) => {
                  const box = link.getBoundingClientRect();
                  return link.contains(
                    document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2),
                  );
                }),
              ),
              true,
            );
            await page.screenshot({
              path: resolve(output, `${engine}-${width}-${name}.png`),
              animations: "disabled",
            });
          }
          cases.push({ query, name, visibleProjects: phase === "before" ? 0 : 1, finding, studyUrl });
        }
        if (phase === "after") {
          await context.setOffline(true);
          for (const [query, name] of queries) {
            await search.fill(query);
            await page.evaluate(
              () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
            );
            assert.equal(await page.locator(".card:visible").count(), 1);
            assert.equal(await page.locator(`[data-project="${name}"]`).isVisible(), true);
          }
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.deepEqual(errors, []);
        assert.deepEqual(catalogueRequests, []);
        records.push({
          engine,
          browserVersion: browser.version(),
          width,
          cases,
          offlineRefilter: phase === "after",
          catalogueRequests,
          errors,
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
  resolve(output, "receipt.json"),
  JSON.stringify(
    {
      checkedAtUtc: new Date().toISOString(),
      base,
      phase,
      scope:
        "Actual served catalogue, three native-workflow queries in both engines and widths; no application assets or search responses mocked.",
      records,
    },
    null,
    2,
  ) + "\n",
);
console.log(`${phase}: ${records.length * queries.length} actual native-workflow searches`);
