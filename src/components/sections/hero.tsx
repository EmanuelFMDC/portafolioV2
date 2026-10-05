import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowsLeftRight, Code, DeviceMobile } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "@/components/motion/magnetic";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";

// Los iconos solo se ven en móvil, donde las cifras son tarjetas.
const FACT_ICONS = {
  years: Code,
  screens: DeviceMobile,
  endpoints: ArrowsLeftRight,
} as const;

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  return (
    <section>
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-16">
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <Reveal as="p" on="load" className="font-mono text-sm text-accent">
            {t("availability")}
          </Reveal>

          <Reveal as="h1" on="load" delay={0.08} className="font-display leading-[0.98] tracking-tight text-(length:--text-hero)">
            <span className="block">Emanuel</span>
            <span className="block italic">Frías</span>
          </Reveal>

          <Reveal as="p" on="load" delay={0.16} className="max-w-[46ch] text-pretty text-muted">
            {t("subtitle")}
          </Reveal>

          <Reveal on="load" delay={0.24} className="flex flex-wrap items-center gap-3">
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
            src="/img/proyectos/marketplace/anfitrion-resumen.jpg"
            width={900}
            height={1876}
            loading="eager"
            fetchPriority="high"
            quality={85}
            sizes="(min-width: 1024px) 260px, 45vw"
            alt={t("imageAlt.marketplace")}
            className="absolute left-0 top-0 h-auto w-[58%] rounded-2xl border border-border"
          />
          <Image
            src="/img/proyectos/reparaciones/proveedor-estadisticas.jpg"
            width={900}
            height={1876}
            loading="eager"
            fetchPriority="low"
            quality={85}
            sizes="(min-width: 1024px) 230px, 40vw"
            alt={t("imageAlt.repairs")}
            className="absolute bottom-0 right-0 h-auto w-[52%] rounded-2xl border border-border"
          />
        </div>
      </div>

      <div className="border-t border-border">
        <ul
          aria-label={t("factsLabel")}
          className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10"
        >
          {site.facts.map((fact) => {
            const Icon = FACT_ICONS[fact.id];
            return (
              <li
                key={fact.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:gap-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
              >
                <Icon aria-hidden="true" size={24} className="text-accent sm:hidden" />
                <span className="font-display text-5xl leading-none">
                  <CountUp to={fact.value} suffix={fact.suffix} />
                </span>
                <span className="text-xs leading-snug text-muted sm:text-sm">
                  {t(`facts.${fact.id}`)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
