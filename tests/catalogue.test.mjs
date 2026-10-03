import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterProjects, groupNames, parseCatalogue } from "../src/catalogue.ts";

const entry = {
  name: "trace-tool",
  description: "Compare café traces and model costs.",
  group: "AI engineering",
  repoUrl: "https://github.com/example/trace-tool",
  demoUrl: "https://example.com/trace-tool/",
  thumbnail: "thumbs/trace-tool.webp",
  status: "published",
  package: { registry: "npm", url: "https://www.npmjs.com/package/trace-tool" },
};
const catalogue = [
  entry,
  { ...entry, name: "calendar", description: "Ancient calendars", group: "Ancient world", demoUrl: null },
  { ...entry, name: "unfinished", status: "soon" },
];

test("reads the actual catalogue and all supported link kinds", async () => {
  const source = JSON.parse(await readFile(new URL("../public/projects.json", import.meta.url), "utf8"));
  assert.deepEqual(parseCatalogue(source), source);
  assert.ok(source.length > 0);
});

test("accepts an empty catalogue and excludes unpublished entries from search and audiences", () => {
  assert.deepEqual(parseCatalogue([]), []);
  assert.deepEqual(
    filterProjects(catalogue).map((p) => p.name),
    ["trace-tool", "calendar"],
  );
  assert.deepEqual(filterProjects(catalogue, "unfinished"), []);
  assert.deepEqual(groupNames([{ ...entry, group: "Future", status: "soon" }]), []);
});

test("matches all query words, regardless of case, accents, order, or whitespace", () => {
  assert.deepEqual(
    filterProjects(catalogue, "  COSTS\tCAFE  ").map((p) => p.name),
    ["trace-tool"],
  );
  assert.equal(filterProjects(catalogue, "traces missing").length, 0);
  assert.equal(filterProjects(catalogue, "\t \n").length, 2);
});

test("combines search with audience and includes registry names", () => {
  assert.equal(filterProjects(catalogue, "npm", "Ancient world")[0].name, "calendar");
  assert.equal(filterProjects(catalogue, "traces", "Ancient world").length, 0);
  assert.equal(filterProjects(catalogue, "AI engineering").length, 1);
  assert.equal(filterProjects(catalogue, "", "Unknown").length, 0);
});

test("orders known audiences first and future audiences alphabetically", () => {
  const projects = ["Zoology", "Games", "Ancient world", "Art", "Games"].map((group, i) => ({
    ...entry,
    name: String(i),
    group,
  }));
  assert.deepEqual(groupNames(projects), ["Ancient world", "Games", "Art", "Zoology"]);
});

for (const value of [
  null,
  {},
  "catalogue",
  [null],
  [[]],
  [{ ...entry, name: " " }],
  [{ ...entry, status: "live" }],
  [{ ...entry, group: 3 }],
  [{ ...entry, demoUrl: undefined }],
  [{ ...entry, package: null }],
  [{ ...entry, package: { registry: "unknown", url: entry.repoUrl } }],
]) {
  test(`rejects malformed catalogue: ${JSON.stringify(value)}`, () => {
    assert.throws(() => parseCatalogue(value));
  });
}

test("rejects duplicate project names, including case and whitespace differences", () => {
  assert.throws(() => parseCatalogue([entry, { ...entry, name: " TRACE-TOOL " }]), /Duplicate/);
});

for (const url of [
  "javascript:alert(1)",
  "data:text/html,x",
  "http://example.com",
  "//example.com",
  "https://user:password@example.com",
  " https://example.com",
  "not a URL",
]) {
  test(`rejects unsafe URL ${url} in every link field`, () => {
    for (const field of ["repoUrl", "demoUrl", "spaceUrl"]) {
      assert.throws(() => parseCatalogue([{ ...entry, [field]: url }]));
    }
    assert.throws(() => parseCatalogue([{ ...entry, package: { registry: "npm", url } }]));
  });
}

for (const thumbnail of [
  "../secret.png",
  "thumbs/../secret.png",
  "/thumbs/image.png",
  "https://example.com/image.png",
  'thumbs/image.webp" onerror="alert(1)',
  "thumbs/image.svg",
]) {
  test(`rejects unsafe thumbnail path ${thumbnail}`, () => {
    assert.throws(() => parseCatalogue([{ ...entry, thumbnail }]), /thumbnail/);
  });
}

test("search treats markup and regular expressions as literal text", () => {
  assert.deepEqual(filterProjects(catalogue, "<img src=x>"), []);
  assert.deepEqual(filterProjects(catalogue, ".*"), []);
});
