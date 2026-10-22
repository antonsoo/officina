import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "@playwright/test";

const base = process.argv[2];
const output = process.argv[3];
assert(base && output);
const projects = JSON.parse(
  await readFile(new URL("../../public/projects.json", import.meta.url), "utf8"),
).filter((entry) => ["sammu", "pyknon"].includes(entry.name));
const records = [];
for (const [engine, launch] of Object.entries({ chromium, firefox })) {
  const browser = await launch.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        for (const project of projects) {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          await page.goto(base);
          await page.getByRole("searchbox", { name: "Find a tool" }).fill(project.name);
          const link = page
            .locator(`[data-project="${project.name}"]`)
            .getByRole("link", { name: "Live demo", exact: true });
          assert.equal(await link.getAttribute("href"), project.demoUrl);
          await link.focus();
          const [response] = await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            page.keyboard.press("Enter"),
          ]);
          assert.equal(response.status(), 200);
          assert.equal(page.url(), project.demoUrl);
          if (project.name === "sammu") {
            await page.waitForFunction(
              () => document.getElementById("string-1").dataset.ratio === "2048/2187",
            );
            assert.equal(await page.locator("#tuning-name").textContent(), "išartum");
            assert.match(await page.locator("#cycle-result").textContent(), /-113\.685 cents/);
          } else {
            await page.waitForFunction(() =>
              document.getElementById("ratio-hz").textContent.includes("446.003"),
            );
            assert.match(await page.locator("#equal-hz").textContent(), /440\.000/);
            assert.equal(
              await page.locator('.step-buttons [data-step="6"]').getAttribute("aria-pressed"),
              "true",
            );
          }
          assert.deepEqual(errors, []);
          records.push({
            engine,
            width,
            project: project.name,
            url: page.url(),
            status: response.status(),
            keyboardEnter: true,
            requestedExperimentReached: true,
            errors,
          });
          await page.close();
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await mkdir(path.dirname(path.resolve(output)), { recursive: true });
await writeFile(output, `${JSON.stringify({ base, records }, null, 2)}\n`);
console.log("Eight keyboard demo navigations reached the requested live experiments.");
