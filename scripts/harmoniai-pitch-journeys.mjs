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
const projects = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = projects.find((p) => p.name === "harmoniai").workshops.find((w) => w.id === "pitches");
const commit = /\/blob\/([a-f0-9]{40})\/docs\/edition-audit.md#/.exec(workshop.reviewUrl)?.[1];
assert(commit, "The review must pin a complete immutable source revision");
const document = execFileSync("git", ["-C", "../harmoniai", "show", `${commit}:docs/edition-audit.md`]);
const raw = await fetch(
  `https://raw.githubusercontent.com/antonsoo/harmoniai/${commit}/docs/edition-audit.md`,
);
assert.equal(raw.status, 200);
assert.deepEqual(Buffer.from(await raw.arrayBuffer()), document);
const manifest = JSON.parse(await readFile("../harmoniai/public/sources/manifest.json", "utf8"));
const terms = [
  "τρίτη ὑπερβολαίων",
  "tritē hyperbolaiōn",
  "trite hyperbolaion",
  "reference pitch",
  "23.460 cents",
];
const rows = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
        acceptDownloads: true,
      });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base);
        const row = page.locator('[data-project="harmoniai"] [data-workshop="pitches"]');
        for (const term of terms) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
        }
        await page.locator("#tool-search").fill("trite hyperbolaion");
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), "trite hyperbolaion");
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((image) => image.decode());
        assert.equal(await row.locator(".workshop-demo").getAttribute("href"), workshop.url);
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        await page.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`), fullPage: true });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.reviewUrl);
        await expect(page.locator("article")).toContainText("521.4815");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.url);
        assert.equal(await page.locator("#mese").inputValue(), "330");
        assert.match(await page.locator("#string-readout").textContent(), /521\.4815/);
        await page.locator("#tuning").selectOption("aristoxenian");
        assert.match(await page.locator("#string-readout").textContent(), /523\.8423/);
        assert.match(await page.locator(".step-measure").textContent(), /two S steps equal/);
        await page.locator("#tuning").selectOption("pythagorean");
        assert.match(await page.locator(".step-measure").textContent(), /23\.460/);
        await page.locator('[data-note="12"]').focus();
        await page.keyboard.press("Enter");
        await page.locator("#stop").click();
        const pending = page.waitForEvent("download");
        await page.locator("#save-octave").click();
        const download = await pending;
        assert.equal(await download.failure(), null);
        const file = resolve(output, `${engine}-${width}-study.html`);
        await download.saveAs(file);
        const bytes = await readFile(file);
        const scans = [...bytes.toString().matchAll(/src="data:image\/jpeg;base64,([^"]+)"/g)];
        assert.equal(scans.length, 3);
        scans.forEach((image, i) =>
          assert.equal(hash(Buffer.from(image[1], "base64")), manifest.pages[i].sha256),
        );
        await page
          .locator("#pitches")
          .screenshot({ path: resolve(output, `${engine}-${width}-pitches.png`) });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        rows.push({
          engine,
          browser: browser.version(),
          width,
          terms,
          shared,
          destination: workshop.url,
          review: workshop.reviewUrl,
          reviewSha256: hash(document),
          nativeStudyBytes: bytes.length,
          nativeStudySha256: hash(bytes),
          threeEmbeddedScansVerified: true,
          actualModelChange: [521.4815, 523.8423],
          keyboardPluck: true,
          errors,
        });
      } finally {
        await context.close();
      }
      const canonical = await fetch(base, { headers: { "cache-control": "no-cache" } });
      assert.equal(canonical.status, 200);
      assert.match(await canonical.text(), /Officina/);
      console.log(
        `${engine}-${width}: catalogue search, shared query, pinned review, keyboard entry, changed pitch and real illustrated study verified`,
      );
    }
  } finally {
    await browser.close();
  }
}
await writeFile(resolve(output, "review.json"), `${JSON.stringify({ base, commit, rows }, null, 2)}\n`);
