import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";

const lessons = [
  { id: "shiguzhai", query: "bronze bells", heading: "What the controls do" },
  { id: "pyknon", query: "Seikilos", legacy: "tetrachords", heading: "Seikilos reading review" },
  { id: "gonia", query: "Vitruvius", legacy: "Doric", heading: "The lesson" },
  { id: "stoicheia", query: "Euclid", legacy: "bisection", heading: "What can be explored" },
];

async function explore(page, id) {
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
  if (id === "gonia") {
    assert.equal(await page.locator("#column-count").inputValue(), "6");
    assert.equal(await page.locator("#front-width").inputValue(), "18");
    assert.equal(await page.locator("#equal-centre").isChecked(), false);
    const numbers = page.locator("#spacing-numbers");
    const before = await numbers.innerText();
    assert.match(before, /Central clear gap\s+3 D/);
    await page.locator("#equal-centre").focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator("#equal-centre").isChecked(), true);
    const after = await numbers.innerText();
    assert.match(after, /Central clear gap\s+2.25 D/);
    assert.notEqual(after, before);
    assert.equal(await page.locator("#front-width").inputValue(), "18");
    assert.match(await page.locator("#scale-description").innerText(), /18 m/);
    await page.locator("#inspect-passage").click();
    await page.waitForFunction(() => document.querySelector("#source-figure img")?.naturalWidth > 0);
    return {
      columns: 6,
      frontMetres: 18,
      centralGapBefore: 3,
      centralGapAfter: 2.25,
      printedSourceDecoded: true,
    };
  }
  assert.equal(new URL(page.url()).hash.includes("p=16&s=8"), true);
  assert.equal(await page.locator('#diagram [data-point="Κ"]').count(), 1);
  assert.match(await page.locator("#diagram-notice").innerText(), /second construction/);
  await page.locator('#step-list [data-step="7"]').click();
  assert.equal(await page.locator('#diagram [data-point="Ζ"]').count(), 1);
  assert.equal(await page.locator('#diagram [data-point="Κ"]').count(), 0);
  await page.locator('#step-list [data-step="8"]').focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator('#diagram [data-point="Κ"]').count(), 1);
  assert.deepEqual(await page.locator("#comparison tbody tr").first().locator("td").allTextContents(), [
    "ΒΘ",
    "ΓΘ",
    "equal halves · I.10",
  ]);
  await page.locator('[data-source="45"]').first().click();
  await page.waitForFunction(() => document.querySelector("#source-image").naturalWidth > 0);
  assert.match(await page.locator("#source-title").innerText(), /45/);
  await page.keyboard.press("Escape");
  return {
    proposition: 16,
    bothMidpointConstructions: true,
    correspondingSides: ["ΒΘ", "ΓΘ"],
    printedLatinPage: 45,
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
          await page.waitForURL(demoURL);
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
          await expect
            .poll(
              async () => {
                const box = await heading.boundingBox();
                return box !== null && box.y >= -2 && box.y < 900;
              },
              { timeout: 15000 },
            )
            .toBe(true);
          const box = await heading.boundingBox();
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
            pinnedHeadingTop: box.y,
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
