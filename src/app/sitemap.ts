import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

const PATHS = ["/", ...projects.map((project) => `/proyectos/${project.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      alternates: {
        languages: {
          "es-MX": absoluteUrl("es", path),
          en: absoluteUrl("en", path),
        },
      },
    })),
  );
}
