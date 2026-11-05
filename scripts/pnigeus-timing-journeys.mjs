import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [base, destination] = process.argv.slice(2);
assert(base && destination, "Supply the catalogue URL and receipt directory");
const output = path.resolve(destination);
await mkdir(output, { recursive: true });
const project = JSON.parse(await readFile("public/projects.json", "utf8")).find((p) => p.name === "pnigeus");
const workshop = project.workshops.find((w) => w.id === "pump-timing");
const pin = /\/blob\/([a-f0-9]{40})\/docs\/audit.md#try-the-actual-work$/.exec(workshop.reviewUrl)?.[1];
assert(pin);
const pinned = execFileSync("git", ["-C", "../pnigeus", "show", `${pin}:docs/audit.md`]);
const raw = await fetch(`https://raw.githubusercontent.com/antonsoo/pnigeus/${pin}/docs/audit.md`);
assert(raw.ok);
assert.deepEqual(Buffer.from(await raw.arrayBuffer()), pinned);
const rows = [];
for (const [name, engine] of Object.entries({ chromium, firefox })) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => {
          if (!page.url().startsWith("https://github.com/")) errors.push(e.message);
        });
        await page.goto(base);
        await page.locator('[data-group="Ancient world"]').click();
        const row = page.locator('[data-project="pnigeus"] [data-workshop="pump-timing"]');
        for (const term of ["pump timing", "πνιγεύς", "unused air"]) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
        }
        await row.locator("img").evaluate((img) => img.decode());
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), "unused air");
        assert.equal(new URL(shared).searchParams.get("audience"), "Ancient world");
        await page.goto(shared);
        await expect(row).toBeVisible();
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        await row.screenshot({ path: path.join(output, `${name}-${width}-catalogue.png`) });
        await row.locator(".workshop-review").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.reviewUrl);
        await expect(page.locator("article")).toContainText("Try the actual work");
        await page.goto(shared);
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.url);
        await page.locator("#timing-within").waitFor();
        await page.evaluate(() => document.fonts.ready);
        const landing = await page.locator("#timing").boundingBox();
        assert(
          landing && landing.y >= -2 && landing.y < 120,
          `Fragment did not land: ${JSON.stringify(landing)}`,
        );
        assert.equal(await page.locator("#timing-pipes").inputValue(), "1");
        await page.locator("#timing-keep").click();
        await page.locator("#timing-search").click();
        await expect(page.locator("#timing-search-result")).toContainText("0 stay in target");
        await page.locator("#timing-rule").selectOption("at-most");
        await page.locator("#timing-search").click();
        await expect(page.locator("#timing-search-result")).toContainText("22 stay in target");
        await page.locator("#timing-load-best").click();
        assert.equal(await page.locator("#timing-within").textContent(), "12.000");
        await expect(page.locator("#timing-budget")).toContainText("4 of seven");
        await page.locator("#timing-note").fill("The search constraint changed; the model did not.");
        async function save(selector, suffix) {
          const waiting = page.waitForEvent("download");
          await page.locator(selector).click();
          const filename = path.join(output, `${name}-${width}-${suffix}`);
          await (await waiting).saveAs(filename);
          return filename;
        }
        const notebook = await save("#notebook-save", "notebook.json");
        const book = JSON.parse(await readFile(notebook, "utf8"));
        assert.deepEqual(book.current.strokes, [0, 0, 1, 0, 1, 1]);
        assert.deepEqual(book.kept.strokes, [7, 0, 0, 0, 0, 0]);
        assert.equal(book.searchMode, "at-most");
        const html = await save("#timing-reading", "reading.html");
        const nativeContext = await browser.newContext({
          javaScriptEnabled: false,
          offline: true,
          acceptDownloads: true,
        });
        const native = await nativeContext.newPage();
        await native.goto(pathToFileURL(html).href);
        assert.equal(await native.locator("script").count(), 0);
        await expect(native.locator("body")).toContainText(book.explanation);
        const nativeDownload = native.waitForEvent("download");
        await native.locator('a[download="pnigeus-timing-notebook.json"]').click();
        const nativeFile = path.join(output, `${name}-${width}-native.json`);
        await (await nativeDownload).saveAs(nativeFile);
        assert.deepEqual(await readFile(nativeFile), await readFile(notebook));
        await nativeContext.close();
        await page.waitForFunction(
          () =>
            navigator.serviceWorker.controller &&
            document.querySelector("#offline").textContent.startsWith("Ready offline"),
        );
        await context.setOffline(true);
        await page.reload();
        await page.locator("#notebook-open").setInputFiles(notebook);
        await expect(page.locator("#timing-note")).toHaveValue(book.explanation);
        assert.equal(await page.locator("#timing-within").textContent(), "12.000");
        await save("#timing-reading", "offline.html");
        await page
          .getByRole("link", { name: "Read Hero’s Greek chamber instruction beside the printed page" })
          .click();
        await page.locator("#source-full").click();
        await expect(page.locator("#greek-scan svg")).toHaveAttribute("viewBox", "0 0 1650 2473");
        assert.equal(
          await page.evaluate(async () => {
            const img = new Image();
            img.src = document.querySelector("#greek-scan image").href.baseVal;
            await img.decode();
            return img.naturalWidth;
          }),
          1650,
        );
        await context.setOffline(false);
        assert.deepEqual(errors, []);
        rows.push({
          name,
          width,
          searchTerms: ["pump timing", "πνιγεύς", "unused air"],
          sharedSearch: true,
          pinnedReviewKeyboardOpened: true,
          fragmentLanding: landing.y,
          operatedBothBudgetRules: true,
          actualNotebookAndNativeDownload: true,
          offlineReopen: true,
          offlineGreekSourceImage: true,
          notebookSha256: createHash("sha256")
            .update(await readFile(notebook))
            .digest("hex"),
          pageErrors: errors,
        });
        console.log(
          `${name}-${width}: catalogue search, pinned review, timing, editable/native notebooks and offline Greek source passed`,
        );
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(
  path.join(output, "review.json"),
  `${JSON.stringify({ base, reviewPin: pin, pinnedReviewSha256: createHash("sha256").update(pinned).digest("hex"), rows }, null, 2)}\n`,
);
