import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, lesson, repo, output] = process.argv.slice(2);
assert(
  catalogue && lesson && repo && output,
  "Supply local catalogue URL, local Zygon URL, source checkout and output folder.",
);
const publicDelivery = process.argv.includes("--public");
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(path.join(repo, "src/parabola-sources.json"), "utf8"));
const records = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375])
      for (const query of ["parabola", "ἐπίτριτον", "tertia parte maius", "last layer", "Method I"]) {
        console.log(`${engine} ${width} ${query}`);
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
        // The feature is local. Redirect its future canonical route explicitly;
        // an unpublished pin is inspected from Git, not asserted to be public.
        if (!publicDelivery)
          await page.route("https://antonsoo.github.io/zygon/parabola.html*", (route) => {
            const canonical = new URL(route.request().url()),
              local = new URL("parabola.html", lesson);
            local.search = canonical.search;
            local.hash = canonical.hash;
            return route.fulfill({ status: 302, headers: { location: local.href } });
          });
        await page.goto(catalogue);
        const search = page.getByRole("searchbox", { name: "Find a tool" });
        await search.waitFor();
        const initial = page.url();
        await search.fill(query);
        assert.equal(page.url(), initial);
        await page.locator("#copy-search-link").focus();
        await page.keyboard.press("Enter");
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), query);
        await page.goto(shared);
        await expect(search).toHaveValue(query);
        const row = page.locator('[data-project="zygon"] [data-workshop="parabola"]');
        await expect(row).toBeVisible();
        const target = await row.locator(".workshop-demo").getAttribute("href");
        const review = await row.locator(".workshop-review").getAttribute("href");
        assert.equal(new URL(target).pathname, "/zygon/parabola.html");
        assert.equal(new URL(target).hash, "#pa-bench");
        const pin = /\/blob\/([a-f0-9]{40})\/docs\/parabola-review\.md#try-the-actual-work$/.exec(review);
        assert.ok(pin);
        const pinned = execFileSync("git", ["-C", repo, "show", `${pin[1]}:docs/parabola-review.md`]);
        assert.ok(pinned.toString().includes("## Try the actual work"));
        if (publicDelivery) {
          const raw = `https://raw.githubusercontent.com/antonsoo/zygon/${pin[1]}/docs/parabola-review.md`;
          const response = await fetch(raw);
          assert.equal(response.status, 200);
          assert.deepEqual(Buffer.from(await response.arrayBuffer()), pinned);
        }
        if (!publicDelivery)
          await page.route(review.split("#")[0], (route) =>
            route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: pinned }),
          );
        await row.locator("img").evaluate((img) => img.decode());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (query === "parabola")
          await page.screenshot({
            path: path.join(output, `${engine}-${width}-catalogue.png`),
            fullPage: true,
          });
        await row.locator(".workshop-review").press("Enter");
        await expect(page).toHaveURL(/\/docs\/parabola-review\.md#try-the-actual-work$/);
        if (publicDelivery) await expect(page.locator("article")).toContainText("Try the actual work");
        else assert.equal(await page.locator("body").textContent(), pinned.toString());
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator(".workshop-demo").press("Enter");
        await expect(page).toHaveURL(new URL("parabola.html#pa-bench", lesson).href);
        await page.locator("#pa-title").waitFor();
        await page.waitForLoadState("load");
        await page.locator("#pa-find-arm").press("Enter");
        await expect(page.locator("#pa-verdict")).toContainText("every interior cut");
        await page.locator("#pa-end").click();
        await expect(page.locator("#pa-verdict")).toContainText("cannot choose an arm");
        await page.locator("#pa-fill-view").click();
        await expect(page.locator("#pa-identity")).toContainText("5/4 + 1/12 = 4/3");
        await page.locator("#pa-add").click();
        await expect(page.locator("#pa-identity")).toContainText("21/16 + 1/48 = 4/3");
        await page.locator("#pa-small-gap").click();
        await expect(page.locator("#pa-account")).toContainText("1/512");
        await expect(page.locator("#pa-verdict")).toContainText("No finite layer");
        await page.locator("#pa-reading-select").selectOption("5");
        await expect(page.locator("#pa-reading-text")).toContainText("τοῦ ἐλαχίστου");
        await expect(page.locator("#pa-reading-text")).toContainText("tertia pars minimae");
        await page.locator("#pa-greek-page").click();
        await expect(page.locator("#pa-source-caption")).toContainText("identity verified");
        const sha = await page.locator("#pa-source-image").evaluate(async (img) => {
          await img.decode();
          const b = await window.__archBlobs.get(img.src).arrayBuffer();
          return [...new Uint8Array(await crypto.subtle.digest("SHA-256", b))]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("");
        });
        assert.equal(sha, manifest.pages[7].sha256);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        records.push({
          engine,
          width,
          query,
          canonicalLessonURL: target,
          sharedSearchURL: shared,
          pinnedReviewURL: review,
          pinnedReviewSha256: createHash("sha256").update(pinned).digest("hex"),
          actualSourceImageSha256: sha,
          operation:
            "Balance all interior cuts, reject an inconclusive endpoint, add a finite layer, retain the exact third and strict bound gap; read Greek/Latin and inspect the actual complete scan",
          publicDeliveryVerified: publicDelivery,
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
  `${JSON.stringify({ scope: publicDelivery ? "Public catalogue search, explicit shared link, keyboard navigation through the actual GitHub pinned review and canonical lesson, source bytes verified against the retained manifest; no request redirection." : "Local catalogue discovery, local pinned review blob rendered through its canonical link, and actual local lesson/source operation. Future canonical entries explicitly redirected. No public delivery claim.", records }, null, 2)}\n`,
);
console.log(
  `Completed ${records.length} ${publicDelivery ? "public" : "local"} catalogue-to-parabola journeys.`,
);
