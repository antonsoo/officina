import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox } from "@playwright/test";
const [base, out, phase] = process.argv.slice(2);
assert(base && out && ["before", "after"].includes(phase));
await mkdir(out, { recursive: true });
const receipt = [];
for (const [engine, kind] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await kind.launch();
  for (const width of [1280, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } }),
      page = await context.newPage(),
      errors = [],
      dataRequests = [];
    let filtering = false;
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (filtering && r.url().includes("projects.json")) dataRequests.push(r.url());
    });
    await page.goto(base);
    await page.locator('[data-project="stutterscope"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    filtering = true;
    const search = page.getByRole("searchbox", { name: "Find a tool" });
    await search.fill("capframex json");
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const visible = page.locator(".card:visible"),
      count = await visible.count();
    assert.equal(count, phase === "before" ? 0 : 1);
    let text;
    if (phase === "after") {
      const card = page.locator('[data-project="stutterscope"]');
      text = await card.innerText();
      assert.match(text, /native CapFrameX JSON/);
      await card.scrollIntoViewIfNeeded();
      await card.locator("img").evaluate((img) => img.decode());
      await card.screenshot({ path: resolve(out, `${engine}-${width}.png`), animations: "disabled" });
      await context.setOffline(true);
      await search.fill("native capframex");
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      assert.equal(await visible.count(), 1);
    } else {
      await page
        .locator("main")
        .screenshot({ path: resolve(out, `${engine}-${width}.png`), animations: "disabled" });
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    assert.deepEqual(dataRequests, []);
    receipt.push({
      base,
      phase,
      engine,
      width,
      query: "capframex json",
      visibleProjects: count,
      ...(text ? { cardText: text, offlineRefilter: true } : {}),
      errors,
      catalogueRequestsWhileFiltering: dataRequests,
      noPageOverflow: true,
    });
    await context.close();
  }
  await browser.close();
}
await writeFile(resolve(out, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n");
console.log(`${phase}: 4 real catalogue search workflows`);
