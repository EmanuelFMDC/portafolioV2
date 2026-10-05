import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, buildMetadata, personJsonLd, websiteJsonLd } from "./seo";

const SITE = "https://emanuelfmdc.vercel.app";

describe("buildMetadata", () => {
  it("el canonical en inglés de un caso lleva el prefijo /en", () => {
    const meta = buildMetadata({
      locale: "en",
      path: "/proyectos/portal-soporte",
      title: "Support ticket portal",
      description: "Dashboard for tickets.",
    });
    expect(meta.alternates?.canonical).toBe(`${SITE}/en/proyectos/portal-soporte`);
  });

  it("x-default apunta a la URL en español y hay es-MX y en", () => {
    const meta = buildMetadata({
      locale: "en",
      path: "/proyectos/portal-soporte",
      title: "t",
      description: "d",
    });
    expect(meta.alternates?.languages).toEqual({
      "es-MX": `${SITE}/proyectos/portal-soporte`,
      en: `${SITE}/en/proyectos/portal-soporte`,
      "x-default": `${SITE}/proyectos/portal-soporte`,
    });
  });

  it("el home en español no lleva prefijo ni barra final", () => {
    const meta = buildMetadata({ locale: "es", path: "/", title: "t", description: "d" });
    expect(meta.alternates?.canonical).toBe(SITE);
    expect(meta.alternates?.languages).toMatchObject({ en: `${SITE}/en` });
  });

  it("incluye Open Graph con el locale correcto y tarjeta grande de Twitter", () => {
    const es = buildMetadata({ locale: "es", path: "/", title: "t", description: "d" });
    const en = buildMetadata({ locale: "en", path: "/", title: "t", description: "d" });
    expect(es.openGraph).toMatchObject({ locale: "es_MX", url: SITE, title: "t" });
    expect(en.openGraph).toMatchObject({ locale: "en_US", url: `${SITE}/en` });
    expect(es.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("imagen social", () => {
  it("Open Graph y Twitter apuntan a la imagen OG de 1200x630 con alt", () => {
    const meta = buildMetadata({ locale: "en", path: "/", title: "t", description: "d" });
    expect(meta.openGraph?.images).toEqual([
      { url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "Emanuel Frías, Frontend Developer" },
    ]);
    expect(meta.twitter?.images).toEqual([`${SITE}/opengraph-image`]);
  });
});

describe("JSON-LD", () => {
  it("Person no incluye teléfono y enlaza LinkedIn y GitHub", () => {
    const person = personJsonLd("es") as Record<string, unknown>;
    expect(person["@type"]).toBe("Person");
    expect(person).not.toHaveProperty("telephone");
    expect(JSON.stringify(person)).not.toMatch(/\+52|2479/);
    expect(person.sameAs).toEqual([
      "https://linkedin.com/in/emanuelfmdc",
      "https://github.com/EmanuelFMDC",
    ]);
    expect(person.email).toBe("emanuelfmdc23@gmail.com");
  });

  it("el cargo de Person cambia con el idioma", () => {
    expect((personJsonLd("es") as { jobTitle: string }).jobTitle).toBe("Desarrollador Frontend");
    expect((personJsonLd("en") as { jobTitle: string }).jobTitle).toBe("Frontend Developer");
  });

  it("WebSite declara el idioma de la página", () => {
    expect((websiteJsonLd("en") as { inLanguage: string }).inLanguage).toBe("en");
    expect((websiteJsonLd("es") as { inLanguage: string }).inLanguage).toBe("es-MX");
  });

  it("BreadcrumbList numera las posiciones desde 1", () => {
    const crumbs = breadcrumbJsonLd([
      { name: "Home", url: SITE },
      { name: "Caso", url: `${SITE}/proyectos/x` },
    ]) as { itemListElement: { position: number; name: string; item: string }[] };
    expect(crumbs.itemListElement.map((c) => c.position)).toEqual([1, 2]);
    expect(crumbs.itemListElement[1]).toMatchObject({ name: "Caso", item: `${SITE}/proyectos/x` });
  });
});
