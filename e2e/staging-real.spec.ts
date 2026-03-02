import { expect, test } from "@playwright/test";

test.describe("staging real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("home, products and cart load without blocking errors", async ({ page }) => {
    const homeResponse = await page.goto("/");
    expect(homeResponse).not.toBeNull();
    const cspHeader = homeResponse?.headers()["content-security-policy"] ?? "";
    expect(cspHeader).toContain("default-src 'self'");

    if (process.env.STAGING_EXPECT_NONCE_CSP === "true") {
      expect(cspHeader).toContain("script-src 'self' 'nonce-");
      expect(cspHeader).not.toContain("'unsafe-inline'");
    }

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.getByRole("heading", { name: /Tu selección/i })).toBeVisible();
  });
});
