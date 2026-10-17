// Follow actual catalogue links into three hosted offline workflows.
// node docs/evidence/listening-vector-browser.mjs CATALOGUE_URL OUTPUT_DIR
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const [base, outputArg] = process.argv.slice(2);
assert(base && outputArg, "CATALOGUE_URL OUTPUT_DIR");
const output = resolve(outputArg); await mkdir(output, { recursive: true });
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const tracePin = "411b2e5c625de23aa9b3fed06c068d32b998faf6";
const traceRoot = `https://raw.githubusercontent.com/antonsoo/tracelens/${tracePin}/studies/usage-conflicts/`;
async function source(url) {
  const response = await fetch(url); assert(response.ok, url);
  const bytes = Buffer.from(await response.arrayBuffer()); return { url, bytes, sha256: hash(bytes) };
}
const fixture = await source(traceRoot + "fixtures/focused.json");
const expectedTrace = await source(traceRoot + "results/after.json");
const expectedCost = JSON.parse(expectedTrace.bytes).focused;
const expectedSvgSha256 = "3629ff436602809702085c5555ab27f617f536f4b076122cb917fb76575f3d61";
const views = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1050 }, colorScheme: width === 1440 ? "dark" : "light" });
      try {
        const page = await context.newPage(), errors = [], offlineRequests = [], downloads = [], cards = [];
        let disconnected = false;
        page.on("pageerror", error => errors.push(error.message));
        page.on("request", request => { if (disconnected && /^https?:/.test(request.url())) offlineRequests.push(request.url()); });
        await page.addInitScript(prices => {
          localStorage.setItem("tracelens.priceTable.v1", JSON.stringify(prices));
          window.evidence = { csp: [], starts: [], inputs: [], phases: [] };
          document.addEventListener("securitypolicyviolation", event => window.evidence.csp.push(event.violatedDirective));
          document.addEventListener("DOMContentLoaded", () => {
            const note = document.querySelector("#paired-listening-status");
            if (note) new MutationObserver(() => window.evidence.phases.push(note.textContent)).observe(note, { subtree: true, childList: true, characterData: true });
          });
          const NativeWorker = Worker;
          window.Worker = class extends NativeWorker {
            postMessage(message, ...rest) {
              if (message.type === "analyze") window.evidence.inputs.push({ pcm: message.pcm.slice(), rate: message.sampleRate });
              return super.postMessage(message, ...rest);
            }
          };
          const start = AudioBufferSourceNode.prototype.start;
          AudioBufferSourceNode.prototype.start = function (...args) {
            window.evidence.starts.push({ when: args[0] ?? 0, pcm: this.buffer.getChannelData(0).slice(), rate: this.buffer.sampleRate, playbackRate: this.playbackRate.value, loop: this.loop });
            return start.apply(this, args);
          };
        }, expectedCost.priceTable);
        async function settled() {
          await page.evaluate(async () => { await Promise.allSettled(Array.from(document.fonts, face => face.load())); await document.fonts.ready; });
        }
        async function download(button, name) {
          const pending = page.waitForEvent("download"); await button.click(); const item = await pending;
          assert.equal(await item.failure(), null); const file = `${engine}-${width}-${name}`;
          await item.saveAs(resolve(output, file)); const bytes = await readFile(resolve(output, file));
          downloads.push({ file, bytes: bytes.length, sha256: hash(bytes), suggestedFilename: item.suggestedFilename() }); return bytes;
        }
        async function checkPage() {
          assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.deepEqual(await page.evaluate(() => window.evidence.csp), []);
        }
        async function card(name, query, text) {
          disconnected = false; await context.setOffline(false); await page.goto(base);
          await page.locator("#tool-search").fill(query); const selected = page.locator(`[data-project="${name}"]`);
          await selected.waitFor(); await expect(selected.locator(".card-desc")).toContainText(text);
          await selected.locator("img").evaluate(async image => { await image.decode(); }); await settled(); await checkPage();
          const link = selected.getByRole("link", { name: "Live demo", exact: true });
          assert.equal(await link.getAttribute("href"), `https://antonsoo.github.io/${name}/`);
          await selected.screenshot({ path: resolve(output, `${engine}-${width}-${name}-card.png`) });
          cards.push({ name, query, description: await selected.locator(".card-desc").innerText(), study: await selected.locator(".card-study").innerText(), followedUrl: await link.getAttribute("href") });
          await link.click(); await settled();
        }
        const button = name => page.getByRole("button", { name, exact: true });
        await card("tonemirror", "recorded Mandarin", "recorded Mandarin");
        await page.getByRole("group", { name: "Recorded Mandarin references" }).waitFor();
        await context.setOffline(true); disconnected = true;
        await button("Load recorded mà, tone 4").click(); await expect(page.locator(".tm-clip-label")).toContainText("Recorded Mandarin mà");
        const falling = await download(button("Download WAV"), "falling.wav"); assert(falling.includes(Buffer.from("Wolfdog")));
        await button("Load recorded má, tone 2").click(); await expect(page.locator(".tm-clip-label")).toContainText("Recorded Mandarin má");
        await page.getByRole("tab", { name: "Your attempt", exact: true }).click();
        await page.getByLabel("Choose an audio file to load").setInputFiles({ name: "falling.wav", mimeType: "audio/wav", buffer: falling });
        await expect(page.locator(".tm-audio-credit")).toContainText("Wolfdog");
        const before = await download(button("Download WAV"), "attempt-before.wav");
        await button("Play reference then attempt").click();
        await expect(page.locator("#paired-listening-status")).toHaveText("Finished listening to the reference and your attempt.");
        const listening = await page.evaluate(() => {
          const p = window.evidence, inputs = [p.inputs[1], p.inputs[2]];
          return { starts: p.starts.map((row, i) => ({ samples: row.pcm.length, rate: row.rate, when: row.when, normalSpeed: row.playbackRate === 1 && !row.loop,
            equalsLoadedAudio: row.pcm.length === inputs[i].pcm.length && row.pcm.every((v, j) => v === inputs[i].pcm[j]) })), phases: p.phases };
        });
        assert.equal(listening.starts.length, 2); assert(listening.starts.every(row => row.equalsLoadedAudio && row.normalSpeed));
        assert(Math.abs(listening.starts[1].when - listening.starts[0].when - listening.starts[0].samples / listening.starts[0].rate - .35) < 1e-10);
        for (const phase of ["Listening to the reference.", "Brief pause before your attempt.", "Listening to your attempt."]) assert(listening.phases.includes(phase));
        const after = await download(button("Download WAV"), "attempt-after.wav"); assert.deepEqual(after, before); await checkPage();
        await page.screenshot({ path: resolve(output, `${engine}-${width}-listening.png`), fullPage: true });
        await card("trainspotter", "vector charts", "vector charts");
        await page.locator('a[href="divergence.html"]').click(); await page.locator(".chart-download").first().waitFor();
        assert.equal(await page.locator(".chart-download").count(), 5); await checkPage();
        await context.setOffline(true); disconnected = true;
        const svg = await download(page.locator(".chart-download").first(), "divergence.svg"); assert.equal(hash(svg), expectedSvgSha256);
        const vectorPage = await context.newPage();
        try {
          await vectorPage.goto(pathToFileURL(resolve(output, `${engine}-${width}-divergence.svg`)).href);
          const metadata = await vectorPage.locator("metadata").textContent(); assert.equal(JSON.parse(metadata).axisLabel, "steps");
          await vectorPage.locator("svg").first().screenshot({ path: resolve(output, `${engine}-${width}-vector.png`) });
        } finally { await vectorPage.close(); }
        await card("tracelens", "input tokens", "recorded token counts");
        await page.locator("#tl-file-input").waitFor({ state: "attached" }); await context.setOffline(true); disconnected = true;
        await page.locator("#tl-file-input").setInputFiles({ name: "focused.json", mimeType: "application/json", buffer: fixture.bytes });
        const ledger = page.locator(".tl-cost-ledger"); await expect(ledger.locator(":scope > summary")).toContainText("0 priced / 1 unpriced");
        await ledger.locator(":scope > summary").click();
        const cost = await download(ledger.getByRole("button", { name: "Download cost JSON", exact: true }), "cost.json"); assert.deepEqual(JSON.parse(cost), expectedCost);
        await checkPage(); await page.screenshot({ path: resolve(output, `${engine}-${width}-cost.png`), fullPage: true });
        assert.deepEqual(errors, []); assert.deepEqual(offlineRequests, []);
        views.push({ engine, width, cards, listening, attemptWavUnchanged: true, svgMatchesPinnedSource: true, costMatchesPinnedCli: true,
          downloads, pageErrors: errors, offlineRequests, cspViolations: [], axeViolations: [] });
        console.log(engine, width, cards.length, "catalogue links;", downloads.length, "actual offline downloads");
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
}
await writeFile(resolve(output, "browser.json"), JSON.stringify({ base, checkedAt: new Date().toISOString(),
  sources: [fixture, expectedTrace].map(({ url, bytes, sha256 }) => ({ url, bytes: bytes.length, sha256 })), expectedSvgSha256,
  scope: "Three actual catalogue links, one recorded rising/falling comparison, one retained controlled training chart and one constructed contradictory native SDK span. Four browser contexts; no additional speakers, training runs, provider invoices or physical audio/print measurements.", views }, null, 2) + "\n");
