import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeScript } from "@/components/ui/theme-script";
import { routing } from "@/i18n/routing";
import { fonts } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site-url";
import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = { metadataBase: new URL(getSiteUrl()) };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${fonts.display.variable} ${fonts.body.variable} ${fonts.mono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipLink />
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
