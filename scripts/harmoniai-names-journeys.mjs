import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [base, output] = process.argv.slice(2);
assert(base && output, "Supply catalogue URL and receipt directory");
await mkdir(output, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const rows = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  if (process.env.REVIEW_BROWSER && process.env.REVIEW_BROWSER !== engine) continue;
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      await page.getByRole("link", { name: "Hear the two Dorians" }).focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#compare-finding")).toContainText("Degrees 2 and 6 differ");
      await page.goto(base);
      const row = page.locator('[data-project="harmoniai"] [data-workshop="names"]');
      const terms = ["which Dorian", "same starting pitch", "ἡμιτόνιον", "βαρύ", "ὀξύ"];
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(page.url(), base);
      }
      await page.locator("#tool-search").fill("ἡμιτόνιον");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "ἡμιτόνιον");
      await page.goto(shared);
      const destination = await row.locator(".workshop-demo").getAttribute("href");
      const review = await row.locator(".workshop-review").getAttribute("href");
      const commit = /\/blob\/([a-f0-9]{40})\/docs\/name-audit.md#try-the-actual-work$/.exec(review)?.[1];
      assert(commit);
      const expected = execFileSync("git", ["-C", "../harmoniai", "show", `${commit}:docs/name-audit.md`]);
      const response = await fetch(`https://raw.githubusercontent.com/antonsoo/harmoniai/${commit}/docs/name-audit.md`);
      assert.equal(response.status, 200);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
      await row.locator("img").evaluate((img) => img.decode());
      await page.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`), fullPage: true });
      await row.locator(".workshop-review").focus(); await page.keyboard.press("Enter");
      await expect(page).toHaveURL(review);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus(); await page.keyboard.press("Enter");
      await expect(page).toHaveURL(destination);
      await page.locator("#compare-both").focus(); await page.keyboard.press("Enter");
      try { await page.waitForFunction(() => document.querySelector("audio").currentTime > 0.1, null, {timeout: 10000}); }
      catch (error) {
        console.error(await page.locator("audio").evaluate((a) => ({currentTime:a.currentTime,paused:a.paused,error:a.error?.message,readyState:a.readyState,networkState:a.networkState,active:document.activeElement?.outerHTML,label:document.querySelector("#audio-label")?.textContent})));
        throw error;
      }
      await page.locator("#compare-stop").click();
      await page.locator("#compare-relation").selectOption("pattern");
      await expect(page.locator("#compare-finding")).toContainText("All eight pitches agree");
      await page.locator("#compare-relation").selectOption("name");
      await page.locator("#source-load").click();
      await expect(page.locator("#source-status")).toContainText("Printed page 198.");
      const sourceBytes = await page.locator("#source-image").evaluate(async (image) => {
        await image.decode();
        return Array.from(new Uint8Array(await (await fetch(image.src)).arrayBuffer()));
      });
      const sourceHash = hash(Buffer.from(sourceBytes));
      assert.equal(sourceHash, "e07ac24e749ae55c35a67573e2a1e873be467ca4f27fde6ee2cb80f35e29082e");
      const pending = page.waitForEvent("download"); await page.locator("#save-wave").click();
      const saved = await pending; assert.equal(await saved.failure(), null);
      const waveHash = hash(await readFile(await saved.path()));
      assert.equal(waveHash, "8290ac5d8a433e2837918109d788fa19368ab86502049fb7a52b62d225498aad");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      rows.push({ engine, version: browser.version(), width, terms, shared, destination, review, reviewSha256: hash(expected), sourceHash, waveHash, errors });
      await context.close();
      await writeFile(resolve(output, "review.json"), `${JSON.stringify({ base, rows }, null, 2)}\n`);
      console.log(engine, width, "selected link, Greek search, pinned source, actual audio and page verified");
    }
  } finally { await browser.close(); }
}
