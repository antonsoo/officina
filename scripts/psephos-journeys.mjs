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
const repo = fileURLToPath(new URL("../../psephos", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(repo, "src/asset-manifest.json"), "utf8"));
const sha = (b) => createHash("sha256").update(b).digest("hex");
const records = [];
const cases = [
  {
    id: "casting",
    query: "πιέζων",
    aliases: ["authoritative urn", "κύριος", "ἂν δὲ ἴσαι"],
    anchor: "workbench",
  },
  {
    id: "inference",
    query: "εὐαρίθμητοι",
    aliases: ["known votes", "252 arrangements", "unanimity"],
    anchor: "inference",
  },
];
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
          window.psephosJourneyBlobs = new Map();
          URL.createObjectURL = (blob) => {
            const url = create(blob);
            window.psephosJourneyBlobs.set(url, blob);
            return url;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(catalogue);
        const row = page.locator(`[data-project="psephos"] [data-workshop="${investigation.id}"]`);
        for (const term of investigation.aliases) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), catalogue, "Typing must not silently rewrite the URL");
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
        assert.equal(new URL(destination).hash, `#${investigation.anchor}`);
        const match = /\/blob\/([a-f0-9]{40})\/docs\/audit\.md#try-the-actual-work$/.exec(review);
        assert.ok(match);
        const pinned = execFileSync("git", ["-C", repo, "show", `${match[1]}:docs/audit.md`]);
        const response = await fetch(
          `https://raw.githubusercontent.com/antonsoo/psephos/${match[1]}/docs/audit.md`,
        );
        assert.equal(response.status, 200);
        assert.deepEqual(Buffer.from(await response.arrayBuffer()), pinned);
        await row.locator("img").evaluate((img) => img.decode());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({
          path: resolve(output, `${name}-${width}-${investigation.id}-catalogue.png`),
          fullPage: true,
        });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(review);
        await expect(page.locator("article")).toContainText("Try the actual work");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(destination);
        await expect(page.locator("#offline-status")).toContainText("This edition is available offline,");
        await page.locator("#issue").focus();
        await page.keyboard.press("Enter");
        if (investigation.id === "casting") {
          await page.locator("#pin").click();
          const concealed = await page.locator("#observer-drawing").innerHTML();
          await page.locator("#choose-pierced").click();
          assert.equal(await page.locator("#observer-drawing").innerHTML(), concealed);
          await page.locator("#choose-solid").click();
        }
        await page.locator("#cast").click();
        await page.locator("#count-bronze").click();
        await expect(page.locator("#verdict")).toContainText("Equal votes");
        if (investigation.id === "inference") {
          await page.locator("#inspect-inference").click();
          await expect(page.locator("#inference-results")).toContainText("252 arrangements fit");
          assert.equal(await page.locator(".assignment-pair .assignment").count(), 2);
          for (let i = 0; i < 5; i++) await page.locator(`#known-${i}`).check();
          await expect(page.locator("#inference-results")).toContainText("choice is forced: solid");
          await page.locator("#known-4").uncheck();
          await expect(page.locator("#inference-results")).toContainText("6 arrangements fit");
          await page.locator("#known-4").check();
        }
        await page.locator("#reading").selectOption("tie");
        await expect(page.locator("#scan-status")).toContainText("Page LXVIII checked");
        await page.locator("#greek button").filter({ hasText: "ἂν δὲ ἴσαι" }).click();
        await expect(page.locator("#phrase-note")).toContainText("feminine plural");
        const displayed = await page.locator("#scan").evaluate(async (img) => {
          await img.decode();
          const bytes = await window.psephosJourneyBlobs.get(img.src).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        });
        assert.equal(displayed, manifest.find((a) => a.path === "sources/kenyon-p68.jpg").sha256);
        await page.locator("#cite").click();
        const note =
          investigation.id === "casting"
            ? "The covered ends remain identical for either private choice. Bronze alone counts; equal votes favor the defendant."
            : "Five known pierced choices force the remaining five solid. With no known choices the same public count permits 252 arrangements.";
        await page.locator("#note").fill(note);
        const pending = page.waitForEvent("download");
        await page.locator("#save-json").click();
        const download = await pending;
        assert.equal(await download.failure(), null);
        const saved = JSON.parse(await readFile(await download.path(), "utf8"));
        assert.equal(saved.version, 2);
        assert.equal(saved.note, note);
        assert.deepEqual(saved.citations, ["tie"]);
        assert.equal(saved.knowledge.known.length, investigation.id === "inference" ? 5 : 0);
        if (investigation.id === "casting")
          assert.deepEqual(saved.observation, { choice: "solid", covered: true });
        await page
          .locator(investigation.id === "inference" ? "#inference" : "#workbench")
          .screenshot({ path: resolve(output, `${name}-${width}-${investigation.id}-lesson.png`) });
        assert.deepEqual(errors, []);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        records.push({
          browser: name,
          version: browser.version(),
          width,
          query: investigation.query,
          aliases: investigation.aliases,
          sharedSearch: shared,
          lesson: destination,
          review,
          reviewSha256: sha(pinned),
          displayedSourceSha256: displayed,
          nativeRecord: saved,
          errors,
        });
        await context.close();
        console.log(
          `${name}/${width}: ${investigation.query} -> ${investigation.id} -> source, native record, pinned review`,
        );
      }
  } finally {
    await browser.close();
  }
}
await writeFile(
  resolve(output, "review.json"),
  JSON.stringify(
    {
      date: new Date().toISOString(),
      catalogue,
      publicCatalogue: new URL(catalogue).hostname === "antonsoo.github.io",
      publicLessonAndReview: true,
      requestRedirection: false,
      records,
    },
    null,
    2,
  ) + "\n",
);
