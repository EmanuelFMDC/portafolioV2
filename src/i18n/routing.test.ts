import { describe, expect, it } from "vitest";
import { routing } from "./routing";
import { switchLocalePath } from "./switch-locale-path";

describe("routing", () => {
  it("define es por defecto sin prefijo y en con prefijo", () => {
    expect(routing.locales).toEqual(["es", "en"]);
    expect(routing.defaultLocale).toBe("es");
    expect(routing.localePrefix).toBe("as-needed");
  });

  it("no redirige por Accept-Language", () => {
    expect(routing.localeDetection).toBe(false);
  });
});

describe("switchLocalePath", () => {
  it("pasa de español a inglés conservando la ruta", () => {
    expect(switchLocalePath("/proyectos/marketplace-renta", "en")).toBe(
      "/en/proyectos/marketplace-renta",
    );
  });

  it("pasa de inglés a español quitando el prefijo", () => {
    expect(switchLocalePath("/en/proyectos/marketplace-renta", "es")).toBe(
      "/proyectos/marketplace-renta",
    );
  });

  it("maneja la raíz en ambos sentidos", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/en", "es")).toBe("/");
  });
});
