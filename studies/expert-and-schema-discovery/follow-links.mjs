import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium, firefox } from "@playwright/test";
const root = new URL("../../", import.meta.url);
const entries = JSON.parse(await readFile(new URL("public/projects.json", root), "utf8")).filter((x) =>
  ["mergeglass", "mcplint"].includes(x.name),
);
const records = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        for (const entry of entries) {
          const page = await context.newPage();
          await page.goto("https://antonsoo.github.io/officina/");
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
          const title =
            entry.name === "mergeglass"
              ? "Follow a fused expert parameter into its saved matrices"
              : "Declared choices that cannot satisfy their type";
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
  new URL("results/public-links.json", import.meta.url),
  JSON.stringify({ records }, null, 2) + "\n",
);
console.log(
  "Eight real keyboard evidence-link navigations reached the intended pinned GitHub study headings.",
);
