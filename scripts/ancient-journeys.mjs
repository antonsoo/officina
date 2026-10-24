import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const lessons = [
  { id: "rajju", query: "marked cords", legacy: "Sanskrit", heading: "What can be learned" },
  { id: "pnigeus", query: "water organ", heading: "What can be learned" },
  { id: "seked", query: "Rhind", heading: "What can be learned" },
  { id: "shiguzhai", query: "bronze bells", heading: "What the controls do" },
  { id: "pyknon", query: "Seikilos", legacy: "tetrachords", heading: "Seikilos reading review" },
  { id: "gonia", query: "sounding vessels", legacy: "flute", heading: "What a learner can now do" },
  { id: "dioptra", query: "water supply", legacy: "unseen tunnel", heading: "What the learner can do" },
  { id: "stoicheia", query: "complements", legacy: "bisection", heading: "What can be learned" },
];

async function explore(page, id) {
  if (id === "rajju") {
    assert.match(await page.locator("#peg-error").innerText(), /Position \(36, 12\)/);
    for (const c of ["wn", "ws", "en", "es"]) {
      await page.locator(`button[data-corner="${c}"]`).click();
      await page.locator("#restore-source").click();
      await page.locator("#place-peg").click();
    }
    assert.match(await page.locator("#ground-result").innerText(), /972 square/);
    for (const c of ["en", "es"]) {
      await page.locator(`button[data-corner="${c}"]`).click();
      await page.locator('input[name="field-stake"][value="grip"]').focus();
      await page.keyboard.press("Space");
      await page.locator("#place-peg").click();
    }
    assert.match(await page.locator("#ground-result").innerText(), /1,080 square/);
    assert.match(await page.locator("#peg-error").innerText(), /angle: 90°/);
    await page.locator('[data-field-page="10"]').click();
    await page.locator("#field-source-image").evaluate((img) => img.decode());
    assert.match(await page.locator("#field-source-note").innerText(), /southwest and southeast/);
    const [template] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#field-template").click(),
    ]);
    assert.equal(template.suggestedFilename(), "rajju-paper-cord.svg");
    await page.getByRole("link", { name: "Circle & return", exact: true }).click();
    assert.match(await page.locator("#lesson-title").innerText(), /circle/);
    await page.locator("#diagonal-tab").focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#lesson-title").innerText(), /diagonal/);
    return {
      sourcePeg: { east: 36, north: 12 },
      prescribedArea: 972,
      easternGripsArea: 1080,
      baselineAngleRemainsDegrees: 90,
      printedDirectionDiscrepancyRead: true,
      nativeTemplateDownloaded: true,
      allThreeLessonsReachable: true,
    };
  }
  if (id === "pnigeus") {
    assert.equal(await page.locator("#shape-pressure").innerText(), "4481");
    assert.equal(await page.locator("#radius").inputValue(), "40");
    await page.locator("#half-radius").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#radius").inputValue(), "20");
    assert.equal(await page.locator("#shape-pressure").innerText(), "2241");
    await page.locator("#published-case").click();
    await page.locator('[data-greek="water"]').click();
    assert.match(await page.locator("#greek-note").innerText(), /dative singular/);
    await page.locator("#greek-scan image").evaluate(async (node) => {
      const img = new Image();
      img.src = node.getAttribute("href");
      await img.decode();
      if (img.naturalWidth !== 1650) throw new Error("Wrong source page");
    });
    await page.getByRole("link", { name: "Return to the pump and listening workshop" }).click();
    for (let i = 0; i < 3; i++) await page.locator("#pump").click();
    assert.equal(await page.locator("#pressure").innerText(), "854");
    await page.locator("#key-0").check();
    await page.locator("#seconds").selectOption("5");
    await page.locator("#release").click();
    assert.equal(await page.locator("#pressure").innerText(), "410");
    return {
      geometricPresetDiameterCm: 80,
      halfSizeEndpointPa: 2241,
      greekDativeRead: true,
      originalSourcePageDecoded: true,
      pumpWorkshopReached: true,
      threeStrokesThenOnePipePa: 410,
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
  if (id === "dioptra") {
    assert.match(await page.locator("#fl-result").innerText(), /A 9.6 L.*B 28.8 L/);
    await page.locator("#fl-changing-example").focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#fl-prediction").innerText(), /overestimates.*9.6 L/);
    await page.locator('[data-window="last"]').click();
    assert.match(await page.locator("#fl-prediction").innerText(), /underestimates.*9.6 L/);
    await page.locator('[data-window="whole"]').click();
    assert.match(await page.locator("#fl-equation").innerText(), /19.2 L ÷ 20 s = 0.96 L\/s/);
    await page.locator("#fl-passage").selectOption("7");
    assert.match(await page.locator("#fl-note").innerText(), /apparatus.*πάχος/s);
    await page.locator("#fl-inspect").click();
    await page.waitForFunction(() => {
      const im = document.querySelector("#fl-source-image");
      return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
    });
    const [water] = await Promise.all([page.waitForEvent("download"), page.locator("#fl-save-reading").click()]);
    assert.equal(water.suggestedFilename(), "dioptra-flow-reading.html");
    await page.getByRole("link", {name:"15 · Tunnel survey",exact:true}).click();
    await page.locator('[data-stage="3"]').click();
    await page.locator("#detour").focus();
    await page.keyboard.press("End");
    assert.match(await page.locator("#net-x").innerText(), /300/);
    assert.match(await page.locator("#net-y").innerText(), /60/);
    await page.locator("#set-aim").click();
    await page.locator("#error").fill("10");
    assert.match(await page.locator("#gap-note").innerText(), /60 mm/);
    await page.locator("#passage").selectOption("7");
    assert.match(await page.locator("#greek").innerText(), /ἀλλήλοις/);
    await page.locator("#show-source").click();
    await page.waitForFunction(() => {
      const im = document.querySelector("#source-image");
      return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
    });
    const [saved] = await Promise.all([page.waitForEvent("download"), page.locator("#save-study").click()]);
    assert.equal(saved.suggestedFilename(), "dioptra-field-book.html");
    return {
      equalSectionVolumesL: [9.6, 28.8],
      changingTotalL: 19.2,
      shortSampleErrorL: 9.6,
      speedThicknessApparatusRead: true,
      completeWaterReadingDownloaded: true,
      net: [300, 60],
      chosenPegErrorMm: 10,
      middleGapMm: 60,
      reciprocalGreekRead: true,
      sourceDecoded: true,
      completeFieldBookDownloaded: true,
    };
  }
  if (id === "gonia") {
    assert.equal(await page.locator(".ec-vessel").count(), 13);
    await page.locator('[data-ec-note="4"]').focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#ec-selection").innerText(), /247.50 Hz.*3 and 11/);
    await page.locator('[data-ec-note="3"]').click();
    await page.locator("#ec-read-order").click();
    assert.match(await page.locator("#ec-latin").innerText(), /^quarta/);
    await page.locator("#ec-play-row").click();
    await expect(page.locator("#ec-stop")).toBeEnabled();
    await page.locator("#ec-stop").click();
    await expect(page.locator("#ec-stop")).toBeDisabled();
    await page.locator("#ec-miss").click();
    assert.match(await page.locator("#ec-amplitude").innerText(), /^6\.8%$/);
    const [sound] = await Promise.all([
      page.waitForEvent("download"), page.locator("#ec-save-response").click(),
    ]);
    assert.match(sound.suggestedFilename(), /\.wav$/);
    await page.getByRole("link", { name: "Theatre", exact: true }).click();
    await page.locator("#th-roman").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#th-roman-depth").innerText(), "5 m");
    await page.locator("#th-greek").click();
    assert.equal(await page.locator("#th-greek-depth").innerText(), "2.93 m");
    await page.locator("#th-single").click();
    assert.match(await page.locator("#th-arc-note").innerText(), /Your alteration/);
    await page.locator("#th-three").click();
    await page.locator("#th-source").selectOption("4");
    await page.locator("#th-source-image").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const im = document.querySelector("#th-source-image");
      return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
    });
    const [plan] = await Promise.all([page.waitForEvent("download"), page.locator("#th-save-csv").click()]);
    assert.match(plan.suggestedFilename(), /theatre.*csv/);
    await page.getByRole("link", { name: "Temple plan", exact: true }).click();
    assert.ok((await page.locator("h1").innerText()).length > 10);
    await page.goto(
      "https://antonsoo.github.io/gonia/transport.html?kind=wheels&w=8&h=6&r=7.5&angle=53&unit=feet&page=231#transport-workshop",
    );

    assert.equal(await page.locator("#full-clearance").textContent(), "2.5 source feet");
    assert.match(await page.locator("#transport-verdict").textContent(), /does not explain the veering/);
    await page.locator("#transport-tight").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".stone-intrusion").count(), 1);
    await page.locator("#transport-quarter").click();
    assert.equal(await page.locator(".stone-intrusion").count(), 0);
    assert.match(await page.locator("#transport-verdict").textContent(), /too small/);
    await page.locator('[data-transport-word="armillis"]').click();
    assert.match(await page.locator("#transport-word-note").textContent(), /Ablative plural/);
    assert.ok(
      await page.locator("#transport-word-panel").evaluate((e) => Boolean(e.closest(".transport-reading"))),
    );
    await page.locator('button[data-transport-page="230"]').click();
    await page.locator("#transport-source-image").evaluate((img) => img.decode());
    const [turn] = await Promise.all([page.waitForEvent("download"), page.locator("#transport-csv").click()]);
    assert.equal(turn.suggestedFilename(), "gonia-transport.csv");
    await page.getByRole("link", { name: "Fluting", exact: true }).click();
    assert.equal(await page.locator("#cut-depth").innerText(), "20.71 mm");
    assert.equal(await page.locator("#edge-angle").innerText(), "135°");
    await page.locator('a[href="#segment-study"]').click();
    assert.equal(
      await page.locator("#segment-p-title").textContent(),
      "P makes 135 degrees in the smaller segment",
    );
    assert.equal(
      await page.locator("#segment-q-title").textContent(),
      "Q makes 45 degrees in the larger segment",
    );
    await page.locator("#segment-point").focus();
    await page.keyboard.press("Home");
    assert.equal(await page.locator("#point").inputValue(), "5");
    assert.match(await page.locator(".segment-reading [lang=la].source-words").textContent(), /minor recto/);
    await page.locator('[data-source="3"]').click();
    await page.locator("#source-window img").evaluate((img) => img.decode());
    assert.match(await page.locator("#source-caption").innerText(), /Heiberg/);
    await page.locator("#recipe").selectOption("ionic");
    assert.equal(await page.locator("#cut-depth").innerText(), "50.00 mm");
    assert.equal(await page.locator("#gauge-miss").innerText(), "0.00 mm");
    await page.locator("#point").focus();
    await page.keyboard.press("End");
    assert.equal(await page.locator("#edge-angle").innerText(), "90°");
    const [template] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#save-template").click(),
    ]);
    assert.equal(template.suggestedFilename(), "gonia-ionic-100mm.svg");
    await page.locator('[data-source="2"]').click();
    await page.locator("#source-window img").evaluate((img) => img.decode());
    assert.match(await page.locator(".genitive-line").innerText(), /κίονος/);
    await page.getByRole("link", { name: "Entasis", exact: true }).click();
    await page.locator("#entasis-station").fill("1");
    await page.locator("#entasis-station").dispatchEvent("input");
    await page.locator("#entasis-enlargement").selectOption("200");
    await page.locator("#entasis-prediction").selectOption("circle");
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
      soundingVessels: 13,
      fourthPlacementRead: true,
      detunedAmplitudePercent: 6.8,
      nativeResponseWavDownloaded: true,
      romanStageDepthM: 5,
      greekStageDepthM: 2.93,
      changedCompassCentresRead: true,
      theatreCsvDownloaded: true,
      colonnadeReached: true,
      circleDifferenceMm: 2.042,
      fivePointMaximumMm: 16.508,
      sourceDecoded: "Penrose 41",
      transportMinimumClearanceSourceFeet: 2.5,
      blockedBetweenQuarterTurns: true,
      inlineLatinAblativeRead: true,
      nativeFullTurnDownloaded: true,
      doricDepthMm: 20.71,
      ionicDepthMm: 50,
      movingIonicAngle: 90,
      nativeTemplateDownloaded: true,
      greekGenitivesRead: true,
      allFiveWorkshopsReachable: true,
    };
  }
  assert.match(await page.locator("#gn-complement-status").innerText(), /13.65 u²/);
  await page.locator("#gn-break").focus();
  await page.keyboard.press("Enter");
  assert.match(await page.locator("#gn-complement-status").innerText(), /7.35 u².*25.35 u²/s);
  assert.match(await page.locator("#gn-complement-note").innerText(), /small triangle pairs remain equal/);
  assert.equal(await page.locator('[data-gn-step="3"]').isDisabled(), true);
  await page.locator("#gn-restore").click();
  await page.locator('[data-gn-gstep="5"]').click();
  assert.match(await page.locator("#gn-gnomon-status").innerText(), /36 \+ 6.25 = 42.25/);
  await page.locator("#gn-read-gnomon").click();
  assert.equal(await page.locator("#gn-passage").inputValue(), "9");
  const [gnomon] = await Promise.all([page.waitForEvent("download"), page.locator("#gn-save").click()]);
  assert.equal(gnomon.suggestedFilename(), "stoicheia-gnomon-reading.html");
  await page.locator("#gn-to-quadrature").click();
  assert.match(await page.locator("#qa-result").innerText(), /Same area: 36 u²/);
  await page.locator('[data-qa-stage="5"]').focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".qa-constructed-square").count(), 1);
  await page.locator("#qa-lock").check();
  await page.locator("#qa-a").fill("11");
  await page.locator("#qa-a").press("Tab");
  assert.equal(await page.locator("#qa-b").inputValue(), "2");
  assert.match(await page.locator("#qa-result").innerText(), /Same area: 22 u²/);
  await page.locator('[data-qa-preset="90,40"]').click();
  await page.locator("#qa-fold").click();
  await page.locator("#qa-cancel").click();
  assert.match(await page.locator("#qa-proof-note").innerText(), /Remove 6.25 u²/);
  await page.locator("#qa-read-subtract").click();
  assert.match(await page.locator('#qa-passage-text [lang="grc"]').first().innerText(), /^κοινὸν ἀφῃρήσθω/);
  const [quadrature] = await Promise.all([page.waitForEvent("download"), page.locator("#qa-save-study").click()]);
  assert.equal(quadrature.suggestedFilename(), "stoicheia-II14-reading.html");
  await page.getByRole("link", { name: "I.1–21 · Read the course", exact: true }).click();
  await page.goto(new URL("#p=21&s=9&m=55", page.url()).href);
  const state = new URLSearchParams(new URL(page.url()).hash.slice(1));
  assert.equal(state.get("p"), "21");
  assert.equal(state.get("s"), "9");
  await page.locator("#motion").focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#motion").inputValue(), "11");
  const values = await page.locator("#comparison tbody td:not(:first-child)").allTextContents();
  assert.ok(Number(values[3]) > Number(values[2]));
  assert.ok(Number(values[5]) < Number(values[4]));
  assert.ok(parseFloat(values[7]) > parseFloat(values[6]));
  await page.locator('#current-passage [data-source="53"]').click();
  await page.waitForFunction(() => {
    const im = document.querySelector("#source-image");
    return im.complete && im.naturalWidth > 0;
  });
  assert.match(await page.locator("#source-title").innerText(), /53/);
  await page.keyboard.press("Escape");
  const [study] = await Promise.all([page.waitForEvent("download"), page.locator("#save-sheet").click()]);
  assert.equal(study.suggestedFilename(), "stoicheia-I21-study.html");
  await page.locator('a[href$="triangle.html"]').click();
  await page.locator(".cl-presets summary").click();
  await page.getByRole("button", { name: "Touch inside", exact: true }).click();
  assert.match(await page.locator("#closure-result").innerText(), /touch|tangent/i);
  const [closure] = await Promise.all([page.waitForEvent("download"), page.locator("#save-study").click()]);
  assert.match(closure.suggestedFilename(), /I22/);
  return {
    offDiagonalComplementAreas: [7.35, 25.35],
    smallTrianglePairsRemainEqual: true,
    gnomonArea: 36,
    gnomonReadingDownloaded: true,
    quadratureArea: 36,
    samePerimeterRectangleArea: 22,
    commonSquareRemoved: 6.25,
    greekSubtractionRead: true,
    quadratureReadingDownloaded: true,
    proposition: 21,
    interiorPercent: 11,
    individualSideCanGrow: true,
    combinedLengthSmaller: true,
    includedAngleLarger: true,
    printedLatinPage: 53,
    illustratedStudyDownloaded: true,
    closureWorkshopReached: true,
    internalTangencyExplored: true,
    closureReadingDownloaded: true,
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
        for (const lesson of lessons.filter((l) => !only || only.split(",").includes(l.id))) {
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
          const matchingCards = await page.locator(".card:visible").count();
          assert(matchingCards >= 1);
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
                url.pathname === target.pathname,
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
            matchingCards,
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
