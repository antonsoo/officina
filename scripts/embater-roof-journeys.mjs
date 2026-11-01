import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [base, output] = process.argv.slice(2);
assert(base && output, "Supply catalogue URL and receipt directory");
await mkdir(output, { recursive: true });
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = catalogue.find((p) => p.name === "embater").workshops.find((w) => w.id === "roof");
const commit = /\/blob\/([a-f0-9]{40})\/docs\/roof-audit.md#/.exec(workshop.reviewUrl)?.[1];
assert(commit, "The review must use an immutable full source revision");
const document = execFileSync("git", ["-C", "../embater", "show", `${commit}:docs/roof-audit.md`]);
const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/embater/${commit}/docs/roof-audit.md`);
assert.equal(raw.status, 200);
assert.deepEqual(Buffer.from(await raw.arrayBuffer()), document);
const manifest = JSON.parse(await readFile("../embater/public/sources/vocabulary/manifest.json", "utf8"));
const source = manifest.plates.find((p) => p.page === 74);
const rows = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
        acceptDownloads: true,
        colorScheme: "light",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base);
      const row = page.locator('[data-project="embater"] [data-workshop="roof"]');
      const terms = ["acroteria", "ἀκρωτήριον", "altiora octava parte", "tam alta quantum", "roof ornaments"];
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
      }
      await page.locator("#tool-search").fill("altiora octava parte");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "altiora octava parte");
      await page.goto(shared);
      await expect(row).toBeVisible();
      await row.locator("img").evaluate((image) => image.decode());
      assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
      await page.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`), fullPage: true });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.reviewUrl);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.url);
      const trial = page.getByRole("slider", { name: "Blue trial height" });
      await trial.focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(await trial.inputValue(), "0.525");
      await page.getByRole("button", { name: "Try a middle ornament only h/8 tall" }).click();
      assert.match(await page.locator("#roof-result").textContent(), /88.89% shorter/);
      await page.getByRole("button", { name: "Match Vitruvius’s middle height" }).click();
      assert.equal(await trial.inputValue(), "1.125");
      await page.getByRole("button", { name: "Read complete printed page 74", exact: true }).click();
      await expect(page.locator("#drill-source-status")).toContainText("Complete printed page 74.", {
        timeout: 20000,
      });
      const digest = await page
        .locator("#drill-source-image")
        .evaluate(async (image) =>
          Array.from(
            new Uint8Array(
              await crypto.subtle.digest("SHA-256", await (await fetch(image.src)).arrayBuffer()),
            ),
            (b) => b.toString(16).padStart(2, "0"),
          ).join(""),
        );
      assert.equal(digest, source.sha256);
      await page.getByRole("button", { name: "Close printed source" }).click();
      const waiting = page.waitForEvent("download", { timeout: 60000 });
      await page.locator("#roof-study").click();
      const download = await waiting;
      assert.equal(await download.failure(), null);
      const file = resolve(output, `${engine}-${width}-reading.html`);
      await download.saveAs(file);
      const bytes = await readFile(file);
      const html = bytes.toString();
      assert(!/<script\b/i.test(html));
      const sources = [
        ...html.matchAll(/<img data-source-page="(\d+)" src="data:image\/jpeg;base64,([^"]+)"/g),
      ];
      assert.deepEqual(
        sources.map((m) => Number(m[1])),
        [73, 74, 84],
      );
      for (const match of sources)
        assert.equal(
          sha(Buffer.from(match[2], "base64")),
          manifest.plates.find((p) => p.page === Number(match[1])).sha256,
        );
      const saved = await context.newPage();
      const remoteRequests = [];
      saved.on("request", (request) => {
        if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
      });
      await saved.goto(pathToFileURL(file).href);
      await saved.evaluate(() => document.fonts.ready.then(() => true));
      assert.equal(await saved.locator("svg").count(), 2);
      assert.equal(
        await saved.locator('[data-part="roof-trial"]').evaluate((el) => getComputedStyle(el).stroke),
        "rgb(31, 78, 156)",
      );
      const settings = JSON.parse(await saved.locator("#saved-settings").textContent());
      assert.equal(settings.trialRatio, 1.125);
      assert.equal(settings.trialTarget, "middle");
      assert.deepEqual(remoteRequests, []);
      await saved.getByRole("link", { name: "Reopen these exact choices in Embater" }).click();
      await expect(saved).toHaveURL(settings.reopenUrl);
      assert.equal(await saved.locator('[name="roof-trial"]').inputValue(), "1.125");
      assert.equal(await saved.locator('[name="roof-target"][value="middle"]').isChecked(), true);
      await saved.close();
      await page.locator("#offline-status").filter({ hasText: "Ready offline:" }).waitFor({ timeout: 60000 });
      await context.setOffline(true);
      await page.reload();
      const offlineWaiting = page.waitForEvent("download", { timeout: 60000 });
      await page.locator("#roof-study").click();
      const offline = await offlineWaiting;
      assert.equal(await offline.failure(), null);
      const offlineFile = resolve(output, `${engine}-${width}-offline.html`);
      await offline.saveAs(offlineFile);
      assert.equal(sha(await readFile(offlineFile)), sha(bytes));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page
        .locator(".plate-wrap")
        .screenshot({ path: resolve(output, `${engine}-${width}-lesson.png`) });
      assert.deepEqual(errors, []);
      rows.push({
        engine,
        browser: browser.version(),
        width,
        terms,
        shared,
        destination: workshop.url,
        review: workshop.reviewUrl,
        reviewSha256: sha(document),
        sourceSha256: digest,
        nativeReadingBytes: bytes.length,
        nativeReadingSha256: sha(bytes),
        blueEnvelopeRetained: true,
        exactChoicesReopened: true,
        identicalControlledOfflineReading: true,
        errors,
      });
      await writeFile(resolve(output, "review.json"), JSON.stringify({ base, rows }, null, 2) + "\n");
      await context.close();
      console.log(
        `${engine} ${width}: discovery, pinned review, operated Latin ratios, printed page, portable reading, exact reopening and identical offline file`,
      );
    }
  } finally {
    await browser.close();
  }
}
