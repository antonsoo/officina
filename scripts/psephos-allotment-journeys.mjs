import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert(catalogue && output, "Supply catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const sha = (b) => createHash("sha256").update(b).digest("hex");
const assets = JSON.parse(await readFile("../psephos/src/allotment-assets.json", "utf8"));
const records = [];
const cases = [
  {
    id: "attendance",
    query: "παραπλησίως ἴσοι",
    aliases: ["turnout", "weighted patterns", "finite population", "7776"],
    anchor: "attendance",
  },
  {
    id: "allotment",
    query: "κατὰ πέντε πινάκια εἷς",
    aliases: ["kleroterion", "joint chance", "same row", "κύβοι"],
    anchor: "allotment",
  },
];
const canonicalFiles = await Promise.all(
  [
    ...["index.html", "projects.json", "thumbs/psephos-attendance.png", "thumbs/psephos-allotment.png"].map(
      (path) => ({
        url: new URL(path === "index.html" ? "" : path, catalogue).href,
        file: resolve("dist", path),
      }),
    ),
    ...["attendance.html", "allotment.html"].map((path) => ({
      url: `https://antonsoo.github.io/psephos/${path}`,
      file: resolve("../psephos/dist", path),
    })),
  ].map(async (item) => ({ ...item, bytes: await readFile(item.file) })),
);
async function canonical() {
  for (const f of canonicalFiles) {
    const r = await fetch(f.url, { cache: "no-store" });
    assert.equal(r.status, 200, f.url);
    assert.deepEqual(Buffer.from(await r.arrayBuffer()), f.bytes, f.url);
  }
}
await canonical();
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375])
      for (const experiment of cases) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          acceptDownloads: true,
        });
        await context.addInitScript(() => {
          const original = URL.createObjectURL.bind(URL);
          window.psephosBlobs = new Map();
          URL.createObjectURL = (b) => {
            const u = original(b);
            window.psephosBlobs.set(u, b);
            return u;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(catalogue);
        const row = page.locator(`[data-project="psephos"] [data-workshop="${experiment.id}"]`);
        for (const term of experiment.aliases) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
          assert.equal(page.url(), catalogue);
        }
        await page.locator("#tool-search").fill(experiment.query);
        await expect(row).toBeVisible();
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), experiment.query);
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((img) => img.decode());
        const lesson = await row.locator(".workshop-demo").getAttribute("href"),
          review = await row.locator(".workshop-review").getAttribute("href");
        assert.equal(new URL(lesson).hash, `#${experiment.anchor}`);
        const match = /\/blob\/([a-f0-9]{40})\/(docs\/attendance-review\.md)#/.exec(review);
        assert(match);
        const pinned = execFileSync("git", ["-C", "../psephos", "show", `${match[1]}:${match[2]}`]);
        const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/psephos/${match[1]}/${match[2]}`);
        assert.equal(raw.status, 200);
        assert.deepEqual(Buffer.from(await raw.arrayBuffer()), pinned);
        await page.screenshot({ path: resolve(output, `${name}-${width}-${experiment.id}-catalogue.png`) });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(review);
        await expect(page.locator("article")).toContainText("Try the row-selection comparison");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(lesson);
        await expect(page.locator("#offline-status")).toContainText("This edition is available offline,", {
          timeout: 45000,
        });
        const id = experiment.id;
        if (id === "attendance") {
          await page.locator("#attendance-pin").click();
          await page.locator("#attendance-exchange").focus();
          await page.keyboard.press("Enter");
          await page.keyboard.press("Enter");
          await page.locator("#attendance-from").selectOption("1");
          await page.locator("#attendance-to").selectOption("3");
          await page.locator("#attendance-exchange").click();
          await expect(page.locator("#attendance-summary")).toContainText("Every group meets");
          await expect(page.locator("#attendance-comparison")).toContainText("A group is short");
          await page.locator("#attendance-inspect").click();
          await expect(page.locator("#attendance-probability")).toContainText("7,776 / 184,756");
        } else {
          await page.locator("#keep-board").click();
          await page.locator("#inspect-chances").click();
          await page.locator("#move-second").focus();
          await page.keyboard.press("Enter");
          await expect(page.locator("#chances")).toContainText("1/6");
          await expect(page.locator("#pinned-board")).toContainText("1/2");
        }
        await page
          .locator(`#${id}`)
          .screenshot({ path: resolve(output, `${name}-${width}-${id}-lesson.png`) });
        await page.locator("#allotment-reading").selectOption(id === "attendance" ? "letters" : "cubes");
        await expect(page.locator("#allotment-scan-status")).toContainText("checked against");
        await page.locator("#allotment-words button").last().click();
        const displayed = await page
          .locator("#allotment-scan")
          .evaluate(async (img) =>
            [
              ...new Uint8Array(
                await crypto.subtle.digest("SHA-256", await window.psephosBlobs.get(img.src).arrayBuffer()),
              ),
            ]
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(""),
          );
        assert.equal(
          displayed,
          assets.find((f) => f.path === `sources/kenyon-leaf${id === "attendance" ? 76 : 77}.jpg`).sha256,
        );
        const note =
          id === "attendance"
            ? "The same total can fail or meet the request. Approximately equal registered groups do not fix daily turnout."
            : "The move changes both-selected from 1/2 to 1/6. The row chance assumes fixed placement and a uniform cube order.";
        await page.locator(`#${id}-note`).fill(note);
        const save = async (suffix) => {
          const next = page.waitForEvent("download");
          await page.locator(`#${id}-save-${suffix}`).click();
          const d = await next;
          assert.equal(await d.failure(), null);
          return readFile(await d.path());
        };
        const json = await save("json"),
          html = await save("html");
        assert.equal(JSON.parse(json).note, note);
        const embedded = [...html.toString().matchAll(/data:[^;]+;base64,([A-Za-z0-9+/=]+)/g)].map((m) =>
          sha(Buffer.from(m[1], "base64")),
        );
        for (const a of assets) assert(embedded.includes(a.sha256), a.path);
        const path = resolve(output, `${name}-${width}-${id}.html`);
        await writeFile(path, html);
        const portable = await context.newPage(),
          requests = [];
        portable.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await portable.goto(`file://${path}`);
        const native = portable.waitForEvent("download");
        await portable.locator(`a[download="psephos-${id}.json"]`).click();
        assert.deepEqual(await readFile(await (await native).path()), json);
        assert.deepEqual(requests, []);
        await portable.close();
        await page
          .locator(`#${id}-open`)
          .setInputFiles({ name: "study.json", mimeType: "application/json", buffer: json });
        await expect(page.locator(`#${id}-file-status`)).toContainText(
          id === "attendance" ? "Attendance reopened" : "Study reopened",
        );
        await page.goto(shared);
        await expect(row).toBeVisible();
        await context.setOffline(true);
        const offlineRequests = [];
        page.on("request", (request) =>
          offlineRequests.push({ url: request.url(), type: request.resourceType() }),
        );
        for (const term of experiment.aliases) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
        }
        assert.deepEqual(
          offlineRequests.filter((r) => ["fetch", "xhr", "script", "document"].includes(r.type)),
          [],
        );
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        records.push({
          browser: name,
          width,
          id,
          query: experiment.query,
          aliases: experiment.aliases,
          shared,
          lesson,
          review,
          reviewSha256: sha(pinned),
          displayedSourceSha256: displayed,
          embeddedIdentities: assets.length,
          portableNativeStudyIdentical: true,
          offlineRefilterWithoutCatalogueFetch: true,
          lazyAssetRequests: offlineRequests,
          errors,
        });
        await context.close();
        await canonical();
        console.log(
          `${name}/${width}: ${id} search -> pinned review -> public model -> Greek -> portable/reopened study -> offline refilter`,
        );
      }
  } finally {
    await browser.close();
  }
}
await writeFile(
  resolve(output, "receipt.json"),
  `${JSON.stringify({ date: new Date().toISOString(), catalogue, publicCatalogue: new URL(catalogue).hostname === "antonsoo.github.io", publicLessons: true, canonicalRecheckedAfterEveryJourney: true, canonicalFiles: canonicalFiles.map((f) => ({ url: f.url, sha256: sha(f.bytes), bytes: f.bytes.length })), records }, null, 2)}\n`,
);
