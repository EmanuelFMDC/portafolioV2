import { expect, test } from "@playwright/test";

test.describe("navegación", () => {
  test("el home carga con un solo h1 y las secciones principales", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const id of ["proyectos", "experiencia", "stack", "freelance", "sobre-mi", "contacto"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test("clic en un proyecto abre su caso de estudio", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Marketplace de renta/ }).click();
    await expect(page).toHaveURL(/\/proyectos\/marketplace-renta$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Marketplace de renta");
  });

  test("el caso enlaza al siguiente proyecto", async ({ page }) => {
    await page.goto("/proyectos/marketplace-renta");
    await page.getByRole("link", { name: /Siguiente proyecto/ }).click();
    await expect(page).toHaveURL(/\/proyectos\/plataforma-reparaciones$/);
  });

  test("rutas inexistentes responden 404 con la página de error", async ({ page }) => {
    for (const path of ["/proyectos/nada", "/en/proyectos/nada", "/fr", "/fr/proyectos/x"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 }), path).toContainText(/no encontrada|not found/i);
    }
  });

  test("el CV se descarga en el idioma de la página", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: "Download CV" }).first()).toHaveAttribute(
      "href",
      "/cv/CV_Emanuel_Frias_EN.pdf",
    );
  });
});
