import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const base = process.argv[2],
  out = process.argv[3];
assert(base && out);
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const queries = {
  gonia: ["one twelfth", "perpendiculum", "sight lines", "trispastos", "paramese"],
};
const records = [];
await mkdir(out, { recursive: true });
async function activate(page, link, url) {
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  const hit = await link.evaluate((e) =>
    [...e.getClientRects()].some((r) =>
      e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)),
    ),
  );
  assert(hit);
  assert.equal(await link.getAttribute("href"), url);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 45000 }),
    page.keyboard.press("Enter"),
  ]);
  assert.equal(page.url(), url);
}
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      try {
        for (const [id, terms] of Object.entries(queries)) {
          const entry = catalogue.find((e) => e.name === id);
          assert(entry);
          const page = await context.newPage();
          await page.goto(base);
          const search = page.getByRole("searchbox", { name: "Find a tool" });
          await page.locator('[data-group="Ancient world"]').click();
          const initialURL = page.url(),
            requests = [];
          page.on("request", (r) => {
            if (new URL(r.url()).pathname.endsWith("projects.json")) requests.push(r.url());
          });
          for (const query of terms) {
            await search.fill(query);
            await expect(page.locator(`[data-project="${id}"]`)).toBeVisible();
            await expect(search).toBeFocused();
            assert.equal(page.url(), initialURL);
          }
          await search.fill(terms[0]);
          const card = page.locator(`[data-project="${id}"]`);
          await card.locator("img").scrollIntoViewIfNeeded();
          await card.locator("img").evaluate((img) => img.decode());
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          assert.deepEqual(requests, []);
          if (name === "chromium") {
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.screenshot({ path: path.join(out, `${id}-${width}.png`), fullPage: true });
          }
          await activate(page, card.getByRole("link", { name: "Live demo", exact: true }), entry.demoUrl);
          assert.equal(await page.locator("#vp-distance").inputValue(), "300");
          await expect(page.locator("#vp-latin")).toContainText("ad perpendiculum et normam");
          await page.locator("#vp-find").focus();
          await page.keyboard.press("Enter");
          assert.equal(await page.locator("#vp-distance").inputValue(), "1248");
          await expect(page.locator("#vp-finding")).toContainText("equal lengths");
          await page.locator("#vp-distance").focus();
          await page.keyboard.press("ArrowRight");
          assert.equal(await page.locator("#vp-distance").inputValue(), "1249");
          await expect(page.locator("#vp-finding")).toContainText("upper ray is shorter");
          const operated =
            "Source 1:12 lean: equal rays at 124.8 m, upper ray shorter one decimetre farther; selected Latin retained";
          await page.goto(base);
          await page.getByRole("searchbox", { name: "Find a tool" }).fill(terms[0]);
          const study = page.locator(`[data-project="${id}"] .card-study a`);
          await activate(page, study, entry.study.url);
          await page
            .getByRole("heading", { name: "What a learner can do", exact: true })
            .first()
            .waitFor({ timeout: 30000 });
          records.push({
            browser: name,
            version: browser.version(),
            width,
            project: id,
            queries: terms,
            nativeSearch: true,
            focusAndURLPreserved: true,
            extraCatalogueRequests: 0,
            thumbnailDecoded: true,
            demoKeyboardEnter: true,
            demoURL: entry.demoUrl,
            operated,
            studyKeyboardEnter: true,
            pinnedStudyURL: entry.study.url,
            pinnedHeading: "What a learner can do",
          });
          await page.close();
          console.log(`${name} ${width}: ${id} search, native lesson operation and pinned source heading`);
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  path.join(out, "replay.json"),
  `${JSON.stringify({ checkedAtUtc: new Date().toISOString(), base, records, scope: "Native catalogue search and focus, keyboard activation of the live lesson and pinned GitHub evidence, one substantive operation in each actual hosted application. No release or deployment claim is derived from search alone." }, null, 2)}\n`,
);
