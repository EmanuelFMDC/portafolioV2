import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProject, getProjectContent } from "@/lib/projects";

type CasePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const PROSE =
  "[&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight sm:[&_h2]:text-4xl " +
  "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-mono [&_h3]:text-sm [&_h3]:text-accent " +
  "[&_p]:my-4 [&_p]:max-w-[65ch] [&_p]:text-pretty [&_p]:text-muted " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-2 [&_li]:max-w-[65ch] [&_li]:text-muted " +
  "[&_strong]:font-medium [&_strong]:text-fg";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export default async function CasePage({ params }: CasePageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const Content = await getProjectContent(locale, slug);
  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="contenido" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <Link
        href="/#proyectos"
        className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        {t("caseStudy.back")}
      </Link>

      <h1 className="mt-8 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
        {t(`projects.${slug}.title`)}
      </h1>
      <p className="mt-6 max-w-[55ch] text-pretty text-lg text-muted">
        {t(`projects.${slug}.summary`)}
      </p>

      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-[auto_1fr] sm:gap-x-12">
        <div>
          <dt className="font-mono text-sm text-accent">{t("caseStudy.role")}</dt>
          <dd className="mt-1">{t(`projects.${slug}.role`)}</dd>
        </div>
        <div>
          <dt className="font-mono text-sm text-accent">{t("caseStudy.stack")}</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <Image
        src={project.image}
        width={project.imageSize.width}
        height={project.imageSize.height}
        alt={t(`projects.${slug}.imageAlt`)}
        priority
        sizes="(min-width: 768px) 768px, 100vw"
        className="mt-10 h-auto w-full rounded-2xl border border-border"
      />

      <div className={PROSE}>
        <Content />
      </div>

      <nav
        aria-label={t("caseStudy.next")}
        className="mt-16 border-t border-border pt-8"
      >
        <Link
          href={`/proyectos/${next.slug}`}
          className="group inline-flex flex-col gap-2"
        >
          <span className="font-mono text-sm text-accent">{t("caseStudy.next")}</span>
          <span className="inline-flex items-center gap-3 font-display text-3xl transition-colors group-hover:text-accent sm:text-4xl">
            {t(`projects.${next.slug}.title`)}
            <ArrowRight size={28} aria-hidden="true" />
          </span>
        </Link>
      </nav>
    </main>
  );
}
