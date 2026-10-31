import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert(catalogue && output, "Supply the catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const repo = fileURLToPath(new URL("../../akzent", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(repo, "src/asset-manifest.json"), "utf8"));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const records = [];
const cases = [
  { id: "resistant", query: "katará", aliases: ["katara", "hvaþar", "πότερος", "páti"], page: 119 },
  {
    id: "inverse",
    query: "akasatam",
    aliases: ["lost accent", "partial evidence", "event order", "g z þ"],
    page: 115,
  },
];
const reviews = new Map();
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375])
      for (const investigation of cases) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          acceptDownloads: true,
        });
        await context.addInitScript(() => {
          const create = URL.createObjectURL.bind(URL);
          window.akzentBlobs = new Map();
          URL.createObjectURL = (blob) => {
            const url = create(blob);
            window.akzentBlobs.set(url, blob);
            return url;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(catalogue);
        const row = page.locator(`[data-project="akzent"] [data-workshop="${investigation.id}"]`);
        for (const term of investigation.aliases) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), catalogue, "Typing must not silently rewrite the search link");
        }
        await page.locator("#tool-search").fill(investigation.query);
        await expect(row).toBeVisible();
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), investigation.query);
        await page.goto(shared);
        await expect(row).toBeVisible();
        const destination = await row.locator(".workshop-demo").getAttribute("href");
        const review = await row.locator(".workshop-review").getAttribute("href");
        const match = /\/blob\/([a-f0-9]{40})\/docs\/audit\.md#try-the-actual-work$/.exec(review);
        assert.ok(match, "Review must be pinned to the actual task instructions");
        if (!reviews.has(review)) {
          const pinned = execFileSync("git", ["-C", repo, "show", `${match[1]}:docs/audit.md`]);
          const response = await fetch(
            `https://raw.githubusercontent.com/antonsoo/akzent/${match[1]}/docs/audit.md`,
          );
          assert.equal(response.status, 200);
          assert.deepEqual(Buffer.from(await response.arrayBuffer()), pinned);
          reviews.set(review, sha(pinned));
        }
        const thumbnail = await row.locator("img").getAttribute("src");
        await row.locator("img").evaluate((img) => img.decode());
        const imageUrl = new URL(thumbnail, page.url());
        const response = await fetch(imageUrl);
        assert.equal(response.status, 200);
        const thumbnailHash = sha(Buffer.from(await response.arrayBuffer()));
        const thumbnailPath = imageUrl.pathname.split("/thumbs/")[1];
        assert.equal(thumbnailHash, sha(await readFile(resolve("public/thumbs", thumbnailPath))));
        await page.screenshot({
          path: resolve(output, `${name}-${width}-${investigation.id}-catalogue.png`),
          fullPage: true,
        });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(review);
        await expect(page.locator("article")).toContainText("Try the actual work");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(destination);
        await expect(page.locator("#offline-status")).toContainText("available offline", { timeout: 30_000 });
        if (investigation.id === "resistant") {
          await expect(page.locator("#selected-title")).toHaveText("which of two");
          await page.locator("#unaccented-rule").selectOption("voiced");
          await page.locator("#test-word").focus();
          await page.keyboard.press("Space");
          await expect(page.locator("#word-details")).toContainText("hvaþar");
          await expect(page.locator("#word-details")).toContainText("πότερος");
          await page.locator('[data-evidence="119"]').click();
        } else {
          await expect(page.locator("#infer-title")).toHaveText("Can the consonants give the accent back?");
          const box = await page.locator("#infer").boundingBox();
          assert.ok(box.y >= -1 && box.y < 200, "Native fragment must land at the inverse controls");
          await page.locator("#evidence-dorsal").selectOption("h");
          await page.locator("#evidence-sibilant").selectOption("z");
          await page.locator("#evidence-dental").selectOption("d");
          await expect(page.locator("#inference-results")).toContainText("Only older accent position 1");
          await page.locator("#evidence-order").selectOption("unknown");
          await expect(page.locator("#inference-results")).toContainText(
            "positions 1, 2, 3, 4 remain possible",
          );
          await page.locator("#proposed-accent").selectOption("3");
          await page.locator("#check-accent").focus();
          await page.keyboard.press("Space");
          await expect(page.locator(".checked-proposal")).toContainText(
            "compatible, but other older accents",
          );
          await page.locator("#evidence-dorsal").selectOption("g");
          await page.locator("#evidence-dental").selectOption("þ");
          await expect(page.locator("#inference-results")).toContainText("Only older accent position 3");
          await expect(page.locator(".checked-proposal")).toContainText(
            "compatible, but other older accents",
          );
          await page.locator("#source-page").selectOption("115");
        }
        await expect(page.locator("#source-status")).toContainText(`Page ${investigation.page} checked`);
        const displayed = await page.locator("#source-image").evaluate(async (img) => {
          await img.decode();
          const bytes = await window.akzentBlobs.get(img.src).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        });
        assert.equal(
          displayed,
          manifest.find((asset) => asset.path === `sources/verner-${investigation.page}.png`).sha256,
        );
        const note =
          investigation.id === "resistant"
            ? "The simple accent rule still disagrees with hvaþar. I keep the mismatch rather than inventing an old accent."
            : "Allowing either order leaves h/z/d ambiguous; g/z/þ permits only position 3. My earlier checked proposal keeps its assumptions.";
        await page.locator("#explanation").fill(note);
        const pending = page.waitForEvent("download");
        await page.locator("#save-json").click();
        const download = await pending;
        assert.equal(await download.failure(), null);
        const saved = JSON.parse(await readFile(await download.path(), "utf8"));
        assert.equal(saved.note, note);
        if (investigation.id === "resistant") {
          assert.equal(saved.selected, "which");
          assert.equal(saved.trials[0].prediction, "d");
        } else {
          assert.equal(saved.inference.submitted.evidence.dorsal, "h");
          assert.equal(saved.inference.evidence.dorsal, "g");
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        records.push({
          browser: name,
          version: browser.version(),
          width,
          query: investigation.query,
          aliases: investigation.aliases,
          sharedSearch: shared,
          lesson: destination,
          review,
          reviewSha256: reviews.get(review),
          thumbnailSha256: thumbnailHash,
          displayedSourceSha256: displayed,
          nativeNotebook: saved,
          errors,
        });
        await context.close();
        console.log(
          `${name} ${width}: ${investigation.query} -> ${investigation.id} -> operated account, original page and actual notebook`,
        );
      }
  } finally {
    await browser.close();
  }
}
await writeFile(
  resolve(output, "review.json"),
  `${JSON.stringify({ date: new Date().toISOString(), catalogue, publicCatalogue: new URL(catalogue).hostname === "antonsoo.github.io", publicLessonAndReview: true, requestRedirection: false, records }, null, 2)}\n`,
);
