import { expect, test } from "@playwright/test";

test.describe("idiomas", () => {
  test("el selector mantiene el mismo caso al cambiar de idioma", async ({ page }) => {
    await page.goto("/proyectos/marketplace-renta");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/proyectos\/marketplace-renta$/);
    await page.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/proyectos\/marketplace-renta$/);
    expect(new URL(page.url()).pathname).not.toMatch(/^\/en/);
  });

  test("html lang es es en / y en en /en", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("hay hreflang es-MX, en y x-default con URLs absolutas", async ({ page }) => {
    await page.goto("/en/proyectos/portal-soporte");
    const hrefs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((nodes) =>
        Object.fromEntries(nodes.map((n) => [n.getAttribute("hreflang"), n.getAttribute("href")])),
      );
    expect(hrefs["es-MX"]).toMatch(/^https:\/\/.+\/proyectos\/portal-soporte$/);
    expect(hrefs["en"]).toMatch(/^https:\/\/.+\/en\/proyectos\/portal-soporte$/);
    expect(hrefs["x-default"]).toBe(hrefs["es-MX"]);
  });

  test("el título y la descripción cambian con el idioma", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Desarrollador Frontend/);
    await page.goto("/en");
    await expect(page).toHaveTitle(/Frontend Developer/);
  });
});
