import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";

export function Freelance() {
  const t = useTranslations("freelance");

  return (
    <section id="freelance" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading>{t("title")}</SectionHeading>
        <p className="-mt-6 mb-12 max-w-[55ch] text-pretty text-muted lg:-mt-10 lg:mb-16">
          {t("intro")}
        </p>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-x-10">
          {site.freelanceSites.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block md:even:mt-16"
            >
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src={item.image}
                  width={1440}
                  height={900}
                  alt={t("imageAlt", { name: item.name })}
                  fetchPriority="low"
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <span className="mt-4 flex items-center justify-between gap-4">
                <span className="font-display text-3xl leading-tight">{item.name}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1 font-mono text-sm text-muted transition-colors group-hover:text-accent"
                >
                  {t("visit")}
                  <ArrowUpRight size={18} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
