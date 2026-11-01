import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert(catalogue && output, "Supply the local catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const reviews = new Map();
const report = {
  date: new Date().toISOString(),
  scope:
    "Local question menu to existing public experiments. This does not verify publication of the new menu or the new conditional room.",
  journeys: [],
};
async function pinnedReview(url) {
  if (reviews.has(url)) return reviews.get(url);
  const u = new URL(url);
  const m = /^\/antonsoo\/([^/]+)\/(blob|tree)\/([a-f0-9]{40})\/(.+)$/.exec(u.pathname);
  assert(m, `Expected immutable review: ${url}`);
  const file = m[4] + (m[2] === "tree" ? "/README.md" : "");
  const local = execFileSync("git", ["-C", resolve("..", m[1]), "show", `${m[3]}:${file}`]);
  const raw = `https://raw.githubusercontent.com/antonsoo/${m[1]}/${m[3]}/${file}`;
  const response = await fetch(raw);
  assert.equal(response.status, 200, raw);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.deepEqual(bytes, local);
  const result = { url, raw, bytes: bytes.length, sha256: hash(bytes) };
  reviews.set(url, result);
  return result;
}
async function operate(page, id) {
  if (id === "columns") {
    await page.locator('input[name="reading"][value="columns"]').check();
    await expect(page.locator("#count-equation")).toContainText("12 columns");
    await expect(page.locator("#count-source")).toContainText(/Source|Perseus|Description/);
    return { selector: "#count-equation", result: await page.locator("#count-equation").textContent() };
  }
  if (id === "counterexample") {
    await expect(page.locator("#scan-status")).toContainText("Printed page 26");
    await page.locator("#pin").click();
    await page.locator("#stone").click();
    await expect(page.locator("#judgment")).toHaveAttribute("data-status", "counterexample");
    await expect(page.locator("#scan-status")).toContainText("Printed page 26");
    return { selector: "#judgment", result: await page.locator("#judgment").textContent() };
  }
  if (id === "dorian") {
    await page.locator("#compare-relation").selectOption("pattern");
    await expect(page.locator("#compare-finding")).toContainText("All eight pitches agree");
    await page.locator("#compare-both").click();
    await page.waitForFunction(() => document.getElementById("comparison-audio").currentTime > 0);
    await page.locator("#compare-stop").click();
    await page.locator("#source-load").click();
    await expect(page.locator("#source-image")).toBeVisible();
    return {
      selector: "#compare-finding",
      result: await page.locator("#compare-finding").textContent(),
      audioClockAdvanced: true,
    };
  }
  if (id === "circle") {
    await page.locator('[data-stage="1"]').click();
    await expect(page.locator("#ci-stage-heading")).toContainText("12");
    await page.locator("#ci-value").fill("600");
    await page.locator('#ci-edit-form button[type="submit"]').click();
    await expect(page.locator("#ci-edit-status")).not.toBeEmpty();
    return { selector: "#ci-bound-status", result: await page.locator("#ci-bound-status").textContent() };
  }
  await page.getByRole("button", { name: "GenAI semconv example", exact: true }).click();
  await expect(page.getByRole("tree", { name: "Span waterfall" })).toBeVisible();
  await expect(page.locator("#tl-span-search")).toBeVisible();
  await page.locator("#tl-span-search").fill("chat");
  return {
    selector: "#tl-span-filter-count",
    result: await page.locator("#tl-span-filter-count").textContent(),
  };
}

try {
  for (const [engine, type] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await type.launch();
    try {
      for (const width of [1440, 375]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          serviceWorkers: "block",
        });
        const page = await context.newPage();
        for (const id of ["columns", "counterexample", "dorian", "circle", "trace"]) {
          await page.goto(catalogue);
          if (width === 375) await page.locator("#question-choice").selectOption(id);
          else {
            await page.locator(`#question-${id}`).focus();
            await page.keyboard.press("Enter");
          }
          await page.locator(".question-preview img").evaluate((i) => i.decode());
          const target = await page.locator(".question-open").getAttribute("href");
          const review = await pinnedReview(await page.locator(".question-review").getAttribute("href"));
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          if (engine === "chromium")
            await page.screenshot({ path: resolve(output, `menu-${id}-${width}.png`) });
          await page.locator(".question-open").focus();
          await page.keyboard.press("Enter");
          await expect(page).toHaveURL(target);
          const operation = await operate(page, id);
          report.journeys.push({ engine, width, id, target, review, operation });
          console.log(`${engine}/${width}/${id}: menu, immutable review, public operated lesson`);
        }
        await context.close();
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  await writeFile(resolve(output, "receipt.json"), `${JSON.stringify(report, null, 2)}\n`);
}
