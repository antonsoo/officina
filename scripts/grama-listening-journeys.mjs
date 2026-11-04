import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output, mode = "public"] = process.argv.slice(2);
assert(catalogue && output, "Supply catalogue URL, receipt directory and optional local mode");
assert(["local", "public"].includes(mode));
await mkdir(output, { recursive: true });
const projects = JSON.parse(await readFile("public/projects.json", "utf8"));
const workshop = projects.find((p) => p.name === "grama").workshops.find((w) => w.id === "listening");
const match = /^https:\/\/github.com\/antonsoo\/grama\/blob\/([a-f0-9]{40})\/(.+)$/.exec(
  workshop.reviewUrl.split("#")[0],
);
assert(match, "Review is pinned to an immutable commit");
const digest = (b) => createHash("sha256").update(b).digest("hex");
const review = execFileSync("git", ["-C", "../grama", "show", `${match[1]}:${match[2]}`]);
if (mode === "public") {
  const response = await fetch(`https://raw.githubusercontent.com/antonsoo/grama/${match[1]}/${match[2]}`, {
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), review);
}
const sources = JSON.parse(await readFile("../grama/public/sources/manifest.json", "utf8"));
const expectedSource = sources.pages.find((p) => p.file === "sources/grosset-28.jpg").sha256;
const report = {
  checkedAt: new Date().toISOString(),
  mode,
  scope:
    mode === "local"
      ? "Local catalogue; public lesson URLs intercepted to serve the local production build. Service workers blocked; no publication or offline claim."
      : "Canonical public catalogue and lesson, pinned raw review, native downloads and a standalone study; canonical hosted identity is checked separately.",
  workshop,
  review: { sha256: digest(review), bytes: review.length },
  journeys: [],
};
for (const [engine, launcher] of Object.entries({ chromium, firefox }).filter(
  ([engine]) => !process.argv[5] || process.argv[5] === engine,
)) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1100 },
        serviceWorkers: mode === "local" ? "block" : "allow",
      });
      if (mode === "local")
        await context.route("https://antonsoo.github.io/grama/**", async (route) => {
          const path = new URL(route.request().url()).pathname.slice("/grama/".length) || "index.html";
          assert(!path.includes(".."));
          const body = await readFile(resolve("../grama/dist", path));
          const extension = path.split(".").at(-1);
          await route.fulfill({
            status: 200,
            contentType:
              {
                html: "text/html",
                js: "text/javascript",
                css: "text/css",
                jpg: "image/jpeg",
                json: "application/json",
                svg: "image/svg+xml",
                ttf: "font/ttf",
                woff2: "font/woff2",
                txt: "text/plain",
              }[extension] ?? "application/octet-stream",
            body,
          });
        });
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await context.addInitScript(() => {
        window.gramaJourneySounds = [];
        const create = AudioContext.prototype.createBufferSource;
        AudioContext.prototype.createBufferSource = function (...args) {
          const source = create.apply(this, args),
            start = source.start;
          source.start = function (...a) {
            const result = start.apply(this, a);
            window.gramaJourneySounds.push(Array.from(source.buffer.getChannelData(0)));
            return result;
          };
          return source;
        };
      });
      const readingProgress = [];
      let stopProgress = () => {};
      try {
        await page.goto(catalogue);
        const row = page.locator('[data-project="grama"] [data-workshop="listening"]');
        for (const term of ["concealed listening", "śruti", "पञ्चम", "reopen listening record"]) {
          await page.locator("#tool-search").fill(term);
          await expect(row).toBeVisible();
        }
        await page.locator("#tool-search").fill("concealed listening");
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("q"), "concealed listening");
        await page.goto(shared);
        await expect(row).toBeVisible();
        await row.locator("img").evaluate((im) => im.decode());
        await page.screenshot({ path: resolve(output, `${engine}-${width}-catalogue.png`) });
        assert.equal(await row.locator(".workshop-review").getAttribute("href"), workshop.reviewUrl);
        if (mode === "public") {
          await row.locator(".workshop-review").focus();
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL(workshop.reviewUrl);
          await expect(page.locator("article")).toContainText("listening");
          await page.goto(shared);
        }
        await row.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(workshop.url);
        await page.locator("#listening-example").click();
        await page.locator("#listening-start").click();
        for (const key of ["a", "b", "x"]) {
          await page.locator(`#listening-${key}`).click();
          await expect(page.locator(`#listening-${key}-count`)).toHaveText("1 completed", { timeout: 15000 });
        }
        const sounds = await page.evaluate(() => window.gramaJourneySounds);
        const pcm = (samples) => digest(Buffer.from(new Float32Array(samples).buffer));
        assert.notEqual(
          pcm(sounds[0]),
          pcm(sounds[1]),
          "The 10-cent setup must produce two distinct sounds before answering",
        );
        const assignment = pcm(sounds[2]) === pcm(sounds[0]) ? "a" : "b";
        assert.equal(pcm(sounds[2]), pcm(sounds[assignment === "a" ? 0 : 1]));
        await page.locator(`#listening-answer-${assignment}`).click();
        await expect(page.locator("#listening-result")).toContainText("Matched");
        await expect(page.locator("#listening-result")).toContainText("10.000000 cents");
        const jsonEvent = page.waitForEvent("download");
        await page.locator("#listening-json").click();
        const jsonPath = resolve(output, `${engine}-${width}-record.json`);
        await (await jsonEvent).saveAs(jsonPath);
        await page.locator("#listening-clear").click();
        await page.locator("#listening-open").setInputFiles(jsonPath);
        await expect(page.locator("#listening-open-status")).toContainText("Reopened");
        await expect(page.locator("#listening-summary")).toContainText("not verified in this tab");
        await page.getByRole("link", { name: "Sanskrit", exact: true }).click();
        await page.locator("#source-page").selectOption("28");
        await expect(page.locator("#scan")).toBeVisible();
        const source = await page.locator("#scan").evaluate(async (image) => {
          const bytes = await (await fetch(image.src)).arrayBuffer();
          return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) =>
            b.toString(16).padStart(2, "0"),
          ).join("");
        });
        assert.equal(source, expectedSource);
        const readingStarted = Date.now();
        const save = page.waitForEvent("download", { timeout: 180000 });
        await page.locator("#listening-reading").click();
        await expect(page.locator("#listening-file-status")).toContainText(/Preparing|Saved/);
        const progressTimer = setInterval(() => {
          void page
            .locator("#listening-file-status")
            .textContent()
            .then(async (status) => {
              readingProgress.push({ elapsedMs: Date.now() - readingStarted, status });
              await writeFile(
                resolve(output, `${engine}-${width}-reading-progress.json`),
                `${JSON.stringify(readingProgress, null, 2)}\n`,
              );
            })
            .catch(() => {});
        }, 5000);
        stopProgress = () => clearInterval(progressTimer);
        const failedSave = page
          .waitForFunction(
            () => {
              const status = document.querySelector("#listening-file-status")?.textContent ?? "";
              return status && !/^(Preparing|Saved)/.test(status);
            },
            {},
            { timeout: 180000 },
          )
          .then(async () => {
            throw new Error(await page.locator("#listening-file-status").textContent());
          });
        const study = resolve(output, `${engine}-${width}-study.html`);
        await (await Promise.race([save, failedSave])).saveAs(study);
        stopProgress();
        const readingSaveMs = Date.now() - readingStarted;
        const html = await readFile(study, "utf8");
        assert(!/<script\b/i.test(html));
        const portable = await context.newPage();
        await portable.goto(pathToFileURL(study).href);
        await expect(portable.locator("#listening-record")).toContainText("reopened file");
        assert.equal(
          await portable
            .locator(".source-page img")
            .evaluateAll((images) => images.filter((im) => im.complete && im.naturalWidth > 0).length),
          11,
        );
        assert.equal(await portable.locator("#listening-record audio").count(), 2);
        await portable.close();
        await page.goto(catalogue);
        await page.locator("#tool-search").fill("octave closes");
        const placement = page.locator('[data-project="grama"] [data-workshop="count-placement"]');
        await expect(placement).toBeVisible();
        await placement.locator(".workshop-demo").click();
        await expect(page.locator("#attachment-finding")).toContainText("Dha moves; Pa stays fixed");
        await page.locator("#attachment-select").selectOption("arriving");
        await expect(page.locator("#attachment-finding")).toContainText("Pa moves");
        const placementDownload = page.waitForEvent("download");
        await page.locator("#attachment-csv").click();
        const placementFile = resolve(output, `${engine}-${width}-placement.csv`);
        await (await placementDownload).saveAs(placementFile);
        assert.match(await readFile(placementFile, "utf8"), /arriving/);
        await page.locator("#attachment-instruction").click();
        await expect(page.locator("#source-page")).toHaveValue("sources/grosset-28.jpg");
        assert.deepEqual(errors, []);
        report.journeys.push({
          engine,
          width,
          terms: 4,
          sharedSearchRestored: true,
          pinnedReviewFollowed: mode === "public",
          nativeXMatchesAssignedPCM: true,
          distinctSetupVerified: true,
          matchedAnswerRevealed: true,
          JSONDownloadedAndReopened: true,
          countPlacementDiscoveredAndOperated: true,
          sourceSha256: source,
          scriptFreeStudyWith11Pages: true,
          readingSaveMs,
          readingProgress,
          studySha256: digest(html),
          pageErrors: errors,
        });
        console.log(
          `${engine} ${width}: search -> listening -> native X -> record reopen -> source -> study passed (${mode})`,
        );
      } catch (error) {
        await writeFile(
          resolve(output, `${engine}-${width}-failure.json`),
          `${JSON.stringify(
            {
              error: String(error),
              url: page.url(),
              status: await page
                .locator("#listening-file-status")
                .textContent()
                .catch(() => null),
              offline: await page
                .locator("#offline-status")
                .textContent()
                .catch(() => null),
              readingProgress,
            },
            null,
            2,
          )}\n`,
        );
        throw error;
      } finally {
        stopProgress();
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
report.state = "passed";
await writeFile(resolve(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
