import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { chromium, firefox, expect } from "@playwright/test";

const [base, destination] = process.argv.slice(2);
assert(base && destination, "Supply the catalogue URL and a receipt directory");
const output = resolve(destination);
await mkdir(output, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const manifest = JSON.parse(await readFile("../traditio/src/asset-manifest.json", "utf8"));
const source = manifest.find((f) => f.path === "sources/mommsen-1893-p644.jpg");
const terms = [
  "alluvion",
  "avulsion",
  "ex eo tempore",
  "haec pars tua manet",
  "radices egerint",
  "Roman river law",
];
const expected = {
  format: "traditio-river",
  version: 1,
  current: { route: "parcel", lens: "digest", events: ["carry", "attach"], at: 2 },
  pinned: { route: "parcel", lens: "digest", events: ["carry", "root", "attach"], at: 3 },
  note: "The two endings differ only in new roots. Long attachment alone has not established the Digest's acquisition condition. Ex eo tempore does not rewrite arrival.",
};
async function download(p, selector) {
  const pending = p.waitForEvent("download", { timeout: 60000 });
  await p.locator(selector).click();
  const file = await pending;
  assert.equal(await file.failure(), null);
  return readFile(await file.path());
}
let expectedArtifacts;
const rows = [];
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1100 } });
      await context.addInitScript(() => {
        const create = URL.createObjectURL.bind(URL);
        window.reviewBlobs = new Map();
        URL.createObjectURL = (blob) => {
          const url = create(blob);
          window.reviewBlobs.set(url, blob);
          return url;
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      const row = page.locator('[data-project="traditio"] [data-workshop="river"]');
      for (const term of terms) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(page.url(), base);
      }
      await page.locator("#tool-search").fill("ex eo tempore");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "ex eo tempore");
      await page.goto(shared);
      const lesson = await row.locator(".workshop-demo").getAttribute("href");
      const review = await row.locator(".workshop-review").getAttribute("href");
      const commit = /\/blob\/([a-f0-9]{40})\/docs\/river-audit.md#try-the-actual-work$/.exec(review)?.[1];
      assert(commit);
      const reviewBytes = execFileSync("git", ["-C", "../traditio", "show", `${commit}:docs/river-audit.md`]);
      const response = await fetch(
        `https://raw.githubusercontent.com/antonsoo/traditio/${commit}/docs/river-audit.md`,
      );
      assert.equal(response.status, 200);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), reviewBytes);
      await row.locator("img").evaluate((img) => img.decode());
      await page.screenshot({ path: `${output}/${name}-${width}-catalogue.png`, fullPage: true });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(review);
      await expect(page.locator("article")).toContainText("Keep original ending and branch here");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(lesson);
      await expect(page.locator("#river-owner")).toHaveText("Lucius");
      // First observe the difference between the short reading and a fuller continuation.
      await page.locator('[data-river-event="root"]').focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#river-owner")).toHaveText("Not settled here");
      await page.selectOption("#river-lens", "digest");
      await expect(page.locator("#river-owner")).toHaveText("Lucius");
      await page.locator('[data-river-event="attach"]').click();
      await expect(page.locator("#river-owner")).toHaveText("Aulus");
      await page.locator('[data-river-at="1"]').click();
      await expect(page.locator("#river-owner")).toHaveText("Lucius");
      await page.locator("#river-branch").focus();
      await page.keyboard.press("Enter");
      await page.locator('[data-river-event="attach"]').click();
      await expect(page.locator("#river-owner")).toHaveText("Lucius");
      await expect(page.locator("#river-comparison-note")).toContainText(
        "Only rooting in the receiving soil differs",
      );
      await page.locator("#river-note").fill(expected.note);
      await page.locator("#river-read-condition").click();
      await page.getByRole("button", { name: "ex eo tempore", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#river-word")).toContainText("rather than backdating it to arrival");
      await expect(page.locator("#river-scan-status")).toContainText("Digest · p. 644.");
      const displayedSource = await page.locator("#river-scan").evaluate(async (img) => {
        await img.decode();
        const b = await window.reviewBlobs.get(img.src).arrayBuffer();
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join("");
      });
      assert.equal(displayedSource, source.sha256);
      const json = await download(page, "#river-save-record");
      assert.deepEqual(JSON.parse(json), expected);
      const csv = await download(page, "#river-csv");
      assert.equal(csv.toString().split("\r\n").filter(Boolean).length, 8);
      const svg = await download(page, "#river-save-svg");
      assert.match(svg.toString(), /Ownership of the focus: Lucius/);
      const html = await download(page, "#river-save-reading");
      assert.ok(html.toString().includes("Only rooting in the receiving soil differs"));
      const embedded = [...html.toString().matchAll(/data:[^;]+;base64,([A-Za-z0-9+/=]+)/g)].map((m) =>
        hash(Buffer.from(m[1], "base64")),
      );
      const retainedPaths = [
        "sources/poste-1904-p160.jpg",
        "sources/poste-1904-p161.jpg",
        "sources/mommsen-1893-p644.jpg",
        "sources/mommsen-1893-p645.jpg",
        "fonts/literata.woff2",
        "fonts/sourcesans3.woff2",
      ];
      for (const path of retainedPaths)
        assert.ok(embedded.includes(manifest.find((f) => f.path === path).sha256), path);
      const artifacts = Object.fromEntries(
        Object.entries({ json, csv, svg, html }).map(([kind, bytes]) => [
          kind,
          { bytes: bytes.length, sha256: hash(bytes) },
        ]),
      );
      if (expectedArtifacts) assert.deepEqual(artifacts, expectedArtifacts);
      else {
        expectedArtifacts = artifacts;
        for (const [kind, bytes] of Object.entries({ json, csv, svg }))
          await writeFile(`${output}/histories.${kind}`, bytes);
        await writeFile(`${output}/reading.html.gz`, gzipSync(html));
      }
      await page.locator("#river-compare").evaluate((node) => node.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/${name}-${width}-comparison.png` });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.deepEqual(errors, []);
      // Reopen an actual downloaded file, with all optional source links untouched.
      const native = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 1000 },
      });
      const document = await native.newPage();
      const network = [];
      document.on("request", (r) => {
        if (/^https?:/.test(r.url())) network.push(r.url());
      });
      const file = resolve("test-results", `river-${name}-${width}.html`);
      await mkdir(resolve("test-results"), { recursive: true });
      await writeFile(file, html);
      await document.goto(`file://${file}`);
      await document.waitForFunction(() => window.document.fonts.status === "loaded", null, {
        polling: 100,
        timeout: 10000,
      });
      assert.equal(await document.evaluate(() => window.document.documentElement.scrollWidth), width);
      assert.equal(await document.locator(".page img").count(), 4);
      const pre = await document.locator("pre").allTextContents();
      for (const path of [
        "LICENSE.txt",
        "sources/NOTICE.txt",
        "fonts/literata-OFL.txt",
        "fonts/sourcesans3-OFL.txt",
      ]) {
        const original = await readFile(`../traditio/public/${path}`);
        // HTML parsing normalizes CRLF. Check the retained bytes in the raw
        // document as well as the rendered license text.
        const marker = `<h3>${path}</h3><pre>`;
        const start = html.toString().indexOf(marker);
        assert.ok(start >= 0, path);
        const literal = html
          .toString()
          .slice(start + marker.length)
          .split("</pre>")[0];
        const decoded = literal.replace(
          /&(amp|lt|gt|quot|#39);/g,
          (_, entity) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[entity],
        );
        assert.equal(hash(Buffer.from(decoded)), hash(original), path);
        assert.ok(pre.includes(original.toString().replace(/\r\n?/g, "\n")), path);
      }
      const nested = await download(document, 'a[download="traditio-river.json"]');
      assert.deepEqual(JSON.parse(nested), expected);
      assert.deepEqual(network, []);
      await native.close();
      rows.push({
        browser: name,
        version: browser.version(),
        width,
        terms,
        shared,
        lesson,
        review,
        reviewSha256: hash(reviewBytes),
        displayedSource,
        artifacts,
        nativeScriptDisabled: true,
        nativeSourceAndFontBytesChecked: true,
        nativeLicenseBytesChecked: true,
        standaloneRequests: network,
        errors,
      });
      await context.close();
      await writeFile(
        `${output}/review.json`,
        `${JSON.stringify({ at: new Date().toISOString(), base, rows }, null, 2)}\n`,
      );
      console.log(
        `${name} ${width}: Latin discovery, pinned evidence, different continuations, source bytes, and portable reading passed`,
      );
    }
  } finally {
    await browser.close();
  }
}
