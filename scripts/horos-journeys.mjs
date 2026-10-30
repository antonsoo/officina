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
const repo = fileURLToPath(new URL("../../horos", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(repo, "src/asset-manifest.json"), "utf8"));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const records = [];
const cases = [
  { id: "two-worlds", query: "λίθος", aliases: ["horse and stone", "ὅροι", "Analytica priora"], page: 26 },
  { id: "inhabitant", query: "ἔκθεσις", aliases: ["ekthesis", "ἂν ληφθῇ", "existential import"], page: 28 },
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
          window.horosBlobs = new Map();
          URL.createObjectURL = (blob) => {
            const url = create(blob);
            window.horosBlobs.set(url, blob);
            return url;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(catalogue);
        const row = page.locator(`[data-project="horos"] [data-workshop="${investigation.id}"]`);
        for (const term of investigation.aliases) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), catalogue, "Typing must not silently rewrite the link");
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
        assert.equal(new URL(destination).searchParams.get("investigation"), investigation.id);
        const match = /\/blob\/([a-f0-9]{40})\/docs\/audit\.md#try-the-actual-work$/.exec(review);
        assert.ok(match);
        const pinned = execFileSync("git", ["-C", repo, "show", `${match[1]}:docs/audit.md`]);
        const response = await fetch(
          `https://raw.githubusercontent.com/antonsoo/horos/${match[1]}/docs/audit.md`,
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
        await expect(page.locator(`[data-lesson="${investigation.id}"]`)).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        await expect(page.locator("#reading")).toHaveValue(investigation.id);
        await expect(page.locator("#scan-status")).toContainText(`Printed page ${investigation.page}`);
        await page.locator("#pin").click();
        if (investigation.id === "two-worlds") {
          await page.locator("#region-5").focus();
          await page.keyboard.press("Space");
          await page.locator("#region-4").click();
          await expect(page.locator("#judgment")).toHaveAttribute("data-status", "counterexample");
          await expect(page.locator("#comparison-note")).toContainText("conclusion changes truth");
          await page.locator("#inspect").click();
          await page.locator(".trace summary").click();
          await page.locator("#load-trace").click();
          await expect(page.locator("#judgment")).toHaveAttribute("data-status", "counterexample");
        } else {
          await page.locator("#region-7").click();
          await page.locator("#region-0").click();
          await expect(page.locator("#judgment")).toHaveAttribute("data-status", "existence");
          await page.locator("#inspect").click();
          await page.locator(".trace summary").click();
          await expect(page.locator("#constraint-trace")).toContainText(
            "C must have an inhabitant has no available region",
          );
          await page.locator("#exists-c").uncheck();
          await expect(page.locator("#judgment")).toHaveAttribute("data-status", "counterexample");
          await expect(page.locator("#comparison-note")).toContainText(
            "Different questions or existence assumptions",
          );
        }
        await page.locator("#locate-scan").click();
        await expect(page.locator("#scan-status")).toContainText("excerpt area is in view");
        const displayed = await page.locator("#scan").evaluate(async (img) => {
          await img.decode();
          const bytes = await window.horosBlobs.get(img.src).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        });
        assert.equal(displayed, manifest.find((a) => a.printedPage === investigation.page).sha256);
        await page.locator("#cite").click();
        const note =
          investigation.id === "two-worlds"
            ? "The C outside A defeats the universal while both premises survive."
            : "Removing the existence assumption admits the outside object; the comparison changes assumptions.";
        await page.locator("#note").fill(note);
        const pending = page.waitForEvent("download");
        await page.locator("#save-json").click();
        const download = await pending;
        const saved = JSON.parse(await readFile(await download.path(), "utf8"));
        assert.equal(saved.current.lesson, investigation.id);
        assert.equal(saved.note, note);
        assert.ok(saved.citations.includes(investigation.id));
        assert.ok(saved.pinned);
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
          nativeNotebook: saved,
          errors,
        });
        await context.close();
        console.log(
          `${name} ${width}: ${investigation.query} -> ${investigation.id} -> Greek source and saved reasoning`,
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
