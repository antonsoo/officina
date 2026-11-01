import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const out = path.resolve(process.argv[2] ?? "test-results/syngraphe-seeing");
const lesson = path.resolve(process.argv[3] ?? "../syngraphe/dist");
await mkdir(out, { recursive: true });
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = catalogue.find((p) => p.name === "syngraphe").workshops.find((w) => w.id === "seeing");
const match = /\/blob\/([a-f0-9]{40})\/docs\/visibility-review\.md#try-the-actual-work$/.exec(
  workshop.reviewUrl,
);
assert(match, "The staged review must identify an immutable source revision.");
const review = execFileSync("git", ["-C", "../syngraphe", "show", `${match[1]}:docs/visibility-review.md`]);
const sha = (b) => createHash("sha256").update(b).digest("hex");
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const server = createServer(async (req, res) => {
  const u = new URL(req.url, "http://local");
  if (u.pathname === "/review.html")
    return res
      .writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      .end(
        `<html lang="en"><head><title>Local pinned review</title></head><body><article><pre style="white-space:pre-wrap">${esc(review.toString())}</pre></article></body></html>`,
      );
  const prefix = u.pathname.startsWith("/officina/")
    ? "/officina/"
    : u.pathname.startsWith("/syngraphe/")
      ? "/syngraphe/"
      : null;
  if (!prefix || u.pathname.includes("..")) return res.writeHead(404).end();
  const file = path.join(
    prefix === "/officina/" ? "dist" : lesson,
    u.pathname.slice(prefix.length) || "index.html",
  );
  try {
    const data = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".jpg": "image/jpeg",
            ".png": "image/png",
            ".svg": "image/svg+xml",
            ".ttf": "font/ttf",
            ".woff2": "font/woff2",
            ".txt": "text/plain",
          }[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const aliases = [
  "ἀμφοτέρους",
  "αμφοτερους",
  "amphoterous",
  "διεξιοῦσιν",
  "διεξιουσιν",
  "diexiousin",
  "τὸμ πρόσθιον",
  "public passage",
  "chest faces",
  "134 chests",
];
const journeys = [];
try {
  for (const [engine, api] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await api.launch();
    try {
      for (const width of [1440, 375]) {
        const c = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
        // Canonical links remain in the catalogue. This review explicitly redirects
        // their navigation to local source/build fixtures; it makes no public claim.
        await c.route("https://antonsoo.github.io/syngraphe/**", (r) => {
          const u = new URL(r.request().url());
          return r.fulfill({ status: 302, headers: { location: base + u.pathname + u.search } });
        });
        await c.route(workshop.reviewUrl.split("#")[0], (r) =>
          r.fulfill({ status: 302, headers: { location: base + "/review.html" } }),
        );
        const p = await c.newPage(),
          errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(base + "/officina/");
        const row = p.locator('[data-project="syngraphe"] [data-workshop="seeing"]');
        for (const term of aliases) {
          await p.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(p.url(), base + "/officina/");
        }
        await p.locator("#tool-search").fill("ἀμφοτέρους");
        await p.locator("#copy-search-link").click();
        const shared = await p.locator("#filter-link-url").inputValue();
        await p.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((i) => i.decode());
        await row.screenshot({ path: path.join(out, `${engine}-${width}-discovery.png`) });
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        assert.equal(await row.locator(".workshop-demo").getAttribute("href"), workshop.url);
        await row.locator(".workshop-review").focus();
        await p.keyboard.press("Enter");
        await expect(p.locator("article")).toContainText("Try the actual work");
        assert.equal(await p.locator("pre").textContent(), review.toString());
        await p.goto(shared);
        await row.locator(".workshop-demo").focus();
        await p.keyboard.press("Enter");
        await expect(p.locator("#sightline-status")).toContainText("stopped by the support");
        await p.locator("#stated-faces").click();
        await p.locator('[data-station="20"]').click();
        await expect(p.locator("#clause-status")).toContainText("Both sides — agrees");
        await expect(p.locator("#sightline-status")).toContainText("B / pillar: Sample point visible");
        await p.locator('[data-reading="3"]').click();
        await p.getByRole("button", { name: "ἀμφοτέρους", exact: true }).click();
        await expect(p.locator("#word-definition")).toContainText("both of the two");
        await p.locator("#reading-pages button").click();
        await expect(p.locator("#source-status")).toHaveText("Verified whole source page for this edition.");
        await expect(p.locator("#source-caption")).toContainText("p.13");
        const download = p.waitForEvent("download", { timeout: 25000 });
        await p.locator("#save-reading").click();
        const d = await download;
        const native = path.join(out, `${engine}-${width}-reading.html`);
        await d.saveAs(native);
        assert.equal(await d.failure(), null);
        const bytes = await readFile(native);
        const pc = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: false });
        const portable = await pc.newPage();
        await portable.goto(pathToFileURL(native).href);
        await expect(portable.locator("h1")).toHaveText("Seeing while passing");
        await expect(portable.locator(".reading")).toContainText(["both of the two"]);
        assert(await portable.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        journeys.push({
          engine,
          width,
          aliases,
          canonicalLesson: workshop.url,
          canonicalReview: workshop.reviewUrl,
          localPinnedReviewSha256: sha(review),
          actualChestOperation: true,
          greekPhraseToWholePage: true,
          portableBytes: bytes.length,
          portableSha256: sha(bytes),
          portableScriptsDisabled: true,
          errors,
        });
        await pc.close();
        await c.close();
        console.log(
          `${engine} ${width}: source-word search -> pinned local review -> operated sightline -> Greek -> printed page -> portable reading`,
        );
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
await writeFile(
  path.join(out, "receipt.json"),
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      boundary:
        "Local production catalogue and lesson builds; canonical navigations redirected to local fixtures; not public publication evidence",
      journeys,
    },
    null,
    2,
  ) + "\n",
);
