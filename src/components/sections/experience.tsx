import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const JOBS = ["nahual", "freelance"] as const;

export function Experience() {
  const t = useTranslations("experience");

  return (
    <section id="experiencia" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading>{t("title")}</SectionHeading>

        <div>
          {JOBS.map((job) => (
            <Reveal
              key={job}
              as="article"
              className="grid gap-4 border-t border-border py-8 md:grid-cols-[14rem_1fr] md:gap-12"
            >
              <p className="font-mono text-sm text-muted">{t(`jobs.${job}.period`)}</p>
              <div>
                <h3 className="font-display text-3xl leading-tight sm:text-4xl">
                  {t(`jobs.${job}.company`)}
                </h3>
                <p className="mt-1 font-mono text-sm text-accent">{t(`jobs.${job}.role`)}</p>
                <ul className="mt-6 list-disc space-y-3 pl-5 text-muted marker:text-border">
                  {(t.raw(`jobs.${job}.highlights`) as string[]).map((line) => (
                    <li key={line} className="max-w-[65ch] text-pretty">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
