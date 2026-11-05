import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert(catalogue && output, "Supply catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const lessonRepo = fileURLToPath(new URL("../../akzent", import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const records = [];
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1100 }, acceptDownloads: true });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(catalogue);
      const row = page.locator('[data-project="akzent"] [data-workshop="next-reading"]');
      for (const term of [
        "next consonant",
        "accent positions",
        "worst case",
        "which consonant",
        "information loss",
      ]) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(page.url(), catalogue);
      }
      await page.locator("#tool-search").fill("next consonant");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      await page.goto(shared);
      await expect(row).toBeVisible();
      const destination = await row.locator(".workshop-demo").getAttribute("href");
      const review = await row.locator(".workshop-review").getAttribute("href");
      assert.equal(destination, "https://antonsoo.github.io/akzent/#inquiry");
      const match = /\/blob\/([a-f0-9]{40})\/docs\/inquiry-audit\.md#two-questions-two-rankings$/.exec(
        review,
      );
      assert.ok(match, "The review must name the immutable audited source and its two goals");
      const local = execFileSync("git", ["-C", lessonRepo, "show", `${match[1]}:docs/inquiry-audit.md`]);
      const raw = await fetch(
        `https://raw.githubusercontent.com/antonsoo/akzent/${match[1]}/docs/inquiry-audit.md`,
      );
      assert.equal(raw.status, 200);
      assert.deepEqual(Buffer.from(await raw.arrayBuffer()), local);
      const img = row.locator("img");
      await img.evaluate((image) => image.decode());
      const thumb = new URL(await img.getAttribute("src"), page.url());
      const thumbBytes = Buffer.from(await (await fetch(thumb)).arrayBuffer());
      const retained = await readFile(resolve("public/thumbs", thumb.pathname.split("/thumbs/")[1]));
      assert.equal(hash(thumbBytes), hash(retained));
      await page.screenshot({ path: resolve(output, `${name}-${width}-discovery.png`), fullPage: true });
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(destination);
      await page.waitForLoadState("load");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("#inquiry-title")).toHaveText("Which consonant would you read next?");
      const box = await page.locator("#inquiry").boundingBox();
      assert.ok(box.y >= -5 && box.y < 200, "The native fragment must land at the inquiry");
      await page.locator("#inquiry-order").selectOption("unknown");
      await page.locator("#inquiry-start").click();
      await expect(page.locator(".inquiry-context")).toContainText("8 scenarios");
      assert.equal(await page.locator(".accent-bound").filter({ hasText: "4 accent positions" }).count(), 3);
      await page.locator('[data-inquiry-key="dorsal"][data-inquiry-value="g"]').click();
      await expect(page.locator(".inquiry-context")).toContainText("3 scenarios");
      await page.locator("#inquiry-undo").click();
      await expect(page.locator(".inquiry-context")).toContainText("8 scenarios");
      const pending = page.waitForEvent("download");
      await page.locator("#save-inquiry-csv").click();
      const csvFile = await pending;
      assert.equal(await csvFile.failure(), null);
      const csv = await readFile(await csvFile.path(), "utf8");
      assert.ok(csv.includes('"recommended_for_accent"'));
      await csvFile.saveAs(resolve(output, `${name}-${width}-reading-plan.csv`));
      await page.locator("#inquiry-erasure").click();
      await expect(page.locator(".inquiry-summary")).toContainText("Every consonant is supplied");
      assert.equal(await page.locator(".output-groups .scenario-token").count(), 5);
      await page.locator("#inquiry-source").click();
      await expect(page.locator("#source-status")).toContainText("Page 115 checked");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.goto(shared);
      await expect(row).toBeVisible();
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(review);
      await expect(page.locator("article")).toContainText("Two questions, two rankings");
      assert.deepEqual(errors, []);
      records.push({
        browser: name,
        width,
        shared,
        destination,
        review,
        reviewSha256: hash(local),
        thumbnailSha256: hash(thumbBytes),
        actualCsvSha256: hash(csv),
        nativeFragment: true,
        twoGoalsOperated: true,
        undo: true,
        sharedOutputScenarios: 5,
        sourcePage: 115,
        errors,
      });
      await context.close();
      console.log(
        `${name} ${width}: search aliases, shared discovery, native fragment, both goals, undo, real CSV, original page and pinned review passed.`,
      );
    }
  } finally {
    await browser.close();
  }
}
await writeFile(resolve(output, "review.json"), `${JSON.stringify({ catalogue, records }, null, 2)}\n`);
