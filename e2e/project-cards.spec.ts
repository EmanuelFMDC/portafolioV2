import { expect, test } from "@playwright/test";

test("en escritorio las imágenes de las tarjetas no se recortan y tienen margen lateral", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cards = page.locator("#proyectos li");
  await expect(cards).toHaveCount(4);

  for (let i = 0; i < 4; i++) {
    const card = cards.nth(i);
    const image = card.locator("img");
    await image.scrollIntoViewIfNeeded();
    const { natural, shown, cardBox } = await image.evaluate((node) => {
      const img = node as HTMLImageElement;
      const r = img.getBoundingClientRect();
      const c = img.closest("li")!.getBoundingClientRect();
      return {
        natural: img.naturalWidth / img.naturalHeight,
        shown: r.width / r.height,
        cardBox: { left: c.left, right: c.right, imgLeft: r.left, imgRight: r.right },
      };
    });
    // Sin recorte: la proporción mostrada coincide con la del archivo (2 % de margen).
    expect(Math.abs(shown / natural - 1), `tarjeta ${i} recortada`).toBeLessThan(0.02);
    // Margen visible entre la imagen y el borde derecho de la tarjeta.
    expect(cardBox.right - cardBox.imgRight, `tarjeta ${i} pegada al borde`).toBeGreaterThanOrEqual(16);
  }
});

test("en móvil la imagen sigue ocupando todo el ancho de la tarjeta", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const image = page.locator("#proyectos li").first().locator("img");
  await image.scrollIntoViewIfNeeded();
  const widths = await image.evaluate((node) => ({
    img: node.getBoundingClientRect().width,
    card: node.closest("li")!.getBoundingClientRect().width,
  }));
  expect(Math.abs(widths.card - widths.img)).toBeLessThanOrEqual(2);
});
