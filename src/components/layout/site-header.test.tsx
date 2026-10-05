import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import es from "@/content/es/messages.json";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function renderHeader() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <SiteHeader />
    </NextIntlClientProvider>,
  );
}

describe("SiteHeader", () => {
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

  it("expone una navegación principal con aria-label", () => {
    renderHeader();
    expect(
      screen.getByRole("navigation", { name: es.nav.main }),
    ).toBeInTheDocument();
  });

  it("enlaza a las cuatro secciones por ancla", () => {
    renderHeader();
    const nav = screen.getByRole("navigation", { name: es.nav.main });
    for (const id of ["proyectos", "experiencia", "stack", "contacto"]) {
      expect(nav.querySelector(`a[href="/#${id}"]`)).not.toBeNull();
    }
  });

  it("abre el menú móvil con Enter y lo cierra con Escape devolviendo el foco", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: es.nav.menu });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("al abrir el menú móvil el foco pasa al primer enlace (WCAG 2.4.3)", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: es.nav.menu });
    toggle.focus();
    await user.keyboard("{Enter}");
    const first = screen
      .getByRole("navigation", { name: es.nav.main })
      .querySelector("a") as HTMLAnchorElement;
    expect(first).toHaveAttribute("href", "/#proyectos");
    expect(first).toHaveFocus();
  });

  it("los controles táctiles miden al menos 44 px (h-11)", () => {
    renderHeader();
    const toggle = screen.getByRole("button", { name: es.nav.menu });
    expect(toggle.className).toMatch(/\bh-11\b/);
    expect(toggle.className).toMatch(/\bw-11\b/);
  });
});
