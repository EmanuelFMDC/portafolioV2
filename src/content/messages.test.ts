import { describe, expect, it } from "vitest";
import en from "./en/messages.json";
import es from "./es/messages.json";

function flatten(value: unknown, prefix = ""): Record<string, unknown> {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (acc, [key, child]) => ({
        ...acc,
        ...flatten(child, prefix ? `${prefix}.${key}` : key),
      }),
      {},
    );
  }
  return { [prefix]: value };
}

describe("messages", () => {
  const flatEs = flatten(es);
  const flatEn = flatten(en);

  it("es y en tienen exactamente las mismas claves", () => {
    expect(Object.keys(flatEn).sort()).toEqual(Object.keys(flatEs).sort());
  });

  it("ningún valor está vacío", () => {
    for (const [locale, flat] of [["es", flatEs], ["en", flatEn]] as const) {
      for (const [key, value] of Object.entries(flat)) {
        const empty = typeof value === "string" && value.trim() === "";
        expect(empty, `${locale}.${key} está vacío`).toBe(false);
      }
    }
  });
});
