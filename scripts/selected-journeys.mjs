import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, firefox, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.argv[2] ?? "https://antonsoo.github.io/officina/";
const output = process.argv[3] ?? "/tmp/officina-selected";
await mkdir(output, { recursive: true });
const receipts = [];
for (const [engine, launcher] of Object.entries({ chromium, firefox })) {
  const browser = await launcher.launch();
  try {
    for (const width of [1440, 375])
      for (const colorScheme of ["light", "dark"]) {
        if (
          process.argv[4] === "smoke" &&
          (engine !== "chromium" || width !== 1440 || colorScheme !== "light")
        )
          continue;
        const id = `${engine}-${width}-${colorScheme}`;
        const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base);
        await expect(page.locator(".feature-link")).toHaveCount(4);
        await expect(page.locator(".owner")).toHaveText("Anthony Mercer");
        assert.doesNotMatch(await page.locator(".masthead").innerText(), /San Francisco|AI engineer/i);
        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        assert.deepEqual(
          axe.violations.map((v) => v.id),
          [],
        );
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({ path: `${output}/${id}.png` });
        const selections = await page
          .locator(".feature-link")
          .evaluateAll((links) => links.map((a) => a.href));
        await page.getByRole("link", { name: "Count the columns" }).click();
        await expect(page.locator("#count-result")).toContainText("17 recorded, 11 predicted");
        await page.locator('input[value="columns"]').check();
        await page.locator("#temple").selectOption("aegina-temple-of-aphaia");
        await expect(page.locator("#count-result")).toContainText("counts agree: 12");
        await page.goto(base);
        await page.getByRole("link", { name: "Hear the two Dorians" }).click();
        await expect(page.locator("#compare-finding")).toContainText("Degrees 2 and 6 differ");
        await page.locator("#compare-both").click();
        await page.waitForFunction(() => document.querySelector("audio").currentTime > 0.1);
        await page.locator("#compare-stop").click();
        await page.locator("#compare-relation").selectOption("pattern");
        await expect(page.locator("#compare-finding")).toContainText("All eight pitches agree");
        await page.goto(base);
        await page.getByRole("link", { name: "Try the argument" }).click();
        await page.locator('[data-stage="0"]').click();
        await expect(page.locator("#ci-polygon svg")).toHaveAccessibleName(/6-sided/);
        await page.locator("#ci-near-miss").click();
        await expect(page.locator("#ci-bound-status")).toContainText(/chain has a gap/i);
        await page.goto(base);
        await page.getByRole("link", { name: "Open the trace reader" }).click();
        await page.getByRole("button", { name: "Inspect token cost (recorded SDK replay)" }).click();
        await expect(page.locator("body")).toContainText("$0.00081907", { timeout: 15000 });

        await page.getByRole("treeitem", { name: "ai.streamText.doStream 59.5 ms" }).click();
        await expect(page.locator("body")).toContainText("gpt-5-nano-2025-08-07");

        const workshops = [];
        for (const [query, project] of [
          ["intercolumnia", "embater"],
          ["unequal lowerings", "harmoniai"],
        ]) {
          await page.goto(base);
          await page.getByRole("link", { name: "Project index", exact: true }).click();
          await page.locator("#tool-search").fill(query);
          const card = page.locator(`[data-project="${project}"] [data-workshop="${project === "embater" ? "count" : "assumptions"}"]`);
          await expect(card).toBeVisible();
          const review = await card.locator(".workshop-review").getAttribute("href");
          assert.match(review, /\/blob\/[a-f0-9]{40}\//);
          const raw = review
            .replace("https://github.com/", "https://raw.githubusercontent.com/")
            .replace("/blob/", "/");
          const response = await context.request.get(raw);
          assert.equal(response.status(), 200);
          assert.match(await response.text(), project === "embater" ? /Count the spaces/ : /Counterexample/);
          await card.locator(".workshop-demo").focus();
          await page.keyboard.press("Enter");
          if (project === "embater") {
            await expect(page.locator("#count-result")).toContainText("17 recorded");
            const download = page.waitForEvent("download");
            await page.locator("#save-count").click();
            await (await download).saveAs(`${output}/${id}-reading.html`);
            const source = await page.locator("#count-source a").getAttribute("href");
            assert.match(source, /perseus\.tufts\.edu/);
          } else {
            await expect(page.locator("#lowering-comparison")).toContainText("182.404");
            await page.locator("#pure-fifth").click();
            await expect(page.locator("#fifth-status")).toContainText("330");
            await page.locator("#comparison-stop").click();
            await page.getByRole("link", { name: /Change the preparation and operate/ }).click();
            await page.locator("#vn-tuning").selectOption("comma");
            const first = await page.locator("#vn-table").innerText();
            await page.locator("#vn-change").click();
            await expect(page.locator("#vn-table")).not.toHaveText(first);
            await expect(page.locator("#vn-validity")).toContainText(/valid|ordered/i);
          }
          workshops.push({ query, review });
        }
        assert.deepEqual(errors, []);
        receipts.push({
          engine,
          width,
          colorScheme,
          selections,
          workshops,
          accessibilityViolations: 0,
          errors,
        });
        await writeFile(`${output}/browser.json`, JSON.stringify({ base, receipts }, null, 2) + "\n");
        console.log(id, "selected activities and source-term journeys verified");
        await context.close();
      }
  } finally {
    await browser.close();
  }
}
