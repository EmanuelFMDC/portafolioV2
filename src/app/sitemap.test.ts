import { describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

const SITE = "https://emanuelfmdc.vercel.app";

describe("sitemap", () => {
  const entries = sitemap();

  it("tiene 10 entradas: 2 idiomas x (home + 4 casos)", () => {
    expect(entries).toHaveLength(10);
    expect(new Set(entries.map((e) => e.url)).size).toBe(10);
  });

  it("cada entrada declara alternates es-MX y en", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages?.["es-MX"], entry.url).toBeTruthy();
      expect(entry.alternates?.languages?.en, entry.url).toBeTruthy();
    }
  });

  it("incluye el home en ambos idiomas y un caso en inglés", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(SITE);
    expect(urls).toContain(`${SITE}/en`);
    expect(urls).toContain(`${SITE}/en/proyectos/marketplace-renta`);
  });
});

describe("robots", () => {
  it("permite todo y referencia el sitemap", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE}/sitemap.xml`);
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  });
});
