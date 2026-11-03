import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output, localCourse] = process.argv.slice(2);
assert.ok(catalogue && output, "Supply catalogue URL and receipt directory");
await mkdir(output, { recursive: true });
const projects = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = projects.find((p) => p.name === "stoicheia").workshops.find((w) => w.id === "intersection");
const pin = /\/blob\/([a-f0-9]{40})\/(docs\/[^#]+)/.exec(workshop.reviewUrl);
assert.ok(pin);
const review = execFileSync("git", ["-C", "../stoicheia", "show", `${pin[1]}:${pin[2]}`]);
const hash = (b) => createHash("sha256").update(b).digest("hex");
if (!localCourse) {
  const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/stoicheia/${pin[1]}/${pin[2]}`);
  assert.equal(raw.status, 200);
  assert.deepEqual(Buffer.from(await raw.arrayBuffer()), review);
}
const manifest = JSON.parse(await readFile("../stoicheia/public/sources/manifest.json", "utf8"));
const source = manifest.pages.find((p) => p.printed_page === 12);
const records = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
      await context.addInitScript(() => {
        const create = URL.createObjectURL.bind(URL);
        window.__sourceBlobs = new Map();
        URL.createObjectURL = (blob) => {
          const url = create(blob);
          window.__sourceBlobs.set(url, blob);
          return url;
        };
      });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(catalogue);
      const row = page.locator('[data-project="stoicheia"] [data-workshop="intersection"]');
      const terms = [
        "τέμνουσιν",
        "τεμνουσιν",
        "temnousin",
        "inter se secant",
        "120/241",
        "rational circle intersection",
      ];
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
      }
      await page.locator("#tool-search").fill("τέμνουσιν");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      await page.goto(shared);
      await expect(row).toBeVisible();
      await expect(row.locator(".workshop-review")).toHaveAttribute("href", workshop.reviewUrl);
      await expect(row.locator(".workshop-demo")).toHaveAttribute("href", workshop.url);
      await row.locator("img").evaluate((i) => i.decode());
      await row.screenshot({ path: resolve(output, `${engine}-${width}-discovery.png`) });
      if (!localCourse) {
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.reviewUrl);
        await expect(page.getByRole("heading", { name: "Try the actual work", exact: true })).toBeVisible({
          timeout: 30000,
        });
        await page.goto(shared);
        await expect(row).toBeVisible();
      }
      await row.locator(".workshop-demo").focus();
      if (localCourse) await page.goto(new URL(new URL(workshop.url).hash, localCourse).href);
      else await page.keyboard.press("Enter");
      await expect(page.locator("#intersection-bench")).toBeVisible();
      await expect(page.locator('[data-exact="residual"]')).toContainText("1/241");
      await page.locator("#intersection-places").selectOption("4");
      await expect(page.locator("#intersection-second")).toContainText("1.0021");
      await page.locator("#intersection-trial").selectOption("6");
      await expect(page.locator("#intersection-second")).toContainText("1.0000");
      await expect(page.locator('[data-exact="residual"]')).toContainText("-1/12545");
      await page
        .locator("#intersection-bench")
        .screenshot({ path: resolve(output, `${engine}-${width}-experiment.png`) });
      await page.locator('[data-source="12"]').first().click();
      await expect(page.locator("#course-source-status")).toContainText("Complete printed page verified", {
        timeout: 30000,
      });
      const scanHash = await page.locator("#source-image").evaluate(async (image) => {
        const bytes = await window.__sourceBlobs.get(image.src).arrayBuffer();
        return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      });
      assert.equal(scanHash, source.sha256);
      await page.keyboard.press("Escape");
      const pending = page.waitForEvent("download", { timeout: 120000 });
      await page.locator("#intersection-save").click();
      const downloaded = await pending;
      assert.equal(await downloaded.failure(), null);
      const file = resolve(output, `${engine}-${width}-reading.html`);
      await downloaded.saveAs(file);
      const html = await readFile(file, "utf8");
      assert.match(html, /56\/97/);
      assert.equal((html.match(/data-source-page=/g) ?? []).length, 10);
      const portable = await context.newPage(),
        requests = [];
      portable.on("request", (r) => {
        if (/^https?:/.test(r.url())) requests.push(r.url());
      });
      await portable.goto(pathToFileURL(file).href);
      await portable.evaluate(() => document.fonts.ready);
      await expect(portable.locator(".intersection-saved")).toContainText("-1/12545");
      await page.waitForFunction(
        () => document.querySelector("#offline-state")?.textContent.includes("ready offline"),
        undefined,
        { timeout: 180000 },
      );
      const address = page.url();
      await context.setOffline(true);
      const response = await page.reload();
      assert.equal(response.fromServiceWorker(), true);
      assert.equal(page.url(), address);
      await expect(page.locator('[data-exact="residual"]')).toContainText("-1/12545");
      const offlinePending = page.waitForEvent("download", { timeout: 30000 });
      await page.locator("#intersection-save").click();
      const offlineDownload = await offlinePending;
      assert.equal(await offlineDownload.failure(), null);
      const offlineBytes = await readFile(await offlineDownload.path());
      assert.equal((offlineBytes.toString().match(/data-source-page=/g) ?? []).length, 10);
      assert.deepEqual(requests, []);
      assert.deepEqual(errors, []);
      records.push({
        engine,
        width,
        terms,
        shared,
        destination: workshop.url,
        localCourse: localCourse ?? null,
        reviewUrl: workshop.reviewUrl,
        reviewSha256: hash(review),
        remoteReviewVerified: !localCourse,
        nativePinnedReviewOpened: !localCourse,
        sourcePage: 12,
        sourceSha256: scanHash,
        nativeReadingBytes: Buffer.byteLength(html),
        nativeReadingSha256: hash(html),
        embeddedScans: 10,
        portableNetworkRequests: 0,
        directOfflineReloadAndNativeReading: true,
        pageErrors: 0,
      });
      await context.close();
      console.log(
        `${engine} ${width}: Greek search -> I.1 point rule -> exact residual -> source -> independent reading`,
      );
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  resolve(output, "receipt.json"),
  `${JSON.stringify({ checkedAt: new Date().toISOString(), catalogue, publicCatalogue: new URL(catalogue).hostname === "antonsoo.github.io", records }, null, 2)}\n`,
);
