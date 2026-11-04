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
const projects = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = projects.find((p) => p.name === "embater").workshops.find((w) => w.id === "measure");
const commit = /\/blob\/([a-f0-9]{40})\/docs\/count-audit.md$/.exec(workshop.reviewUrl)?.[1];
assert(commit, "Use an immutable review revision");
const review = execFileSync("git", ["-C", "../embater", "show", `${commit}:docs/count-audit.md`]);
const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/embater/${commit}/docs/count-audit.md`);
assert.equal(raw.status, 200);
assert.deepEqual(Buffer.from(await raw.arrayBuffer()), review);
const sha = (b) => createHash("sha256").update(b).digest("hex");
const rows = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        acceptDownloads: true,
        colorScheme: "light",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      const row = page.locator('[data-project="embater"] [data-workshop="measure"]');
      for (const term of [
        "longitudo operis",
        "axial pitch",
        "column centres",
        "same column count",
        "hold a reference",
      ]) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
      }
      await page.locator("#tool-search").fill("longitudo operis");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "longitudo operis");
      await page.goto(shared);
      await expect(row).toBeVisible();
      await row.locator("img").evaluate((i) => i.decode());
      await page.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`) });
      assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.reviewUrl);
      await expect(page.locator("article")).toContainText("The same columns can enclose a square");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.url);
      await page.locator("#measure-hold").click();
      await page.locator("#measure-halved").click();
      assert.equal(await page.locator("[data-trial-column]").count(), 30);
      assert.equal(await page.locator("[data-held-column]").count(), 30);
      assert.match(await page.locator("#measure-reference-result").textContent(), /Column count unchanged/);
      assert.match(await page.locator("#measure-result").textContent(), /L \/ W = 1\./);
      await page.locator("#front-pitch").focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(await page.locator("#front-pitch").inputValue(), "3.05");
      await page.locator("#measure-halved").click();
      assert.equal(await page.locator("#flank-pitch").inputValue(), "1.525");
      await page.locator("#measure-equal-example").click();
      await page.locator("#measure-halved").click();
      const event = page.waitForEvent("download");
      await page.locator("#save-measure-work").click();
      const file = await event;
      const path = resolve(output, `${engine}-${width}-comparison.json`);
      await file.saveAs(path);
      const bytes = await readFile(path),
        work = JSON.parse(bytes);
      assert.equal(work.current.trial.flankPitch, 1.5);
      assert.equal(work.reference.trial.flankPitch, 3);
      assert.equal(work.current.temple, "priene-temple-of-athena");
      await page.locator("#measure-drop").click();
      await page.locator("#load-measure-work").setInputFiles(path);
      await expect(page.locator("#measure-save-status")).toContainText("Reopened");
      await page.locator('#count-measuring a[href="#latin"]').click();
      await expect(page.locator("#latin")).toBeInViewport();
      await page.locator("#count-open-source").click();
      await expect(page.locator("#drill-source-status")).toContainText("Complete printed page 69", {
        timeout: 195000,
      });
      const sourceHash = await page
        .locator("#drill-source-image")
        .evaluate(async (i) =>
          Array.from(
            new Uint8Array(await crypto.subtle.digest("SHA-256", await (await fetch(i.src)).arrayBuffer())),
            (b) => b.toString(16).padStart(2, "0"),
          ).join(""),
        );
      // The live reader and the saved reading retain different renders of this leaf.
      assert.equal(sourceHash, "29eb1a487e566f3ea1397f96412aeb7d51504f80c01741c81325f8eab77ec3fd");
      await page.getByRole("button", { name: "Close printed source" }).click();
      const save = page.waitForEvent("download");
      await page.locator("#save-count").click();
      const reading = await save;
      const htmlPath = resolve(output, `${engine}-${width}-reading.html`);
      await reading.saveAs(htmlPath);
      const html = await readFile(htmlPath, "utf8");
      assert(!/<script\b/i.test(html));
      assert(html.includes("Column count unchanged"));
      const savedSource = html.match(/<img data-source-page="69" src="data:image\/jpeg;base64,([^"]+)"/);
      assert(savedSource);
      assert.equal(
        sha(Buffer.from(savedSource[1], "base64")),
        "783d80afa3c7401f826a74f484832d5f7e5d79255b19ae3e74b3bf35fa3878b4",
      );
      const portable = await context.newPage();
      const requests = [];
      portable.on("request", (r) => {
        if (/^https?:/.test(r.url())) requests.push(r.url());
      });
      await portable.goto(pathToFileURL(htmlPath).href);
      await portable.evaluate(() => document.fonts.ready);
      assert.deepEqual(requests, []);
      await portable.close();
      await expect(page.locator("#offline-status")).toContainText("Ready offline", { timeout: 60000 });
      await context.setOffline(true);
      await page.reload();
      await expect(page.locator("#measure-reference-result")).toContainText("Column count unchanged");
      const offline = page.waitForEvent("download");
      await page.locator("#save-measure-work").click();
      const offlineFile = await offline;
      const offlinePath = resolve(output, `${engine}-${width}-offline.json`);
      await offlineFile.saveAs(offlinePath);
      assert.deepEqual(await readFile(offlinePath), bytes);
      assert.deepEqual(errors, []);
      rows.push({
        engine,
        width,
        sharedSearch: shared,
        review: workshop.reviewUrl,
        reviewSha256: sha(review),
        sourceHash,
        comparisonSha256: sha(bytes),
        keyboardAndNativeReopen: true,
        sourceAndPortableReading: true,
        controlledOfflineDownloadMatches: true,
        errors,
      });
      await context.close();
      console.log(
        engine,
        width,
        "discovery, pinned review, controls, native reopening, full source and offline download passed",
      );
    }
  } finally {
    await browser.close();
  }
}
await writeFile(resolve(output, "journeys.json"), `${JSON.stringify(rows, null, 2)}\n`);
