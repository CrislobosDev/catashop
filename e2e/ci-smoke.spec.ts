import { expect, test } from "@playwright/test";

test.describe("ci smoke", () => {
  test("core routes render without blocking errors", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Todo lo esencial para tu día a día/i })).toBeVisible();

    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Colección completa/i })).toBeVisible();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Tu selección/i })).toBeVisible();
  });
});
