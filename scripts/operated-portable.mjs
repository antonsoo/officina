import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
const packets = [
  {
    project: "haidao",
    revision: "f42a7c4681799710aa617a7bcc14e29a21335580",
    stem: "haidao-reading",
    htmlExtension: "html.gz",
    preset:
      "Source observations; retreat-difference divisor; completed recipe; independent setback half-width 2 bu",
  },
  {
    project: "stoicheia",
    revision: "3d33c47c92a69e46862cce554afd74cc51dd91eb",
    stem: "common-measure",
    htmlExtension: "html.gz",
    preset: "Book X; exact 577/408 and diagonal comparison; complete native reading",
  },
  {
    project: "gonia",
    revision: "3c04ee1ca2ae21b59a45658a5cdf6ca93caa53ed",
    stem: "screw-reading",
    htmlExtension: "html.gz",
    preset: "Eight starts; sixteen-digit source foot; source pitch and 3-4-5 slope",
  },
  {
    project: "stoicheia",
    revision: "1855a9594a3a006bf42ae3639281cfe4f992f7de",
    stem: "stoicheia-construction-reading",
    preset: "Detached I.2; completed eleven-command route",
  },
  {
    project: "pyknon",
    revision: "c91cdc576af85baf113fba182fe89e8d44c9340f",
    stem: "rhythm-reading",
    preset: "Six times, 2+4, joined attacks, reference comparison",
  },
  {
    project: "grama",
    revision: "433620732c1f4fef46947d38cdf677a821cd0102",
    stem: "grama-illustrated-reading",
    preset: "Madhyama, start Re, Sa 220 Hz, equal-division counterexample",
  },
  {
    project: "gonia",
    revision: "cc4a123ea05ae5f42dfb4313323ea55dc539ee31",
    stem: "hoist-reading",
    preset: "Five wheels, moving tie, rise 1 m, 1200 N, arm ratio 4",
  },
];
const out = process.argv[2] ?? "/tmp/operated-portable.json",
  results = [];
for (const p of packets)
  for (const ext of [p.htmlExtension ?? "html", "pdf"]) {
    const file = `examples/${p.stem}.${ext}`,
      url = `https://raw.githubusercontent.com/antonsoo/${p.project}/${p.revision}/${file}`,
      local = await readFile(path.join("..", p.project, file)),
      response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, url);
    const remote = Buffer.from(await response.arrayBuffer()),
      hash = (b) => createHash("sha256").update(b).digest("hex");
    assert.equal(hash(remote), hash(local), url);
    const expanded = ext.endsWith(".gz") ? gunzipSync(remote) : remote;
    if (ext.startsWith("html")) assert.match(expanded.toString(), /^<!doctype html>/i);
    else assert.equal(expanded.subarray(0, 5).toString(), "%PDF-");
    results.push({
      ...p,
      file,
      url,
      bytes: remote.length,
      sha256: hash(remote),
      expandedBytes: expanded.length,
      expandedSha256: hash(expanded),
      matchesLocal: true,
    });
  }
await mkdir(path.dirname(out), { recursive: true });
await writeFile(
  out,
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      scope:
        "Pinned public native HTML/PDF source artifacts, each compared with the retained local file; no claim that physical printing was performed",
      files: results,
    },
    null,
    2,
  ) + "\n",
);
console.log(`All ${results.length} pinned public HTML/PDF files match their retained files.`);
