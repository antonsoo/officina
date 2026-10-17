import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { verifyPages } from "../scripts/verify-pages.mjs";

async function fixture(t, handler) {
  const directory = await mkdtemp(join(tmpdir(), "officina-pages-"));
  const files = new Map([
    ["index.html", '<script src="assets/app.js"></script>'],
    ["assets/app.js", 'document.title = "current";'],
    ["assets/λ#?.txt", "exact UTF-8 bytes: café\n"],
  ]);
  for (const [name, body] of files) {
    await mkdir(join(directory, name, ".."), { recursive: true });
    await writeFile(join(directory, name), body);
  }
  const requests = [];
  const server = createServer((request, response) => {
    const url = new URL(request.url, "http://example.test");
    requests.push({ path: url.pathname, search: url.search });
    const name = decodeURIComponent(url.pathname.slice("/site/".length)) || "index.html";
    handler({ request, response, name, files, requests });
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
    await rm(directory, { recursive: true, force: true });
  });
  return { baseURL: `http://127.0.0.1:${server.address().port}/site/`, directory, requests };
}
const serve = ({ response, name, files }) => {
  response.writeHead(files.has(name) ? 200 : 404);
  response.end(files.get(name) ?? "absent");
};

test("an HTTP 200 from the older canonical entry cannot verify newer build assets", async (t) => {
  const site = await fixture(t, (item) => {
    if (item.request.url === "/site/") {
      item.response.writeHead(200);
      item.response.end("old");
    } else serve(item); // All immutable new assets already exist.
  });
  const result = await verifyPages(site);
  assert.equal(result.state, "mismatch");
  assert.equal(result.rootBefore.httpStatus, 200);
  assert.equal(result.checkedFileCount, 0);
  assert.equal(result.expectedFileCount, 3);
  assert.deepEqual(site.requests, [{ path: "/site/", search: "" }]);
});

test("complete canonical bytes, escaped paths and both entry aliases must agree", async (t) => {
  const site = await fixture(t, serve);
  const result = await verifyPages(site);
  assert.equal(result.state, "verified");
  assert.equal(result.verifiedFileCount, 3);
  assert.equal(result.rootAfter.state, "verified");
  assert(site.requests.some((r) => r.path === "/site/index.html"));
  assert(site.requests.some((r) => r.path.includes("%23%3F")));
  assert(site.requests.every((r) => r.search === ""));
  assert(result.files.every((file) => file.observedSha256 === file.sha256));
});

test("a stale explicit index or changed entry during the pass blocks verification", async (t) => {
  for (const which of ["explicit", "after", "asset"]) {
    let roots = 0;
    const site = await fixture(t, (item) => {
      if (item.request.url === "/site/") roots++;
      if (which === "asset" && item.name === "assets/app.js") {
        item.response.writeHead(200);
        item.response.end(item.files.get(item.name).replace("current", "earlier"));
      } else if (
        (which === "explicit" && item.request.url === "/site/index.html") ||
        (which === "after" && roots > 1)
      ) {
        item.response.writeHead(200);
        item.response.end("old");
      } else serve(item);
    });
    const result = await verifyPages(site);
    assert.equal(result.state, "mismatch", which);
    if (which === "after") assert.equal(result.rootAfter.state, "mismatch");
    else if (which === "explicit")
      assert.equal(result.files.find((file) => file.path === "index.html").state, "mismatch");
    else {
      const asset = result.files.find((file) => file.path === "assets/app.js");
      assert.equal(asset.observedBytes, asset.bytes);
      assert.notEqual(asset.observedSha256, asset.sha256);
    }
  }
});

test("propagation retries canonical URLs until the complete build is available", async (t) => {
  let entries = 0;
  const site = await fixture(t, (item) => {
    if (item.request.url === "/site/" && ++entries < 3) {
      item.response.writeHead(200);
      item.response.end("old");
    } else serve(item);
  });
  const result = await verifyPages({ ...site, waitMs: 5000, pollMs: 10 });
  assert.equal(result.state, "verified");
  assert.equal(result.attempts, 3);
  assert(site.requests.every((r) => r.search === ""));
});

test("missing HTTP evidence remains unavailable and is distinct from an oversized 200 body", async (t) => {
  for (const mode of ["503", "truncated", "oversize"]) {
    const site = await fixture(t, (item) => {
      if (item.name !== "assets/app.js") return serve(item);
      if (mode === "503") {
        item.response.writeHead(503);
        item.response.end("temporarily unavailable");
      } else if (mode === "truncated") {
        item.response.writeHead(200, { "content-length": 10000 });
        item.response.write("partial");
        setTimeout(() => item.response.destroy(), 10);
      } else {
        item.response.writeHead(200);
        item.response.end("x".repeat(100000));
      }
    });
    const result = await verifyPages({ ...site, requestTimeoutMs: 1000 });
    const asset = result.files.find((file) => file.path === "assets/app.js");
    assert.equal(result.state, mode === "oversize" ? "mismatch" : "unavailable");
    assert.equal(asset.state, result.state);
    if (mode === "oversize") {
      assert(asset.observedBytesAtLeast > asset.bytes);
      assert.equal(asset.observedSha256, null);
    } else assert.equal(asset.observedSha256, undefined);
  }
});

test("non-artifact paths are refused before networking; CLI cannot add its receipt to the build", async (t) => {
  const site = await fixture(t, serve);
  await assert.rejects(verifyPages({ ...site, baseURL: `${site.baseURL}?fresh=1` }), /without query/);
  await symlink("index.html", join(site.directory, "linked.html"));
  await assert.rejects(verifyPages(site), /symlink/);
  assert.equal(site.requests.length, 0);
  await rm(join(site.directory, "linked.html"));
  await mkdir(join(site.directory, ".git"));
  await assert.rejects(verifyPages(site), /repository or dependency metadata/);
  assert.equal(site.requests.length, 0);
  const run = spawnSync(
    process.execPath,
    ["scripts/verify-pages.mjs", site.baseURL, site.directory, "--out", join(site.directory, "receipt.json")],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" },
  );
  assert.equal(run.status, 2);
  assert.match(run.stderr, /outside the build directory/);
});
