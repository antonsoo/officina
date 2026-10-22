import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const lessons = [
  { id: "pnigeus", query: "water organ", heading: "What can be learned" },
  { id: "seked", query: "Rhind", heading: "What can be learned" },
  { id: "shiguzhai", query: "bronze bells", heading: "What the controls do" },
  { id: "pyknon", query: "Seikilos", legacy: "tetrachords", heading: "Seikilos reading review" },
  { id: "gonia", query: "entasis", legacy: "Doric", heading: "What can be learned" },
  { id: "stoicheia", query: "Euclid", legacy: "bisection", heading: "What can be learned" },
];

async function explore(page, id) {
  if (id === "pnigeus") {
    assert.equal(await page.locator("#pressure").innerText(), "410");
    assert.equal(await page.locator("#key-0").isChecked(), true);
    await page.locator("#pump").focus();
    await page.keyboard.press("Enter");
    assert.ok(Number(await page.locator("#pressure").innerText()) > 410);
    await page.locator("#undo").click();
    assert.equal(await page.locator("#pressure").innerText(), "410");
    await page.locator('[data-word="aqua"]').click();
    assert.match(await page.locator("#word-note").innerText(), /nominative subject/);
    await page.locator(".source-figure img").scrollIntoViewIfNeeded();
    await page.locator(".source-figure img").evaluate((img) => img.decode());
    return {
      gaugePressurePa: 410,
      actionSequenceRestored: true,
      keyboardPumpAndUndo: true,
      latinWaterSubject: true,
      sourceFigureDecoded: true,
    };
  }
  if (id === "shiguzhai") {
    assert.equal(await page.locator("#reference-pitch").inputValue(), "439");
    assert.match(await page.locator("#coverage-summary").innerText(), /87.*9 modern keys/);
    const marks = () =>
      page
        .locator("#pitch-chart [data-hz]")
        .evaluateAll((nodes) =>
          nodes.map((n) => [
            n.dataset.hz,
            n.dataset.position,
            n.getAttribute("cx"),
            n.getAttribute("cy"),
            n.getAttribute("d"),
          ]),
        );
    const before = await marks();
    assert.equal(before.length, 87);
    await page.locator("#reset-reference").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#reference-pitch").inputValue(), "440");
    assert.match(await page.locator("#coverage-summary").innerText(), /87.*10 modern keys/);
    assert.deepEqual(await marks(), before);
    assert.equal(await page.locator("#b-frequency").inputValue(), "269");
    await page.locator('[data-play="pair"]').click();
    await page.waitForFunction(() => document.body.hasAttribute("data-playing"));
    await page.locator("#stop").click();
    assert.equal(await page.locator("#audio-status").innerText(), "Stopped.");
    return {
      entries: 87,
      keysAt439: 9,
      keysAt440: 10,
      measuredPointsUnchanged: true,
      playbackStartedAndStopped: true,
    };
  }
  if (id === "pyknon") {
    assert.match(await page.locator("#selected-title").innerText(), /φαί/);
    assert.equal(await page.locator("#syllable-table tr").count(), 3);
    const photoURL = await page.locator("#source-lens image").getAttribute("href");
    assert.ok(photoURL?.includes("inscription.jpg"));
    assert.equal(
      await page.evaluate(async (url) => {
        const img = new Image();
        img.src = url;
        await img.decode();
        return img.naturalWidth > 0;
      }, photoURL),
      true,
    );
    await page.locator('[data-song-play="verse"]').click();
    await page.waitForFunction(() =>
      document.querySelector("#song-status").textContent.startsWith("Playing verse"),
    );
    await page.locator("#song-stop").click();
    assert.match(await page.locator("#song-status").innerText(), /Stopped/);
    return {
      selectedSyllable: "φαί",
      notes: 3,
      museumPhotographDecoded: true,
      versePlaybackStartedAndStopped: true,
    };
  }
  if (id === "seked") {
    assert.equal(await page.locator("#lesson-palms").innerText(), "2 1/3 palms");
    assert.match(await page.locator("#step-text").innerText(), /five palms and two fingers/);
    await page.locator('[data-reading="working"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#lesson-palms").innerText(), "5 1/4 palms");
    await page.locator("#clear-rows").click();
    for (const i of [0, 1]) {
      await page.locator(`#row-${i}`).focus();
      await page.keyboard.press("Space");
    }
    assert.match(await page.locator("#reckoning-sum").innerText(), /Target reached/);
    await page.locator("#read-peet").click();
    await page.locator("#scan-window img").evaluate((img) => img.decode());
    assert.match(await page.locator("#scan-caption").innerText(), /Peet/);
    return {
      statementPalms: "7/3",
      workingPalms: "21/4",
      literalResultPalms: "11/2",
      keyboardFractionSum: "3/4",
      sourceDecoded: "Peet 100",
    };
  }
  if (id === "gonia") {
    assert.equal(await page.locator("#entasis-station").inputValue(), "1");
    assert.equal(await page.locator("#entasis-enlargement").inputValue(), "200");
    assert.equal(await page.locator("#entasis-prediction").inputValue(), "circle");
    assert.match(await page.locator("#prediction-assessment").innerText(), /2\.042 mm/);
    await page.locator("#inspect-rounding").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#entasis-prediction").inputValue(), "hyperbola");
    assert.match(await page.locator("#entasis-equation").innerText(), /16\.508 mm/);
    await page.locator('a[data-source="41"]').first().click();
    await page.locator("#entasis-scan-window img").evaluate((img) => img.decode());
    await page.getByRole("link", { name: "Column spacing", exact: true }).click();
    assert.equal(await page.locator("#spacing-title").innerText(), "The space between columns");
    await page.getByRole("link", { name: "Doric corner", exact: true }).click();
    assert.equal(await page.locator("#workshop-title").innerText(), "The corner workshop");
    return {
      circleDifferenceMm: 2.042,
      fivePointMaximumMm: 16.508,
      sourceDecoded: "Penrose 41",
      allThreeWorkshopsReachable: true,
    };
  }
  const state = new URLSearchParams(new URL(page.url()).hash.slice(1));
  assert.equal(state.get("p"), "20");
  assert.equal(state.get("s"), "7");
  assert.equal(state.get("pair"), "2");
  assert.equal(await page.locator('#diagram [data-point="Δ"]').count(), 1);
  assert.match(await page.locator("#diagram-notice").innerText(), /modern expansion/);
  assert.match(await page.locator("#equations").innerText(), /ΒΓ \+ ΓΑ/);
  await page.locator("#pair").focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#pair").inputValue(), "0");
  assert.match(await page.locator("#equations").innerText(), /ΒΑ \+ ΑΓ/);
  await page.locator("#next").click();
  await page.locator('#current-passage [data-source="51"]').click();
  await page.waitForFunction(() => document.querySelector("#source-image").naturalWidth > 0);
  assert.match(await page.locator("#source-title").innerText(), /51/);
  await page.keyboard.press("Escape");
  if (await page.locator("#lesson-select").isVisible())
    await page.locator("#lesson-select").selectOption("19");
  else await page.locator('.lesson-tab[data-lesson="19"]').click();
  await page.locator('#step-list [data-step="2"]').focus();
  await page.keyboard.press("Enter");
  assert.match(await page.locator("#diagram-notice").innerText(), /given angle inequality no longer holds/);
  assert.deepEqual(await page.locator("#comparison thead th").allTextContents(), [
    "Quantity / premise",
    "Original given",
    "Temporary case",
  ]);
  assert.match(await page.locator("#comparison").innerText(), /Not satisfied/);
  return {
    proposition: 20,
    comparedPairs: ["ΒΓ + ΓΑ > ΑΒ", "ΒΑ + ΑΓ > ΒΓ"],
    printedLatinPage: 51,
    converseTemporaryPremise: "Not satisfied",
  };
}

export async function runJourneys(base, out, only) {
  assert.ok(base && out, "Supply catalogue URL and evidence directory.");
  await mkdir(out, { recursive: true });
  const report = {
    checkedAt: new Date().toISOString(),
    base,
    scope:
      "Native catalogue search and keyboard navigation, hosted lesson interactions and pinned GitHub heading placement. Playback state is observed; historical timbre or physical speaker output is not established.",
    configurations: [],
  };
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await engine.launch();
    try {
      for (const width of [1280, 375]) {
        for (const lesson of lessons.filter((l) => !only || l.id === only)) {
          console.log(`${name} ${width}px ${lesson.id}`);
          const context = await browser.newContext({ viewport: { width, height: 900 } });
          context.setDefaultTimeout(20000);
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (e) => errors.push(String(e)));
          await page.goto(base);
          const search = page.getByRole("searchbox", { name: "Find a tool" });
          if (lesson.legacy) {
            await search.fill(lesson.legacy);
            await page.locator(`[data-project="${lesson.id}"]`).waitFor({ state: "visible" });
          }
          await search.fill(lesson.query);
          const card = page.locator(`[data-project="${lesson.id}"]`);
          await card.waitFor({ state: "visible" });
          assert.equal(await page.locator(".card:visible").count(), 1);
          const thumbnail = card.locator("img");
          await thumbnail.scrollIntoViewIfNeeded();
          await thumbnail.evaluate((e) => e.decode());
          assert.equal(await thumbnail.evaluate((e) => e.complete && e.naturalWidth > 0), true);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            true,
          );
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => window.scrollTo(0, 0));
          if (name === "chromium")
            await page.screenshot({ path: `${out}/${lesson.id}-search-${width}.png`, fullPage: true });
          const demo = card.getByRole("link", { name: "Live demo" });
          const demoURL = await demo.getAttribute("href");
          await demo.focus();
          await page.keyboard.press("Enter");
          if (lesson.id === "stoicheia") {
            const target = new URL(demoURL);
            await page.waitForURL(
              (url) =>
                url.origin === target.origin &&
                url.pathname === target.pathname &&
                new URLSearchParams(url.hash.slice(1)).get("p") === "20",
            );
          } else await page.waitForURL(demoURL);
          const interaction = await explore(page, lesson.id);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            true,
          );
          await page.goto(base);
          await page.getByRole("searchbox", { name: "Find a tool" }).fill(lesson.query);
          const evidence = page.locator(`[data-project="${lesson.id}"] .card-study a`);
          const expected = await evidence.getAttribute("href");
          assert.match(expected, /\/blob\/[a-f0-9]{40}\/.+#/);
          await evidence.focus();
          await page.keyboard.press("Enter");
          await page.waitForURL(expected);
          const heading = page.getByRole("heading", { name: lesson.heading, exact: true });
          await heading.waitFor();
          // Observe native fragment navigation after hydration; never scroll
          // the heading into position to make a broken link pass.
          let headingTop;
          await expect
            .poll(
              async () => {
                const box = await heading.boundingBox();
                const visible = box !== null && box.y >= -2 && box.y < 900;
                if (visible) headingTop = box.y;
                return visible;
              },
              { timeout: 15000 },
            )
            .toBe(true);
          assert.deepEqual(errors, []);
          report.configurations.push({
            browser: name,
            version: browser.version(),
            width,
            project: lesson.id,
            search: lesson.query,
            legacySearch: lesson.legacy ?? null,
            matchingCards: 1,
            thumbnailLoaded: true,
            demoURL,
            keyboardDemo: true,
            interaction,
            pinnedEvidence: expected,
            pinnedHeadingTop: headingTop,
            pageErrors: errors,
          });
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
  await writeFile(`${out}/journeys.json`, JSON.stringify(report, null, 2) + "\n");
  console.log(`Verified ${report.configurations.length} catalogue -> lesson -> pinned-source journeys`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await runJourneys(process.argv[2], process.argv[3], process.argv[4]);
