import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Freelance } from "@/components/sections/freelance";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { routing } from "@/i18n/routing";
import { buildMetadata, jsonLdString, personJsonLd, websiteJsonLd } from "@/lib/seo";

type HomeProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("home.title"),
    description: t("home.description"),
  });
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <main id="contenido">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd(locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd(locale)) }}
      />
      <Hero />
      <Projects />
      <Experience />
      <Stack />
      <Freelance />
      <About />
      <Contact />
    </main>
  );
}
