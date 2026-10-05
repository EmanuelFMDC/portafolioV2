import { expect, test } from "@playwright/test";

test.describe("hero y cifras en móvil (390 px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
  });

  test("el nombre es grande y cabe sin desbordar", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    const size = await h1.evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
    expect(size).toBeGreaterThanOrEqual(88);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const box = await h1.locator("span").first().evaluate((n) => {
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      return { left: r.left, right: r.right };
    });
    expect(box.right).toBeLessThanOrEqual(390 - 12);
    expect(box.left).toBeGreaterThanOrEqual(8);
  });

  test("las tres cifras van en una sola fila, compactas y con icono", async ({ page }) => {
    const items = page.getByRole("list", { name: "Cifras clave" }).getByRole("listitem");
    await expect(items).toHaveCount(3);
    await items.first().scrollIntoViewIfNeeded();
    const boxes = await items.evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, width: r.width, svg: n.querySelectorAll("svg[aria-hidden='true']").length };
      }),
    );
    for (const b of boxes) {
      expect(Math.abs(b.top - boxes[0].top), "misma fila").toBeLessThanOrEqual(2);
      expect(b.width).toBeGreaterThanOrEqual(100);
      expect(b.svg, "icono decorativo").toBeGreaterThanOrEqual(1);
    }
    const height = Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.top));
    expect(height, "altura de la fila de cifras").toBeLessThanOrEqual(240);
  });

  test("las etiquetas de las cifras no se cortan ni desbordan su tarjeta", async ({ page }) => {
    const items = page.getByRole("list", { name: "Cifras clave" }).getByRole("listitem");
    await items.first().scrollIntoViewIfNeeded();
    const clipped = await items.evaluateAll((nodes) =>
      nodes.filter((n) => n.scrollWidth > n.clientWidth + 1 || n.scrollHeight > n.clientHeight + 1).length,
    );
    expect(clipped).toBe(0);
  });
});

test("en escritorio las cifras no cambian: tres columnas sin tarjeta", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const items = page.getByRole("list", { name: "Cifras clave" }).getByRole("listitem");
  const visibleIcons = await items.first().evaluate((n) =>
    [...n.querySelectorAll("svg")].filter((s) => getComputedStyle(s).display !== "none").length,
  );
  expect(visibleIcons).toBe(0);
});
