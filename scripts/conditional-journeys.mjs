import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert.ok(catalogue && output, "Supply the catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile("../horos/src/conditional-assets.json", "utf8"));
const hash = (b) => createHash("sha256").update(b).digest("hex");
const journeys = [];
for (const [engine, api] of [["chromium", chromium], ["firefox", firefox]]) {
  const browser = await api.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(catalogue);
      const row = page.locator('[data-project="horos"] [data-workshop="conditionals"]');
      const aliases = ["συνάρτησις", "συναρτησιν", "synartesis", "Philo", "Diodorus", "συνημμένον", "synemmenon", "pugnet"];
      for (const term of aliases) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(page.url(), catalogue);
      }
      await page.locator("#tool-search").fill("συνάρτησις");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      await page.goto(shared);
      await expect(row).toBeVisible();
      const review = await row.locator(".workshop-review").getAttribute("href");
      const match = /\/blob\/([a-f0-9]{40})\/docs\/conditional-review\.md#try-the-actual-work$/.exec(review);
      assert.ok(match);
      const pinned = execFileSync("git", ["-C", "../horos", "show", `${match[1]}:docs/conditional-review.md`]);
      const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/horos/${match[1]}/docs/conditional-review.md`);
      assert.equal(raw.status, 200);
      assert.deepEqual(Buffer.from(await raw.arrayBuffer()), pinned);
      await row.locator("img").evaluate((i) => i.decode());
      await row.screenshot({ path: resolve(output, `${engine}-${width}-discovery.png`) });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(review);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await page.goto(shared);
      const destination = await row.locator(".workshop-demo").getAttribute("href");
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(destination);
      await expect(page.locator("#source-status")).toContainText("Complete printed page 92");
      await page.locator("#pin").click();
      await page.locator("#allow-2").uncheck();
      await expect(page.locator("#philo-result")).toContainText("True here");
      await expect(page.locator("#connection-result")).toContainText("Passes this table");
      await expect(page.locator("#comparison-note")).toContainText("Only the admitted-case table has changed");
      await page.locator("#reading").selectOption("connection");
      await page.getByRole("button", { name: "μάχηται", exact: true }).click();
      await expect(page.locator("#word-note")).toContainText("pugnet");
      await page.locator("#locate-source").click();
      await expect(page.locator("#source-status")).toContainText("Complete printed page 92");
      const note = "The current pair stays true. I excluded day with silence by assumption; that checkbox alone does not establish μάχηται.";
      await page.locator("#note").fill(note);
      const pending = page.waitForEvent("download");
      await page.locator("#save-html").click();
      const d = await pending;
      assert.equal(await d.failure(), null);
      const bytes = await readFile(await d.path());
      const embedded = [...bytes.toString().matchAll(/data:(?:image\/jpeg|font\/woff2);base64,([A-Za-z0-9+/=]+)/g)].map((m) => hash(Buffer.from(m[1], "base64")));
      for (const a of manifest.filter((x) => ["image/jpeg", "font/woff2"].includes(x.mime))) assert.ok(embedded.includes(a.sha256));
      const path = resolve(output, `${engine}-${width}-reading.html`);
      await writeFile(path, bytes);
      const portable = await context.newPage();
      const requests = [];
      portable.on("request", (r) => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
      await portable.goto(pathToFileURL(path).href);
      await portable.evaluate(() => document.fonts.ready);
      await expect(portable.locator(".note")).toHaveText(note);
      assert.ok(await portable.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const nd = portable.waitForEvent("download");
      await portable.getByRole("link", { name: "Download editable notebook", exact: true }).click();
      const record = JSON.parse(await readFile(await (await nd).path(), "utf8"));
      assert.equal(record.note, note);
      assert.equal(record.current.allowed, 11);
      assert.equal(record.pinned.allowed, 15);
      assert.deepEqual(requests, []);
      assert.deepEqual(errors, []);
      journeys.push({ engine, width, aliases, shared, destination, review, reviewSha256: hash(pinned), unchangedPresent: record.current.now === record.pinned.now, changedAssumptions: true, greekToLatin: "μάχηται -> pugnet", embeddedBinaryAssets: embedded.length, nativeHtmlBytes: bytes.length, editableRoundTrip: true, portableRequests: requests, errors });
      await context.close();
      console.log(`${engine} ${width}: source-word search -> conditional -> Greek/Latin -> portable reading -> editable notebook`);
    }
  } finally { await browser.close(); }
}
await writeFile(resolve(output, "receipt.json"), JSON.stringify({ date: new Date().toISOString(), catalogue, publicCatalogue: new URL(catalogue).hostname === "antonsoo.github.io", journeys }, null, 2) + "\n");
