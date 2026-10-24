import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const packets = [
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
  for (const ext of ["html", "pdf"]) {
    const file = `examples/${p.stem}.${ext}`,
      url = `https://raw.githubusercontent.com/antonsoo/${p.project}/${p.revision}/${file}`,
      local = await readFile(path.join("..", p.project, file)),
      response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, url);
    const remote = Buffer.from(await response.arrayBuffer()),
      hash = (b) => createHash("sha256").update(b).digest("hex");
    assert.equal(hash(remote), hash(local), url);
    results.push({ ...p, file, url, bytes: remote.length, sha256: hash(remote), matchesLocal: true });
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
console.log("All eight pinned public HTML/PDF packets match their retained files.");
