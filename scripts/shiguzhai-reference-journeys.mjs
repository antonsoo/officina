import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const publicMode = process.argv.includes("--public");
const output = path.resolve(process.argv[2] ?? "/tmp/officina-bell-reference");
await mkdir(output, { recursive: true });
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = catalogue.find((project) => project.name === "shiguzhai").workshops[0];
const pinned = /\/blob\/([a-f0-9]{40})\/(.+)$/.exec(new URL(workshop.reviewUrl).pathname);
assert(pinned);
const [, commit, reviewPath] = pinned;
const review = execFileSync("git", ["-C", "../shiguzhai", "show", `${commit}:${reviewPath}`]);
assert.deepEqual(review, await readFile(path.join("../shiguzhai", reviewPath)));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://local");
  const match = /^\/(officina|shiguzhai)\/(.*)$/.exec(url.pathname);
  if (!match || match[2].includes("..")) {
    response.writeHead(404).end();
    return;
  }
  const root = match[1] === "officina" ? "dist" : "../shiguzhai/dist";
  const file = match[2] || "index.html";
  try {
    const bytes = await readFile(path.join(root, file));
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".json": "application/json",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
    };
    response
      .writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" })
      .end(bytes);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const base = publicMode ? "https://antonsoo.github.io/officina/" : `${origin}/officina/`;
if (publicMode) {
  const raw = `https://raw.githubusercontent.com/antonsoo/shiguzhai/${commit}/${reviewPath}`;
  const response = await fetch(raw, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), review);
}
const results = [];
try {
  for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
    const browser = await launcher.launch();
    try {
      for (const width of [1440, 375]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          reducedMotion: "reduce",
          serviceWorkers: "block",
          acceptDownloads: true,
        });
        // These URLs retain their actual destinations while all bytes are from
        // local builds / the immutable local commit. This is not a hosted review.
        if (!publicMode)
          await context.route("https://antonsoo.github.io/shiguzhai/**", async (route) => {
            const requested = new URL(route.request().url());
            const response = await fetch(origin + requested.pathname + requested.search);
            await route.fulfill({
              status: response.status,
              headers: { "content-type": response.headers.get("content-type") },
              body: Buffer.from(await response.arrayBuffer()),
            });
          });
        if (!publicMode)
          await context.route("https://github.com/antonsoo/shiguzhai/blob/**", async (route) => {
            assert.equal(new URL(route.request().url()).pathname, new URL(workshop.reviewUrl).pathname);
            await route.fulfill({ contentType: "text/plain; charset=utf-8", body: review });
          });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(base);
        const row = page.locator('[data-project="shiguzhai"] [data-workshop="reference-boundaries"]');
        const terms = ["269 Hz", "439.523", "reference boundary", "classification", "石鼓寨"];
        for (const term of terms) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), base, "Typing must not silently share a new URL");
        }
        await page.locator('[data-group="Ancient world"]').click();
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), "石鼓寨");
        assert.equal(new URL(shared).searchParams.get("audience"), "Ancient world");
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((image) => image.decode());
        assert.equal(await row.locator(".workshop-demo").getAttribute("href"), workshop.url);
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        await row.screenshot({ path: path.join(output, `${engine}-${width}-catalogue.png`) });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.reviewUrl);
        await expect(page.locator("body")).toContainText("What a learner can do");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.url);
        await page.waitForFunction(
          () => document.querySelector("#reference").getBoundingClientRect().top < 100,
        );
        await expect(page.locator("#reference-result")).toContainText(
          "Held 439.523 Hz: 9 keys. Current 439.524 Hz: 10 keys.",
        );
        await page.locator("#hold-reference").click();
        await page.locator("#precise-a4").fill("439.523");
        await page.locator("#precise-a4").press("Enter");
        await expect(page.locator("#reference-result")).toContainText(
          "Held 439.524 Hz: 10 keys. Current 439.523 Hz: 9 keys.",
        );
        await page.locator("#show-table").click();
        const imageUrl = await page.locator("#printed-table image").getAttribute("href");
        const source = await page.evaluate(
          async (relative) => Array.from(new Uint8Array(await (await fetch(relative)).arrayBuffer())),
          imageUrl,
        );
        assert.equal(
          hash(Buffer.from(source)),
          hash(await readFile("../shiguzhai/public/sources/li-2024-table-1.jpg")),
        );
        const pending = page.waitForEvent("download");
        await page.locator("#save-reading").click();
        const downloaded = await pending;
        const html = await readFile(await downloaded.path(), "utf8");
        assert(html.includes("Held A4 439.524 Hz: 10 keys"));
        assert(html.includes("Current A4 439.523 Hz: 9 keys"));
        assert(!/<script\b/i.test(html));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        assert.deepEqual(errors, []);
        results.push({
          engine,
          width,
          terms,
          sharedQuery: new URL(shared).search,
          destination: workshop.url,
          review: workshop.reviewUrl,
          pinnedReviewSha256: hash(review),
          canonicalRawReviewByteEqual: publicMode,
          actualReadingSha256: hash(Buffer.from(html)),
          actualReadingBytes: Buffer.byteLength(html),
          sourceImageSha256: hash(Buffer.from(source)),
          pageErrors: errors,
        });
        await context.close();
        process.stdout.write(
          `${engine} ${width}: search, shared link, pinned ${publicMode ? "public" : "local"} review, operated lesson, source and downloaded reading passed\n`,
        );
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}
await writeFile(
  path.join(output, "receipt.json"),
  `${JSON.stringify({ scope: publicMode ? "Canonical public catalogue and lesson URLs without response interception, pinned GitHub review followed by keyboard and exact raw review byte comparison. Service workers blocked for fresh network discovery; public worker and offline behavior verified separately in Shiguzhai. This is browser delivery evidence, separate from source synchronization and remote CI." : "Local catalogue-to-lesson route. Public lesson URLs and pinned review URL are fulfilled from local dist files and the actual local commit. Service workers blocked here; offline behavior verified separately in the lesson review. This is not public delivery evidence.", configurations: results }, null, 2)}\n`,
);
