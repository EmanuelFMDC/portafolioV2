import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  // El hreflang ya se genera en la metadata de cada página.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
