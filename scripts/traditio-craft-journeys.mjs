import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
import { retainedRoomJourney } from "../../traditio/scripts/retained-room-journey.mjs";

const [base, destination] = process.argv.slice(2);
assert(base && destination, "Supply the catalogue URL and receipt directory");
const output = resolve(destination);
const scratch = resolve("test-results/traditio-craft");
await mkdir(output, { recursive: true });
await mkdir(scratch, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const terms = [
  "gold into a vessel",
  "painting on a board",
  "Sabinus and Cassius",
  "utilis mihi actio",
  "utique si",
  "ownership and recovery",
];
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const expected = catalogue.find((p) => p.name === "traditio").workshops.find((w) => w.id === "craft");
const commit = /\/blob\/([a-f0-9]{40})\/docs\/craft-review.md#what-the-learner-can-do$/.exec(
  expected.reviewUrl,
)?.[1];
assert(commit);
const reviewBytes = execFileSync("git", ["-C", "../traditio", "show", `${commit}:docs/craft-review.md`]);
const sourceResponse = await fetch(
  `https://raw.githubusercontent.com/antonsoo/traditio/${commit}/docs/craft-review.md`,
);
assert.equal(sourceResponse.status, 200);
assert.deepEqual(Buffer.from(await sourceResponse.arrayBuffer()), reviewBytes);
const rows = [];
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      await context.addInitScript(() => {
        const create = URL.createObjectURL.bind(URL);
        window.reviewBlobs = new Map();
        URL.createObjectURL = (blob) => {
          const url = create(blob);
          window.reviewBlobs.set(url, blob);
          return url;
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      const row = page.locator('[data-project="traditio"] [data-workshop="craft"]');
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(page.url(), base);
      }
      await page.locator("#tool-search").fill("utilis mihi actio");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "utilis mihi actio");
      await page.goto(shared);
      await expect(row).toBeVisible();
      assert.equal(await row.locator(".workshop-demo").getAttribute("href"), expected.url);
      assert.equal(await row.locator(".workshop-review").getAttribute("href"), expected.reviewUrl);
      await row.locator("img").evaluate((img) => img.decode());
      const size = await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
      assert.ok(size[1] <= size[0] + 1);
      await page.screenshot({ path: resolve(output, `${name}-${width}-catalogue.png`), fullPage: true });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(expected.reviewUrl);
      await expect(page.locator("article")).toContainText("Change custody and reimbursement");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(expected.url);
      const journey = await retainedRoomJourney({
        context,
        page,
        base: "https://antonsoo.github.io/traditio/",
        kind: "craft",
        name,
        width,
        output,
        scratch,
        projectRoot: "../traditio",
      });
      await context.setOffline(true);
      await journey.offline();
      assert.deepEqual(errors, []);
      rows.push({
        browser: name,
        version: browser.version(),
        width,
        terms,
        shared,
        lesson: expected.url,
        review: expected.reviewUrl,
        reviewSha256: hash(reviewBytes),
        journey: journey.receipt,
        offlineReplay:
          "Browser offline emulation; separate Traditio public audit refuses the actual TLS origin",
        errors,
      });
      await context.close();
      await writeFile(
        resolve(output, "review.json"),
        `${JSON.stringify({ at: new Date().toISOString(), base, rows }, null, 2)}\n`,
      );
      console.log(
        `${name} ${width}: search, immutable review, operated recovery, displayed source bytes, native downloads and offline reading passed`,
      );
    }
  } finally {
    await browser.close();
  }
}
