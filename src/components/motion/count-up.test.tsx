import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "./count-up";

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("CountUp", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renderiza el valor final en el primer render", () => {
    stubReducedMotion(false);
    render(<CountUp to={25} suffix="+" />);
    expect(screen.getByText("25+")).toBeInTheDocument();
  });

  it("con reduced motion nunca cambia el valor mostrado", async () => {
    stubReducedMotion(true);
    render(<CountUp to={50} suffix="+" />);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText("50+")).toBeInTheDocument();
  });
});
