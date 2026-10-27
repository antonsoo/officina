import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
const [catalogue, lesson, repo, output] = process.argv.slice(2);
assert(
  catalogue && lesson && repo && output,
  "Supply local catalogue URL, local Pyknon URL, Pyknon checkout and output folder.",
);
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(path.join(repo, "public/sources/helikon/manifest.json"), "utf8"));
const source = manifest.pages.find((p) => p.id === "100");
assert(source);
const records = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375])
      for (const query of ["helikon", "υπαγωγεα", "subductorium"]) {
        console.log(`${engine} ${width}: ${query}`);
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          serviceWorkers: "block",
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        // This addition is intentionally local. Redirect only its future canonical
        // lesson entry to the reviewed local build; do not imply public delivery.
        await page.route("https://antonsoo.github.io/pyknon/helikon.html*", async (route) => {
          const canonical = new URL(route.request().url()),
            local = new URL("helikon.html", lesson);
          local.search = canonical.search;
          local.hash = canonical.hash;
          await route.fulfill({ status: 302, headers: { location: local.href } });
        });
        await page.goto(catalogue);
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        await search.waitFor();
        const before = page.url();
        await search.fill(query);
        assert.equal(page.url(), before);
        await page.locator("#copy-search-link").focus();
        await page.keyboard.press("Enter");
        const sharedSearch = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(sharedSearch).searchParams.get("q"), query);
        await page.goto(sharedSearch);
        await expect(page.getByRole("searchbox", { name: "Find a tool" })).toHaveValue(query);

        const row = page.locator('[data-project="pyknon"] [data-workshop="helikon"]');
        await expect(row).toBeVisible();
        const demo = row.locator(".workshop-demo"),
          review = row.locator(".workshop-review");
        const canonical = await demo.getAttribute("href"),
          reviewURL = await review.getAttribute("href");
        assert.equal(new URL(canonical).pathname, "/pyknon/helikon.html");
        const match = /\/blob\/([a-f0-9]{40})\/docs\/helikon-review\.md#try-the-actual-work$/.exec(reviewURL);
        assert(match);
        const pinned = execFileSync("git", ["-C", repo, "show", `${match[1]}:docs/helikon-review.md`]);
        assert(pinned.toString().includes("## Try the actual work"));
        await row.locator("img").scrollIntoViewIfNeeded();
        await row.locator("img").evaluate((i) => i.decode());
        await page.evaluate(async () => {
          scrollTo(0, 0);
          await document.fonts.ready;
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        if (query === "helikon")
          await page.screenshot({
            path: path.join(output, `${engine}-${width}-catalogue.png`),
            fullPage: true,
          });
        await demo.focus();
        await page.keyboard.press("Enter");
        await page.waitForURL(
          (url) => url.origin === new URL(lesson).origin && url.pathname.endsWith("/helikon.html"),
        );
        await page.locator("#hk-title").waitFor();
        await expect(page.locator("#hk-retuning-result")).toContainText("2 of 4");
        await page.locator("#hk-fit").focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#hk-retuning-result")).toContainText("All four");
        await page.locator("#hk-scale").focus();
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator("#hk-transposition")).toContainText("240 Hz");
        assert.deepEqual(await page.locator("#hk-retuning-table tbody tr td:last-child").allTextContents(), [
          "0 · exact",
          "0 · exact",
          "0 · exact",
          "0 · exact",
        ]);
        await expect(page.locator("#hk-source-status")).toContainText("Verified complete page");
        assert((await page.locator("#hk-reading-body").innerText()).includes("subductorium"));
        const digest = await page.locator("#hk-source-image").evaluate(async (img) => {
          const b = await (await fetch(img.src)).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", b))]
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("");
        });
        assert.equal(digest, source.sha256);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        if (query === "helikon")
          await page
            .locator("#hk-retuning")
            .screenshot({ path: path.join(output, `${engine}-${width}-operation.png`) });
        records.push({
          engine,
          width,
          query,
          canonicalLessonURL: canonical,
          sharedSearchURL: sharedSearch,
          localLessonURL: page.url(),
          pinnedReviewURL: reviewURL,
          pinnedReviewCommit: match[1],
          localPinnedReviewSha256: createHash("sha256").update(pinned).digest("hex"),
          actualSourcePageSha256: digest,
          action:
            "Keyboard fitting moves inner strings to 1/7 and 1/4; shortening the sounding scale raises the left note to 240 Hz while all four ratios still agree.",
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
  `${JSON.stringify({ scope: "Local catalogue discovery to the real local workshop; future canonical lesson entry explicitly redirected; review target verified against the exact local git blob. No public delivery claim.", records }, null, 2)}\n`,
);
console.log(`Completed ${records.length} local discovery journeys.`);
