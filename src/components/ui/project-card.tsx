import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content/projects";
import { Link } from "@/i18n/navigation";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations();
  const copy = {
    title: t(`projects.${project.slug}.title`),
    summary: t(`projects.${project.slug}.summary`),
    role: t(`projects.${project.slug}.role`),
    imageAlt: t(`projects.${project.slug}.imageAlt`),
  };

  return (
    <li
      style={{ "--stack-top": `${5 + index}rem` } as CSSProperties}
      className="group relative grid overflow-hidden rounded-2xl border border-border bg-surface lg:sticky lg:top-(--stack-top) lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="order-2 flex flex-col justify-between gap-8 p-6 sm:p-8 lg:order-1 lg:p-10">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm text-accent">{copy.role}</p>
          <h3 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            <Link
              href={`/proyectos/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {copy.title}
            </Link>
          </h3>
          <p className="max-w-[44ch] text-pretty text-muted">{copy.summary}</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </div>
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-2 font-mono text-sm text-fg transition-colors group-hover:text-accent"
          >
            {t("projectsSection.viewCase")}
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>

      {/* Móvil: la imagen llena el ancho (16:10). Escritorio: se muestra completa, sin recorte, con margen. */}
      <div className="order-1 aspect-[16/10] overflow-hidden border-b border-border lg:order-2 lg:flex lg:aspect-auto lg:items-center lg:border-b-0 lg:border-l lg:p-8">
        <div className="h-full w-full overflow-hidden lg:h-auto lg:rounded-xl lg:border lg:border-border">
          <Image
            src={project.image}
            width={project.imageSize.width}
            height={project.imageSize.height}
            alt={copy.imageAlt}
            fetchPriority="low"
            sizes="(min-width: 1024px) 520px, 100vw"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] lg:h-auto"
          />
        </div>
      </div>
    </li>
  );
}
