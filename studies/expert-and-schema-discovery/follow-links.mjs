import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
import { resolve } from "node:path";
const root = new URL("../../", import.meta.url);
// Optional arguments let later catalogue studies reuse the actual keyboard flow.
const [base = "https://antonsoo.github.io/officina/", output, headingsFile] = process.argv.slice(2);
const headings = headingsFile
  ? JSON.parse(await readFile(resolve(headingsFile), "utf8"))
  : {
      mergeglass: "Follow a fused expert parameter into its saved matrices",
      mcplint: "Declared choices that cannot satisfy their type",
    };
assert(
  Object.keys(headings).length > 0 &&
    Object.values(headings).every((title) => typeof title === "string" && title.length > 0),
);
const entries = JSON.parse(await readFile(new URL("public/projects.json", root), "utf8")).filter((x) =>
  Object.hasOwn(headings, x.name),
);
assert.equal(entries.length, Object.keys(headings).length);
const records = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        for (const entry of entries) {
          const page = await context.newPage();
          await page.goto(base);
          await page.getByRole("searchbox", { name: "Find a tool" }).fill(entry.name);
          const link = page.locator(`[data-project="${entry.name}"] .card-study a`);
          await link.scrollIntoViewIfNeeded();
          await link.focus();
          const hit = await link.evaluate((el) =>
            [...el.getClientRects()].some((r) =>
              el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)),
            ),
          );
          assert(hit);
          assert.equal(await link.getAttribute("href"), entry.study.url);
          const [response] = await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 45000 }),
            page.keyboard.press("Enter"),
          ]);
          assert.equal(response.status(), 200);
          assert.equal(page.url(), entry.study.url);
          const title = headings[entry.name];
          await page.getByRole("heading", { name: title, exact: true }).first().waitFor({ timeout: 15000 });
          records.push({
            engine,
            width,
            project: entry.name,
            keyboardEnter: true,
            hitTest: true,
            url: page.url(),
            status: response.status(),
            title,
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
await writeFile(
  output ? resolve(output) : new URL("results/public-links.json", import.meta.url),
  JSON.stringify({ records }, null, 2) + "\n",
);
console.log(
  `${records.length} real keyboard evidence-link navigations reached the intended pinned GitHub study headings.`,
);
