import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const cards = JSON.parse(await readFile("public/projects.json", "utf8"));
const anchors = {
  rajju: "#field-workshop",
  pnigeus: ".shape-section",
  seked: ".reading-desk",
  shiguzhai: ".reference-control",
  pyknon: "#rhythm",
  gonia: ".hw-workbench",
  stoicheia: ".dk-layout",
  grama: "#bench",
  dioptra: ".fl-lab",
};
const browser = await chromium.launch();
const report = {
  checkedAt: new Date().toISOString(),
  browser: browser.version(),
  viewport: { width: 1200, height: 750 },
  captures: [],
};
try {
  for (const [name, anchor] of Object.entries(anchors).filter(
    ([name]) => !process.argv[3] || process.argv.slice(3).includes(name),
  )) {
    const card = cards.find((c) => c.name.toLowerCase() === name);
    const page = await browser.newPage({ viewport: report.viewport });
    await page.goto(card.demoUrl);
    await page.evaluate(() => document.fonts.ready);
    if (name === "stoicheia") {
      for (const [kind, first, second, branch] of [
        ["line", "A", "B"],
        ["circle", "A", "B"],
        ["circle", "B", "A"],
        ["meet", "c2", "c3", 0],
        ["line", "P1", "B"],
        ["circle", "B", "C"],
      ]) {
        await page.locator(`[data-tool="${kind}"]`).click();
        await page.locator("#dk-first").selectOption(first);
        await page.locator("#dk-second").selectOption(second);
        if (kind === "meet") await page.locator(`[data-keep="${branch}"]`).click();
        else await page.locator("#dk-draw").click();
      }
      await page.locator('[data-tool="meet"]').click();
      await page.locator("#dk-first").selectOption("l4");
      await page.locator("#dk-second").selectOption("c5");
    }
    // Let the application's own fragment scroll finish before choosing the
    // screenshot frame. Otherwise a scheduled frame can undo our scroll.
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    await page.locator(anchor).evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" }));
    const wantedTop = 0;
    if (name === "gonia") {
      const top = (await page.locator(anchor).boundingBox()).y;
      await page.evaluate((offset) => window.scrollBy(0, offset), top - wantedTop);
    }
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const anchorTop = (await page.locator(anchor).boundingBox()).y;
    assert.ok(
      Math.abs(anchorTop - wantedTop) <= 32,
      `${name}: screenshot anchor is outside the intended frame (${anchorTop})`,
    );
    if (name === "pyknon") await page.locator("#rh-drawing svg").waitFor();
    const path = `public/${card.thumbnail}`;
    await page.screenshot({ path });
    report.captures.push({
      project: name,
      url: card.demoUrl,
      capturedURL: page.url(),
      interactionBeforeCapture:
        name === "stoicheia"
          ? "Six learner commands; inspect both crossings before choosing the seventh"
          : "None",
      anchor,
      anchorTop,
      wantedTop,
      file: card.thumbnail,
      sha256: createHash("sha256")
        .update(await readFile(path))
        .digest("hex"),
    });
    await page.close();
  }
} finally {
  await browser.close();
}
const out = process.argv[2] ?? "docs/evidence/ancient-readings-2026-10-21";
await mkdir(out, { recursive: true });
await writeFile(`${out}/thumbnails.json`, JSON.stringify(report, null, 2) + "\n");
