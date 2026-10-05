import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Magnetic } from "@/components/motion/magnetic";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  return (
    <section>
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-16">
        <div className="flex flex-col items-start gap-8">
          <Reveal as="p" className="font-mono text-sm text-accent">
            {t("availability")}
          </Reveal>

          <Reveal as="h1" delay={0.08} className="font-display leading-[0.98] tracking-tight text-(length:--text-hero)">
            <span className="block">Emanuel</span>
            <span className="block italic">Frías</span>
          </Reveal>

          <Reveal as="p" delay={0.16} className="max-w-[46ch] text-pretty text-muted">
            {t("subtitle")}
          </Reveal>

          <Reveal delay={0.24} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#proyectos"
                className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-mono text-sm text-bg transition-transform active:scale-[0.98]"
              >
                {t("ctaProjects")}
              </a>
            </Magnetic>
            <a
              href={site.cv[locale]}
              download
              className="inline-flex min-h-12 items-center rounded-full border border-border px-7 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              {t("ctaCv")}
            </a>
          </Reveal>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-none">
          <Image
            src="/proyectos/marketplace/anfitrion-resumen.jpg"
            width={900}
            height={1876}
            priority
            sizes="(min-width: 1024px) 260px, 45vw"
            alt={t("imageAlt.marketplace")}
            className="absolute left-0 top-0 h-auto w-[58%] rounded-2xl border border-border"
          />
          <Image
            src="/proyectos/reparaciones/proveedor-estadisticas.jpg"
            width={900}
            height={1876}
            priority
            sizes="(min-width: 1024px) 230px, 40vw"
            alt={t("imageAlt.repairs")}
            className="absolute bottom-0 right-0 h-auto w-[52%] rounded-2xl border border-border"
          />
        </div>
      </div>

      <div className="border-t border-border">
        <ul
          aria-label={t("factsLabel")}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6"
        >
          {site.facts.map((fact) => (
            <li key={fact.id} className="flex flex-col gap-1">
              <span className="font-display text-5xl leading-none">
                <CountUp to={fact.value} suffix={fact.suffix} />
              </span>
              <span className="text-sm text-muted">{t(`facts.${fact.id}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
