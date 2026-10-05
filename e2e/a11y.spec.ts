import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/en", "/proyectos/marketplace-renta", "/en/proyectos/portal-soporte"];
const THEMES = ["dark", "light"] as const;

// Se audita el estado final: las animaciones de entrada dan lecturas de contraste a medias.
test.use({ reducedMotion: "reduce" });

for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`sin violaciones graves de accesibilidad: ${path} (${theme})`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`),
      ).toEqual([]);
    });
  }
}
