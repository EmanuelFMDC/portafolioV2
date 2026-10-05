import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";

const PILL =
  "inline-flex min-h-12 items-center rounded-full border border-border px-6 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent active:scale-[0.98]";

export function Contact() {
  const t = useTranslations("contact");
  const hero = useTranslations("hero");
  const locale = useLocale() as Locale;

  return (
    <section id="contacto" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading>{t("title")}</SectionHeading>
        <p className="max-w-[48ch] text-pretty text-muted">{t("lead")}</p>

        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-block font-display text-[clamp(1.75rem,6.5vw,5.5rem)] leading-[1.05] underline decoration-border underline-offset-8 transition-colors [overflow-wrap:anywhere] hover:text-accent hover:decoration-accent"
        >
          {site.email}
        </a>

        <div className="mt-12 flex flex-wrap gap-3">
          <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={PILL}>
            LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={PILL}>
            GitHub
          </a>
          <a href={site.cv[locale]} download className={PILL}>
            {hero("ctaCv")}
          </a>
        </div>
      </div>
    </section>
  );
}
