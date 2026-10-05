import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/ui/project-card";
import { projects } from "@/content/projects";

export function Projects() {
  const t = useTranslations("projectsSection");

  return (
    <section id="proyectos" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 className="mb-12 font-display text-(length:--text-h2) leading-none lg:mb-16">
          {t("title")}
        </h2>
        <ul className="grid gap-6 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
