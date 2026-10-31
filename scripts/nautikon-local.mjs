import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium, firefox } from "@playwright/test";
const out = resolve("test-results/nautikon-local");
await mkdir(out, { recursive: true });
const projects = JSON.parse(await readFile("dist/projects.json", "utf8"));
const entry = projects.find((p) => p.name === "nautikon");
assert.equal(entry.status, "published");
assert.equal(entry.demoUrl, "https://antonsoo.github.io/nautikon/");
const pin = /\/blob\/([a-f0-9]{40})\/docs\/review.md/.exec(entry.workshops[0].reviewUrl)?.[1];
assert(pin, "The staged review must identify a local source commit");
const review = execFileSync("git", ["-C", "../nautikon", "show", `${pin}:docs/review.md`]);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};
async function response(root, url, prefix) {
  const file = resolve(root, decodeURIComponent(new URL(url).pathname.slice(prefix.length)) || "index.html");
  assert(file.startsWith(resolve(root) + sep));
  return { body: await readFile(file), contentType: types[extname(file)] || "application/octet-stream" };
}
const server = createServer(async (req, res) => {
  try {
    const r = await response("dist", `http://localhost${req.url}`, "/officina/");
    res.writeHead(200, { "Content-Type": r.contentType });
    res.end(r.body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/officina/`;
const receipts = [];
try {
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const b = await engine.launch();
    try {
      for (const width of [1440, 375]) {
        const context = await b.newContext({
          viewport: { width, height: 1100 },
          serviceWorkers: "block",
          reducedMotion: "reduce",
        });
        context.setDefaultTimeout(25000);
        const p = await context.newPage();
        const errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await context.route("https://antonsoo.github.io/nautikon/**", async (route) => {
          try {
            await route.fulfill(await response("../nautikon/dist", route.request().url(), "/nautikon/"));
          } catch {
            await route.fulfill({ status: 404, body: "Not found" });
          }
        });
        await context.route("https://github.com/antonsoo/nautikon/blob/**", (r) =>
          r.fulfill({ contentType: "text/plain; charset=utf-8", body: review }),
        );
        await p.goto(base);
        await p.locator("#tool-search").fill("ἐκπλεύσωσιν");
        const row = p.locator('[data-project="nautikon"] [data-workshop="departure"]');
        await row.waitFor({ state: "visible" });
        await p.evaluate(() => {
          const heading = document.querySelector(".index-heading");
          window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 20);
        });
        await row.locator("img").evaluate((img) => img.decode());
        await p.screenshot({ path: `${out}/${name}-${width}-search.png` });
        await row.locator(".workshop-demo").focus();
        await p.keyboard.press("Enter");
        await p.locator("#ledger").filter({ hasText: "3,675" }).waitFor();
        await p.locator("#pin").click();
        await p.locator("#departure").evaluate((e) => {
          e.value = "1";
          e.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await p.locator("#ledger").filter({ hasText: "3,900" }).waitFor();
        await p.locator('#ledger a[href="#read-rate"]').first().click();
        await p.locator("#source-status").filter({ hasText: "Page 107" }).waitFor();
        await p.locator("#reading-text").filter({ hasText: "Aorist subjunctive" }).waitFor();
        await p.goto(base + "?q=ὑποθήκη");
        const short = p.locator('[data-project="nautikon"] [data-workshop="shortfall"]');
        await short.waitFor({ state: "visible" });
        await short.locator(".workshop-demo").click();
        await p.locator('[data-preset="default"]').click();
        await p.locator("#collection").filter({ hasText: "1,675" }).waitFor();
        await p.goto(base + "?q=Arcturus");
        await row.waitFor({ state: "visible" });
        await row.locator(".workshop-review").click();
        assert.match(await p.locator("body").textContent(), /Try the actual work/);
        assert.deepEqual(errors, []);
        receipts.push({
          browser: name,
          width,
          publishedCatalogueEntry: true,
          localLessonBytesOnly: true,
          departureRateAndSource: true,
          shortfallOperated: true,
          reviewCommit: pin,
          remoteChecked: false,
        });
        await context.close();
      }
    } finally {
      await b.close();
    }
  }
  await writeFile(`${out}/receipts.json`, JSON.stringify(receipts, null, 2));
  console.log(receipts);
} finally {
  await new Promise((r) => server.close(r));
}
