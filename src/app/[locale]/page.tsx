import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="contenido">
      <Hero />
      <Projects />
    </main>
  );
}
