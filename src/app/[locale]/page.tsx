import { setRequestLocale } from "next-intl/server";

type HomeProps = { params: Promise<{ locale: string }> };

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="contenido">
      <h1>Emanuel Frías</h1>
    </main>
  );
}
