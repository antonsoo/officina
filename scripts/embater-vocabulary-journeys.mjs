import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";
const [base, output] = process.argv.slice(2);
assert(base && output, "Supply catalogue URL and receipt directory");
await mkdir(output, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const rows = [];
const catalogue = JSON.parse(await readFile("public/projects.json", "utf8"));
const expectedWorkshop = catalogue
  .find((p) => p.name === "embater")
  .workshops.find((w) => w.id === "vocabulary");
const source = JSON.parse(
  await readFile("../embater/public/sources/vocabulary/manifest.json", "utf8"),
).plates.find((p) => p.page === 71);
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const b = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const c = await b.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      const p = await c.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(base);
      const row = p.locator('[data-project="embater"] [data-workshop="vocabulary"]');
      const terms = ["centrum oculi", "oculus", "oculi", "ὀφθαλμός", "volute eye", "Latin genitive"];
      for (const term of terms) {
        await p.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
        assert.equal(p.url(), base);
      }
      await p.locator("#tool-search").fill("ὀφθαλμός");
      await p.locator("#copy-search-link").click();
      const shared = await p.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "ὀφθαλμός");
      await p.goto(shared);
      await expect(row).toBeVisible();
      await row.locator("img").evaluate((i) => i.decode());
      const destination = await row.locator(".workshop-demo").getAttribute("href");
      const review = await row.locator(".workshop-review").getAttribute("href");
      assert.equal(destination, expectedWorkshop.url);
      assert.equal(review, expectedWorkshop.reviewUrl, "browser uses the current reviewed catalogue pin");
      const commit = /\/blob\/([a-f0-9]{40})\/docs\/vocabulary-audit.md#/.exec(review)?.[1];
      assert(commit);
      const doc = execFileSync("git", ["-C", "../embater", "show", `${commit}:docs/vocabulary-audit.md`]);
      const raw = await fetch(
        `https://raw.githubusercontent.com/antonsoo/embater/${commit}/docs/vocabulary-audit.md`,
      );
      assert.equal(raw.status, 200);
      assert.deepEqual(Buffer.from(await raw.arrayBuffer()), doc);
      await p.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`), fullPage: true });
      await row.locator(".workshop-review").focus();
      await p.keyboard.press("Enter");
      await expect(p).toHaveURL(review);
      await expect(p.locator("article")).toContainText("Try the actual work");
      await p.goto(shared);
      await row.locator(".workshop-demo").focus();
      await p.keyboard.press("Enter");
      await expect(p).toHaveURL(destination);
      await expect(p.locator(".card-title")).toHaveText("eye of the volute");
      await expect(p.locator(".context-phrase")).toContainText("centrum oculi");
      await p.evaluate(() => document.fonts.ready);
      const whole = await p.locator("#drill-plate svg").getAttribute("viewBox");
      await p.locator('[data-view="detail"]').click();
      await expect(p.locator('[data-view="detail"]')).toHaveAttribute("aria-pressed", "true");
      await p.locator('[data-pan="in"]').click();
      assert.notEqual(await p.locator("#drill-plate svg").getAttribute("viewBox"), whole);
      await p.locator('[data-source-rule="ionic-capital"]').first().click();
      await expect(p.locator("#drill-source-status")).toContainText("Complete printed page 71.", {
        timeout: 20000,
      });
      const digest = await p
        .locator("#drill-source-image")
        .evaluate(async (i) =>
          Array.from(
            new Uint8Array(await crypto.subtle.digest("SHA-256", await (await fetch(i.src)).arrayBuffer())),
            (b) => b.toString(16).padStart(2, "0"),
          ).join(""),
        );
      assert.equal(digest, source.sha256);
      await p.locator("[data-source-close]").click();
      const pending = p.waitForEvent("download");
      await p.locator("#drill-save-reading").click();
      const file = await pending;
      assert.equal(await file.failure(), null);
      const path = resolve(output, `${engine}-${width}-study.html`);
      await file.saveAs(path);
      const html = await readFile(path, "utf8");
      assert(!/<script\b/i.test(html));
      const images = [...html.matchAll(/src="data:image\/jpeg;base64,([^"]+)"/g)].map((m) =>
        hash(Buffer.from(m[1], "base64")),
      );
      assert.deepEqual(images, [source.sha256]);
      assert(html.includes("vocabulary.csv"));
      assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await p.screenshot({ path: resolve(output, `${engine}-${width}-lesson.png`), fullPage: true });
      rows.push({
        engine,
        version: b.version(),
        width,
        terms,
        shared,
        destination,
        review,
        reviewSha256: hash(doc),
        sourceSha256: digest,
        readingBytes: Buffer.byteLength(html),
        readingSha256: hash(html),
        errors,
      });
      await writeFile(resolve(output, "review.json"), JSON.stringify({ base, rows }, null, 2) + "\n");
      console.log(
        `${engine} ${width}: search, pinned review, selected eye, detail, checked page and native study verified`,
      );
      await c.close();
    }
  } finally {
    await b.close();
  }
}
