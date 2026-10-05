import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="contenido">
      <Hero />
    </main>
  );
}
