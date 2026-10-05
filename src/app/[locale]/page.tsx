import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Freelance } from "@/components/sections/freelance";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="contenido">
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
