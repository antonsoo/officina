import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox } from "@playwright/test";

const published = process.env.NAUTIKON_PUBLIC === "1";
const out = resolve(published ? "studies/nautikon-evidence-public" : "test-results/nautikon-evidence-local");
await mkdir(out, { recursive: true });
const catalogue = await readFile("dist/projects.json", "utf8");
const project = JSON.parse(catalogue).find((p) => p.name === "nautikon");
const workshop = project.workshops.find((w) => w.id === "missing-evidence");
assert(workshop);
const match = /\/blob\/([a-f0-9]{40})\/(docs\/[^#]+)(?:#.*)?$/.exec(workshop.reviewUrl);
assert(match, "The review needs an immutable source commit");
const review = execFileSync("git", ["-C", "../nautikon", "show", `${match[1]}:${match[2]}`]);
let server;
let base = "https://antonsoo.github.io/officina/";
let lesson = "https://antonsoo.github.io/nautikon/";
if (published) {
  assert.equal(await (await fetch(`${base}projects.json`)).text(), catalogue);
  const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/nautikon/${match[1]}/${match[2]}`);
  assert.equal(raw.status, 200);
  assert.deepEqual(Buffer.from(await raw.arrayBuffer()), review);
  assert.equal(
    await (await fetch(`${lesson}sw.js`)).text(),
    await readFile("../nautikon/dist/sw.js", "utf8"),
  );
} else {
  server = createServer(async (req, res) => {
    const path = new URL(req.url, "http://localhost").pathname;
    const prefix = path.startsWith("/nautikon/") ? "/nautikon/" : "/officina/";
    const root = resolve(prefix === "/nautikon/" ? "../nautikon/dist" : "dist");
    const file = resolve(root, decodeURIComponent(path.slice(prefix.length)) || "index.html");
    if (!file.startsWith(root + sep)) return res.writeHead(404).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".jpg": "image/jpeg",
            ".png": "image/png",
            ".woff2": "font/woff2",
            ".xml": "application/xml",
          }[extname(file)] || "text/plain",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  base = `${origin}/officina/`;
  lesson = `${origin}/nautikon/`;
}
const observations = [];
const wait = (p, id, text) => p.locator(`#${id}`).filter({ hasText: text }).waitFor({ timeout: 45000 });
const save = async (p, id, name) => {
  const pending = p.waitForEvent("download");
  await p.locator(`#${id}`).click();
  const d = await pending;
  assert.equal(await d.failure(), null);
  const file = resolve(out, name);
  await d.saveAs(file);
  return file;
};
try {
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const b = await engine.launch();
    try {
      for (const width of [1440, 375]) {
        console.log(`${name}/${width}: ${published ? "canonical" : "local"} missing-evidence discovery`);
        const c = await b.newContext({
          viewport: { width, height: 1000 },
          acceptDownloads: true,
          reducedMotion: "reduce",
        });
        c.setDefaultTimeout(45000);
        if (!published) {
          await c.route("https://antonsoo.github.io/nautikon/**", (r) =>
            r.fulfill({
              status: 302,
              headers: {
                Location: r.request().url().replace("https://antonsoo.github.io/nautikon/", lesson),
              },
            }),
          );
          await c.route(workshop.reviewUrl.split("#")[0], (r) =>
            r.fulfill({ contentType: "text/plain; charset=utf-8", body: review }),
          );
        }
        const p = await c.newPage();
        const errors = [];
        p.on("pageerror", (e) => {
          if (p.url().startsWith(lesson) || p.url().startsWith(base)) errors.push(e.message);
        });
        for (const query of ["missing departure", "3,800", "ἐκπλεύσωσιν"]) {
          await p.goto(`${base}?q=${encodeURIComponent(query)}`);
          await p.locator('[data-project="nautikon"] [data-workshop="missing-evidence"]').waitFor();
        }
        const row = p.locator('[data-project="nautikon"] [data-workshop="missing-evidence"]');
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        await row.locator(".workshop-demo").focus();
        await p.keyboard.press("Enter");
        await p.waitForURL((url) => url.href === `${lesson}#evidence`);
        await p.locator("#withhold-departure").click();
        await p.locator("#check-debt").click();
        await wait(p, "debt-check", "Possible, but not established");
        await p.locator("#claim-amount").fill("3800");
        await p.locator("#check-debt").click();
        await wait(p, "debt-check", "No permitted departure gives this debt");
        await p.locator("#pin").click();
        await p.locator("#arrival").evaluate((e) => {
          e.value = "-5";
          e.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await wait(p, "ledger", "arrival rules out");
        await wait(p, "debt-check", "The voyage has changed");
        await p.locator("#claim-amount").fill("3675");
        await p.locator("#check-debt").click();
        await wait(p, "debt-check", "Follows from these model facts");
        await p
          .locator("#note")
          .fill(
            "Arrival constrains departure. Two possible debts do not form an interval. This is a conditional reading of the selected clauses.",
          );
        await p.locator('#departure-evidence a[href="#read-rate"]').click();
        await wait(p, "source-status", "Page 107");
        await wait(p, "reading-text", "Aorist subjunctive");
        const json = await save(p, "json", `${name}-${width}.json`);
        const record = JSON.parse(await readFile(json, "utf8"));
        assert.equal(record.claim.voyage.departure, null);
        assert.equal(record.claim.voyage.arrival, -5);
        assert.equal(record.pinned.arrival, 25);
        const html = await save(p, "html", `${name}-${width}.html`);
        const portable = await c.newPage();
        const requests = [];
        portable.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await portable.goto(pathToFileURL(html).href);
        assert.equal(await portable.locator("img").count(), 7);
        assert.equal(await portable.locator('[data-verdict="forced"]').count(), 1);
        const pending = portable.waitForEvent("download");
        await portable.getByRole("link", { name: "Editable notebook JSON" }).click();
        assert.deepEqual(JSON.parse(await readFile(await (await pending).path(), "utf8")), record);
        assert.deepEqual(requests, []);
        await portable.close();
        await p.goto(`${base}?q=missing%20departure`);
        await p
          .locator('[data-project="nautikon"] [data-workshop="missing-evidence"] .workshop-review')
          .click();
        await p.waitForURL((url) => url.href === workshop.reviewUrl);
        assert.match(await p.locator("body").textContent(), /Operate the investigation/);
        assert.deepEqual(errors, []);
        observations.push({
          browser: name,
          width,
          queries: ["missing departure", "3,800", "ἐκπλεύσωσιν"],
          published,
          routeInterceptionUsed: !published,
          threeDebtVerdictsOperated: true,
          originalFactsKept: true,
          sourcePage107Read: true,
          nativeJsonAndReading: true,
          embeddedJsonRoundtrip: true,
          portableNetworkRequests: requests,
          reviewUrl: workshop.reviewUrl,
          pageErrors: errors,
        });
        await c.close();
      }
    } finally {
      await b.close();
    }
  }
  if (published) {
    assert.equal(await (await fetch(`${base}projects.json`)).text(), catalogue);
    assert.equal(
      await (await fetch(`${lesson}sw.js`)).text(),
      await readFile("../nautikon/dist/sw.js", "utf8"),
    );
  }
  await writeFile(
    resolve(out, "receipt.json"),
    JSON.stringify({ checkedAt: new Date().toISOString(), catalogue: base, lesson, observations }, null, 2) +
      "\n",
  );
  console.log(JSON.stringify({ state: "passed", published, journeys: observations.length }));
} finally {
  if (server) await new Promise((r) => server.close(r));
}
