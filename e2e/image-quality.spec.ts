import { expect, test } from "@playwright/test";

type Served = { w: number; q: number; css: number };

async function served(img: import("@playwright/test").Locator): Promise<Served> {
  await img.scrollIntoViewIfNeeded();
  await img.evaluate((node) => (node as HTMLImageElement).decode());
  return img.evaluate((node) => {
    const el = node as HTMLImageElement;
    const url = new URL(el.currentSrc);
    return {
      w: Number(url.searchParams.get("w")),
      q: Number(url.searchParams.get("q")),
      css: el.getBoundingClientRect().width,
    };
  });
}

test.describe("calidad de las imágenes de proyectos", () => {
  test("pantalla 1x: el archivo es al menos 1.4x el tamaño mostrado y de alta calidad", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto("/");
    const cards = page.locator("#proyectos li");
    for (let i = 0; i < 4; i++) {
      const s = await served(cards.nth(i).locator("img"));
      expect(s.w / s.css, `tarjeta ${i} sobremuestreo 1x`).toBeGreaterThanOrEqual(1.4);
      expect(s.q, `tarjeta ${i} calidad`).toBeGreaterThanOrEqual(90);
    }
    await context.close();
  });

  test("pantalla 2x: el archivo cubre los píxeles físicos (salvo que el original sea menor)", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto("/proyectos/plataforma-reparaciones");
    const s = await served(page.locator("main img").first());
    // El original mide 1600 px: el tope es el propio original.
    expect(s.w).toBeGreaterThanOrEqual(Math.min(s.css * 2, 1600) * 0.95);
    expect(s.q).toBeGreaterThanOrEqual(90);
    await context.close();
  });

  test("el optimizador sirve AVIF cuando el navegador lo acepta", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("#proyectos li").first().locator("img");
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((n) => (n as HTMLImageElement).decode());
    const src = await img.evaluate((n) => (n as HTMLImageElement).currentSrc);
    expect(src).toContain("/_next/image");
    const res = await page.request.get(src, { headers: { accept: "image/avif,image/webp,image/*" } });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/avif");
  });
});
