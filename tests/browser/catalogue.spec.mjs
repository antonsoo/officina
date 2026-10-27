import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";

const projects = JSON.parse(await readFile(new URL("../../public/projects.json", import.meta.url), "utf8"));
const visible = projects.filter((project) => project.status === "published");
const cards = (page) => page.locator(".card:visible");
const search = (page) => page.getByRole("searchbox", { name: "Find a tool" });
const audience = (page, name) => page.getByRole("button", { name: new RegExp(`^${name} \\d+$`) });

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.policyViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      window.policyViolations.push(event.violatedDirective);
    });
  });
  await page.exposeFunction("getPageErrors", () => errors);
});

test.afterEach(async ({ page }) => {
  expect(await page.evaluate(() => window.policyViolations)).toEqual([]);
  expect(await page.evaluate(() => window.getPageErrors())).toEqual([]);
});

test("combines text and audience filters, keeps focus, and resets both", async ({ page }) => {
  await page.goto("./");
  await expect(cards(page)).toHaveCount(visible.length);
  await search(page).fill("TRACE");
  await expect(search(page)).toBeFocused();
  const matching = visible.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes("trace"));
  await expect(cards(page)).toHaveCount(matching.length);
  await audience(page, "Games").click();
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No matching tools" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText(`Showing 0 of ${visible.length} tools`);
  await page.getByRole("button", { name: "Show all tools" }).click();
  await expect(cards(page)).toHaveCount(visible.length);
  await expect(search(page)).toBeFocused();
  await expect(search(page)).toHaveValue("");
  await expect(audience(page, "All tools")).toHaveAttribute("aria-pressed", "true");
});

test("keyboard users can skip the header, filter, and clear without losing their place", async ({ page }) => {
  await page.goto("./");
  await expect(cards(page)).toHaveCount(visible.length);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to tools" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(search(page)).toBeFocused();
  await search(page).fill("zzz-no-match");
  await page.keyboard.press("Enter");
  await expect(search(page)).toHaveValue("zzz-no-match");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Clear filters" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(search(page)).toBeFocused();
  await expect(cards(page)).toHaveCount(visible.length);
  await audience(page, "Games").focus();
  await page.keyboard.press("Space");
  await expect(audience(page, "Games")).toBeFocused();
  await expect(audience(page, "Games")).toHaveAttribute("aria-pressed", "true");
});

test("filtering is local, preserves card nodes, and does not change the URL", async ({ page }) => {
  await page.goto("./");
  await expect(cards(page)).toHaveCount(visible.length);
  await page.evaluate(() => {
    window.originalCard = document.querySelector(".card");
  });
  const requests = [];
  page.on("request", (request) => {
    // Lazy thumbnails can load as cards become visible; searches must not be sent anywhere.
    if (request.resourceType() !== "image" && request.resourceType() !== "font") requests.push(request.url());
  });
  await search(page).fill("private search text");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await audience(page, "AI engineering").click();
  expect(requests).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
  expect(await page.evaluate(() => window.originalCard === document.querySelector(".card"))).toBe(true);
});

for (const failure of ["http", "network", "invalid-json", "invalid-entry"]) {
  test(`recovers from ${failure} with a keyboard-accessible retry`, async ({ page }) => {
    let attempts = 0;
    await page.route("**/projects.json", async (route) => {
      attempts += 1;
      if (attempts > 1) return route.fulfill({ json: projects });
      if (failure === "http") return route.fulfill({ status: 503, body: "Unavailable" });
      if (failure === "network") return route.abort();
      if (failure === "invalid-json") return route.fulfill({ body: "<html>Not JSON</html>" });
      return route.fulfill({ json: [{ ...projects[0], repoUrl: "javascript:alert(1)" }] });
    });
    await page.goto("./");
    await expect(page.getByRole("alert")).toContainText("couldn't be loaded");
    await expect(page.getByRole("main")).toHaveAttribute("aria-busy", "false");
    const retry = page.getByRole("button", { name: "Try again" });
    await retry.focus();
    await page.keyboard.press("Enter");
    await expect(cards(page)).toHaveCount(visible.length);
    await expect(search(page)).toBeFocused();
    expect(attempts).toBe(2);
  });
}

test("unpublished projects stay absent even when their name matches", async ({ page }) => {
  await page.route("**/projects.json", (route) =>
    route.fulfill({
      json: [...projects, { ...projects[0], name: "unfinished-secret", group: "Future", status: "soon" }],
    }),
  );
  await page.goto("./");
  await expect(cards(page)).toHaveCount(visible.length);
  await expect(audience(page, "Future")).toHaveCount(0);
  await search(page).fill("unfinished-secret");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator("[data-project='unfinished-secret']")).toHaveCount(0);
});

test("empty catalogues show a useful status", async ({ page }) => {
  await page.route("**/projects.json", (route) => route.fulfill({ json: [] }));
  await page.goto("./");
  await expect(page.getByRole("status")).toHaveText("No tools are listed yet.");
});

test("catalogue text is escaped and cannot add markup", async ({ page }) => {
  const hostile = '<img src=x onerror="window.injected=true">';
  await page.route("**/projects.json", (route) =>
    route.fulfill({ json: [{ ...projects[0], name: hostile, group: hostile, description: hostile }] }),
  );
  await page.goto("./");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.locator(".card-name")).toHaveText(hostile);
  expect(await page.locator("img").count()).toBe(1);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await search(page).fill(hostile);
  await expect(cards(page)).toHaveCount(1);
});

test("themes remain usable when storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage denied");
      },
    });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await search(page).fill("traces");
  await expect(page.getByRole("status")).not.toContainText("Showing 0");
});

for (const colorScheme of ["light", "dark"]) {
  for (const width of [375, 1280]) {
    test(`fits ${width}px in ${colorScheme} theme`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme });
      await page.goto("./");
      await expect(cards(page)).toHaveCount(visible.length);
      await audience(page, "Games").click();
      await expect(cards(page)).toHaveCount(visible.filter((p) => p.group === "Games").length);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(
        await page.evaluate(() => {
          const range = document.createRange();
          range.selectNodeContents(document.querySelector("h1"));
          const title = range.getBoundingClientRect();
          const toggle = document.querySelector("#theme-toggle").getBoundingClientRect();
          return (
            title.left < toggle.right &&
            title.right > toggle.left &&
            title.top < toggle.bottom &&
            title.bottom > toggle.top
          );
        }),
      ).toBe(false);
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      for (const button of await page.locator(".audiences button").all()) {
        const box = await button.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      // Full-page screenshots do not trigger every browser's lazy images. Scroll
      // through the actual cards and verify they decode before recording the page.
      for (const image of await page.locator(".card:visible img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`${colorScheme}-${width}.png`), fullPage: true });
    });
  }
}

test("cards state their recorded evidence and link to its source revision", async ({ page }) => {
  await page.goto("./");
  const studies = page.locator(".card-study a");
  await expect(studies).toHaveCount(visible.filter((project) => project.study).length);
  const flakemap = page.locator('[data-project="flakemap"] .card-study a');
  await expect(flakemap).toContainText("Recorded evidence");
  await expect(flakemap).toHaveAttribute(
    "href",
    /github\.com\/antonsoo\/flakemap\/tree\/[0-9a-f]{40}\/studies\//,
  );
  // The finding is searchable like the description.
  await search(page).fill("independent identity");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.locator('[data-project="flakemap"]')).toBeVisible();
});

test("source-word searches expose keyboard-accessible links to the matching reader", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("searchbox", { name: "Find a tool" });
  await search.fill("μηδεποτε");
  const card = page.locator('[data-project="stoicheia"]');
  const link = card.locator('[data-workshop="measure"] .workshop-demo');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", /\/measure\.html#/);
  await expect(card.locator('[data-workshop="horn"]')).toBeHidden();
  await expect(search).toBeFocused();
  for (let i = 0; i < 12 && !(await link.evaluate((e) => e === document.activeElement)); i++)
    await page.keyboard.press("Tab");
  await expect(link).toBeFocused();
  await expect(card.locator('[data-workshop="measure"] .workshop-review')).toHaveAttribute(
    "href",
    /\/blob\/[a-f0-9]{40}\/docs\/measure-review\.md#/,
  );
});

test("matching workshop nodes survive searches and clear without leaking unrelated links", async ({
  page,
}) => {
  await page.goto("./");
  const search = page.getByRole("searchbox", { name: "Find a tool" });
  await search.fill("μηδέποτε");
  await page.locator('[data-workshop="measure"] .workshop-demo').evaluate((e) => {
    window.originalWorkshopLink = e;
  });
  await search.fill("horn angle");
  await expect(page.locator('[data-workshop="horn"] .workshop-demo')).toBeVisible();
  await expect(page.locator('[data-workshop="measure"] .workshop-demo')).toBeHidden();
  await search.fill("μηδέποτε 591.15");
  await expect(page.locator('[data-project="stoicheia"]')).toBeVisible();
  await expect(page.locator(".card-workshops:visible")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".card-workshops:visible")).toHaveCount(0);
  await expect(search).toBeFocused();
  await search.fill("μηδέποτε");
  expect(
    await page
      .locator('[data-workshop="measure"] .workshop-demo')
      .evaluate((e) => e === window.originalWorkshopLink),
  ).toBe(true);
});

test("a specific workshop search keeps its own activity and restores the umbrella details on clear", async ({page}) => {
  await page.goto("./");
  const card = page.locator('[data-project="stoicheia"]');
  await expect(card.locator('.card-thumb')).toBeVisible();
  await search(page).fill("οποιονουν");
  const row = card.locator('[data-workshop="ratios"]');
  await expect(row).toBeVisible();
  await expect(row.locator('.workshop-summary')).toContainText("4,761");
  await expect(row.locator('img')).toHaveAttribute('src',/stoicheia-ratios/);
  await expect(card.locator('.card-thumb')).toBeHidden();
  await expect(card.locator('.card-desc')).toBeHidden();
  await expect(card.locator('.card-study')).toBeHidden();
  await expect(card.locator('[data-project-demo]')).toHaveText('Project demo');
  await expect(card.locator('[data-project-demo]')).toHaveAttribute('href',/circle.html/);
  await expect(row.locator('.workshop-demo')).toHaveAttribute('href',/ratios.html/);
  await expect(search(page)).toBeFocused();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(card.locator('.card-thumb')).toBeVisible();
  await expect(card.locator('.card-desc')).toBeVisible();
  await expect(card.locator('.card-study')).toBeVisible();
  await expect(row).toBeHidden();
});
