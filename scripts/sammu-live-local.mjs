import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const source = path.resolve(process.argv[2] ?? "../sammu");
const output = path.resolve(process.argv[3] ?? "/tmp/officina-sammu-live");
await mkdir(output, { recursive: true });
const { reviewPreview } = await import(pathToFileURL(path.join(source, "scripts/review-preview.mjs")));
const catalogueServer = reviewPreview(process.cwd(), 4414);
const workshopServer = reviewPreview(source, 4415);
const catalogue = "http://127.0.0.1:4414/officina/";
const workshop = "http://127.0.0.1:4415/sammu/";
const rows = [];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const edition = /const EDITION = "([a-f0-9]+)"/.exec(
  await readFile(path.join(source, "dist/sw.js"), "utf8"),
)[1];
try {
  await Promise.all([catalogueServer.ready, workshopServer.ready]);
  for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
    const browser = await launcher.launch();
    try {
      for (const width of [1440, 375]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          reducedMotion: "reduce",
          acceptDownloads: true,
        });
        try {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          // Exercise the real catalogue anchor. The local integration review
          // explicitly redirects its public destination to the reviewed build.
          // No public response or publication claim is substituted by this test.
          await page.route("https://antonsoo.github.io/sammu/**", (route) => {
            const url = new URL(route.request().url());
            return route.fulfill({
              status: 302,
              headers: {
                location: `${workshop}${url.pathname.slice("/sammu/".length)}${url.search}${url.hash}`,
              },
            });
          });
          await page.goto(catalogue);
          const row = page.locator('[data-project="sammu"] [data-workshop="live"]');
          for (const term of ["amplitude beats", "lā zakû", "la zaku", "nasāḫum", "sustained sound"]) {
            await page.locator("#tool-search").fill(term);
            await expect(row).toBeVisible();
            assert.equal(page.url(), catalogue, "typing must not silently replace the shared URL");
          }
          await page.locator("#tool-search").fill("lā zakû");
          await page.locator("#copy-search-link").click();
          const shared = await page.locator("#filter-link-url").inputValue();
          assert.equal(new URL(shared).searchParams.get("q"), "lā zakû");
          await page.goto(shared);
          await expect(row).toBeVisible();
          await row.locator("img").evaluate((image) => image.decode());
          const destination = await row.locator(".workshop-demo").getAttribute("href");
          const review = await row.locator(".workshop-review").getAttribute("href");
          const pin = /\/blob\/([a-f0-9]{40})\/docs\/live-review\.md#try-the-actual-instrument$/.exec(
            review,
          )?.[1];
          assert.ok(pin);
          const document = execFileSync("git", ["-C", source, "show", `${pin}:docs/live-review.md`]);
          assert.match(document.toString(), /The current review is local/);
          const thumb = await readFile("public/thumbs/sammu-live.png");
          assert.deepEqual(thumb, await readFile(path.join(source, "docs/assets/live-workbench.png")));
          await page.screenshot({
            path: path.join(output, `${engine}-${width}-catalogue.png`),
            fullPage: true,
          });
          await row.locator(".workshop-demo").focus();
          await page.keyboard.press("Enter");
          await page.waitForURL(
            (url) => url.origin === new URL(workshop).origin && url.pathname.endsWith("practice.html"),
          );
          assert.equal(new URL(page.url()).searchParams.get("cents"), "110");
          await expect(page.locator("#edition")).toHaveText(`Workshop edition: ${edition}`);
          await page.locator("#listen").click();
          await page.waitForFunction(
            () => document.getElementById("audio-status").dataset.playing === "true",
          );
          await page.locator("#amount").focus();
          await page.keyboard.press("Shift+ArrowRight");
          await page.keyboard.press("Shift+ArrowRight");
          await expect(page.locator("#amount")).toHaveValue("112");
          await expect(page.locator("#audio-status")).toHaveAttribute("data-playing", "true");
          await page.locator("#reveal").click();
          await expect(page.locator(".partial-gap")).toContainText("1.015608 Hz");
          await expect(page.locator("#base-summary")).toContainText("2 exact moves");
          await page.locator("#stop").click();
          const waiting = page.waitForEvent("download");
          await page.locator("#save-json").click();
          const download = await waiting;
          const file = `${engine}-${width}-attempt.json`;
          await download.saveAs(path.join(output, file));
          const attempt = JSON.parse(await readFile(path.join(output, file), "utf8"));
          assert.equal(attempt.practice.settings.amount, 112);
          assert.equal(attempt.moves, "LL");
          assert.equal(attempt.edition, edition);
          await page.screenshot({
            path: path.join(output, `${engine}-${width}-operated.png`),
            fullPage: true,
          });
          await page.locator("#source-link").click();
          await page.waitForURL((url) => url.origin === new URL(workshop).origin && url.hash === "#evidence");
          await expect(page.locator("#clauses")).toContainText("restored");
          assert.ok(
            await page.locator('a[href="https://journal.iftawm.org/previous/vol2no2/mirelman/"]').count(),
          );
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            true,
          );
          assert.deepEqual(errors, []);
          rows.push({
            engine,
            width,
            shared,
            destination,
            localDestination: workshop,
            edition,
            review,
            localReviewSha256: hash(document),
            thumbnailSha256: hash(thumb),
            operatedCents: 112,
            partialGap: "1.015608 Hz",
            attempt: file,
            sourcePreservationReached: true,
            publicBytesChecked: false,
            errors,
          });
        } finally {
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  catalogueServer.stop();
  workshopServer.stop();
}
await writeFile(
  path.join(output, "receipt.json"),
  JSON.stringify(
    {
      scope:
        "Local discovery and operation only. Public workshop links redirect to the reviewed local build; the review pin is read from local Git, not from a public server.",
      passed: true,
      rows,
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(
  `Four local catalogue -> live practice -> retained attempt -> source journeys passed.\n`,
);
