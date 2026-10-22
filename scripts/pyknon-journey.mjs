import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const base = process.argv[2];
const out = process.argv[3];
await mkdir(out, { recursive: true });
const report = { checkedAt: new Date().toISOString(), base, configurations: [] };
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(base);
      const search = page.getByRole("searchbox", { name: "Find a tool" });
      await search.fill("tetrachords");
      const card = page.locator('[data-project="pyknon"]');
      await card.waitFor({ state: "visible" });
      assert.equal(await page.locator(".card:visible").count(), 1);
      const image = card.locator("img");
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((e) => e.decode());
      assert.equal(await image.evaluate((e) => e.complete && e.naturalWidth > 0), true);
      await page.evaluate(() => document.fonts.ready);
      if (name === "chromium") await page.screenshot({ path: `${out}/search-${width}.png` });
      const demo = card.getByRole("link", { name: "Live demo" });
      await demo.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL("**/pyknon/**");
      await page.waitForFunction(() => document.querySelector("#offline-status").textContent.startsWith("Ready offline"));
      assert.equal(await page.locator("[data-genus=enharmonic]").getAttribute("aria-pressed"), "true");
      const top = await page.locator("#listen-title").boundingBox();
      assert.ok(top.y >= -1 && top.y < 200);
      await page.locator("[data-play=close]").click();
      await page.waitForFunction(() => document.querySelectorAll(".sounding").length === 1);
      await page.locator("#stop").click();
      assert.equal(await page.locator("#play-status").innerText(), "Stopped.");
      await page.goto(base);
      await page.getByRole("searchbox", { name: "Find a tool" }).fill("tetrachords");
      const evidence = page.locator('[data-project="pyknon"] .card-study a');
      const expected = await evidence.getAttribute("href");
      await evidence.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(expected);
      const heading = page.getByRole("heading", { name: "What modern rounding removes", exact: true });
      await heading.waitFor();
      const h = await heading.boundingBox();
      assert.ok(h.y >= -2 && h.y < 900, `Pinned heading is outside viewport: ${h.y}`);
      assert.deepEqual(errors, []);
      report.configurations.push({
        browser: name,
        width,
        search: "tetrachords",
        matchingCards: 1,
        thumbnailLoaded: true,
        keyboardDemo: true,
        selectedGenus: "enharmonic",
        audibleComparisonAndStop: true,
        pinnedEvidence: expected,
        pinnedHeadingTop: h.y,
        pageErrors: errors,
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
await writeFile(`${out}/journeys.json`, JSON.stringify(report, null, 2) + "\n");
console.log(`Verified ${report.configurations.length} catalogue -> demo -> pinned-source journeys`);
