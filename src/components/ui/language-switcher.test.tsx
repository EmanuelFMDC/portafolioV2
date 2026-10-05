import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

const pathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => pathname() }));

describe("LanguageSwitcher", () => {
  beforeEach(() => pathname.mockReset());

  it("desde español enlaza al mismo caso en inglés", () => {
    pathname.mockReturnValue("/proyectos/marketplace-renta");
    render(<LanguageSwitcher current="es" label="Idioma" />);
    expect(screen.getByRole("link", { name: /english/i })).toHaveAttribute(
      "href",
      "/en/proyectos/marketplace-renta",
    );
  });

  it("desde inglés enlaza al mismo caso en español", () => {
    pathname.mockReturnValue("/en/proyectos/marketplace-renta");
    render(<LanguageSwitcher current="en" label="Language" />);
    expect(screen.getByRole("link", { name: /español/i })).toHaveAttribute(
      "href",
      "/proyectos/marketplace-renta",
    );
  });

  it("el nombre accesible incluye el texto visible (WCAG 2.5.3)", () => {
    pathname.mockReturnValue("/");
    render(<LanguageSwitcher current="es" label="Idioma" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(/\bEN\b/);
    expect(link).toHaveAccessibleName(/English/);
  });

  it("marca el idioma actual con aria-current", () => {
    pathname.mockReturnValue("/");
    render(<LanguageSwitcher current="es" label="Idioma" />);
    expect(screen.getByText("ES")).toHaveAttribute("aria-current", "true");
  });
});
