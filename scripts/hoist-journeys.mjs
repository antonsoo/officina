import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [base, destination] = process.argv.slice(2);
assert(base && destination, "Supply the catalogue URL and receipt directory.");
const out = path.resolve(destination);
await mkdir(out, { recursive: true });
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = catalogue.find((p) => p.name === "gonia").workshops.find((w) => w.id === "hoist");
const pin = /\/blob\/([a-f0-9]{40})\/docs\/hoist-audit\.md#try-the-actual-work$/.exec(
  workshop.reviewUrl,
)?.[1];
assert(pin, "The source review must use an immutable revision.");
const document = execFileSync("git", ["-C", "../gonia", "show", `${pin}:docs/hoist-audit.md`]);
const response = await fetch(`https://raw.githubusercontent.com/antonsoo/gonia/${pin}/docs/hoist-audit.md`);
assert(response.ok);
assert.deepEqual(Buffer.from(await response.arrayBuffer()), document);
const manifest = JSON.parse(await readFile("../gonia/public/sources/hoist/manifest.json", "utf8"));
const rows = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (error) => {
        if (!page.url().startsWith("https://github.com/")) errors.push(error.message);
      });
      await page.goto(base);
      const row = page.locator('[data-project="gonia"] [data-workshop="hoist"]');
      const terms = ["religatur", "trispastos", "unequal tensions", "pulley losses", "ὑπομόχλιον"];
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
      }
      await page.locator("#tool-search").fill("religatur");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "religatur");
      await page.goto(shared);
      await expect(row).toBeVisible();
      await row.locator("img").evaluate((image) => image.decode());
      assert.equal(await row.locator(".workshop-demo").getAttribute("href"), workshop.url);
      assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
      await row.screenshot({ path: path.join(out, `${engine}-${width}-catalogue.png`) });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.reviewUrl);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.url);
      await page.waitForFunction(
        () => document.querySelector("#hw-offline")?.textContent === "Workshop & source saved offline",
        null,
        { timeout: 90000 },
      );
      await expect(page.locator("#hw-loss-finding")).toContainText("81.3%");
      const slider = page.locator("#hw-efficiency");
      await slider.focus();
      await page.keyboard.press("ArrowLeft");
      assert.equal(await slider.inputValue(), "89");
      assert(await slider.evaluate((e) => e === document.activeElement));
      await page.locator("#hw-try-loss").click();
      await page.locator("#hw-rig").selectOption("five");
      const fiveWork = Number(await page.locator("#hw-work-drawing svg").getAttribute("data-input"));
      assert(Math.abs(fiveWork - 813.9809365664656) < 1e-8);
      await page.locator("#hw-try-loss").click();
      await page.locator("#hw-read-tie").click();
      await page.getByRole("button", { name: "religatur", exact: true }).click();
      await expect(page.locator("#hw-word-note")).toContainText("is tied");
      await page.waitForFunction(() => {
        const image = document.querySelector("#hw-source-image");
        return image.complete && image.naturalWidth > 0;
      });
      const displayedSourceSha = await page
        .locator("#hw-source-image")
        .evaluate(async (image) =>
          Array.from(
            new Uint8Array(
              await crypto.subtle.digest("SHA-256", await (await fetch(image.src)).arrayBuffer()),
            ),
            (b) => b.toString(16).padStart(2, "0"),
          ).join(""),
        );
      assert.equal(displayedSourceSha, manifest.assets["sources/hoist/krohn-227.jpg"]);
      const pending = page.waitForEvent("download", { timeout: 60000 });
      await page.locator("#hw-save-reading").click();
      const download = await pending,
        file = path.join(out, `${engine}-${width}-reading.html`);
      await download.saveAs(file);
      const html = await readFile(file, "utf8");
      assert.match(html, /chosen turning-wheel tension transfer 90%/);
      assert.match(html, /Required Notice: Copyright/);
      assert(!/<script\b|\son\w+=/i.test(html));
      const local = await context.newPage(),
        remote = [];
      local.on("request", (r) => {
        if (/^https?:/.test(r.url())) remote.push(r.url());
      });
      await local.goto(pathToFileURL(file).href);
      await local.evaluate(() => document.fonts.ready);
      const images = await local
        .locator(".printed img")
        .evaluateAll((imgs) => imgs.map((i) => i.src.split(",")[1]));
      assert.equal(images.length, 5);
      for (const [i, key] of ["title", "226", "227", "232", "233"].entries())
        assert.equal(
          sha(Buffer.from(images[i], "base64")),
          manifest.assets[`sources/hoist/krohn-${key}.jpg`],
        );
      assert.deepEqual(remote, []);
      assert.equal(
        Number(await local.locator("[data-efficiency]").getAttribute("data-efficiency")).toFixed(3),
        "0.813",
      );
      await local.close();
      await page.locator("#hw-losses").screenshot({ path: path.join(out, `${engine}-${width}-lesson.png`) });
      await context.setOffline(true);
      await page.reload();
      await expect(page.locator("#hw-loss-finding")).toContainText("81.3%");
      const offline = page.waitForEvent("download");
      await page.locator("#hw-save-reading").click();
      const offlineFile = path.join(out, `${engine}-${width}-offline.html`);
      await (await offline).saveAs(offlineFile);
      assert.deepEqual(await readFile(offlineFile), Buffer.from(html));
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
        displayedSourceSha,
        nativeReadingBytes: Buffer.byteLength(html),
        nativeReadingSha256: sha(html),
        sameStudyBrowserOffline: true,
        standaloneRemoteRequests: 0,
        errors,
      });
      await context.close();
      console.log(
        `${engine} ${width}: search, pinned review, operated tensions, Latin source, native study and identical offline download passed`,
      );
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  path.join(out, "review.json"),
  `${JSON.stringify({ base, checkedAt: new Date().toISOString(), rows }, null, 2)}\n`,
);
