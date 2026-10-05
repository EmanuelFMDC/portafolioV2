import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";

const DETAILS = [
  { label: "location", value: "locationValue" },
  { label: "languages", value: "languagesValue" },
  { label: "education", value: "educationValue" },
] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="sobre-mi" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:py-28">
        <div>
          <SectionHeading>{t("title")}</SectionHeading>
          <p className="max-w-[48ch] text-pretty text-xl leading-relaxed sm:text-2xl">
            {t("bio")}
          </p>
        </div>

        <dl className="flex flex-col gap-6 self-end">
          {DETAILS.map(({ label, value }) => (
            <div key={label} className="border-t border-border pt-4">
              <dt className="font-mono text-sm text-accent">{t(label)}</dt>
              <dd className="mt-1 text-muted">{t(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
