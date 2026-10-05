import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("nav");
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-sm focus:text-bg"
    >
      {t("skip")}
    </a>
  );
}
