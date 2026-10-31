// Real canonical URLs only. No intercepted route, catalogue fixture or local
// lesson bytes can establish this public discovery and operation receipt.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox } from "@playwright/test";
const base = "https://antonsoo.github.io/officina/",
  lesson = "https://antonsoo.github.io/nautikon/",
  out = resolve("studies/nautikon-public");
await mkdir(out, { recursive: true });
const remote = await fetch(`${base}projects.json`);
assert.equal(remote.status, 200);
const catalogue = await remote.text();
assert.equal(catalogue, await readFile("dist/projects.json", "utf8"));
const entry = JSON.parse(catalogue).find((p) => p.name === "nautikon");
assert.equal(entry.status, "published");
assert.equal(entry.demoUrl, lesson);
const pin = /\/blob\/([a-f0-9]{40})\/docs\/review.md/.exec(entry.workshops[0].reviewUrl)?.[1];
assert(pin);
const rawReview = await fetch(`https://raw.githubusercontent.com/antonsoo/nautikon/${pin}/docs/review.md`);
assert.equal(rawReview.status, 200);
assert.equal(
  await rawReview.text(),
  execFileSync("git", ["-C", "../nautikon", "show", `${pin}:docs/review.md`], { encoding: "utf8" }),
);
const workerResponse = await fetch(`${lesson}sw.js`);
assert.equal(workerResponse.status, 200);
const worker = await workerResponse.text();
assert.equal(worker, await readFile("../nautikon/dist/sw.js", "utf8"));
const edition = /EDITION="([a-f0-9]+)"/.exec(worker)[1];
const downloadsDir = resolve("test-results/nautikon-public");
await mkdir(downloadsDir, { recursive: true });
const receipts = [],
  wait = (p, id, t) => p.locator(`#${id}`).filter({ hasText: t }).waitFor({ timeout: 45000 });
const save = async (p, id, name) => {
  const pending = p.waitForEvent("download");
  await p.locator(`#${id}`).click();
  const d = await pending;
  assert.equal(await d.failure(), null);
  const path = resolve(downloadsDir, name);
  await d.saveAs(path);
  return path;
};
try {
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const b = await engine.launch();
    try {
      for (const width of [1440, 375]) {
        console.log(`${name}/${width}: canonical discovery`);
        const c = await b.newContext({
          viewport: { width, height: 1100 },
          acceptDownloads: true,
          reducedMotion: "reduce",
        });
        c.setDefaultTimeout(45000);
        const p = await c.newPage(),
          errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(`${base}?q=${encodeURIComponent("ἐκπλεύσωσιν")}`);
        const departure = p.locator('[data-project="nautikon"] [data-workshop="departure"]');
        await departure.waitFor();
        await p
          .locator(".index-heading")
          .evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 20));
        await departure.locator("img").waitFor({ state: "visible" });
        await departure.locator("img").evaluate(async (img) => {
          if (!img.complete || !img.naturalWidth)
            await new Promise((resolve, reject) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", () => reject(new Error("Workshop thumbnail did not load")), {
                once: true,
              });
            });
          await img.decode();
        });
        await p.screenshot({ path: resolve(out, `${name}-${width}-discovery.png`) });
        assert.equal(
          await departure.locator(".workshop-review").getAttribute("href"),
          entry.workshops[0].reviewUrl,
        );
        await departure.locator(".workshop-demo").focus();
        await p.keyboard.press("Enter");
        await wait(p, "ledger", "3,675");
        await wait(p, "offline", "Complete edition available offline");
        await p.locator("#pin").click();
        await p.locator("#departure").evaluate((e) => {
          e.value = "1";
          e.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await wait(p, "ledger", "3,900");
        await wait(p, "comparison", "3,675");
        await p.locator('#ledger a[href="#read-rate"]').first().click();
        await wait(p, "source-status", "Page 107");
        await wait(p, "reading-text", "Aorist subjunctive");
        await p.goto(`${base}?q=${encodeURIComponent("ὑποθήκη")}`);
        await p.locator('[data-project="nautikon"] [data-workshop="shortfall"] .workshop-demo').click();
        await p.locator('[data-preset="default"]').click();
        await wait(p, "collection", "1,675");
        await p.goto(`${base}?q=${encodeURIComponent("οὐδὲ πεντακόσια")}`);
        const testimony = p.locator('[data-project="nautikon"] [data-workshop="testimony"]');
        await testimony.waitFor();
        await testimony.locator(".workshop-demo").click();
        await wait(p, "inference", "0–499");
        await wait(p, "source-status", "Page 110");
        await wait(p, "offline", "Complete edition available offline");
        await p.locator("#check").focus();
        await p.keyboard.press("Enter");
        await wait(p, "checked", "Counterexample: 499");
        await p.locator('[data-count="499"]').click();
        await wait(p, "candidate-result", "499 jars fits");
        await p.locator("#erasikles").check();
        await wait(p, "inference", "2,550 jars fewer");
        await wait(p, "checked", "current controls have since changed");
        await p.locator("#read-hippias").click();
        await wait(p, "source-status", "Page 111");
        await p.locator("#enlarge").click();
        await p.locator(".source-viewport").focus();
        await p.keyboard.press("ArrowRight");
        await p.waitForTimeout(200);
        assert.ok(await p.locator(".source-viewport").evaluate((e) => e.scrollLeft > 0));
        assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), width);
        await p.locator("#enlarge").click();
        await p
          .locator("#note")
          .fill(
            "The speaker’s upper bound alone does not force 450. An attributed deposition changes the conditional inference, without verifying the actual cargo.",
          );
        const json = await save(p, "json", `${name}-${width}-testimony.json`),
          record = JSON.parse(await readFile(json, "utf8"));
        assert.equal(record.checked.selected.erasikles, false);
        assert.equal(record.selected.erasikles, true);
        const htmlPath = await save(p, "html", `${name}-${width}-testimony.html`),
          html = await readFile(htmlPath, "utf8");
        assert.ok(!html.includes("<script"));
        await p.locator("#erasikles").uncheck();
        await p.locator("#import").setInputFiles(json);
        await wait(p, "status", "Testimony reopened");
        assert.equal(await p.locator("#erasikles").isChecked(), true);
        const file = await c.newPage(),
          requests = [];
        file.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await file.goto(pathToFileURL(htmlPath).href);
        await file.evaluate(() => document.fonts.ready);
        assert.equal(await file.locator("img").count(), 7);
        assert.deepEqual(requests, []);
        const embedded = file.waitForEvent("download");
        await file.getByRole("link", { name: "Editable testimony notebook" }).click();
        assert.deepEqual(JSON.parse(await readFile(await (await embedded).path(), "utf8")), record);
        await file.close();
        const second = await c.newPage();
        await second.goto(lesson);
        await wait(second, "offline", "Complete edition available offline");
        await c.setOffline(true);
        await p.reload();
        await wait(p, "source-status", "Page 110");
        await p.locator("#erasikles").check();
        await save(p, "html", `${name}-${width}-offline.html`);
        await second.reload();
        await wait(second, "ledger", "3,675");
        await p.evaluate(async () => {
          for (const k of await caches.keys())
            if (k.startsWith("nautikon-"))
              await (await caches.open(k)).delete(new URL("sources/rennie-p110.jpg", location.href));
        });
        await p.locator("#retry-source").click();
        await wait(p, "source-status", "Could not load");
        await wait(p, "offline", "not retained");
        await second.bringToFront();
        await wait(second, "offline", "not retained");
        await c.setOffline(false);
        await p.locator("#retry-offline").click();
        await wait(p, "offline", "Complete edition available offline");
        await p.locator("#retry-source").click();
        await wait(p, "source-status", "Page 110");
        await p
          .locator(".report-choices")
          .evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 24));
        await p.screenshot({ path: resolve(out, `${name}-${width}-testimony.png`) });
        // Follow the actual immutable review link after the operated lesson.
        await p.goto(`${base}?q=Arcturus`);
        await p.locator('[data-project="nautikon"] [data-workshop="departure"] .workshop-review').click();
        assert.ok(p.url().includes(`/blob/${pin}/docs/review.md`));
        await p.getByRole("heading", { name: "Try the actual work", exact: true }).waitFor();
        assert.deepEqual(errors, []);
        receipts.push({
          browser: name,
          version: b.version(),
          width,
          edition,
          reviewCommit: pin,
          canonicalCatalogueBytes: true,
          realDepartureAndShortfall: true,
          testimonyCounterexampleAndKeptPremises: true,
          nativeJsonAndReading: true,
          embeddedJsonRoundtrip: true,
          bothPagesBrowserOffline: true,
          twoTabDamageAndOnlineRepair: true,
          realReviewLink: true,
          pageErrors: errors,
          routeInterceptionUsed: false,
        });
        await c.close();
      }
    } finally {
      await b.close();
    }
  }
  assert.equal(await (await fetch(`${base}projects.json`)).text(), catalogue);
  assert.equal(await (await fetch(`${lesson}sw.js`)).text(), worker);
  await writeFile(
    resolve(out, "receipts.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        catalogue: base,
        lesson,
        edition,
        reviewCommit: pin,
        journeys: receipts,
      },
      null,
      2,
    ),
  );
  console.log(receipts);
} finally {
  /* Each isolated browser owns its local retained edition. */
}
