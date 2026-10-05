import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("devuelve el dominio por defecto sin variable de entorno", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://emanuelfmdc.vercel.app");
  });

  it("usa NEXT_PUBLIC_SITE_URL sin la barra final", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://x.dev/");
    expect(getSiteUrl()).toBe("https://x.dev");
  });
});
