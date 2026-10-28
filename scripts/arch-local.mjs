import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, lesson, repo, output] = process.argv.slice(2);
assert(
  catalogue && lesson && repo && output,
  "Supply local catalogue URL, local Gonia URL, Gonia checkout and output folder.",
);
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(path.join(repo, "public/sources/arch/manifest.json"), "utf8"));
const records = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375])
      for (const query of ["arch and pier", "latiores", "cunei", "coagmenta", "pier thrust"]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          serviceWorkers: "block",
        });
        await context.addInitScript(() => {
          window.__archBlobs = new Map();
          const original = URL.createObjectURL;
          URL.createObjectURL = (blob) => {
            const url = original.call(URL, blob);
            window.__archBlobs.set(url, blob);
            return url;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        // This is an unpublished local addition. Only the future lesson entry is
        // redirected; the catalogue's actual canonical link is checked separately.
        await page.route("https://antonsoo.github.io/gonia/arch.html*", (route) => {
          const canonical = new URL(route.request().url()),
            local = new URL("arch.html", lesson);
          local.search = canonical.search;
          local.hash = canonical.hash;
          return route.fulfill({ status: 302, headers: { location: local.href } });
        });
        await page.goto(catalogue);
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        await search.waitFor();
        const address = page.url();
        await search.fill(query);
        assert.equal(page.url(), address);
        await page.locator("#copy-search-link").focus();
        await page.keyboard.press("Enter");
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), query);
        await page.goto(shared);
        await expect(page.getByRole("searchbox", { name: "Find a tool" })).toHaveValue(query);
        const row = page.locator('[data-project="gonia"] [data-workshop="arch"]');
        await expect(row).toBeVisible();
        const target = await row.locator(".workshop-demo").getAttribute("href"),
          review = await row.locator(".workshop-review").getAttribute("href");
        assert.equal(new URL(target).pathname, "/gonia/arch.html");
        assert.equal(new URL(target).hash, "#ar-bench");
        const pin = /\/blob\/([a-f0-9]{40})\/docs\/arch-review\.md#try-the-actual-work$/.exec(review);
        assert.ok(pin);
        const pinned = execFileSync("git", ["-C", repo, "show", `${pin[1]}:docs/arch-review.md`]);
        assert.ok(pinned.toString().includes("## Try the actual work"));
        await row.locator("img").scrollIntoViewIfNeeded();
        await row.locator("img").evaluate((img) => img.decode());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (query === "arch and pier") {
          await page.evaluate(async () => {
            scrollTo(0, 0);
            await document.fonts.ready;
          });
          await page.screenshot({
            path: path.join(output, `${engine}-${width}-catalogue.png`),
            fullPage: true,
          });
        }
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await page.waitForURL(
          (url) => url.origin === new URL(lesson).origin && url.pathname.endsWith("/arch.html"),
        );
        await page.locator("#ar-title").waitFor();
        await expect(page.locator("#ar-verdict")).toContainText("bases need more restraint");
        await page.locator("#ar-width").focus();
        await page.keyboard.press("End");
        await expect(page.locator("#ar-width-value")).toHaveText("1.4");
        await expect(page.locator("#ar-mass-value")).toHaveText("1");
        await expect(page.locator("#ar-verdict")).toContainText("fits the arch and the bases");
        await page.locator("#ar-fit-whole").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#ar-status")).toContainText("Found one path");
        await page.locator("#ar-joint").selectOption("4");
        await expect(page.locator("#ar-contact-note")).toContainText("Joint 4: contact inside");
        await expect(page.locator("#ar-source-caption")).toContainText("identity verified");
        const sha = await page.locator("#ar-source-image").evaluate(async (img) => {
          await img.decode();
          const data = await window.__archBlobs.get(img.src).arrayBuffer();
          return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), (b) =>
            b.toString(16).padStart(2, "0"),
          ).join("");
        });
        assert.equal(sha, manifest.pages[0].sha256);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        records.push({
          engine,
          width,
          query,
          canonicalLessonURL: target,
          sharedSearchURL: shared,
          localLessonURL: page.url(),
          pinnedReviewURL: review,
          pinnedReviewSha256: createHash("sha256").update(pinned).digest("hex"),
          actualSourceImageSha256: sha,
          operation:
            "Keyboard widening repairs base contact without changing pier weight; a fitted path and joint 4 are then inspected.",
          publicDeliveryVerified: false,
          errors,
        });
        await context.close();
      }
  } finally {
    await browser.close();
  }
}
await writeFile(
  path.join(output, "review.json"),
  `${JSON.stringify({ scope: "Local discovery and operation. Future canonical lesson entry explicitly redirected; exact pinned review git blob verified locally. No public delivery claim.", records }, null, 2)}\n`,
);
console.log(`Completed ${records.length} local catalogue-to-arch journeys.`);
