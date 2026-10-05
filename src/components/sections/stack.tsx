import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";

export function Stack() {
  const t = useTranslations("stack");

  return (
    <section id="stack" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading>{t("title")}</SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.stack.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="font-mono text-sm text-accent">{t(`groups.${group.id}`)}</h3>
              <p className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-fg"
                  >
                    {item}
                  </span>
                ))}
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-accent p-6">
            <h3 className="font-mono text-sm text-accent">{t("learning")}</h3>
            <p className="mt-4 flex flex-wrap gap-2">
              {site.learning.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-accent px-3 py-1 font-mono text-xs text-fg"
                >
                  {item}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
