import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
const [base, output] = process.argv.slice(2);
assert(base && output, "Supply catalogue URL and receipt directory");
await mkdir(output, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const pages = [
  ...JSON.parse(await readFile("../embater/public/sources/doorways/manifest.json", "utf8")).plates,
  ...JSON.parse(await readFile("../embater/public/sources/erechtheion/manifest.json", "utf8")).plates,
];
const rows = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const [id, terms, heading] of [
        [
          "doorways",
          ["semis", "thyromaton", "θύρωμα", "antepagmentum", "supercilium"],
          "Try the actual work",
        ],
        ["erechtheion", ["Erechtheion", "double square", "4.882", "later linings"], "Almost a double square"],
      ]) {
        await page.goto(base);
        const row = page.locator(`[data-project="embater"] [data-workshop="${id}"]`);
        for (const term of terms) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), base);
        }
        await page.locator("#tool-search").fill(terms[2]);
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), terms[2]);
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((i) => i.decode());
        const destination = await row.locator(".workshop-demo").getAttribute("href"),
          review = await row.locator(".workshop-review").getAttribute("href");
        const commit = /\/blob\/([a-f0-9]{40})\/docs\/doorway-review.md#/.exec(review)?.[1];
        assert(commit);
        const doc = execFileSync("git", ["-C", "../embater", "show", `${commit}:docs/doorway-review.md`]);
        const raw = await fetch(
          `https://raw.githubusercontent.com/antonsoo/embater/${commit}/docs/doorway-review.md`,
        );
        assert.equal(raw.status, 200);
        assert.deepEqual(Buffer.from(await raw.arrayBuffer()), doc);
        await page.screenshot({
          path: resolve(output, `${engine}-${width}-${id}-catalogue.png`),
          fullPage: true,
        });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(review);
        await expect(page.locator("article")).toContainText(heading);
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(destination);
        await expect(page.locator("#door-source-status")).toContainText("Complete printed page 88.");
        if (id === "doorways") {
          await page.locator('input[name="reading"][value="unsupplied"]').focus();
          await page.keyboard.press("Space");
          await expect(page.locator("#door-height-rule")).toContainText("= 16 ft opening");
          await page.locator("#door-match").click();
          await expect(page.locator("#door-result")).toContainText("matches this reading");
          await page.locator('[data-term="jamb"]').click();
          await page.locator("#door-word-source").click();
          await expect(page.locator("#door-passage-jamb")).toBeVisible();
        } else {
          await page.locator('input[name="measure-rule"][value="square"]').focus();
          await page.keyboard.press("Space");
          await expect(page.locator("#measure-result")).toContainText("14 mm wider");
          await page.locator('input[name="measure-fit"][value="width"]').check();
          await expect(page.locator("#measure-result")).toContainText("28 mm shorter");
          await page.locator("#measure-source-page").selectOption("99");
          await expect(page.locator("#measure-source-status")).toContainText("Complete printed page 99.");
          const bytes = await page
            .locator("#measure-source-image")
            .evaluate(async (i) => Array.from(new Uint8Array(await (await fetch(i.src)).arrayBuffer())));
          assert.equal(hash(Buffer.from(bytes)), pages[3].sha256);
        }
        const pending = page.waitForEvent("download");
        await page.locator("#door-save-reading").click();
        const file = await pending;
        assert.equal(await file.failure(), null);
        const html = await readFile(await file.path(), "utf8");
        assert.ok(!/<script\b/i.test(html));
        const images = [...html.matchAll(/src="data:image\/jpeg;base64,([^"]+)"/g)].map((m) =>
          hash(Buffer.from(m[1], "base64")),
        );
        assert.deepEqual(
          images,
          pages.map((p) => p.sha256),
        );
        assert.ok(html.includes("later inner linings"));
        assert.ok(html.includes("Metres"));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        rows.push({
          engine,
          version: browser.version(),
          width,
          workshop: id,
          terms,
          shared,
          destination,
          review,
          reviewSha256: hash(doc),
          sourceImages: images,
          actualReadingSha256: hash(html),
          actualReadingBytes: Buffer.byteLength(html),
          pageErrors: errors,
        });
        await writeFile(resolve(output, "review.json"), `${JSON.stringify({ base, rows }, null, 2)}\n`);
        console.log(
          engine,
          width,
          id,
          "search, keyboard, pinned source, operated model and actual reading verified",
        );
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
