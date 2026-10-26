import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, firefox, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.argv[2],
  out = process.argv[3],
  only = process.argv[4];
assert(base && out, "Supply catalogue URL and review directory.");
await mkdir(out, { recursive: true });
const cases = [
  {
    project: "stoicheia",
    id: "measure",
    query: "μηδεποτε",
    word: "μηδέποτε",
    path: "/stoicheia/measure.html",
    heading: "What the learner can do",
  },
  {
    project: "stoicheia",
    id: "horn",
    query: "ηχθω",
    word: "ἤχθω",
    path: "/stoicheia/horn.html",
    heading: "What the learner can do",
  },
  {
    project: "stoicheia",
    id: "circle",
    query: "sphaerae",
    word: "sphaerae",
    path: "/stoicheia/circle.html",
    heading: "What the learner can do",
  },
  {
    project: "stoicheia",
    id: "desk",
    query: "restricted compass",
    path: "/stoicheia/desk.html",
    heading: "Try an actual construction",
  },
  {
    project: "gonia",
    id: "fluting",
    query: "ῥαβδωσεως",
    word: "ῥαβδώσεως",
    path: "/gonia/fluting.html",
    heading: "What can be learned",
  },
  {
    project: "gonia",
    id: "entasis",
    query: "Penrose",
    word: "Penrose",
    path: "/gonia/entasis.html",
    heading: "What can be learned",
  },
  {
    project: "gonia",
    id: "ledger",
    query: "σιμιο",
    word: "Σιμίο",
    path: "/gonia/ledger.html",
    heading: "Try the ledger",
  },
  {
    project: "pyknon",
    id: "canon",
    query: "επογδοος",
    word: "ἐπόγδοος",
    path: "/pyknon/canon.html",
    heading: "Try the result",
  },
  {
    project: "pyknon",
    id: "trial",
    query: "aequitona",
    word: "aequitona",
    path: "/pyknon/trial.html",
    heading: "What the learner can do",
  },
];
const fold = (s) => s.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
async function image(page, selector) {
  const im = page.locator(selector).first();
  await expect(im).toBeVisible({ timeout: 20000 });
  await im.scrollIntoViewIfNeeded();
  await expect
    .poll(() => im.evaluate((i) => i.complete && i.naturalWidth > 0), { timeout: 20000 })
    .toBe(true);
  return im.evaluate((i) => ({ src: i.currentSrc, width: i.naturalWidth, height: i.naturalHeight }));
}
async function operate(page, id) {
  if (id === "measure") {
    await expect(page.locator("#mr-n")).toHaveValue("577");
    await page.locator("#mr-fit").focus();
    await page.keyboard.press("Enter");
    assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get("copies"), "1");
    return { action: "one copy of 408 fitted into 577", source: await image(page, "#mr-source-image") };
  }
  if (id === "horn") {
    assert.match(await page.locator("#hn-certificate").textContent(), /1\/1000000000001/);
    await page.locator('[data-hn-preset="tangent"]').focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#hn-verdict").textContent(), /angle with the tangent is zero/);
    await page.locator('[data-hn-preset="tiny"]').click();
    return {
      action: "tiny positive ray compared with the tangent",
      source: await image(page, "#hn-source-image"),
    };
  }
  if (id === "circle") {
    await page.locator("#ci-near-miss").focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#ci-bound-status").textContent(), /chain has a gap/);
    await page.locator('[data-stage="1"]').click();
    assert.match(await page.locator("#ci-bound-status").textContent(), /Both perimeter bounds/);
    return {
      action: "unsafe root compared with the still-justified same-row bound",
      source: await image(page, "#ci-source-image"),
    };
  }
  if (id === "desk") {
    await page.locator('[data-tool="line"]').click();
    await page.locator("#dk-first").selectOption("A");
    await page.locator("#dk-second").selectOption("B");
    const before = await page.locator("#dk-count").textContent();
    await page.locator("#dk-draw").focus();
    await page.keyboard.press("Enter");
    const after = await page.locator("#dk-count").textContent();
    assert.notEqual(after, before);
    const drawing = JSON.parse(new URLSearchParams(new URL(page.url()).hash.slice(1)).get("drawing"));
    assert.deepEqual(drawing.actions, [{ kind: "line", a: "A", b: "B" }]);
    return { action: "first line constructed through the two given points", before, after };
  }
  if (id === "fluting") {
    await page.locator("#recipe").selectOption("ionic");
    assert.match(await page.locator("#cut-depth").textContent(), /^50/);
    assert.match(await page.locator("#edge-angle").textContent(), /^90/);
    await page.locator('a[data-source="2"]').click();
    return {
      action: "Ionic hollow selected; Greek fluting clause located",
      source: await image(page, "#source-window img"),
    };
  }
  if (id === "entasis") {
    await page.locator("#entasis-station").focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#entasis-station")).toHaveValue("1");
    await page.locator("#entasis-enlargement").selectOption({ index: 1 });
    return {
      action: "second measurement inspected and departure enlarged",
      station: await page.locator("#station-output").textContent(),
      calculation: await page.locator("#entasis-equation").textContent(),
    };
  }
  if (id === "canon") {
    await expect(page.locator("#passage")).toContainText("ἐπόγδοος");
    const before = await page.locator("#ratio-hz").textContent();
    await page.locator('.step-buttons [data-step="5"]').focus();
    await page.keyboard.press("Enter");
    const after = await page.locator("#ratio-hz").textContent();
    assert.notEqual(after, before);
    await page.locator("#play").click();
    await expect(page.locator("#stop")).toBeEnabled();
    await page.locator("#stop").click();
    return {
      action: "fifth interval selected and synthetic pair scheduled/stopped",
      before,
      after,
      source: await image(page, "#source-image"),
    };
  }
  if (id === "trial") {
    await expect(page.locator("#tr-passage")).toHaveValue("2");
    const hz = async () =>
      Promise.all(["a", "b"].map((k) => page.locator(`#tr-${k}-hz`).getAttribute("data-hz").then(Number)));
    const halves = await hz();
    assert(Math.abs(halves[0] - halves[1]) < 1e-8);
    await page.locator('input[name="tr-test"][value="1"]').focus();
    await page.keyboard.press("Space");
    const quarters = await hz();
    assert(Math.abs(quarters[0] - quarters[1]) > 1);
    return {
      action: "equal halves followed by unequal right quarters",
      halvesHz: halves,
      quartersHz: quarters,
    };
  }
  if (id === "ledger") {
    for (const i of [0, 1, 2, 3, 4]) await page.locator(`#lg-extra-${i}`).check();
    await page.locator("#lg-reveal").focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#lg-result").textContent(), /matches the edited record/);
    await page.locator("#lg-extra-0").uncheck();
    await page.locator("#lg-extra-6").check();
    assert.match(await page.locator("#lg-result").textContent(), /Balanced, but different/);
    await page.locator('[data-lg-person="6"]').click();
    await page.locator("#lg-find").click();
    await page.waitForFunction(() => document.querySelector("#lg-source-note").textContent.startsWith("Verified"));
    return { action: "same total with different named allocation; Sosandros located on the original printed page", source: await image(page, "#lg-source-image") };
  }
  throw Error(`Unknown workshop ${id}`);
}
const report = {
  checkedAt: new Date().toISOString(),
  base,
  scope:
    "Native catalogue search -> matching workshop link -> actual public operation -> immutable review heading. Service workers blocked in these navigation contexts. Audio scheduling is observed, not physical speaker output.",
  configurations: [],
};
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  if (process.env.WORKSHOP_ENGINE && process.env.WORKSHOP_ENGINE !== name) continue;
  const browser = await engine.launch();
  try {
    for (const width of [1280, 375]) {
      if (process.env.WORKSHOP_WIDTH && Number(process.env.WORKSHOP_WIDTH) !== width) continue;
      for (const c of cases.filter((c) => !only || only.split(",").includes(c.id))) {
        console.log(`${name} ${width} ${c.id}`);
        const context = await browser.newContext({
            viewport: { width, height: 900 },
            serviceWorkers: "block",
          }),
          page = await context.newPage();
        const errors = [],
          failedRequests = [],
          consoleErrors = [];
        page.on("requestfailed", (r) => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
        page.on("console", (m) => {
          if (m.type() === "error") consoleErrors.push(m.text());
        });
        page.on("pageerror", (e) => {
          if (new URL(page.url()).hostname !== "github.com") errors.push(String(e));
        });
        const prefix = `${out}/${name}-${width}-${c.id}`;
        try {
          await page.goto(base);
          const search = page.getByRole("searchbox", { name: "Find a tool" });
          await search.waitFor();
          const catalogueRequests = [];
          page.on("request", (r) => {
            if (new URL(r.url()).pathname.endsWith("/projects.json")) catalogueRequests.push(r.url());
          });
          const address = page.url();
          await search.fill(c.query);
          await expect(search).toBeFocused();
          const row = page.locator(`[data-project="${c.project}"] [data-workshop="${c.id}"]`);
          await row.waitFor({ state: "visible" });
          const target = await row.locator(".workshop-demo").getAttribute("href");
          assert.equal(new URL(target).pathname, c.path);
          assert.equal(page.url(), address);
          assert.deepEqual(catalogueRequests, []);
          // Snapshot the filtering interval before returning here fetches the catalogue again.
          const extraCatalogueRequests = [...catalogueRequests];
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          if (c.id === "measure") {
            const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
            assert.deepEqual(
              axe.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
              [],
            );
          }
          if (name === "chromium") await page.screenshot({ path: `${prefix}-search.png`, fullPage: true });
          await row.locator(".workshop-demo").focus();
          await page.keyboard.press("Enter");
          await page.waitForURL((u) => u.origin === new URL(target).origin && u.pathname === c.path);
          await page.locator("h1").waitFor();
          const initialAddress = page.url();
          if (c.word)
            assert(
              fold(await page.locator("body").innerText()).includes(fold(c.word)),
              `Source word missing: ${c.word}`,
            );
          const interaction = await operate(page, c.id);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          if (name === "chromium") await page.screenshot({ path: `${prefix}-operation.png` });
          await page.goto(base);
          await page.getByRole("searchbox", { name: "Find a tool" }).fill(c.query);
          const review = page.locator(
            `[data-project="${c.project}"] [data-workshop="${c.id}"] .workshop-review`,
          );
          const reviewURL = await review.getAttribute("href");
          assert.match(reviewURL, /\/blob\/[a-f0-9]{40}\/docs\/.+\.md#/);
          await review.focus();
          await page.keyboard.press("Enter");
          await page.waitForURL(reviewURL);
          const heading = page.getByRole("heading", { name: c.heading, exact: true });
          await heading.waitFor();
          let headingTop;
          await expect
            .poll(
              async () => {
                const box = await heading.boundingBox();
                if (box && box.y >= -2 && box.y + box.height <= 900) {
                  headingTop = box.y;
                  return true;
                }
                return false;
              },
              { timeout: 15000 },
            )
            .toBe(true);
          assert.deepEqual(errors, []);
          report.configurations.push({
            engine: name,
            version: browser.version(),
            width,
            project: c.project,
            workshop: c.id,
            query: c.query,
            target,
            initialAddress,
            sourceWord: c.word ?? null,
            interaction,
            reviewURL,
            nativeReviewHeadingTop: headingTop,
            extraCatalogueRequests,
            applicationErrors: errors,
          });
          await writeFile(
            `${out}/progress.json`,
            JSON.stringify({ ...report, partial: true }, null, 2) + "\n",
          );
        } catch (error) {
          await page.screenshot({ path: `${prefix}-failure.png` });
          console.error({ workshop: c.id, url: page.url(), errors, failedRequests, consoleErrors });
          throw error;
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(`${out}/journeys.json`, JSON.stringify(report, null, 2) + "\n");
console.log(`Verified ${report.configurations.length} direct workshop/review journeys`);
