"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";

const SECTIONS = [
  { id: "proyectos", key: "projects" },
  { id: "experiencia", key: "experience" },
  { id: "stack", key: "stack" },
  { id: "contacto", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header
      onKeyDown={onKeyDown}
      className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-xl leading-none">
          {site.name}
        </Link>

        <nav aria-label={t("nav.main")} className="md:flex md:flex-1 md:justify-center">
          <ul
            id="primary-nav"
            className={`${
              open ? "flex" : "hidden"
            } absolute inset-x-0 top-16 flex-col gap-1 border-b border-border bg-bg p-4 md:static md:flex md:flex-row md:gap-2 md:border-0 md:bg-transparent md:p-0`}
          >
            {SECTIONS.map(({ id, key }) => (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center rounded-full px-4 font-mono text-sm text-muted transition-colors hover:text-accent"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} label={t("common.language")} />
          <ThemeToggle labels={{ toLight: t("theme.toLight"), toDark: t("theme.toDark") }} />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={t("nav.menu")}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden"
          >
            <span aria-hidden="true" className="font-mono text-sm">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
