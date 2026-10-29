import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, source, destination] = process.argv.slice(2);
assert(catalogue && source && destination, "Supply catalogue URL, Traditio checkout and output directory.");
const output = resolve(destination);
await mkdir(output, { recursive: true });
const project = JSON.parse(await readFile("public/projects.json", "utf8")).find(
  (item) => item.name === "traditio",
);
const workshop = project.workshops.find((item) => item.id === "counterexample");
const pin = /\/blob\/([a-f0-9]{40})\/docs\/review\.md#try-the-actual-work$/.exec(workshop.reviewUrl);
assert.ok(pin);
const review = execFileSync("git", ["-C", source, "show", `${pin[1]}:docs/review.md`]);
const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/traditio/${pin[1]}/docs/review.md`);
assert.equal(raw.status, 200);
assert.deepEqual(Buffer.from(await raw.arrayBuffer()), review);
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const expectedScan = JSON.parse(await readFile(resolve(source, "src/asset-manifest.json"), "utf8")).find(
  (item) => item.printedPage === 149,
);
const queries = ["Roman law", "usucapio", "in bonis", "quamvis"];
const report = {
  date: new Date().toISOString(),
  catalogue,
  lesson: workshop.url,
  reviewUrl: workshop.reviewUrl,
  reviewSha256: sha(review),
  journeys: [],
};
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
        acceptDownloads: true,
      });
      await context.addInitScript(() => {
        const create = URL.createObjectURL.bind(URL);
        window.reviewBlobs = new Map();
        URL.createObjectURL = (blob) => {
          const url = create(blob);
          window.reviewBlobs.set(url, blob);
          return url;
        };
      });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(catalogue);
      const search = page.getByRole("searchbox", { name: "Find a tool" });
      await search.waitFor();
      await page.locator('[data-group="Ancient world"]').click();
      const row = page.locator('[data-project="traditio"] [data-workshop="counterexample"]');
      const sharedQueries = [];
      for (const query of queries) {
        const address = page.url();
        await search.fill(query);
        assert.equal(page.url(), address);
        await expect(row).toBeVisible();
        await page.locator("#copy-search-link").focus();
        await page.keyboard.press("Enter");
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), query);
        await page.goto(shared);
        await expect(search).toHaveValue(query);
        await expect(page.locator('[data-group="Ancient world"]')).toHaveAttribute("aria-pressed", "true");
        await expect(row).toBeVisible();
        sharedQueries.push({ query, shared });
      }
      const thumbnail = await row.locator("img").evaluate(async (image) => {
        await image.decode();
        return image.currentSrc;
      });
      const imageResponse = await fetch(thumbnail);
      assert.equal(imageResponse.status, 200);
      const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
      assert.deepEqual(imageBytes, await readFile(resolve("public", workshop.thumbnail)));
      await page
        .locator(".catalogue-controls")
        .evaluate((element) => element.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: resolve(output, `${name}-${width}-catalogue.png`), fullPage: false });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(
        axe.violations.map((item) => item.id),
        [],
      );
      const shared = page.url();
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.reviewUrl);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await expect(page.locator("article")).toContainText("The comparison pin shows that only entry changed");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.url);
      await page.locator("#claim-select").selectOption("knowing-seller");
      await page.locator("#check-argument").click();
      await expect(page.locator("#argument-assessment")).toHaveAttribute("data-kind", "premise-not-met");
      await page.locator('[data-lesson="land"]').click();
      await page.locator('[data-years="2"]').focus();
      await page.keyboard.press("Enter");
      await page.locator("#pin").click();
      await page.locator("#check-argument").click();
      await expect(page.locator("#argument-assessment")).toHaveAttribute("data-kind", "counterexample");
      await page.locator("#focus-read").click();
      await page.getByRole("button", { name: "quamvis", exact: true }).click();
      await expect(page.locator("#word-note")).toContainText("although");
      await expect(page.locator("#scan-status")).toContainText("Printed page 149 · complete page");
      const sourceHash = await page.locator("#scan").evaluate(async (image) => {
        const bytes = await window.reviewBlobs.get(image.src).arrayBuffer();
        return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
      });
      assert.equal(sourceHash, expectedScan.sha256);
      await page.locator("#cite-reading").click();
      await page.locator("#reading-select").selectOption("time");
      await page.locator("#cite-reading").click();
      const note =
        "Marcus knows, but the later buyer receives in good faith. Quamvis concedes the first fact without defeating the second person's usucapion. Peaceful entry and two completed years matter.";
      await page.locator("#argument-note").fill(note);
      await page.locator('input[name="entry"][value="violent"]').check();
      await expect(page.locator("#title-holder")).toHaveText("Lucius");
      await expect(page.locator("#witness-title")).toContainText("Aulus");
      await expect(page.locator("#comparison-count")).toContainText("1 fact changed");
      const pending = page.waitForEvent("download");
      await page.locator("#save-case").click();
      const download = await pending;
      assert.equal(await download.failure(), null);
      const bytes = await readFile(await download.path()),
        record = JSON.parse(bytes);
      assert.equal(record.current.entry, "violent");
      assert.equal(record.argument.witness.entry, "peaceful");
      assert.deepEqual(record.argument.citations, ["land", "time"]);
      assert.equal(record.argument.note, note);
      await writeFile(resolve(output, `${name}-${width}-argument.json`), bytes);
      await page.locator("#clear-argument").click();
      await page
        .locator("#open-case")
        .setInputFiles({ name: "argument.json", mimeType: "application/json", buffer: bytes });
      await expect(page.locator("#file-status")).toContainText("Saved case reopened");
      await expect(page.locator("#argument-note")).toHaveValue(note);
      await page.locator("#argument").evaluate((element) => element.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: resolve(output, `${name}-${width}-argument.png`) });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []);
      report.journeys.push({
        browser: name,
        version: browser.version(),
        width,
        sharedQueries,
        actualThumbnailSha256: sha(imageBytes),
        actualSourcePage149Sha256: sourceHash,
        nativeArgumentSha256: sha(bytes),
        keyboardReviewAndLessonNavigation: true,
        pinnedReviewActuallyOpened: true,
        falsePremiseRejected: true,
        submittedCounterexampleRetainedAfterLiveEdit: true,
        nativeArgumentReopened: true,
        catalogueAxeViolations: 0,
        errors,
      });
      console.log(
        `${name} ${width}: four source searches, pinned review, counterexample, Latin scan, native download/reopen passed.`,
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
await writeFile(resolve(output, "journeys.json"), `${JSON.stringify(report, null, 2)}\n`);
