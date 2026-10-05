import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

const labels = { toLight: "Cambiar a tema claro", toDark: "Cambiar a tema oscuro" };

function mockPrefersLight(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("light") ? matches : !matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });
  afterEach(() => vi.unstubAllGlobals());

  it("cambia de oscuro a claro y guarda la preferencia", async () => {
    mockPrefersLight(false);
    render(<ThemeToggle labels={labels} />);
    await userEvent.click(screen.getByRole("button", { name: labels.toLight }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("respeta prefers-color-scheme: light si no hay valor guardado", () => {
    mockPrefersLight(true);
    render(<ThemeToggle labels={labels} />);
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("expone aria-label y aria-pressed coherentes con el tema", async () => {
    mockPrefersLight(false);
    render(<ThemeToggle labels={labels} />);
    const button = screen.getByRole("button", { name: labels.toLight });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await act(async () => button.click());
    const back = screen.getByRole("button", { name: labels.toDark });
    expect(back).toHaveAttribute("aria-pressed", "true");
  });
});
