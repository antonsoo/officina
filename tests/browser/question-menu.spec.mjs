import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const choices = [
  ["roof", /embater\/#order=doric&columns=6&view=roof&trial=0\.5$/, "embater-roof.png"],
  ["counterexample", /horos\/\?investigation=two-worlds#workshop$/, "horos.png"],
  ["dorian", /harmoniai\/compare.html\?name=dorian#listen$/, "harmoniai-names.png"],
  ["circle", /stoicheia\/circle.html$/, "stoicheia-circle.png"],
  ["cord", /rajju\/field.html\?corner=en&nearerr=10&farerr=0#cord-errors$/, "rajju-errors.png"],
  ["trace", /tracelens\/$/, "tracelens.webp"],
];

test("the question menu exposes every experiment, review and source with a keyboard", async ({ page }) => {
  await page.goto("./");
  const panel = page.getByRole("tabpanel");
  await expect(page.getByRole("tab")).toHaveCount(6);
  await page.getByRole("tab").first().focus();
  for (const [i, [id, url, thumbnail]] of choices.entries()) {
    if (i) await page.keyboard.press("ArrowDown");
    const active = page.locator(`#question-${id}`);
    await expect(active).toBeFocused();
    await expect(active).toHaveAttribute("aria-selected", "true");
    await expect(panel).toHaveAttribute("aria-labelledby", `question-${id}`);
    await expect(panel.locator(".question-open")).toHaveAttribute("href", url);
    await expect(panel.locator("img")).toHaveAttribute("src", new RegExp(thumbnail.replace(".", "\\.")));
    await expect.poll(() => panel.locator("img").evaluate((i) => i.naturalWidth)).toBeGreaterThan(0);
    await expect(panel.locator(".question-review")).toHaveAttribute("href", /\/(blob|tree)\/[a-f0-9]{40}\//);
    await expect(panel.getByRole("link", { name: "Project source" })).toHaveAttribute(
      "href",
      /github\.com\/antonsoo\//,
    );
  }
  await page.keyboard.press("Home");
  await expect(page.locator("#question-roof")).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator("#question-trace")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(panel).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("changing the preview preserves searches and stays on the current page", async ({ page }) => {
  await page.goto("./?q=horse&audience=Ancient+world#catalogue");
  const search = page.getByRole("searchbox", { name: "Find a tool" });
  await expect(search).toHaveValue("horse");
  const start = page.url();
  const requests = [];
  page.on("request", (r) => {
    if (!["image", "font"].includes(r.resourceType())) requests.push(r.url());
  });
  await page.locator("#question-dorian").click();
  await expect(search).toHaveValue("horse");
  expect(page.url()).toBe(start);
  expect(requests).toEqual([]);
  await expect(page.locator(".card:visible")).toHaveCount(1);
});

for (const theme of ["light", "dark"]) {
  test(`the phone selector uses the same six routes in ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 1000 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("./");
    const select = page.getByRole("combobox", { name: "Choose an experiment" });
    await expect(select).toBeVisible();
    await expect(page.getByRole("tablist")).toBeHidden();
    for (const [id, url] of choices) {
      await select.selectOption(id);
      const labelFits = await select.evaluate((element) => {
        const style = getComputedStyle(element);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = style.font;
        const label = element.selectedOptions[0].label;
        return context.measureText(label).width <= element.clientWidth - 40;
      });
      expect(labelFits, "the selected phone action fits without clipping").toBe(true);
      await expect(page.locator(".question-open")).toHaveAttribute("href", url);
      await expect
        .poll(() => page.locator(".question-preview img").evaluate((i) => i.naturalWidth))
        .toBeGreaterThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await select.selectOption("counterexample");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`question-menu-${theme}-375.png`) });
  });
}

test("an unavailable thumbnail keeps the experiment usable and the next choice recovers", async ({
  page,
}) => {
  await page.route("**/thumbs/horos.png", (r) => r.abort());
  await page.goto("./");
  await page.locator("#question-counterexample").click();
  await expect(page.locator(".question-preview-status")).toHaveText(/Preview unavailable/);
  await expect(page.locator(".question-open")).toBeVisible();
  await expect(page.locator(".question-review")).toBeVisible();
  await page.locator("#question-dorian").click();
  await expect(page.locator(".question-preview-status")).toBeHidden();
  await expect
    .poll(() => page.locator(".question-preview img").evaluate((i) => i.naturalWidth))
    .toBeGreaterThan(0);
});
