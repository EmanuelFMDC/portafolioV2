import { expect, test } from "@playwright/test";

const WIDTHS = [320, 360, 768, 1280, 1920];
const PAGES = ["/", "/en", "/proyectos/plataforma-reparaciones"];

for (const width of WIDTHS) {
  for (const path of PAGES) {
    test(`sin scroll horizontal a ${width}px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.waitForLoadState("load");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("el hero entra en el viewport con los botones visibles (1280x720)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Ver proyectos" })).toBeInViewport();
  await expect(page.getByRole("link", { name: "Descargar CV" }).first()).toBeInViewport();
});

test.describe("sin animaciones", () => {
  test.use({ reducedMotion: "reduce" });

  test("con reduced motion el hero y las cifras tienen su valor final", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const facts = page.getByRole("list", { name: "Cifras clave" });
    for (const value of ["4+", "25+", "50+"]) await expect(facts).toContainText(value);
  });
});

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("el contenido sigue visible y completo", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver proyectos" })).toBeVisible();
    const facts = page.getByRole("list", { name: "Cifras clave" });
    for (const value of ["4+", "25+", "50+"]) await expect(facts).toContainText(value);
    await expect(page.locator("section#proyectos")).toContainText("Marketplace de renta");
  });
});
