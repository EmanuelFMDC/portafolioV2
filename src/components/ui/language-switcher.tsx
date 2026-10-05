"use client";

import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { switchLocalePath } from "@/i18n/switch-locale-path";

const NAMES: Record<Locale, string> = { es: "Español", en: "English" };

type LanguageSwitcherProps = {
  current: Locale;
  label: string;
};

export function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1 font-mono text-sm">
      {routing.locales.map((locale) =>
        locale === current ? (
          <span
            key={locale}
            aria-current="true"
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-fg px-3 text-bg"
          >
            {locale.toUpperCase()}
          </span>
        ) : (
          <a
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-label={NAMES[locale]}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-muted transition-colors hover:text-accent"
          >
            {locale.toUpperCase()}
          </a>
        ),
      )}
    </nav>
  );
}
