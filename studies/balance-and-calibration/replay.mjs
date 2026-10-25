import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const base = process.argv[2],
  out = process.argv[3];
assert(base && out);
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const queries = {
  dioptra: ["hodometer", "πειρα", "changing flow", "tunnel survey"],
  zygon: ["Archimedes balance", "sphere volume", "διπλασια", "τετραπλασιων"],
  shiguzhai: ["Kaogongji", "銑間", "remove two parts", "269 Hz"],
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
          let operated;
          if (id === "dioptra") {
            await expect(page.locator("#ct-indicated")).toContainText("1,200");
            const divisions = (await page.locator("#ct-combination").textContent()).split(
              " Each fine division",
            )[0];
            for (let i = 0; i < 20; i++) await page.locator("#ct-probe-step").click();
            await expect(page.locator("#ct-apply")).toBeEnabled();
            await page.locator("#ct-apply").click();
            await expect(page.locator("#ct-indicated")).toContainText("800");
            assert.equal(
              (await page.locator("#ct-combination").textContent()).split(" Each fine division")[0],
              divisions,
            );
            operated =
              "Twenty shaft turns, measured graduation applied, 1200 to 800 cubits with fixed division readout";
          } else if (id === "zygon") {
            assert.equal(await page.locator("#count").inputValue(), "8");
            await expect(page.locator("#stack-report")).toContainText("43/32");
            await page.locator("#count").selectOption("16");
            await expect(page.locator("#stack-report")).toContainText("171/128");
            assert.equal(
              await page.locator("#left-moment").textContent(),
              await page.locator("#right-moment").textContent(),
            );
            operated = "Eight to sixteen finite bands; changed volume estimate with equal turning moments";
          } else {
            assert.equal(await page.locator("#bell").inputValue(), "p08");
            await expect(page.locator("#a-hz")).toContainText("1214.1");
            await expect(page.locator(".chinese")).toContainText("鼓間");
            await page.locator("#rule").selectOption("fixed");
            await expect(page.locator("#dimension-figure")).toContainText("6.5 / 6");
            await page.locator("#next").click();
            await expect(page.locator(".chinese")).toContainText("舞廣");
            operated = "Piao-shi No. 8, original-parts reading and next Chinese craft clause";
          }
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
