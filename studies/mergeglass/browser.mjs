import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, firefox } from "playwright";

const baseURL = process.argv[2] ?? "https://antonsoo.github.io/officina/";
const output = process.argv[3];
if (!output) throw new Error("Usage: node studies/mergeglass/browser.mjs URL OUTPUT_DIRECTORY");
await mkdir(output, { recursive: true });
const catalogue = JSON.parse(await readFile(new URL("../../public/projects.json", import.meta.url)));
const expected = catalogue.find((p) => p.name === "mergeglass");
assert.ok(expected);
const thumbnailBytes = await readFile(new URL(`../../public/${expected.thumbnail}`, import.meta.url));
const thumbnailHash = createHash("sha256").update(thumbnailBytes).digest("hex");
const results = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await type.launch();
  for (const width of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 950 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL);
    await page.locator(".card").first().waitFor();
    const response = await page.request.get(new URL("projects.json", baseURL).href);
    assert.equal(response.status(), 200);
    const actual = (await response.json()).find((p) => p.name === "mergeglass");
    assert.deepEqual(actual, expected);
    const search = page.getByRole("searchbox", { name: "Find a tool" });
    for (const query of ["LoRA", "BF16", "wrong direction"]) {
      await search.fill(query);
      await page.locator('[data-project="mergeglass"]:visible').waitFor();
      assert.equal(await page.locator(".card:visible").count(), 1);
    }
    await page.getByRole("button", { name: /^AI engineering \d+$/ }).click();
    const card = page.locator('[data-project="mergeglass"]');
    assert.equal(await page.locator(".card:visible").count(), 1);
    assert.equal(await card.locator(".card-desc").textContent(), expected.description);
    const finding = await card.locator(".card-study").innerText();
    assert.ok(finding.includes(expected.study.finding));
    const links = await card.locator("a").evaluateAll((as) =>
      as.map((a) => ({
        text: a.textContent.trim(),
        href: a.href,
      })),
    );
    assert.deepEqual(links.map((a) => a.href).sort(), [expected.repoUrl, expected.study.url].sort());
    const image = card.locator("img");
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((i) => i.decode());
    const dimensions = await image.evaluate((i) => [i.naturalWidth, i.naturalHeight]);
    assert.deepEqual(dimensions, [1200, 750]);
    const imageURL = new URL(await image.getAttribute("src"), page.url()).href;
    const imageResponse = await page.request.get(imageURL);
    assert.equal(imageResponse.status(), 200);
    assert.equal(
      createHash("sha256")
        .update(await imageResponse.body())
        .digest("hex"),
      thumbnailHash,
    );
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      return document.fonts.ready;
    });
    await page.waitForFunction(() => scrollY === 0);
    const screenshot = `${name}-${width}.png`;
    await page.screenshot({ path: join(output, screenshot), fullPage: true });
    assert.deepEqual(errors, []);
    results.push({
      browser: name,
      width,
      queries: ["LoRA", "BF16", "wrong direction"],
      finding,
      links,
      dimensions,
      thumbnailSha256: thumbnailHash,
      screenshot,
    });
    await page.close();
  }
  await browser.close();
}
await writeFile(join(output, "browser.json"), JSON.stringify({ baseURL, results }, null, 2) + "\n");
console.log(`Verified Mergeglass discovery and artifact links in ${results.length} browser/viewports`);
