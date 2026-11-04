import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [base, destination] = process.argv.slice(2);
assert(base && destination, "Supply the catalogue URL and receipt directory.");
const out = path.resolve(destination);
await mkdir(out, { recursive: true });
const sha = (b) => createHash("sha256").update(b).digest("hex");
const bytes = await readFile("public/projects.json");
const project = JSON.parse(bytes).find((p) => p.name === "haidao");
const workshop = project.workshops.find((w) => w.id === "error-pairs");
const pin = /\/blob\/([a-f0-9]{40})\/docs\/audit.md#try-the-actual-work$/.exec(workshop.reviewUrl)?.[1];
assert(pin, "The review must be pinned to a source revision.");
const local = execFileSync("git", ["-C", "../haidao", "show", `${pin}:docs/audit.md`]);
const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/haidao/${pin}/docs/audit.md`);
assert(raw.ok);
assert.ok(Buffer.from(await raw.arrayBuffer()).equals(local));
const expectedIndex = await readFile("../haidao/dist/index.html");
const results = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => {
        if (!page.url().startsWith("https://github.com/")) errors.push(e.message);
      });
      await page.goto(base);
      await page.locator('[data-group="Ancient world"]').click();
      const row = page.locator('[data-project="haidao"] [data-workshop="error-pairs"]');
      for (const term of ["shared offset", "相多", "independent errors"]) {
        await page.locator("#tool-search").fill(term);
        await expect(row).toBeVisible();
      }
      await page.locator("#tool-search").fill("shared offset");
      await page.locator("#copy-search-link").click();
      const shared = await page.locator("#filter-link-url").inputValue();
      assert.equal(new URL(shared).searchParams.get("q"), "shared offset");
      assert.equal(new URL(shared).searchParams.get("audience"), "Ancient world");
      await page.goto(shared);
      await expect(row).toBeVisible();
      await row.locator("img").evaluate((img) => img.decode());
      assert.equal(await row.locator(".workshop-demo").getAttribute("href"), workshop.url);
      assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
      await row.screenshot({ path: path.join(out, `${engine}-${width}-catalogue.png`) });
      await row.locator(".workshop-review").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.reviewUrl);
      await expect(page.locator("article")).toContainText("Try the actual work");
      await page.goto(shared);
      await row.locator(".workshop-demo").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(workshop.url);
      await page.waitForLoadState("load");
      await page.waitForFunction(() =>
        document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
      );
      await page.evaluate(() => document.fonts.ready);
      const landing = await page.locator("#uncertainty").boundingBox();
      assert(
        landing && landing.y >= -2 && landing.y < 100,
        `The lesson must actually land at its fragment: ${JSON.stringify(landing)}`,
      );
      await page.waitForFunction(() =>
        document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
      );
      assert.equal(await page.locator("#error-probe").inputValue(), "99");
      assert.equal(await page.locator("#rear-error-probe").inputValue(), "-99");
      assert.match(await page.locator("#error-witness").textContent(), /H = 125005 bu/);
      await page.locator("#equal-errors").focus();
      await page.keyboard.press("Enter");
      assert.match(await page.locator("#error-witness").textContent(), /H = 1255 bu; D = 31245 bu/);
      assert.match(await page.locator("#bounds").textContent(), /No finite upper bound/);
      await page.locator("#error-mode").selectOption("shared");
      assert.match(await page.locator("#bounds").textContent(), /30250/);
      assert.equal(await page.locator("#rear-error-probe").isDisabled(), true);
      await page.locator("#error-probe").focus();
      await page.keyboard.press("ArrowRight");
      assert.match(await page.locator("#error-witness").textContent(), /H = 1255 bu; D = 31250 bu/);
      const downloads = [];
      async function save(id, suffix) {
        const event = page.waitForEvent("download");
        await page.locator(id).click();
        const d = await event;
        const filename = `${engine}-${width}-${suffix}`;
        await d.saveAs(path.join(out, filename));
        const data = await readFile(path.join(out, filename));
        downloads.push({ filename, bytes: data.length, sha256: sha(data) });
        return data;
      }
      const csv = await save("#save-csv", "record.csv");
      assert(csv.includes(Buffer.from('"error_model","shared"')));
      assert(csv.includes(Buffer.from('"probe_distance","31250"')));
      const html = await save("#save-html", "reading.html");
      const portableContext = await browser.newContext({
        javaScriptEnabled: false,
        offline: true,
        viewport: { width, height: 1000 },
      });
      const portable = await portableContext.newPage();
      await portable.goto(pathToFileURL(path.join(out, `${engine}-${width}-reading.html`)).href);
      assert.equal(await portable.locator("script").count(), 0);
      assert.match(await portable.locator(".witness-result").textContent(), /H = 1255 bu; D = 31250 bu/);
      await portableContext.close();
      await context.setOffline(true);
      await page.reload();
      await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
      assert.equal(await page.locator("#error-mode").inputValue(), "shared");
      assert.equal(await page.locator("#error-probe").inputValue(), "100");
      const offline = await save("#save-html", "offline-reading.html");
      assert.ok(offline.equals(html));
      await context.setOffline(false);
      for (const suffix of ["", "index.html"]) {
        const response = await fetch(new URL(suffix, "https://antonsoo.github.io/haidao/"));
        assert.equal(response.status, 200);
        assert.ok(Buffer.from(await response.arrayBuffer()).equals(expectedIndex));
      }
      const catalogue = await fetch(new URL("projects.json", base));
      assert(catalogue.ok);
      assert.ok(Buffer.from(await catalogue.arrayBuffer()).equals(bytes));
      assert.deepEqual(errors, []);
      results.push({
        engine,
        width,
        terms: ["shared offset", "相多", "independent errors"],
        shared,
        landing,
        reviewUrl: workshop.reviewUrl,
        sourceSha256: sha(local),
        downloads,
        offlineNativeParity: true,
        canonicalEntryRechecked: true,
        errors,
      });
      console.log(
        `${engine}-${width}: search/share -> immutable review -> native fragment -> operated pair and complete bounds -> actual files -> offline parity passed`,
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  path.join(out, "report.json"),
  `${JSON.stringify({ base, catalogueSha256: sha(bytes), reviewPin: pin, results }, null, 2)}\n`,
);
