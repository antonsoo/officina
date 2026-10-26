import { test, expect } from "@playwright/test";

const search = (page) => page.getByRole("searchbox", { name: "Find a tool" });
const cards = (page) => page.locator(".card:visible");

test("an incoming Greek search opens its workshop and Clear removes it for reload", async ({ page }) => {
  await page.goto(`./?q=${encodeURIComponent("ΣΙΜΙΟ")}&audience=Ancient+world#catalogue`);
  await expect(search(page)).toHaveValue("ΣΙΜΙΟ");
  await expect(cards(page)).toHaveCount(1);
  await expect(page.locator('[data-project="gonia"] [data-workshop="ledger"] .workshop-demo')).toBeVisible();
  await expect(page.locator('[data-group="Ancient world"]')).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search(page)).toBeFocused();
  expect(new URL(page.url()).searchParams.has("q")).toBe(false);
  expect(new URL(page.url()).searchParams.has("audience")).toBe(false);
  await page.reload();
  await expect(search(page)).toHaveValue("");
  await expect(cards(page)).not.toHaveCount(1);
});

test("typing stays local and an explicit copied link restores both filters", async ({ page }) => {
  await page.goto("./");
  await expect(search(page)).toBeVisible();
  const original = page.url(),
    requests = [];
  page.on("request", (r) => {
    if (!["image", "font"].includes(r.resourceType())) requests.push(r.url());
  });
  await search(page).fill("minore pressura");
  await page.locator('[data-group="Ancient world"]').click();
  expect(page.url()).toBe(original);
  expect(requests).toEqual([]);
  // Rejecting clipboard permission must leave an ordinary selectable link.
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(Error("denied")) },
    }),
  );
  await page.getByRole("button", { name: "Copy search link" }).click();
  const field = page.getByRole("textbox", { name: "Search and audience link" });
  await expect(field).toBeFocused();
  const url = new URL(await field.inputValue());
  expect(url.searchParams.get("q")).toBe("minore pressura");
  expect(url.searchParams.get("audience")).toBe("Ancient world");
  await expect(page.locator("#filter-link-status")).toContainText("Copy the selected link");
  expect(await page.evaluate(() => Object.values(localStorage))).not.toContain("minore pressura");
  await page.goto(url.href);
  await expect(search(page)).toHaveValue("minore pressura");
  await expect(page.locator('[data-workshop="calix"] .workshop-demo')).toBeVisible();
});

test("ambiguous or unknown filters reset together and markup is literal", async ({ page }) => {
  for (const query of ["q=pressura&q=Σιμίο", "q=pressura&audience=Unknown", `q=${"x".repeat(513)}`]) {
    await page.goto(`./?${query}`);
    await expect(search(page)).toHaveValue("");
    await expect(page.locator("#shared-filter-note")).toBeVisible();
    await expect(page.locator('[data-group=""]')).toHaveAttribute("aria-pressed", "true");
  }
  const literal = '<img src=x onerror="window.injected=true">';
  await page.goto(`./?q=${encodeURIComponent(literal)}`);
  await expect(search(page)).toHaveValue(literal);
  await expect(cards(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});
