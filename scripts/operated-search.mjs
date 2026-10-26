import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium, firefox, expect } from "@playwright/test";
const base = process.argv[2],
  out = process.argv[3];
assert(base && out);
await mkdir(out, { recursive: true });
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8")),
  ids = ["pyknon", "gonia", "stoicheia", "grama", "haidao"],
  cases = [];
const extra = {
  haidao: ["HAIDAO", "Liu Hui", "sea-island", "海島算經", "海岛算经", "相多", "表間", "ground eyes"],
  pyknon: ["ΙΣΟΤΟΝΟΝ", "tetrachords", "Ptolemy ισοτονον"],
  gonia: [
    "trispastos",
    "pentaspaston",
    "religatur",
    "sucula",
    "pulley",
    "windlass",
    "Doric corner",
    "entasis",
    "fluting",
    "column",
    "sounding vessels",
    "paramese",
    "Greek pitch names",
    "resonance",
    "theatres",
    "column flute",
    "water screw",
    "stone transport",
    "1:12",
    "124.8",
    "Archimedes",
  ],
  stoicheia: [
    "two mean proportionals",
    "bisection",
    "complements",
    "Euclid X.2",
    "Euclid X.3",
    "σύμμετρα",
    "commensurable",
    "common measure",
    "anthyphairesis",
    "Euclid I.2",
    "restricted compass",
    "construction desk",
    "wrong branch",
    "Book X",
    "Archimedes circle",
    "κυκλου",
    "sphaerae",
    "591.15",
  ],
  grama: ["PANCAMA", "Grama", "पञ्चम"],
};
for (const [name, type] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await type.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } }),
        page = await context.newPage();
      try {
        await page.goto(base);
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        await search.waitFor();
        await page.locator('[data-group="Ancient world"]').click();
        const dataRequests = [];
        page.on("request", (r) => {
          if (new URL(r.url()).pathname.endsWith("projects.json")) dataRequests.push(r.url());
        });
        const url = page.url();
        let queries = 0;
        for (const id of ids) {
          const card = catalogue.find((p) => p.name === id);
          for (const query of [...new Set([...card.searchTerms, ...extra[id]])]) {
            await search.fill(query);
            await expect(page.locator(`[data-project="${id}"]`)).toBeVisible();
            await expect(search).toBeFocused();
            assert.equal(page.url(), url);
            queries++;
          }
          const query = {
            pyknon: "ῥυθμός",
            gonia: "religatur",
            stoicheia: "restricted compass",
            grama: "pañcama",
            haidao: "相多",
          }[id];
          await search.fill(query);
          const target = page.locator(`[data-project="${id}"]`);
          assert.equal(
            await target.getByRole("link", { name: "Live demo" }).getAttribute("href"),
            card.demoUrl,
          );
          assert.equal(await target.locator(".card-study a").getAttribute("href"), card.study.url);
          await target.locator("img").scrollIntoViewIfNeeded();
          await target.locator("img").evaluate((img) => img.decode());
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          if (name === "chromium") {
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: `${out}/${id}-${width}.png`, fullPage: true });
          }
        }
        await search.fill("music");
        for (const id of ["pyknon", "grama", "sammu", "pnigeus", "shiguzhai"])
          await expect(page.locator(`[data-project="${id}"]`)).toBeVisible();
        await page.locator('[data-group="AI engineering"]').click();
        for (const id of ids) await expect(page.locator(`[data-project="${id}"]`)).toBeHidden();
        assert.deepEqual(dataRequests, []);
        cases.push({
          browser: name,
          version: browser.version(),
          width,
          queries,
          sourceAndLegacyTermsAllFound: true,
          focusAndURLPreserved: true,
          musicFindsFiveLearningProjects: true,
          audienceFilterNarrows: true,
          additionalCatalogueRequests: 0,
        });
        console.log(`${name} ${width}: ${queries} source/legacy queries and five music projects`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  `${out}/search.json`,
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      base,
      scope:
        "Actual native search inputs; every indexed term of the five featured lessons plus explicit older-topic and unaccented queries, link identities, music discovery and audience narrowing",
      cases,
    },
    null,
    2,
  ) + "\n",
);
