import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const lessons = [
  { id: "rajju", query: "marked cords", legacy: "Sanskrit", heading: "What can be learned" },
  { id: "pnigeus", query: "water organ", heading: "What can be learned" },
  { id: "seked", query: "Rhind", heading: "What can be learned" },
  { id: "shiguzhai", query: "bronze bells", heading: "What the controls do" },
  { id: "pyknon", query: "ῥυθμός", legacy: "ισοτονον", heading: "What a learner can do" },
  { id: "gonia", query: "religatur", legacy: "sounding vessels", heading: "What a learner can do" },
  { id: "dioptra", query: "water supply", legacy: "unseen tunnel", heading: "What the learner can do" },
  {
    id: "stoicheia",
    query: "restricted compass",
    legacy: "two mean proportionals",
    heading: "Try an actual construction",
  },
  { id: "grama", query: "pañcama", legacy: "Indian music", heading: "What changed for a learner" },
];

async function exploreEarlier(page, id) {
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
    assert.equal(await page.locator("#tr-string").inputValue(), "repeat");
    for (const test of [0, 1]) {
      await page.locator(`input[name="tr-test"][value="${test}"]`).check();
      assert.match(await page.locator("#tr-verdict").innerText(), /Same pitch/);
    }
    await page.locator('input[name="tr-test"][value="2"]').focus();
    await page.keyboard.press("Space");
    assert.match(await page.locator("#tr-difference").innerText(), /701.955 cents higher/);
    await page.locator("#tr-play").click();
    await page.waitForFunction(() => document.querySelector("#tr-drawing[data-sounding]"));
    await page.locator("#tr-stop").click();
    await page.locator("#tr-passage").selectOption("2");
    assert.match(await page.locator('#tr-passage-text [lang="grc"]').innerText(), /ἰσότονον/);
    await page.locator("#tr-inspect").click();
    assert.equal(await page.evaluate(() => document.activeElement.id), "tr-source-viewport");
    await page.locator("#tr-source-image").evaluate((image) => image.decode());
    await page.locator("#tr-zoom").selectOption("2");
    await page.locator("#tr-source-viewport").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("#tr-source-viewport").scrollLeft > 0);
    const waiting = page.waitForEvent("download");
    await page.locator("#tr-save").click();
    const saved = await waiting;
    assert.equal(saved.suggestedFilename(), "pyknon-string-trial.html");
    const bytes = await readFile(await saved.path());
    assert.equal((bytes.toString().match(/data:image\/jpeg;base64,/g) ?? []).length, 6);
    assert.match(bytes.toString(), /data:audio\/wav;base64,/);
    return {
      repeatedProfilePassesHalvesAndQuarters: true,
      extraEighthsDifferenceCents: 701.955,
      greekSourceWord: "ἰσότονον",
      sourcePage: 37,
      keyboardSourcePan: true,
      playbackStartedAndStopped: true,
      savedPacketIncludesSixScansAndAudio: true,
      nativeHtmlSha256: createHash("sha256").update(bytes).digest("hex"),
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
    const [water] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#fl-save-reading").click(),
    ]);
    assert.equal(water.suggestedFilename(), "dioptra-flow-reading.html");
    await page.getByRole("link", { name: "15 · Tunnel survey", exact: true }).click();
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
    await expect(page.locator(".ec-vessel")).toHaveCount(13);
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
      page.waitForEvent("download"),
      page.locator("#ec-save-response").click(),
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
  assert.equal(id, "stoicheia");
  assert.equal(await page.locator("#ml-factor").inputValue(), "2");
  assert.equal(await page.locator("#ml-alignment").getAttribute("data-aligned"), "false");
  assert.match(await page.locator("#ml-alignment").innerText(), /Β agrees. Check Γ/);
  await page.locator("#ml-ideal").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#ml-alignment").getAttribute("data-aligned"), "true");
  assert.match(await page.locator("#ml-volume").innerText(), /Volume 2/);
  assert.match(await page.locator("#ml-ratios").innerText(), /1.25992/);
  await page.locator("#ml-nudge").click();
  assert.equal(await page.locator("#ml-alignment").getAttribute("data-aligned"), "false");
  assert.equal(await page.locator('[data-step="4"]').isDisabled(), true);
  await page.locator("#ml-ideal").click();
  await page.locator('[data-step="4"]').click();
  await page.locator("#ml-passage").selectOption("3");
  for (const lang of ["grc", "la"]) {
    assert(await page.locator(`#ml-passage-text [lang="${lang}"]`).innerText());
  }
  await page.locator('#ml-passage-text [data-page="109"]').click();
  await page.locator("#ml-source-image").evaluate((image) => image.decode());
  assert.match(await page.locator("#ml-source-caption").innerText(), /109/);
  const waiting = page.waitForEvent("download");
  await page.locator("#ml-save").click();
  const saved = await waiting;
  assert.equal(saved.suggestedFilename(), "stoicheia-mesolabe-reading.html");
  const bytes = await readFile(await saved.path());
  assert.equal((bytes.toString().match(/data:image\/jpeg;base64,/g) ?? []).length, 12);
  assert.match(bytes.toString(), /stoicheia-mesolabe-paper.svg/);
  return {
    firstContactInsufficient: true,
    mathematicalAlignmentVolume: 2,
    cubeEdgeShown: 1.25992,
    chosenDisplacementMm: 0.5,
    invalidProofDisabled: true,
    greekAndLatinRead: true,
    sourcePage: 109,
    savedPacketIncludesTwelveScansAndPaper: true,
    nativeHtmlSha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

const earlierRoutes = {
  pyknon:
    "https://antonsoo.github.io/pyknon/trial.html?string=repeat&density=2.25&test=1&a=220&sound=compare&p=2&page=37#trial",
  gonia: "https://antonsoo.github.io/gonia/echea.html#ec-workshop",
  stoicheia: "https://antonsoo.github.io/stoicheia/mesolabe.html#r=2&l=0.12&q=0.47&m=first&s=0&p=3&page=109",
};
async function nativeReading(page, selector, expected, scans) {
  const pending = page.waitForEvent("download");
  await page.locator(selector).click();
  const saved = await pending;
  assert.equal(saved.suggestedFilename(), expected);
  const bytes = await readFile(await saved.path());
  assert.equal((bytes.toString().match(/data:image\/jpeg;base64,/g) ?? []).length, scans);
  assert(!/<script\b|\son\w+=/i.test(bytes.toString()));
  return { name: expected, sha256: createHash("sha256").update(bytes).digest("hex"), scans };
}
async function deskOperation(page, kind, first, second, branch = 0) {
  await page.locator(`[data-tool="${kind}"]`).click();
  await page.locator("#dk-first").selectOption(first);
  await page.locator("#dk-second").selectOption(second);
  if (kind === "meet") await page.locator(`[data-keep="${branch}"]`).click();
  else await page.locator("#dk-draw").click();
}
async function explore(page, id) {
  if (id === "grama") {
    assert.equal(await page.locator("#model").inputValue(), "ratios");
    await page.locator("#start").selectOption("1");
    assert.match(await page.locator("#order-description").innerText(), /^Re – Ga – Ma/);
    await page.locator('input[value="madhyama"]').focus();
    await page.keyboard.press("Space");
    assert.match(await page.locator("#retune-result").innerText(), /Pa moved; the other six notes stayed/);
    assert.match(await page.locator("#lowering-comparison").innerText(), /21\.506/);
    await page.locator("#model").selectOption("equal");
    assert.match(await page.locator("#lowering-comparison").innerText(), /54\.545/);
    await page.locator("#hear-pa").click();
    await expect(page.locator("#stop")).toBeEnabled();
    await page.locator("#stop").click();
    await page.locator("#passage").selectOption("2");
    assert.match(await page.locator("#passage-text .deva").innerText(), /पञ्चम/);
    await page.locator('[data-word="pañcama"]').focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#word-note").innerText(), /Pa/);
    await page.locator("#scan").evaluate((image) => image.decode());
    const packet = await nativeReading(page, "#save-reading", "grama-illustrated-reading.html", 11);
    return {
      startingNoteChangesOrder: true,
      onlyPaRetuned: true,
      modernRatioLoweringCents: 21.506,
      equalDivisionLoweringCents: 54.545,
      SanskritRead: true,
      nativePacket: packet,
    };
  }
  if (id === "pyknon") {
    assert.equal(await page.locator("#rh-texture").inputValue(), "joined");
    await page.locator("#rh-up").selectOption("3");
    assert.match(await page.locator("#rh-result").innerText(), /dactylic/i);
    await page.locator("#rh-up").selectOption("2");
    assert.match(await page.locator("#rh-result").innerText(), /iambic/i);
    await page.locator("#rh-reverse").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#rh-up").inputValue(), "4");
    await page.locator('[data-rh-case="7"]').click();
    assert.match(await page.locator("#rh-result").innerText(), /outside the three genera/);
    await page.locator('[data-rh-case="6"]').click();
    await page.locator("#rh-play-compare").click();
    await expect(page.locator("#rh-stop")).toBeEnabled();
    await page.locator("#rh-stop").click();
    await page.locator("#rh-between-choice").selectOption("middle");
    assert.match(await page.locator("#rh-between-result").innerText(), /3:4/);
    await page.locator("#rh-passage").selectOption("3");
    assert.match(await page.locator('#rh-passage-text [lang="la"]').innerText(), /tres partitiones/);
    await page.locator("#rh-scan").evaluate((image) => image.decode());
    const packet = await nativeReading(page, "#rh-save-reading", "pyknon-rhythm-reading.html", 8);
    await page.getByRole("link", { name: "String trial", exact: true }).click();
    await page.waitForURL(/trial\.html/);
    await page.goto(earlierRoutes.pyknon);
    return {
      equalAndDoubleSameSize: true,
      reversalPreservesGenus: true,
      sevenScopeVisible: true,
      chosenMidpointRatio: "3:4",
      LatinParallelRead: true,
      nativePacket: packet,
      earlierLesson: await exploreEarlier(page, id),
    };
  }
  if (id === "gonia") {
    assert.equal(await page.locator("#hw-supports").innerText(), "3");
    await page.locator("#hw-anchor").focus();
    await page.locator("#hw-anchor").selectOption("fixed");
    assert.equal(await page.locator("#hw-supports").innerText(), "2");
    await page.locator("#hw-rig").selectOption("five");
    assert.equal(await page.locator("#hw-supports").innerText(), "4");
    await page.locator("#hw-anchor").selectOption("moving");
    assert.equal(await page.locator("#hw-supports").innerText(), "5");
    await page.locator("#hw-hold").selectOption("rope");
    assert.equal(await page.locator("#hw-rise").innerText(), "0.2 m");
    await page.locator("#hw-arm").selectOption("4");
    assert.equal(await page.locator("#hw-hand").innerText(), "30 N");
    assert.equal(await page.locator("#hw-hand-path").innerText(), "4 m");
    await page.locator("#hw-read-tie").click();
    await page.getByRole("button", { name: "religatur", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#hw-word-note").innerText(), /fastened/);
    await page.locator("#hw-source-image").evaluate((image) => image.decode());
    const packet = await nativeReading(page, "#hw-save-reading", "gonia-hoist-reading.html", 5);
    await page.getByRole("link", { name: "Sounding vessels", exact: true }).click();
    return {
      sameWheelsThreeToTwo: true,
      sameWheelsFiveToFour: true,
      oneMetreRopeRaisesPointTwo: true,
      windlassForceN: 30,
      windlassHandPathM: 4,
      LatinTieRead: true,
      nativePacket: packet,
      earlierLesson: await exploreEarlier(page, id),
    };
  }
  if (id === "stoicheia") {
    await deskOperation(page, "line", "A", "B");
    await deskOperation(page, "circle", "A", "B");
    await deskOperation(page, "circle", "B", "A");
    await deskOperation(page, "meet", "c2", "c3", 0);
    await deskOperation(page, "line", "P1", "B");
    await deskOperation(page, "circle", "B", "C");
    await deskOperation(page, "meet", "l4", "c5", 0);
    assert.match(await page.locator("#dk-proof-state").innerText(), /not complete/);
    await page.locator("#dk-hint-toggle").click();
    assert.match(await page.locator("#dk-hint-text").innerText(), /BEYOND B/);
    await page.locator("#dk-hint-toggle").click();
    await page.locator("#dk-undo").click();
    await deskOperation(page, "meet", "l4", "c5", 1);
    await deskOperation(page, "line", "P1", "A");
    await deskOperation(page, "circle", "P1", "P2");
    await deskOperation(page, "meet", "l6", "c7", 1);
    await deskOperation(page, "line", "A", "P3");
    assert.match(await page.locator("#dk-proof-state").innerText(), /chain is present/);
    await page.locator("#dk-measure-point").selectOption("P3");
    assert.match(await page.locator("#dk-measurements").innerText(), /Difference: -?0\.000000/);
    await page.getByRole("link", { name: "Read the commands", exact: true }).click();
    assert.match(await page.locator("#dk-position").innerText(), /Operation 11 of 11/);
    await page.locator('[data-page="13"]').click();
    await page.locator("#dk-scan").evaluate((image) => image.decode());
    const packet = await nativeReading(page, "#dk-study", "stoicheia-construction-reading.html", 4);
    await page.getByRole("link", { name: "I.2 in the course", exact: true }).click();
    await page.getByRole("link", { name: /Twice the stone/ }).click();
    await page.goto(earlierRoutes.stoicheia);
    return {
      learnerCommands: 11,
      wrongCrossingRemainsLegitimate: true,
      adaptiveHintRead: true,
      undoChangesBranch: true,
      incidenceProofPresent: true,
      GreekAndLatinSourcesAvailable: true,
      nativePacket: packet,
      earlierLesson: await exploreEarlier(page, id),
    };
  }
  return exploreEarlier(page, id);
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
            await page.waitForURL((url) => url.origin === target.origin && url.pathname === target.pathname);
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
                const visible = box !== null && box.y >= -2 && box.y + box.height <= 900;
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
