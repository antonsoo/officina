import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterProjects, matchingWorkshops, parseCatalogue } from "../src/catalogue.ts";

const source = JSON.parse(await readFile(new URL("../public/projects.json", import.meta.url), "utf8"));
const catalogue = parseCatalogue(source);
const project = (name) => catalogue.find((p) => p.name === name);

test("a source word identifies its actual workshop with case and accent folding", () => {
  for (const [name, query, id, pathname] of [
    ["stoicheia", "μηδεποτε", "measure", "/stoicheia/measure.html"],
    ["stoicheia", "ΗΧΘΩ", "horn", "/stoicheia/horn.html"],
    ["stoicheia", "sphaerae", "circle", "/stoicheia/circle.html"],
    ["gonia", "ῥαβδωσεως", "fluting", "/gonia/fluting.html"],
    ["gonia", "PENROSE", "entasis", "/gonia/entasis.html"],
    ["pyknon", "επογδοος", "canon", "/pyknon/canon.html"],
    ["pyknon", "AEQUITONA", "trial", "/pyknon/trial.html"],
  ]) {
    const matches = matchingWorkshops(project(name), query);
    assert.deepEqual(
      matches.map((w) => w.id),
      [id],
    );
    assert.equal(new URL(matches[0].url).pathname, pathname);
    assert.ok(filterProjects(catalogue, query).some((p) => p.name === name));
  }
});

test("aliases from different rooms cannot fabricate one matching workshop", () => {
  const p = project("stoicheia");
  assert.deepEqual(
    matchingWorkshops(p, "stoicheia μηδέποτε").map((w) => w.id),
    ["measure"],
  );
  assert.deepEqual(matchingWorkshops(p, "μηδέποτε 591.15"), []);
  assert.ok(filterProjects(catalogue, "μηδέποτε 591.15").includes(p));
  assert.deepEqual(matchingWorkshops(p, "stoicheia"), []);
  assert.deepEqual(matchingWorkshops(p, "Ancient world"), []);
  assert.deepEqual(matchingWorkshops(p, "  "), []);
  assert.deepEqual(
    matchingWorkshops(p, "circle tangent").map((w) => w.id),
    ["horn"],
  );
});

test("older catalogue entries and unpublished projects keep their existing behavior", () => {
  const old = { ...source.find((p) => p.name === "stoicheia") };
  delete old.workshops;
  const [p] = parseCatalogue([old]);
  assert.deepEqual(p, old);
  assert.deepEqual(matchingWorkshops(p, "common measure"), []);
  assert.equal(filterProjects([p], "common measure").length, 1);
  assert.deepEqual(matchingWorkshops({ ...project("stoicheia"), status: "soon" }, "μηδέποτε"), []);
});

test("workshop metadata rejects ambiguous identities, unsafe links and malformed aliases", () => {
  const p = source.find((p) => p.name === "stoicheia");
  const w = p.workshops[0];
  for (const bad of [
    null,
    "workshops",
    [null],
    [w, w],
    [{ ...w, id: "../horn" }],
    [{ ...w, title: " " }],
    [{ ...w, url: "javascript:alert(1)" }],
    [{ ...w, reviewUrl: "https://user:password@example.com/" }],
    [{ ...w, searchTerms: [] }],
    [{ ...w, searchTerms: ["ἤχθω", "ηχθω"] }],
  ])
    assert.throws(() => parseCatalogue([{ ...p, workshops: bad }]));
});
