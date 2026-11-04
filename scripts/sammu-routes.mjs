import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const source = path.resolve(process.argv[2] ?? "../sammu");
const output = path.resolve(process.argv[3] ?? "/tmp/claude-1000/officina-sammu-routes");
const publicReview = process.env.SAMMU_PUBLIC === "1";
await mkdir(output, { recursive: true });
const { reviewPreview } = await import(pathToFileURL(path.join(source, "scripts/review-preview.mjs")));
const catalogueServer = publicReview ? null : reviewPreview(process.cwd(), 4418);
const workshopServer = publicReview ? null : reviewPreview(source, 4419);
const catalogue = publicReview ? "https://antonsoo.github.io/officina/" : "http://127.0.0.1:4418/officina/";
const workshop = publicReview ? "https://antonsoo.github.io/sammu/" : "http://127.0.0.1:4419/sammu/";
const edition = /const EDITION = "([a-f0-9]+)"/.exec(await readFile(path.join(source, "dist/sw.js"), "utf8"))[1];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const rows = [];
async function download(page, selector, filename) {
  const waiting = page.waitForEvent("download"); await page.locator(selector).click();
  const item = await waiting; assert.equal(await item.failure(), null);
  const file = path.join(output, filename); await item.saveAs(file);
  return { file, bytes: await readFile(file) };
}
try {
  await Promise.all([catalogueServer?.ready, workshopServer?.ready]);
  for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
    const browser = await launcher.launch();
    try {
      for (const width of [1440, 375]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true, reducedMotion: "reduce" });
        try {
          const page = await context.newPage(), errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          if (!publicReview) await page.route("https://antonsoo.github.io/sammu/**", (route) => {
            const url = new URL(route.request().url());
            return route.fulfill({ status: 302, headers: { location: `${workshop}${url.pathname.slice(7)}${url.search}${url.hash}` } });
          });
          await page.goto(catalogue);
          const row = page.locator('[data-project="sammu"] [data-workshop="routes"]');
          for (const term of ["two roads", "transposition", "same tuning", "pitch identity", "2187/2048"]) {
            await page.locator("#tool-search").fill(term); await expect(row).toBeVisible();
          }
          await page.locator("#tool-search").fill("two roads");
          await page.locator("#copy-search-link").click();
          const shared = await page.locator("#filter-link-url").inputValue();
          assert.equal(new URL(shared).searchParams.get("q"), "two roads");
          await page.goto(shared); await expect(row).toBeVisible();
          await row.locator("img").evaluate((image) => image.decode());
          const review = await row.locator(".workshop-review").getAttribute("href");
          const pin = /\/blob\/([a-f0-9]{40})\/docs\/routes-review\.md#the-learning-gap$/.exec(review)?.[1];
          assert.ok(pin);
          const document = execFileSync("git", ["-C", source, "show", `${pin}:docs/routes-review.md`]);
          assert.match(document.toString(), /modern modeling choices/);
          if (publicReview) {
            const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/sammu/${pin}/docs/routes-review.md`);
            assert.equal(raw.status, 200); assert.deepEqual(Buffer.from(await raw.arrayBuffer()), document);
            await row.locator(".workshop-review").focus(); await page.keyboard.press("Enter");
            await expect(page).toHaveURL(review); await expect(page.locator("article")).toContainText("The learning gap");
            await page.goto(shared);
          }
          const thumb = await readFile("public/thumbs/sammu-routes.png");
          assert.deepEqual(thumb, await readFile(path.join(source, "docs/assets/routes-desktop.png")));
          await page.screenshot({ path: path.join(output, `${engine}-${width}-catalogue.png`), fullPage: true });
          await row.locator(".workshop-demo").focus(); await page.keyboard.press("Enter");
          await page.waitForURL((url) => url.origin === new URL(workshop).origin && url.pathname.endsWith("routes.html"));
          await expect(page.locator("#edition")).toHaveText(`Workshop edition: ${edition}`);
          await expect(page.locator("#origin-description")).toContainText("7 bench moves");
          await expect(page.locator("#a-count")).toHaveText("2 moves");
          await expect(page.locator("#b-count")).toHaveText("5 moves");
          await page.locator('input[value="aligned"]').check();
          await page.locator("#listen-string").selectOption("all");
          await page.locator("#play").click();
          await page.waitForFunction(() => document.querySelector("#audio-status").dataset.playing === "true");
          await page.locator("#stop").click();
          const record = await download(page, "#save-json", `${engine}-${width}.json`);
          const data = JSON.parse(record.bytes);
          assert.equal(data.origin.priorMoves, "LLLLLLL"); assert.equal(data.bOverA, "2187/2048");
          assert.equal(data.listening.bMultiplier, "2048/2187"); assert.equal(data.sound.notes.length, 18);
          assert.deepEqual(data.sound.notes.slice(0, 9).map((n) => n.hz), data.sound.notes.slice(9).map((n) => n.hz));
          const reading = await download(page, "#save-study", `${engine}-${width}.html`);
          await page.screenshot({ path: path.join(output, `${engine}-${width}-operated.png`), fullPage: true });
          const disk = await browser.newContext({ offline: true, viewport: { width, height: 1000 }, acceptDownloads: true });
          const saved = await disk.newPage(), requests = [];
          saved.on("request", (r) => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
          await saved.goto(pathToFileURL(reading.file).href); await saved.evaluate(() => document.fonts.ready);
          assert.equal(await saved.locator("tbody tr").count(), 9);
          const native = await download(saved, 'a[download="sammu-routes.json"]', `${engine}-${width}-native.json`);
          assert.deepEqual(JSON.parse(native.bytes), data); assert.deepEqual(requests, []);
          await disk.close();
          await page.locator("#evidence-link").click(); await page.waitForURL((url) => url.hash === "#evidence");
          assert.equal(await page.locator("#string-1").getAttribute("data-ratio"), "2048/2187");
          await expect(page.locator("#clauses")).toContainText("restored");
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          assert.deepEqual(errors, []);
          rows.push({ engine, width, shared, review, reviewSha256: hash(document), thumbnailSha256: hash(thumb), edition, recordSha256: hash(record.bytes), sourcePreservesPriorCycle: true, nativeReadingHasNoHttp: true, publicReviewBytesChecked: publicReview });
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
} finally { catalogueServer?.stop(); workshopServer?.stop(); }
await writeFile(path.join(output, "receipt.json"), `${JSON.stringify({ scope: publicReview ? "Actual public catalogue and workshop, keyboard review navigation, immutable raw-byte check and native reading" : "Local catalogue and workshop; public workshop destinations explicitly redirected to the local production build", passed: rows.length === 4, rows }, null, 2)}\n`);
console.log(JSON.stringify({ passed: rows.length === 4, journeys: rows.length, publicReview, output }));
