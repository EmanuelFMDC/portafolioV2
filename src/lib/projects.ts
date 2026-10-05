import type { ComponentType } from "react";
import { projects, type Project } from "@/content/projects";
import type { Locale } from "@/i18n/routing";

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export async function getProjectContent(
  locale: Locale,
  slug: string,
): Promise<ComponentType> {
  if (!getProject(slug)) throw new Error(`Proyecto desconocido: ${slug}`);
  const mod = await import(`@/content/${locale}/projects/${slug}.mdx`);
  return mod.default;
}
