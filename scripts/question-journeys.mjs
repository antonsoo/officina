import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, expect } from "@playwright/test";

const [catalogue, output] = process.argv.slice(2);
assert(catalogue && output, "Supply the catalogue URL and receipt directory.");
await mkdir(output, { recursive: true });
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const reviews = new Map();
const report = {
  date: new Date().toISOString(),
  scope:
    "Operated question-menu handoffs to public experiments, with pinned raw-review identity. Canonical hosted-file identity is recorded separately.",
  state: "running",
  expectedJourneys: 24,
  searches: [],
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
let cordDownloads = 0;
async function operate(page, id) {
  if (id === "roof") {
    await page.getByRole("button", { name: "Try a middle ornament only h/8 tall" }).click();
    await expect(page.locator("#roof-result")).toContainText("88.89% shorter");
    await page.getByRole("button", { name: "Match Vitruvius’s middle height" }).click();
    await expect(page.locator('[name="roof-trial"]')).toHaveValue("1.125");
    await page.getByRole("button", { name: "Read complete printed page 74", exact: true }).click();
    await expect(page.locator("#drill-source-status")).toContainText("Complete printed page 74.", {
      timeout: 20000,
    });
    return {
      selector: "#roof-result",
      result: await page.locator("#roof-result").textContent(),
      sourcePage: 74,
    };
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
    try {
      await page.waitForFunction(() => document.getElementById("comparison-audio").currentTime > 0);
    } catch (error) {
      const state = await page.locator("#comparison-audio").evaluate((a) => ({
        time: a.currentTime,
        paused: a.paused,
        ended: a.ended,
        duration: a.duration,
        ready: a.readyState,
        network: a.networkState,
        error: a.error?.message,
        source: a.currentSrc,
        status: document.getElementById("audio-label").textContent,
      }));
      console.error("Native comparison playback did not advance:", state);
      throw error;
    }
    await page.locator("#compare-stop").click();
    await page.locator("#source-load").click();
    await expect(page.locator("#source-image")).toBeVisible();
    return {
      selector: "#compare-finding",
      result: await page.locator("#compare-finding").textContent(),
      audioClockAdvanced: true,
    };
  }
  if (id === "cord") {
    await expect(page.locator("#error-near")).toHaveValue("10");
    await page.locator("#error-near").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#error-near").inputValue(), "11");
    assert(await page.locator("#error-near").evaluate((e) => document.activeElement === e));
    await page.locator('[data-errors="-300,300"]').click();
    await expect(page.locator('[data-error-method="51213"]')).toContainText("Cannot reach");
    await page.locator('[data-errors="10,0"]').click();
    await expect(page.locator('[data-error-method="51213"]')).toContainText("0.260013");
    await page.locator("#error-source-link").click();
    await page.locator("#field-source-image").waitFor({ state: "visible" });
    const sourceSha = await page.locator("#field-source-image").evaluate(async (img) => {
      const bytes = await (await fetch(img.src)).arrayBuffer();
      return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("");
    });
    assert.equal(sourceSha, "5cb1829e54f9ec8f812beb368fab1b68bdf1be130087776bf4b071327c4880ba");
    const pending = page.waitForEvent("download");
    await page.locator("#field-save").click();
    const download = await pending;
    const file = resolve(output, `cord-${++cordDownloads}.html`);
    await download.saveAs(file);
    const html = await readFile(file);
    assert(html.includes(Buffer.from("Near-segment error +0.1")));
    assert(html.includes(Buffer.from("Required Notice: Copyright")));
    const saved = await page.context().newPage(),
      requests = [];
    saved.on("request", (r) => {
      if (/^https?:/.test(r.url())) requests.push(r.url());
    });
    await saved.goto(`file://${file}`);
    await expect(saved.locator(".cord-error-study")).toContainText("0.260013");
    assert.deepEqual(requests, []);
    await saved.close();
    return {
      selector: "#error-summary",
      result: await page.locator("#error-summary").textContent(),
      sourceSha,
      readingSha256: hash(html),
      savedReadingRequests: requests,
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
        for (const term of ["cord errors", "lakṣaṇa", "measurement errors"]) {
          await page.goto(catalogue);
          await page.locator("#tool-search").fill(term);
          await expect(page.locator('[data-project="rajju"] [data-workshop="cord-errors"]')).toBeVisible();
        }
        await page.locator("#copy-search-link").click();
        const shared = await page.locator("#filter-link-url").inputValue();
        await page.goto(shared);
        await expect(page.locator("#tool-search")).toHaveValue("measurement errors");
        const workshop = page.locator('[data-project="rajju"] [data-workshop="cord-errors"]');
        const searchReview = await pinnedReview(
          await workshop.locator(".workshop-review").getAttribute("href"),
        );
        await workshop.locator(".workshop-demo").focus();
        await page.keyboard.press("Enter");
        const searchOperation = await operate(page, "cord");
        report.searches.push({ engine, width, shared, searchReview, operation: searchOperation });
        for (const id of ["roof", "counterexample", "dorian", "circle", "cord", "trace"]) {
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
  assert.equal(report.journeys.length, report.expectedJourneys);
  report.state = "passed";
} catch (error) {
  report.state = "failed";
  report.error = String(error);
  throw error;
} finally {
  await writeFile(resolve(output, "receipt.json"), `${JSON.stringify(report, null, 2)}\n`);
}
