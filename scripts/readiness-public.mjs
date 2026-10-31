import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { connect } from "node:net";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox } from "@playwright/test";

const config = {
  psephos: [
    {
      id: "court",
      route: "",
      select: "#scan-page",
      page: "67",
      path: "sources/kenyon-p67.jpg",
      retry: "#retry-scan",
      status: "#scan-status",
      image: "#scan",
      note: "#note",
      json: "#save-json",
      html: "#save-html",
      open: "#open-file",
      fileStatus: "#file-status",
    },
  ],
  horos: [
    {
      id: "logic",
      route: "",
      select: "#scan-page",
      page: "28",
      path: "sources/bekker-p28.jpg",
      retry: "#retry-scan",
      status: "#scan-status",
      image: "#scan",
      note: "#note",
      json: "#save-json",
      html: "#save-html",
      open: "#open-file",
      fileStatus: "#file-status",
    },
  ],
  traditio: [
    {
      id: "river",
      route: "river.html",
      select: "#river-page",
      page: "d1",
      path: "sources/mommsen-1893-p644.jpg",
      retry: "#river-retry",
      status: "#river-scan-status",
      image: "#river-scan",
      note: "#river-note",
      json: "#river-save-record",
      html: "#river-save-reading",
      open: "#river-open",
      fileStatus: "#river-save-status",
    },
    {
      id: "ownership",
      route: "",
      select: "#page-select",
      page: "133",
      path: "sources/poste-1904-p133.jpg",
      retry: "#retry-scan",
      status: "#scan-status",
      image: "#scan",
      note: null,
      json: "#save-case",
      html: "#save-sheet",
      open: "#open-case",
      fileStatus: "#file-status",
    },
    {
      id: "ceremony",
      route: "ceremony.html",
      select: "#ceremony-page",
      page: "74",
      path: "sources/poste-1904-p74.jpg",
      retry: "#ceremony-retry",
      status: "#ceremony-scan-status",
      image: "#ceremony-scan",
      note: "#ceremony-note",
      json: "#save-rehearsal",
      html: "#save-dossier",
      open: "#open-rehearsal",
      fileStatus: "#dossier-status",
    },
  ],
};
const [project, destination] = process.argv.slice(2);
assert.ok(Object.hasOwn(config, project), "Supply psephos, horos or traditio and an output directory.");
assert.ok(destination);
const repo = fileURLToPath(new URL(`../../${project}/`, import.meta.url));
const base = `https://antonsoo.github.io/${project}/`;
const output = resolve(destination);
await mkdir(output, { recursive: true });
const sha = (b) => createHash("sha256").update(b).digest("hex");
const manifest = JSON.parse(await readFile(resolve(repo, "src/asset-manifest.json"), "utf8"));
async function files(dir) {
  const all = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, e.name);
    if (e.isDirectory()) all.push(...(await files(path)));
    else all.push(path);
  }
  return all.sort();
}
const root = resolve(repo, "dist");
const expected = await Promise.all(
  (await files(root)).map(async (path) => ({
    path: path.slice(root.length + 1),
    bytes: await readFile(path),
  })),
);
async function canonical() {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < expected.length) {
        const f = expected[next++];
        const url = new URL(f.path, base);
        const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(30000) });
        assert.equal(r.status, 200, url.href);
        const bytes = Buffer.from(await r.arrayBuffer());
        assert.ok(
          bytes.equals(f.bytes),
          `${url.href}: expected ${f.bytes.length} bytes (${sha(f.bytes)}); got ${bytes.length} bytes (${sha(bytes)})`,
        );
        results.push({ path: f.path, bytes: bytes.length, sha256: sha(bytes) });
      }
    }),
  );
  const r = await fetch(base, { cache: "no-store" });
  assert.equal(r.status, 200);
  const rootBytes = Buffer.from(await r.arrayBuffer());
  assert.ok(
    rootBytes.equals(expected.find((f) => f.path === "index.html").bytes),
    "Canonical root differs from the reviewed build",
  );
  return results.sort((a, b) => a.path.localeCompare(b.path));
}
const before = await canonical();
const sockets = new Set();
let unavailable = false,
  refused = 0;
const proxy = createServer((_q, r) => r.writeHead(502).end());
proxy.on("connect", (request, client, head) => {
  if (unavailable) {
    refused++;
    client.end("HTTP/1.1 503 Offline audit\r\n\r\n");
    return;
  }
  if (request.url !== "antonsoo.github.io:443") {
    client.end("HTTP/1.1 403 Forbidden\r\n\r\n");
    return;
  }
  const upstream = connect(443, "antonsoo.github.io");
  for (const socket of [client, upstream]) {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  }
  client.on("error", () => upstream.destroy());
  upstream.on("error", () => client.destroy());
  client.on("close", () => upstream.destroy());
  upstream.on("close", () => client.destroy());
  upstream.on("connect", () => {
    if (unavailable) {
      client.destroy();
      upstream.destroy();
      return;
    }
    client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head.length) upstream.write(head);
    client.pipe(upstream);
    upstream.pipe(client);
  });
});
await new Promise((done) => proxy.listen(0, "127.0.0.1", done));
const ready = (p) =>
  p.locator("#offline-status").filter({ hasText: "This edition is available offline," }).waitFor();
const incomplete = (p) =>
  p.locator("#offline-status").filter({ hasText: "not fully available offline" }).waitFor();
const checked = (p, v) =>
  p
    .locator(v.status)
    .filter({ hasText: /checked|Printed page/ })
    .waitFor();
async function download(p, id, file) {
  const waiting = p.waitForEvent("download");
  await p.locator(id).click();
  const d = await waiting;
  assert.equal(await d.failure(), null);
  await d.saveAs(file);
  return readFile(file);
}
async function damage(p, path) {
  await p.evaluate(
    async ({ project, path }) => {
      const edition = document.querySelector(`meta[name="${project}-edition"]`).content;
      const url = new URL(path, new URL(".", location.href));
      const cache = await caches.open(`${project}-${edition}`);
      const good = await cache.match(url);
      if (!good) throw Error("Expected source in current cache");
      const bytes = new Uint8Array(await good.arrayBuffer());
      bytes[100] ^= 1;
      await cache.put(url, new Response(bytes, { headers: { "Content-Type": "image/jpeg" } }));
    },
    { project, path },
  );
}
const nativeImage = (p, path) =>
  p.evaluate(
    (path) =>
      new Promise((done) => {
        const image = new Image();
        image.onload = () => done("loaded");
        image.onerror = () => done("failed");
        image.src = new URL(path, new URL(".", location.href)).href;
      }),
    path,
  );
const journeys = [];
try {
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await engine.launch({ proxy: { server: `http://127.0.0.1:${proxy.address().port}` } });
    try {
      for (const width of [1440, 375])
        for (const v of config[project]) {
          unavailable = false;
          const context = await browser.newContext({
            viewport: { width, height: 1000 },
            acceptDownloads: true,
          });
          await context.addInitScript(() => {
            const create = URL.createObjectURL.bind(URL);
            window.readinessBlobs = new Map();
            URL.createObjectURL = (blob) => {
              const url = create(blob);
              window.readinessBlobs.set(url, blob);
              return url;
            };
          });
          const p = await context.newPage(),
            errors = [];
          p.on("pageerror", (e) => errors.push(e.message));
          await p.goto(base + v.route);
          await ready(p);
          await p.locator(v.select).selectOption(v.page);
          await checked(p, v);
          if (project === "psephos") {
            await p.locator("#issue").click();
            await p.locator("#cast").click();
            await p.locator("#count-bronze").click();
            await p.locator("#inspect-inference").click();
            await p.locator("#inference-results").filter({ hasText: "252 arrangements fit" }).waitFor();
          }
          if (project === "horos") {
            await p.locator("#pin").click();
            await p.locator("#region-5").click();
            await p.locator("#region-4").click();
            assert.equal(await p.locator("#judgment").getAttribute("data-status"), "counterexample");
          }
          await p.locator(v.select).selectOption(v.page);
          await checked(p, v);
          const note = "Keep this explanation through source loss and recovery.";
          if (v.note) await p.locator(v.note).fill(note);
          const prefix = resolve(output, `${name}-${width}-${v.id}`);
          const json = await download(p, v.json, prefix + ".json");
          const html = await download(p, v.html, prefix + ".html");
          const embedded = [...html.toString().matchAll(/data:[^;]+;base64,([A-Za-z0-9+/=]+)/g)].map((m) =>
            Buffer.from(m[1], "base64"),
          );
          for (const path of [v.path, "fonts/literata.woff2", "fonts/sourcesans3.woff2"])
            assert.ok(
              embedded.some((b) => sha(b) === manifest.find((a) => a.path === path).sha256),
              path,
            );
          const other = await context.newPage();
          await other.goto(
            base + config[project][(config[project].indexOf(v) + 1) % config[project].length].route,
          );
          await ready(other);
          await context.setOffline(true);
          await damage(p, v.path);
          await p.locator(v.retry).click();
          await p.waitForFunction(
            (selector) => !document.querySelector(selector).textContent.startsWith("Loading"),
            v.status,
          );
          const direct = (await p.locator(v.status).textContent()) || "";
          const directRefused = /failed|Could not|does not match/.test(direct);
          if (directRefused) {
            await incomplete(p);
            await incomplete(other);
          } else assert.match(direct, /checked|Printed page/);
          await context.setOffline(false);
          await ready(p);
          await ready(other);
          unavailable = true;
          for (const s of sockets) s.destroy();
          const refusedBefore = refused;
          const probeContext = await browser.newContext({ serviceWorkers: "block" });
          const probe = await probeContext.newPage();
          let failed = false;
          try {
            await probe.goto(base, { timeout: 15000 });
          } catch {
            failed = true;
          }
          assert.equal(failed, true);
          assert.ok(refused > refusedBefore);
          await probeContext.close();
          assert.equal(await p.evaluate(() => navigator.onLine), true);
          await p.reload({ waitUntil: "domcontentloaded" });
          await ready(p);
          await p
            .locator(v.open)
            .setInputFiles({ name: `${project}-saved.json`, mimeType: "application/json", buffer: json });
          await p
            .locator(v.fileStatus)
            .filter({ hasText: /reopened/i })
            .waitFor();
          await p.locator(v.select).selectOption(v.page);
          await checked(p, v);
          const offline = await download(p, v.html, prefix + "-offline.html");
          assert.equal(sha(offline), sha(html));
          await damage(p, v.path);
          assert.equal(await nativeImage(p, v.path), "failed");
          await incomplete(p);
          await incomplete(other);
          await p.locator("#offline-status").screenshot({ path: prefix + "-incomplete.png" });
          unavailable = false;
          assert.equal(await nativeImage(p, v.path), "loaded");
          await ready(p);
          await ready(other);
          await p.locator(v.retry).click();
          await checked(p, v);
          if (v.note) assert.equal(await p.locator(v.note).inputValue(), note);
          const displayedSourceSha256 = await p.locator(v.image).evaluate(async (img) => {
            await img.decode();
            const bytes = await window.readinessBlobs.get(img.src).arrayBuffer();
            return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
          });
          assert.equal(displayedSourceSha256, manifest.find((a) => a.path === v.path).sha256);
          const recovered = await download(p, v.json, prefix + "-recovered.json");
          assert.deepEqual(JSON.parse(recovered), JSON.parse(json));
          assert.deepEqual(errors, []);
          assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          journeys.push({
            browser: name,
            version: browser.version(),
            width,
            page: v.route || "index.html",
            browserOfflineSourceStatus: direct,
            sourceFailureWithdrawsBothFooters: directRefused ? true : null,
            realTransportRefused: true,
            freshWorkerFreeContextFailed: true,
            navigatorOnLineWhileOriginUnavailable: true,
            reloadedAndReopenedActualJsonOffline: true,
            offlineHtmlIdentical: sha(html) === sha(offline),
            nativeImageFailureWithdrawsBothFooters: true,
            recoveryRechecksBothFooters: true,
            recoveredJsonIdentical: true,
            embeddedSourceAndFontsChecked: true,
            displayedSourceSha256,
            errors,
          });
          await context.close();
          await canonical();
          console.log(
            `${project}/${name}/${width}/${v.id}: two tabs, actual TLS outage, identical offline record, damage and recovery`,
          );
        }
    } finally {
      unavailable = false;
      await browser.close();
    }
  }
  const after = await canonical();
  assert.deepEqual(after, before);
  await writeFile(
    resolve(output, "receipt.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        project,
        base,
        requestRedirection: false,
        transport: "Original TLS bytes through CONNECT; close tunnels and refuse new connections",
        canonicalRecheckedAfterEveryJourney: true,
        files: after,
        journeys,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  unavailable = false;
  for (const s of sockets) s.destroy();
  await new Promise((done) => proxy.close(done));
}
