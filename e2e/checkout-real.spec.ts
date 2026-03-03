import { expect, test } from "@playwright/test";

test.describe("checkout real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("can add one product and reach checkout form without sending order", async ({ page }) => {
    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toContainText(/Cargando colección/i, { timeout: 20_000 });

    if (await main.getByText(/No se pudieron cargar los productos/i).isVisible()) {
      throw new Error("Catalogo no disponible en este entorno (error cargando productos).");
    }

    if (await main.getByText(/No hay resultados para esta búsqueda/i).isVisible()) {
      throw new Error("Catalogo sin productos publicos para ejecutar smoke de checkout.");
    }

    const addButtons = page.getByRole("button", { name: /Agregar al Carrito/i });
    await expect(addButtons.first()).toBeVisible({ timeout: 15_000 });
    await addButtons.first().click();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);

    const continueButton = page.getByRole("button", { name: /Continuar Compra/i });
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(page.getByRole("heading", { name: /Datos de Envío/i })).toBeVisible();
  });
});
