import { act, render, screen } from "@testing-library/react";
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

  describe("al entrar en pantalla", () => {
    let trigger: (isIntersecting: boolean) => void = () => {};
    const observe = vi.fn();

    function stubObserver() {
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
            trigger = (isIntersecting) => callback([{ isIntersecting }]);
          }
          observe = observe;
          disconnect = vi.fn();
        },
      );
    }

    afterEach(() => {
      vi.useRealTimers();
      observe.mockClear();
    });

    it("no anima mientras no es visible: conserva el valor final", async () => {
      stubReducedMotion(false);
      stubObserver();
      render(<CountUp to={25} suffix="+" />);
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(observe).toHaveBeenCalledTimes(1);
      expect(screen.getByText("25+")).toBeInTheDocument();
    });

    it("al hacerse visible cuenta desde cero y termina en el valor final", () => {
      vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
      stubReducedMotion(false);
      stubObserver();
      const { container } = render(<CountUp to={25} suffix="+" />);
      const node = container.querySelector("span") as HTMLElement;

      act(() => trigger(true));
      act(() => {
        vi.advanceTimersByTime(120);
      });
      expect(node.textContent).not.toBe("25+");
      expect(parseInt(node.textContent ?? "", 10)).toBeLessThan(25);

      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(node.textContent).toBe("25+");
    });
  });
});
