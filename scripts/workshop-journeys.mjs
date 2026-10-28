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
  {project:"gonia",id:"arch",query:"latiores",word:"cunei",path:"/gonia/arch.html",heading:"Try the actual work"},
  {project:"stoicheia",id:"solids",query:"aequiangulis",word:"ἴσων ἀλλήλοις",path:"/stoicheia/solids.html",heading:"Try the actual work"},
  {project:"pyknon",id:"helikon",query:"subductorium",word:"ὑπαγωγέα",path:"/pyknon/helikon.html",heading:"Try the actual work"},
  {project:"pyknon",id:"notation",query:"κρουσεως",word:"κρούσεως",path:"/pyknon/notation.html",heading:"Try the translation"},
  {project:"gonia",id:"volute",query:"minuatur",word:"minuatur",path:"/gonia/volute.html",heading:"What the learner can do"},
  {project:"zygon",id:"floating",query:"μη απτεσθαι",word:"μὴ ἅπτεσθαι",path:"/zygon/float.html",heading:"Try the actual work"},
  {project:"pyknon",id:"halves",query:"superparticularis",word:"ἀνάλογον",path:"/pyknon/halves.html",heading:"Try the actual work"},
  {
    project: "syngraphe", id: "arsenal", query: "συν τωι παχει", word: "σὺν τῶι πάχει",
    path: "/syngraphe/", heading: "Try the actual work",
  },
  {
    project: "stoicheia", id: "ratios", query: "οποιονουν", word: "ὁποιονοῦν",
    path: "/stoicheia/ratios.html", heading: "Direct review of the Book V ratio workshop",
  },
  {
    project: "pyknon", id: "vina", query: "dve vine", word: "dve vīṇe",
    path: "/pyknon/vina.html", heading: "What changed for the learner",
  },
  {
    project: "gonia", id: "babylon", query: "nindanu", word: "nindanu",
    path: "/gonia/babylon.html", heading: "What changed for the learner",
  },
  {
    project: "stoicheia", id: "quadratrix", query: "ουκετι", word: "οὐκέτι",
    path: "/stoicheia/quadratrix.html", heading: "What changed for the learner",
  },
  {
    project: "dioptra",
    id: "calix",
    query: "minore pressura",
    word: "minore pressura",
    path: "/dioptra/calix.html",
    heading: "Try the opening experiment",
  },
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
  if(id === "arch") {
    await page.locator('#ar-title').waitFor();
    await expect(page.locator('#ar-verdict')).toContainText('bases need more restraint');
    await page.locator('#ar-width').focus(); await page.keyboard.press('End');
    await expect(page.locator('#ar-mass-value')).toHaveText('1');
    await expect(page.locator('#ar-verdict')).toContainText('fits the arch and the bases');
    await page.locator('#ar-fit-whole').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#ar-status')).toContainText('Found one path');
    await page.locator('#ar-joint').selectOption('4');
    await expect(page.locator('#ar-contact-note')).toContainText('Joint 4: contact inside');
    await expect(page.locator('#ar-source-caption')).toContainText('identity verified');
    return {action:'Keyboard widening repairs the pier bases while keeping weight 1 W; a complete-model path and joint 4 remain inspectable beside the Latin and complete source page',source:await image(page,'#ar-source-image')};
  }
  if (id === "solids") {
    await page.locator('#sl-title').waitFor();
    await expect(page.locator('#sl-result')).toContainText('tetrahedron');
    await page.locator('#sl-q').focus();
    for(let i=0;i<3;i++)await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sl-result')).toContainText('360°');
    await expect(page.locator('#sl-result')).toContainText('lies flat');
    await page.locator('#sl-tip').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#sl-vertex-result')).toContainText('3 faces × 60° = 180°');
    await page.locator('#sl-comparison details summary').click();
    await expect(page.locator('#sl-inference')).toContainText('V = 720 / 180 = 4');
    await page.locator('#sl-belt').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#sl-vertex-result')).toContainText('4 faces × 60° = 240°');
    await expect(page.locator('#sl-inference')).toContainText('V = 720 / 120 = 6');
    await expect(page.locator('#sl-inference')).toContainText('The actual solid has five');
    await page.locator('#sl-latin-page').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#sl-source-status')).toContainText('Verified complete page');
    await expect(page.locator('#sl-source-status')).toContainText('printed p.337');
    const source=await image(page,'#sl-source-image');
    source.sha256=await page.evaluate(async()=>{
      const b=await(await fetch(new URL('sources/solids/heiberg-337.jpg',location.href))).arrayBuffer();
      return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),v=>v.toString(16).padStart(2,'0')).join('');
    });
    assert.equal(source.sha256,'47960a27f1f8c3c6a300dbab59c848f1f986d7d11ee1c69f1015f5601ed36a90');
    return {action:'The sixth triangle lies flat. The same six-faced bipyramid has three-face tips and four-face belt vertices; assuming a uniform tip predicts four vertices, assuming a uniform belt predicts six, and the actual model retains five. Greek, Latin and the complete page remain.',source};
  }
  if(id==="notation") {
    await expect(page.locator('#nt-result')).toContainText('2 of 4 notes');
    for(const [slot,sign] of [[1,'bracket'],[2,'zeta']]) {
      await page.locator(`#nt-written-${slot}`).focus();await page.keyboard.press('Enter');
      await page.locator(`[data-nt-write="${sign}"]`).focus();await page.keyboard.press('Enter');
    }
    await expect(page.locator('#nt-result')).toContainText('4 of 4 notes');
    await page.locator('[data-nt-frame-sign="iota"]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#nt-frame-result')).toContainText('247.5 Hz');
    await page.locator('[data-nt-frame-anchor="mese"]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#nt-frame-result')).toContainText('Hypolydian sign moves');
    await expect(page.locator('#nt-frame-views')).toContainText('440 Hz');
    await page.locator('#nt-frame-play').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#nt-frame-stop')).toBeEnabled();
    await page.locator('#nt-frame-stop').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#nt-audio-status')).toHaveText('Stopped.');
    await page.locator('[data-nt-frame-source="370"]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('#nt-source-status')).toContainText('Verified complete page');
    await expect(page.locator('#nt-source-band-secondary')).toBeVisible();
    const source=await image(page,'#nt-source-image');
    source.sha256=await page.locator('#nt-source-image').evaluate(async im=>{
      const bytes=await(await fetch(im.src)).arrayBuffer();
      return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
    });
    assert.equal(source.sha256,'2ca20ce4ac8f2251e10eeddf603ae97c3c219dfb766c44ff423a84210ead6e85');
    return {action:'Two keyboard sign replacements preserve all four pitches; holding the shared sign moves mesē, holding mesai moves the sign; local sound stops; two Hypolydian functions and the actual whole-page bytes remain',source};
  }
  if(id === "helikon") {
    await expect(page.locator('#hk-retuning-result')).toContainText('2 of 4');
    await page.locator('#hk-fit').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#hk-retuning-result')).toContainText('All four');
    await expect(page.locator('#hk-x1-value')).toHaveText('1/7');
    await expect(page.locator('#hk-x2-value')).toHaveText('1/4');
    await page.locator('#hk-scale').focus(); await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#hk-transposition')).toContainText('240 Hz');
    await page.locator('[data-hk-play="retuning"]').click();
    await page.locator('#hk-retuning-stop').click();
    await expect(page.locator('#hk-source-status')).toContainText('Verified complete page');
    const source=await image(page,'#hk-source-image');
    return {action:'The fixed strings miss two target notes; keyboard fitting puts the inner strings at 1/7 and 1/4; shortening the bridge scale raises the left note to 240 Hz without losing a target ratio; the common-support Greek and Latin and whole source page remain',source};
  }
  if(id==="volute") {
    await page.locator('#vo-draw').waitFor();
    await page.getByText('Other starting sheets',{exact:true}).click();
    await page.locator('#vo-empty').focus(); await page.keyboard.press('Enter');
    for(let pin=1;pin<=12;pin++) {
      await page.locator(`[data-pin="${pin}"]`).focus(); await page.keyboard.press('Enter');
      await page.locator('#vo-draw').focus(); await page.keyboard.press('Space');
    }
    await expect(page.locator('#vo-result')).toContainText('exactly on the eye');
    await expect(page.locator('#vo-join-note')).toContainText('8.130102°');
    await page.locator('#vo-join').selectOption('1');
    await expect(page.locator('#vo-join-note')).toContainText('0.447614°');
    const outline=await page.locator('[data-arc]').evaluateAll(ns=>ns.map(n=>n.getAttribute('d')));
    await page.locator('#vo-repair').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#vo-repair-note')).toContainText('difference becomes 0°');
    assert.deepEqual(await page.locator('[data-arc]').evaluateAll(ns=>ns.map(n=>n.getAttribute('d'))),outline);
    await page.locator('#vo-page').selectOption('2');
    await expect(page.locator('#vo-source-caption')).toContainText('Image identity verified');
    return {action:'Twelve keyboard compass arcs reach the eye; final direction differs by 8.130102 degrees; aligning the first join preserves the committed outline; whole 1889 plate verified',source:await image(page,'#vo-source-frame img')};
  }
  if(id==="floating") {
    await expect(page.locator("#fl-result")).toContainText("turn it right");
    await page.locator("#fl-upright").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#fl-result")).toContainText("unstable");
    await page.locator("#fl-nudge").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#fl-result")).toContainText("turn it right");
    await page.locator("#fl-equilibrium").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#fl-result")).toContainText("Balanced at an oblique");
    await expect(page.locator("#fl-angle-value")).toContainText("32.3115332");
    await page.locator("#fl-critical").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#fl-stability")).toContainText("zero linear");
    await page.locator("#fl-reading-select").selectOption("1");
    await expect(page.locator("#fl-greek")).toContainText("μὴ ἅπτεσθαι");
    await page.locator("#fl-show-greek").focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#fl-source-status")).toContainText("identity checked");
    const dimensions=await page.locator("#fl-source-frame image").evaluate(async node => {
      const source=new Image();source.src=node.getAttribute("href");await source.decode();
      return {width:source.naturalWidth,height:source.naturalHeight};
    });
    assert.deepEqual(dimensions,{width:2448,height:3264});
    return {action:"Upright is balanced but unstable; keyboard nudge turns away; separate computed tilt balances; critical density keeps finite restoring response; Greek dry-base phrase locates its verified manuscript frame",source:dimensions};
  }
  if(id==="halves"){
    await expect(page.locator("#hf-result")).toContainText("First 17/16; second 18/17");
    await page.locator('[data-hf-method="ratio"]').focus();await page.keyboard.press("Enter");
    await expect(page.locator("#hf-result")).toContainText("ratios are equal");
    await expect(page.locator("#hf-result")).toContainText("12√2");
    await page.locator("#hf-control").focus();await page.keyboard.press("Enter");
    await expect(page.locator("#hf-result")).toContainText("First 3/2; second 3/2");
    await expect(page.locator("#hf-proof")).toContainText("outside III’s premise");
    await page.locator("#hf-reading").selectOption("6");
    await expect(page.locator("#hf-passage")).toContainText("non dividetur");
    await expect(page.locator("#hf-source-status")).toContainText("Verified complete");
    return {action:"17/16 differs from 18/17; keyboard geometric middle gives 12√2 and equal ratios; 4–6–9 control lies outside III’s premise; corresponding Greek/Latin conclusion and verified complete page",source:await image(page,"#hf-source-image")};
  }
  if (id === "arsenal") {
    await expect(page.locator("#width-result")).toContainText("60½ feet");
    await page.locator("#side-inclusive").focus();await page.keyboard.press("Space");
    await expect(page.locator("#width-result")).toContainText("55 feet");
    await page.locator("#fit-total").focus();await page.keyboard.press("Enter");
    await expect(page.locator("#height-result")).toContainText("contradicts");
    await page.locator("#first-five").focus();await page.keyboard.press("Space");
    await page.locator("#fit-total").focus();await page.keyboard.press("Enter");
    await expect(page.locator("#height-result")).toContainText("exception is observed");
    await page.locator('[data-reading="1"]').focus();await page.keyboard.press("Enter");
    await expect(page.locator("#reading-greek")).toContainText("σὺν τῶι πάχει");
    await page.locator('#reading-pages [data-page="34"]').focus();await page.keyboard.press("Enter");
    await expect(page.locator("#source-status")).toContainText("Verified whole");
    return { action: "inclusive width closes fifty-five feet; a thirty-foot total first hides the wrong segment, then the five-foot exception is observed; corresponding Greek and complete verified page", source: await image(page,"#source-image") };
  }
  if (id === "ratios") {
    await expect(page.locator("#rt-bound")).toHaveValue("69");
    await expect(page.locator("#rt-scan-result")).toContainText("4,761");
    await expect(page.locator("#rt-find")).toBeDisabled();
    await page.locator('[data-rt-bound="100"]').focus();
    await page.keyboard.press("Enter");
    await page.locator("#rt-find").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#rt-m")).toHaveValue("70");
    await expect(page.locator("#rt-n")).toHaveValue("99");
    await expect(page.locator("#rt-signs")).toContainText("70√2 < 99");
    await expect(page.locator("#rt-signs")).toContainText("6930 = 6930");
    await expect(page.locator("#rt-excess-note")).toContainText("without having V.7");
    return {
      action: "4,761 agreeing comparisons through 69; keyboard-expanded search finds the exact 70/99 equality counterexample, distinguished from a V.7 strict-excess witness",
      source: await image(page, "#rt-source-image"),
    };
  }
  if (id === "vina") {
    await expect(page.locator("#vn-tuning")).toHaveValue("comma");
    await expect(page.locator("#vn-pair")).toContainText("244.4444 Hz");
    await page.locator("#vn-change").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#vn-tuning")).toHaveValue("quarter");
    await expect(page.locator("#vn-pair")).toContainText("240.3184 Hz");
    await expect(page.locator("#vn-validity")).toContainText("ordered matches survive");
    await page.locator('[data-vn-stage="4"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#vn-verdict")).toContainText("Sa → Ni↓; Ma → Ga; Pa → Ma");
    await page.locator("#vn-read-stage").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#vn-reading-choice")).toHaveValue("5");
    await expect(page.locator("#vn-reading-text")).toContainText("lower octave");
    await expect(page.locator("#vn-source-status")).toContainText("Verified");
    assert.equal(await page.locator("#vn-page").inputValue(), "29");
    return {
      action: "keyboard-change preparation: second-stage Ga–Ri remains a match at 244.4444 then 240.3184 Hz; fourth-stage three matches, corresponding Sanskrit reading and verified complete source",
      source: await image(page, "#vn-source-image"),
    };
  }
  if (id === "babylon") {
    await expect(page.locator("#bb-supplied")).not.toBeChecked();
    assert.match(await page.locator("#bb-total").textContent(), /84 m.*Total unresolved/);
    await page.locator("#bb-conventional").focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#bb-total").textContent(), /90 m total/);
    await page.locator('[data-bb-select="1"]').click();
    assert.match(await page.locator("#bb-level-detail").textContent(), /18 m/);
    assert.match(await page.locator("#bb-level-detail").textContent(), /9\.52 m/);
    await page.locator("#bb-read-row").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#bb-reading")).toHaveValue("1");
    await expect(page.locator("#bb-source-title")).toBeFocused();
    await page.waitForFunction(() => document.querySelector("#bb-source-status").textContent.startsWith("Verified"));
    return {
      action: "unknown sixth storey, disclosed 90 m completion, second-storey disagreement and corresponding numerical source",
      source: await image(page, "#bb-source-image"),
    };
  }
  if (id === "quadratrix") {
    assert.equal(await page.locator("#qx-time").inputValue(), "999999");
    assert.equal(await page.locator(".qx-z").count(), 1);
    await page.locator('[data-qx-time="1000000"]').focus();
    await page.keyboard.press("Enter");
    assert.match(await page.locator("#qx-verdict").textContent(), /lines coincide/);
    assert.equal(await page.locator(".qx-z").count(), 0);
    assert.equal(await page.locator(".qx-limit").count(), 1);
    return { action: "positive-time crossing compared with final coincident lines; separately added H retained", source: await image(page, "#qx-source-image") };
  }
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
  if (id === "calix") {
    assert.equal(await page.locator("#cx-flow-value").textContent(), "4 ×");
    await page.locator("[data-preset=same]").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#cx-flow-value").textContent(), "1 ×");
    await page.locator("#cx-record").click();
    await page.locator("[data-preset=head]").click();
    assert.equal(await page.locator("#cx-flow-value").textContent(), "2 ×");
    await page.locator("#cx-record").click();
    await expect(page.locator("#cx-trials tbody tr")).toHaveCount(2);
    await page.selectOption("#cx-passage", "7");
    await page.locator("#cx-find").click();
    await page.waitForFunction(() => document.querySelector("#cx-source-status").textContent.includes("Source image verified"));
    return { action: "equal delivery through four times the opening; then doubled delivery through the same opening; bronze calix located in Latin", source: await image(page, "#cx-source-image") };
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
          const shared = new URL(base);
          shared.searchParams.set("q", c.query);
          shared.hash = "catalogue";
          await page.goto(shared.href);
          const search = page.getByRole("searchbox", { name: "Find a tool" });
          await expect(search).toHaveValue(c.query);
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
          const preview = row.locator(".workshop-thumb");
          if (await preview.count()) {
            await preview.scrollIntoViewIfNeeded();
            await preview.evaluate(i => i.decode());
            await search.focus();
          }
          await expect(row.locator(".workshop-summary")).toBeVisible();
          await expect(page.locator(`[data-project="${c.project}"] .card-desc`)).toBeHidden();
          // Fixed offscreen skip links can appear inside a full-document capture
          // when the visual viewport was scrolled. Capture from document top.
          await page.evaluate(async () => { scrollTo(0, 0); await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
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
          console.error("Failed journey", prefix, page.url(), String(error));
          await page.screenshot({ path: `${prefix}-failure.png`, timeout: 5000 }).catch(() => {});
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
