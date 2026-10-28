import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, lesson, repo, output] = process.argv.slice(2);
assert(catalogue && lesson && repo && output, "Supply local catalogue URL, local Stoicheia URL, source checkout and output folder.");
const publicDelivery = process.argv.includes("--public");
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(path.join(repo, "public/sources/areas/manifest.json"), "utf8"));
const records = [];
for (const [engine, launcher] of [["chromium", chromium], ["firefox", firefox]]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375])
      for (const query of ["application of areas", "ἐλλεῖπον", "ὑπερβάλλον", "deficiens", "excedens"]) {
        console.log(`${engine} ${width} ${query}`);
        const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
        await context.addInitScript(() => {
          window.__areaBlobs = new Map();
          const original = URL.createObjectURL;
          URL.createObjectURL = (blob) => { const url = original.call(URL, blob); window.__areaBlobs.set(url, blob); return url; };
        });
        const page = await context.newPage(), errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        // The feature is local. Redirect its future canonical route explicitly;
        // an unpublished pin is inspected from Git, not asserted to be public.
        if (!publicDelivery) await page.route("https://antonsoo.github.io/stoicheia/areas.html*", (route) => {
          const canonical = new URL(route.request().url()), local = new URL("areas.html", lesson);
          local.search = canonical.search; local.hash = canonical.hash;
          return route.fulfill({ status: 302, headers: { location: local.href } });
        });
        await page.goto(catalogue);
        const search = page.getByRole("searchbox", { name: "Find a tool" }); await search.waitFor();
        const initial = page.url(); await search.fill(query); assert.equal(page.url(), initial);
        await page.locator("#copy-search-link").focus(); await page.keyboard.press("Enter");
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), query);
        await page.goto(shared); await expect(search).toHaveValue(query);
        const row = page.locator('[data-project="stoicheia"] [data-workshop="areas"]');
        await expect(row).toBeVisible();
        const target = await row.locator(".workshop-demo").getAttribute("href");
        const review = await row.locator(".workshop-review").getAttribute("href");
        assert.equal(new URL(target).pathname, "/stoicheia/areas.html"); assert.equal(new URL(target).hash, "#ar-bench");
        const pin = /\/blob\/([a-f0-9]{40})\/docs\/areas-review\.md#try-the-actual-work$/.exec(review); assert.ok(pin);
        const pinned = execFileSync("git", ["-C", repo, "show", `${pin[1]}:docs/areas-review.md`]);
        assert.ok(pinned.toString().includes("## Try the actual work"));
        if (publicDelivery) {
          const raw = `https://raw.githubusercontent.com/antonsoo/stoicheia/${pin[1]}/docs/areas-review.md`;
          const response = await fetch(raw); assert.equal(response.status, 200);
          assert.deepEqual(Buffer.from(await response.arrayBuffer()), pinned);
        }
        if (!publicDelivery) await page.route(review.split("#")[0], (route) => route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: pinned }));
        await row.locator("img").evaluate((img) => img.decode());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (query === "application of areas") await page.screenshot({ path: path.join(output, `${engine}-${width}-catalogue.png`), fullPage: true });
        await row.locator(".workshop-review").focus(); await page.keyboard.press("Enter");
        await expect(page).toHaveURL(/\/docs\/areas-review\.md#try-the-actual-work$/);
        if (publicDelivery) await expect(page.locator("article")).toContainText("Try the actual work");
        else assert.equal(await page.locator("body").textContent(), pinned.toString());
        await page.goto(shared); await expect(row).toBeVisible();
        await row.locator(".workshop-demo").focus(); await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`${new URL(lesson).origin.replaceAll(".", "\\.")}/stoicheia/areas\\.html#ar-bench$`));
        await page.locator("#ar-title").waitFor();
        await page.locator("#ar-reflect").focus(); await page.keyboard.press("Enter");
        await expect(page.locator("#ar-trial")).toHaveValue("9"); await expect(page.locator("#ar-result")).toContainText("fits exactly");
        await page.locator('[data-ar-case="impossible"]').click(); await expect(page.locator("#ar-solutions")).toContainText("No fit");
        await page.locator("#ar-read-condition").click(); await expect(page.locator("#ar-reading-text")).toContainText("μὴ μεῖζον");
        await page.locator("#ar-mode").selectOption("beyond");
        await page.locator('[data-ar-fit="0"]').click(); await expect(page.locator("#ar-result")).toContainText("fits exactly");
        await expect(page.locator("#ar-target")).toHaveValue("45"); await expect(page.locator("#ar-trial")).toHaveValue("3");
        await page.locator("#ar-read-condition").click(); await expect(page.locator("#ar-reading-text")).toContainText("ὑπερβάλλον");
        await page.locator("#ar-greek").click(); await expect(page.locator("#ar-source-caption")).toContainText("Printed p.166");
        const sha = await page.locator("#ar-source-image").evaluate(async (img) => {
          await img.decode(); const b = await window.__areaBlobs.get(img.src).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", b))].map((v) => v.toString(16).padStart(2, "0")).join("");
        });
        assert.equal(sha, manifest.pages.find((p) => p.page === 166).sha256);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); assert.deepEqual(errors, []);
        records.push({ engine, width, query, canonicalLessonURL: target, sharedSearchURL: shared, pinnedReviewURL: review, pinnedReviewSha256: createHash("sha256").update(pinned).digest("hex"), actualSourceImageSha256: sha, operation: "Reflect the equal-area fit, keep impossible target 45, change to exceeding and fit at 3; read the changed condition and verify its actual Greek page.", publicDeliveryVerified: publicDelivery, errors });
        await context.close();
      }
  } finally { await browser.close(); }
}
await writeFile(path.join(output, "review.json"), `${JSON.stringify({ scope: publicDelivery ? "Public catalogue search, explicit shared link, keyboard navigation through the actual GitHub pinned review and canonical lesson, source bytes verified against the retained manifest; no request redirection." : "Local catalogue discovery, local pinned review blob rendered through its canonical link, and actual local lesson/source operation. Future canonical entries explicitly redirected. No public delivery claim.", records }, null, 2)}\n`);
console.log(`Completed ${records.length} ${publicDelivery ? "public" : "local"} catalogue-to-area journeys.`);
