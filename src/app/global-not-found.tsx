import Link from "next/link";
import { ThemeScript } from "@/components/ui/theme-script";
import { fonts } from "@/lib/fonts";
import "./globals.css";

// El layout raíz vive en [locale] (segmento dinámico), así que Next exige este
// 404 global. No conoce el idioma, por eso es bilingüe.
export default function GlobalNotFound() {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fonts.display.variable} ${fonts.body.variable} ${fonts.mono.variable}`}
    >
      <head>
        <ThemeScript />
        <title>404</title>
      </head>
      <body>
        <main
          id="contenido"
          className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6"
        >
          <p className="font-mono text-sm text-accent">404</p>
          <h1 className="font-display text-(length:--text-h2) leading-none">
            Página no encontrada
            <span lang="en" className="mt-2 block text-muted italic">
              Page not found
            </span>
          </h1>
          <p className="text-muted">
            <span lang="es">La página que buscas no existe o cambió de lugar.</span>
            <br />
            <span lang="en">The page you are looking for does not exist or has moved.</span>
          </p>
          <nav className="flex gap-6 font-mono text-sm">
            <Link href="/" className="underline underline-offset-4">
              Inicio
            </Link>
            <Link href="/en" className="underline underline-offset-4">
              Home
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
