import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "./reveal";

describe("Reveal", () => {
  it("renderiza el contenido con la etiqueta pedida", () => {
    render(<Reveal as="h1">Hola</Reveal>);
    expect(screen.getByRole("heading", { level: 1, name: "Hola" })).toBeInTheDocument();
  });

  it("por defecto anima con el scroll mediante CSS", () => {
    render(<Reveal>texto</Reveal>);
    expect(screen.getByText("texto")).toHaveClass("reveal-scroll");
  });

  it("en modo load usa la animación de entrada y expone el retraso como variable CSS", () => {
    render(
      <Reveal on="load" delay={0.24}>
        texto
      </Reveal>,
    );
    const node = screen.getByText("texto");
    expect(node).toHaveClass("reveal-load");
    expect(node.style.getPropertyValue("--reveal-delay")).toBe("0.24s");
  });

  it("nunca oculta el contenido con estilos en línea (visible sin JS)", () => {
    render(<Reveal on="load" delay={1}>texto</Reveal>);
    const style = screen.getByText("texto").getAttribute("style") ?? "";
    expect(style).not.toMatch(/opacity|visibility|display/);
  });
});
