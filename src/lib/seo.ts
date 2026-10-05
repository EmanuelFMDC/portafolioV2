import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { getSiteUrl } from "./site-url";

const OG_LOCALE: Record<Locale, string> = { es: "es_MX", en: "en_US" };
const LANGUAGE: Record<Locale, string> = { es: "es-MX", en: "en" };
const OG_ALT = "Emanuel Frías, Frontend Developer";
const JOB_TITLE: Record<Locale, string> = {
  es: "Desarrollador Frontend",
  en: "Frontend Developer",
};

// "/" es el home; el español no lleva prefijo y el inglés lleva /en.
export function absoluteUrl(locale: Locale, path: string): string {
  const prefix = locale === "es" ? "" : "/en";
  const rest = path === "/" ? "" : path;
  return `${getSiteUrl()}${prefix}${rest}`;
}

type BuildMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(locale, path);
  const image = `${getSiteUrl()}/opengraph-image`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "es-MX": absoluteUrl("es", path),
        en: absoluteUrl("en", path),
        "x-default": absoluteUrl("es", path),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: site.name,
      locale: OG_LOCALE[locale],
      images: [{ url: image, width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function personJsonLd(locale: Locale): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.fullName,
    jobTitle: JOB_TITLE[locale],
    url: absoluteUrl(locale, "/"),
    email: site.email,
    sameAs: [site.links.linkedin, site.links.github],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    knowsAbout: site.stack.flatMap((group) => group.items),
  };
}

export function websiteJsonLd(locale: Locale): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.name} | ${JOB_TITLE[locale]}`,
    url: absoluteUrl(locale, "/"),
    inLanguage: LANGUAGE[locale],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Evita que un "</script>" dentro de los datos cierre la etiqueta.
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
