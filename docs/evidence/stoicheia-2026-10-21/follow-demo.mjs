import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";

const [
  base = "https://antonsoo.github.io/officina/",
  output = "docs/evidence/stoicheia-2026-10-21/demo.json",
] = process.argv.slice(2);
const catalogue = JSON.parse(
  await readFile(new URL("../../../public/projects.json", import.meta.url), "utf8"),
);
const entry = catalogue.find((p) => p.name === "stoicheia");
assert.ok(entry?.demoUrl);
const records = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(String(error)));
        await page.goto(base);
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        const queries = ["Euclid Greek", "Latin", "angle bisection", "circle crossings"];
        for (const query of queries) {
          await search.fill(query);
          await page.locator('[data-project="stoicheia"]:visible').waitFor();
          assert.equal(await page.locator(".card:visible").count(), 1, query);
        }
        await page.getByRole("button", { name: /^Ancient world \d+$/ }).click();
        const card = page.locator('[data-project="stoicheia"]');
        assert.equal(await page.locator(".card:visible").count(), 1);
        await card.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const image = document.querySelector('[data-project="stoicheia"] img');
          return image?.complete && image.naturalWidth === 1200 && image.naturalHeight === 750;
        });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const link = card.getByRole("link", { name: "Live demo", exact: true });
        assert.equal(await link.getAttribute("href"), entry.demoUrl);
        await link.focus();
        const [response] = await Promise.all([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          page.keyboard.press("Enter"),
        ]);
        assert.equal(response.status(), 200);
        const target = new URL(entry.demoUrl);
        const opened = new URL(page.url());
        assert.equal(opened.origin + opened.pathname, target.origin + target.pathname);
        const openedState = new URLSearchParams(opened.hash.slice(1));
        for (const [key, value] of new URLSearchParams(target.hash.slice(1)))
          assert.equal(openedState.get(key), value);
        await page.locator("#variant").waitFor();
        assert.equal(await page.locator("#step-position").innerText(), "Step 8 of 9");
        assert.equal(await page.locator("#angle").inputValue(), "90");
        assert.equal(await page.locator("#variant").inputValue(), "0");
        await page.locator("#parameters summary").click();
        assert.match(await page.locator("#measurements").innerText(), /45.00/);
        await page.locator("#variant").selectOption("1");
        assert.match(await page.locator("#diagram-notice").innerText(), /opposite bisector ray/);
        assert.match(await page.locator("#measurements").innerText(), /135.00/);
        assert.doesNotMatch(await page.locator("#equations").innerText(), /½/);
        await page.locator("#variant").selectOption("0");
        assert.equal(await page.locator("#hypothesis-warning").isHidden(), true);
        assert.match(await page.locator("#measurements").innerText(), /45.00/);
        await page.locator("#current-passage [data-source]").first().click();
        await page.waitForFunction(() => {
          const image = document.querySelector("#source-image");
          return image?.complete && image.naturalWidth > 0;
        });
        const sourceImage = await page.locator("#source-image").getAttribute("src");
        assert.deepEqual(errors, []);
        records.push({
          engine,
          version: browser.version(),
          width,
          queries,
          group: entry.group,
          keyboardEnter: true,
          demoUrl: entry.demoUrl,
          proposition: 9,
          step: 8,
          givenAngle: 90,
          internalAngles: [45, 45],
          alternateAngles: [135, 135],
          withheldAlternateConclusion: true,
          restoredInternalBisector: true,
          sourceImage,
          pageErrors: errors.length,
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
  output,
  JSON.stringify({ checkedAt: new Date().toISOString(), base, records }, null, 2) + "\n",
);
console.log(
  `${records.length} catalogue-to-course keyboard journeys passed, including both circle crossings and a printed source page.`,
);
