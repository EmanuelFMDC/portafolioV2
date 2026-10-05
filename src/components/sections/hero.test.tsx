import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/content/en/messages.json";
import es from "@/content/es/messages.json";
import { site } from "@/content/site";
import { Hero } from "./hero";

function renderHero(locale: "es" | "en") {
  const messages = locale === "es" ? es : en;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Hero />
    </NextIntlClientProvider>,
  );
}

describe("Hero", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  it("tiene un único h1 con el nombre", () => {
    renderHero("es");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Emanuel");
    expect(headings[0]).toHaveTextContent("Frías");
  });

  it("el enlace al CV apunta al PDF del idioma activo y se descarga", () => {
    renderHero("en");
    const link = screen.getByRole("link", { name: en.hero.ctaCv });
    expect(link).toHaveAttribute("href", site.cv.en);
    expect(link).toHaveAttribute("download");
  });

  it("en español el CV es el PDF en español", () => {
    renderHero("es");
    expect(screen.getByRole("link", { name: es.hero.ctaCv })).toHaveAttribute(
      "href",
      site.cv.es,
    );
  });

  it("Ver proyectos enlaza al ancla de proyectos", () => {
    renderHero("es");
    expect(
      screen.getByRole("link", { name: es.hero.ctaProjects }),
    ).toHaveAttribute("href", "#proyectos");
  });

  it("las tres cifras están en el DOM inicial con su valor final", () => {
    renderHero("es");
    const stats = screen.getByRole("list", { name: es.hero.factsLabel });
    expect(within(stats).getByText("4+")).toBeInTheDocument();
    expect(within(stats).getByText("25+")).toBeInTheDocument();
    expect(within(stats).getByText("50+")).toBeInTheDocument();
  });

  it("el subtítulo no pasa de 20 palabras y no usa guiones largos", () => {
    for (const [locale, messages] of [["es", es], ["en", en]] as const) {
      const { unmount } = renderHero(locale);
      const words = messages.hero.subtitle.trim().split(/\s+/).length;
      expect(words, `${locale} subtitle`).toBeLessThanOrEqual(20);
      expect(document.body.textContent).not.toMatch(/[—–]/);
      unmount();
    }
  });

  it("las imágenes reales del hero tienen alt descriptivo", () => {
    renderHero("es");
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(2);
    for (const image of images) expect(image).toHaveAccessibleName();
  });
});
