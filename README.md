# Portafolio v2

Portafolio bilingüe (español en `/`, inglés en `/en`) de Emanuel Frías, desarrollador frontend. Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 y next-intl.

## Comandos

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
npm run build        # build de producción
npm start            # sirve el build
npm run lint
npm run typecheck
npm test             # Vitest + React Testing Library
npm run test:e2e     # Playwright + axe (construye y levanta el sitio)
```

La primera vez, `npx playwright install chromium` descarga el navegador de las pruebas E2E.

## Variables de entorno

Copia `.env.example` a `.env.local`.

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio público. Alimenta canonical, hreflang, sitemap, Open Graph y JSON-LD. Por defecto `https://emanuelfmdc.vercel.app`. |

## Estructura

```
src/
  app/[locale]/        layout, home, proyectos/[slug]
  app/                 sitemap.ts, robots.ts, opengraph-image.tsx, global-not-found.tsx
  components/          sections/ (secciones del home), layout/, ui/, motion/
  content/
    site.ts            datos que no cambian con el idioma (contacto, stack, sitios freelance)
    projects.ts        lista y orden de proyectos (imagen, stack)
    es/, en/           messages.json (todo el texto de la interfaz) y projects/*.mdx (casos)
  i18n/                routing, request, navegación y recorte de mensajes para el cliente
  lib/                 seo (metadata, JSON-LD), fuentes, utilidades
  proxy.ts             proxy de next-intl (en Next 16 reemplaza a middleware)
public/
  img/                 capturas de proyectos y sitios freelance
  cv/                  CV en español y en inglés
e2e/                   pruebas Playwright
```

## Cómo agregar un proyecto

1. Agrega la entrada en `src/content/projects.ts` (slug, imagen, tamaño y stack).
2. Agrega `projects.<slug>` (`title`, `summary`, `role`, `imageAlt`) en `src/content/es/messages.json` y en `src/content/en/messages.json`.
3. Crea `src/content/es/projects/<slug>.mdx` y `src/content/en/projects/<slug>.mdx`.
4. Pon las imágenes en `public/img/proyectos/<carpeta>/`.

`npm test` falla si falta el MDX de un idioma, una imagen, un `alt`, o una clave de traducción.

## Cómo agregar un idioma

1. Agrega el código en `routing.locales` (`src/i18n/routing.ts`) y su `messages.json` y MDX.
2. Agrega su entrada en `OG_LOCALE`, `LANGUAGE` y `JOB_TITLE` de `src/lib/seo.ts`, y en `site.cv`.

## Decisiones que conviene conocer

- **Carpetas estáticas fuera de las rutas.** Los activos viven en `public/img` y `public/cv`. `public/proyectos` chocaría con la ruta `/proyectos/[slug]` porque el proxy reescribe las URLs en español. Si agregas otra carpeta pública, exclúyela en el `matcher` de `src/proxy.ts`.
- **404 global.** El layout raíz está en un segmento dinámico (`[locale]`), así que Next exige `global-not-found` (experimental). Es bilingüe porque no conoce el idioma.
- **Calidad de imagen.** Las capturas se sirven en AVIF (WebP de respaldo) a calidad 90, con archivos ~1.5x el tamaño mostrado para que se vean nítidas en pantallas 1x y 2x. `next.config.ts` limita `deviceSizes` a 1600 px porque los originales no pasan de ~1900 px: más grande solo escala sin ganar detalle. Si cambias una captura, sustitúyela por una de mayor resolución en `public/img`; el sitio no puede inventar detalle que el original no tiene.
- **Movimiento sin JavaScript.** Las entradas usan CSS (`animation-timeline: view()` con degradación estática) y respetan `prefers-reduced-motion`. No hay librería de animación.
- **Sin teléfono publicado.** Solo correo, LinkedIn y GitHub, para evitar spam.

## Despliegue

Vercel. Define `NEXT_PUBLIC_SITE_URL` con el dominio final. GitHub Actions (`.github/workflows/ci.yml`) corre lint, typecheck, pruebas y build en cada pull request.
