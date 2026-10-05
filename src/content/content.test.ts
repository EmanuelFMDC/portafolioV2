import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "./en/messages.json";
import es from "./es/messages.json";
import { projects } from "./projects";
import { site } from "./site";

const root = process.cwd();
const publicFile = (path: string) => join(root, "public", path);
const locales = ["es", "en"] as const;
const messages = { es, en } as const;

describe("proyectos", () => {
  it("mantiene el orden y los slugs del spec", () => {
    expect(projects.map((p) => p.slug)).toEqual([
      "marketplace-renta",
      "plataforma-reparaciones",
      "portal-soporte",
      "automatizacion-facturacion",
    ]);
  });

  for (const project of projects) {
    for (const locale of locales) {
      it(`${project.slug} tiene caso MDX en ${locale}`, () => {
        const file = join(root, "src/content", locale, "projects", `${project.slug}.mdx`);
        expect(existsSync(file)).toBe(true);
      });

      it(`${project.slug} tiene título, resumen y rol en ${locale}`, () => {
        const entry = (
          messages[locale].projects as Record<
            string,
            { title: string; summary: string; role: string }
          >
        )[project.slug];
        expect(entry?.title).toBeTruthy();
        expect(entry?.summary).toBeTruthy();
        expect(entry?.role).toBeTruthy();
      });
    }

    it(`${project.slug} tiene imagen existente con tamaño`, () => {
      expect(existsSync(publicFile(project.image))).toBe(true);
      expect(project.imageSize.width).toBeGreaterThan(0);
      expect(project.imageSize.height).toBeGreaterThan(0);
    });
  }
});

describe("site", () => {
  it("usa los datos de contacto del spec y no publica el teléfono", () => {
    expect(site.email).toBe("emanuelfmdc23@gmail.com");
    expect(site.links.linkedin).toBe("https://linkedin.com/in/emanuelfmdc");
    expect(site.links.github).toBe("https://github.com/EmanuelFMDC");
    expect(JSON.stringify(site)).not.toMatch(/\+52|33 2479|2479 2413/);
  });

  it("los dos CV existen en public", () => {
    for (const locale of locales) {
      expect(existsSync(publicFile(site.cv[locale]))).toBe(true);
    }
  });

  it("los cuatro sitios freelance tienen captura existente y enlace https", () => {
    expect(site.freelanceSites).toHaveLength(4);
    for (const item of site.freelanceSites) {
      expect(existsSync(publicFile(item.image))).toBe(true);
      expect(item.url).toMatch(/^https:\/\//);
    }
  });
});

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    const isSource = /\.(tsx?|mdx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name);
    return isSource ? [full] : [];
  });
}

describe("imágenes referenciadas", () => {
  it("toda ruta /img/... escrita en el código o en los MDX existe en public", () => {
    const missing: string[] = [];
    let found = 0;
    for (const file of listSourceFiles(join(root, "src"))) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(/["`](\/img\/[^"`\s]+)["`]/g)) {
        found += 1;
        if (!existsSync(publicFile(match[1]))) missing.push(`${file}: ${match[1]}`);
      }
    }
    expect(found).toBeGreaterThan(20);
    expect(missing).toEqual([]);
  });
});

describe("contenido publicable", () => {
  it("ningún MDX ni archivo de datos contiene TODO", () => {
    const files = [
      join(root, "src/content/site.ts"),
      join(root, "src/content/projects.ts"),
      ...locales.flatMap((locale) => {
        const dir = join(root, "src/content", locale, "projects");
        return readdirSync(dir).map((name) => join(dir, name));
      }),
    ];
    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/TODO/);
    }
  });

  it("todo <Figure> y toda imagen de PhoneGallery declaran alt", () => {
    for (const locale of locales) {
      const dir = join(root, "src/content", locale, "projects");
      for (const name of readdirSync(dir)) {
        const text = readFileSync(join(dir, name), "utf8");
        const figures = text.match(/<Figure[\s\S]*?\/>/g) ?? [];
        for (const figure of figures) expect(figure, `${locale}/${name}`).toMatch(/alt="[^"]+"/);
        const images = text.match(/\{ src:[^}]*\}/g) ?? [];
        for (const image of images) expect(image, `${locale}/${name}`).toMatch(/alt: "[^"]+"/);
      }
    }
  });
});
