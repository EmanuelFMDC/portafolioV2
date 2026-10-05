import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/content/en/messages.json";
import es from "@/content/es/messages.json";
import { site } from "@/content/site";
import { About } from "./about";
import { Contact } from "./contact";
import { Experience } from "./experience";
import { Freelance } from "./freelance";
import { Stack } from "./stack";

function renderIn(locale: "es" | "en", ui: ReactElement) {
  const messages = locale === "es" ? es : en;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("secciones del home", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  it("cada sección tiene el id al que apunta la navegación", () => {
    const cases: [ReactElement, string][] = [
      [<Experience key="e" />, "experiencia"],
      [<Stack key="s" />, "stack"],
      [<Freelance key="f" />, "freelance"],
      [<About key="a" />, "sobre-mi"],
      [<Contact key="c" />, "contacto"],
    ];
    for (const [ui, id] of cases) {
      const { container, unmount } = renderIn("es", ui);
      expect(container.querySelector(`section#${id}`), id).not.toBeNull();
      unmount();
    }
  });

  it("experiencia muestra ambos periodos exactos en español", () => {
    renderIn("es", <Experience />);
    expect(screen.getByText("01/2025 - 09/2026")).toBeInTheDocument();
    expect(screen.getByText("06/2022 - 12/2024")).toBeInTheDocument();
    expect(screen.getByText("Nahual Consultores")).toBeInTheDocument();
  });

  it("experiencia muestra los periodos en inglés", () => {
    renderIn("en", <Experience />);
    expect(screen.getByText("Jan 2025 - Sep 2026")).toBeInTheDocument();
    expect(screen.getByText("Jun 2022 - Dec 2024")).toBeInTheDocument();
  });

  it("stack lista todos los grupos y lo que se está aprendiendo", () => {
    renderIn("es", <Stack />);
    for (const group of site.stack) {
      for (const item of group.items) {
        expect(screen.getAllByText(item).length, item).toBeGreaterThan(0);
      }
    }
    for (const item of site.learning) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("freelance muestra 4 sitios con enlace externo seguro e imagen con alt", () => {
    renderIn("es", <Freelance />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    }
    for (const image of screen.getAllByRole("img")) {
      expect(image.getAttribute("alt")?.trim()).toBeTruthy();
    }
  });

  it("contacto enlaza al correo y no publica el teléfono", () => {
    const { container } = renderIn("es", <Contact />);
    const mail = screen.getByRole("link", { name: site.email });
    expect(mail).toHaveAttribute("href", `mailto:${site.email}`);
    expect(container.textContent).not.toMatch(/\+52|2479/);
    expect(container.innerHTML).not.toMatch(/tel:/);
  });

  it("contacto: enlaces externos seguros y CV descargable en el idioma activo", () => {
    renderIn("en", <Contact />);
    for (const name of ["LinkedIn", "GitHub"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    const cv = screen.getByRole("link", { name: en.hero.ctaCv });
    expect(cv).toHaveAttribute("href", site.cv.en);
    expect(cv).toHaveAttribute("download");
  });

  it("sobre mí menciona ubicación, inglés B1 y CETI sin guiones largos", () => {
    const { container } = renderIn("es", <About />);
    expect(within(container).getByText(/Guadalajara/)).toBeInTheDocument();
    expect(container.textContent).toMatch(/B1/);
    expect(container.textContent).toMatch(/CETI/);
    expect(container.textContent).toMatch(/2027/);
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("ninguna sección usa guiones largos en ningún idioma", () => {
    for (const locale of ["es", "en"] as const) {
      for (const ui of [<Experience key="e" />, <Stack key="s" />, <Freelance key="f" />, <About key="a" />, <Contact key="c" />]) {
        const { container, unmount } = renderIn(locale, ui);
        expect(container.textContent, locale).not.toMatch(/[—–]/);
        unmount();
      }
    }
  });
});
