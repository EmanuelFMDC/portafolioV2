# Portafolio v2 — Diseño

Fecha: 2026-10-05
Autor: Emanuel Frías (con Claude)

## 1. Objetivo y contexto

Portafolio web que un reclutador entienda en menos de 60 segundos y que un líder técnico pueda revisar a fondo. Reemplaza la v1 (`C:\Users\emanu\proyectos\portafolio`). Se reutilizan **los datos y las capturas** de la v1; **no se reutiliza su diseño**.

- **Mercado:** México + remoto internacional. Español como idioma base (`/`), inglés completo (`/en`).
- **Dirección visual:** editorial oscuro con motion fino.
- **Contenido pendiente:** sin métricas inventadas. Solo se usan cifras del CV (4+ años, 25+ pantallas, 50+ endpoints, 25+ pruebas, 10+ sitios freelance, 5+ sitios estáticos). Los resultados de cada caso se redactan de forma cualitativa; las cifras reales se pueden agregar después en el archivo de contenido.

### Criterios de éxito

- Lighthouse >= 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO (móvil), LCP < 2.5 s.
- Sin scroll horizontal en 360, 768, 1280 y 1920 px.
- Contraste WCAG AA en tema oscuro y claro; navegación completa por teclado.
- Todo el contenido disponible sin animaciones con `prefers-reduced-motion`.
- `hreflang`, canonical, sitemap y JSON-LD correctos en ambos idiomas.

## 2. Datos del sitio

| Dato | Valor |
|---|---|
| Nombre | Jorge Emanuel Frías Martín del Campo (se muestra "Emanuel Frías") |
| Rol | Frontend Developer — React · TypeScript · Redux Toolkit |
| Ubicación | Guadalajara, Jalisco; abierto a remoto |
| Correo | emanuelfmdc23@gmail.com |
| LinkedIn | https://linkedin.com/in/emanuelfmdc |
| GitHub | https://github.com/EmanuelFMDC |
| Dominio | emanuelfmdc.vercel.app (configurable por variable de entorno) |
| CV | `CV_Emanuel_Frias_ES.pdf` y `CV_Emanuel_Frias_EN.pdf` (origen: `C:\Users\emanu\portafolio\CV`) |
| Teléfono | **No se publica** (protección contra spam) |
| Foto | Fuera de alcance por ahora |

Fuentes de contenido: `src/content/site.ts` y `src/content/projects.ts` de la v1, y los dos CV. Las capturas de `public/proyectos` y `public/freelance` de la v1 se copian tal cual (ya tienen datos sensibles ocultos).

## 3. Estructura de la página

**Home (`/`, `/en`)**

1. **Hero:** nombre en tipografía grande, "Frontend Developer · React · TypeScript", estado "Disponible para remoto", botones *Ver proyectos* y *Descargar CV*, y tres cifras (4+ años, 25+ pantallas, 50+ endpoints).
2. **Proyectos destacados:** marketplace de renta, plataforma de reparaciones, portal de soporte y automatización de facturas. Tarjeta grande con imagen, rol, stack y enlace al caso.
3. **Experiencia:** línea de tiempo con Nahual Consultores (01/2025–09/2026) y Freelance (06/2022–12/2024).
4. **Stack:** agrupado por categoría; "Aprendiendo: Next.js y Node.js" aparte.
5. **Trabajo freelance:** los 4 sitios en línea (Nahual Consultores, Decoder, Inmerza 360, Blackfire) con captura y enlace.
6. **Sobre mí:** bio breve, Guadalajara, inglés B1, estudios en CETI (egreso esperado 2027).
7. **Contacto:** correo, LinkedIn, GitHub y CV. Sin formulario.

**Casos de estudio (`/proyectos/[slug]`, `/en/proyectos/[slug]`)** — contexto, mi rol, cómo funciona, decisiones técnicas y resultado, en MDX por idioma.

**Fuera de alcance (YAGNI):** blog, formulario de contacto, foto, 3D, panel de administración.

## 4. Sistema visual y movimiento

- **Tipografía:** Instrument Serif (títulos, con cursiva en palabras clave), Schibsted Grotesk (texto), JetBrains Mono (etiquetas, años, stack). Tamaños fluidos con `clamp()`.
- **Color (tokens CSS):** fondo `#0B0B0C`, texto `#EDEAE3`, acento único `#FF5A1F`. Tema claro con toggle, que respeta `prefers-color-scheme`. Contraste AA en ambos.
- **Layout:** grid asimétrico de 12 columnas, mobile-first, sin tarjetas anidadas. Áreas táctiles >= 44 px.
- **Movimiento:**
  - Hero: titular revelado por líneas, cifras que cuentan hacia arriba.
  - Proyectos: tarjetas apiladas con scroll (sticky stack) y parallax suave de imagen.
  - Stack: cinta de desplazamiento lento.
  - Botones magnéticos y cursor personalizado solo en escritorio con mouse.
  - GSAP se importa dinámicamente solo en las secciones que lo usan.
  - Con `prefers-reduced-motion` todo es estático. Sin scroll secuestrado ni 3D.

## 5. Arquitectura

Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind 4, next-intl, MDX y GSAP.

```
src/
  app/[locale]/        layout, page, proyectos/[slug], not-found
  app/                 sitemap.ts, robots.ts, opengraph-image
  components/          sections/, ui/, motion/
  content/
    site.ts            datos no traducibles (nombre, links, stack, fechas)
    es/, en/           textos de UI (JSON) y casos de estudio (MDX)
  i18n/                routing, request, navegación
  lib/                 seo (metadata, JSON-LD), utils
e2e/                   pruebas Playwright
```

Cada unidad tiene una responsabilidad. Los datos no traducibles se definen una sola vez; solo el texto cambia por idioma. **Antes de escribir código** se debe leer la guía de la versión instalada en `node_modules/next/dist/docs/`, porque esta versión de Next.js puede diferir de lo conocido.

## 6. i18n

- `next-intl`: español en `/`, inglés en `/en`, selector de idioma en el header.
- `Accept-Language` solo sugiere el idioma; no hay redirección forzada.
- Casos de estudio: un MDX por idioma y por proyecto.
- Todo texto visible sale de archivos de traducción; no hay texto fijo en componentes.

## 7. SEO

- Metadata por página e idioma con `canonical` y `hreflang` (`es-MX`, `en`, `x-default`).
- JSON-LD `Person` y `WebSite` en el home; `BreadcrumbList` en los casos.
- `sitemap.ts` con ambos idiomas, `robots.ts` y OG image dinámica por página.
- HTML semántico, un solo `h1` por página, `alt` descriptivo en cada imagen.
- Fuentes con `next/font`, imágenes con `next/image`.

## 8. Calidad y pruebas

- TypeScript estricto, ESLint y Prettier.
- Vitest + React Testing Library: componentes, utilidades de SEO e i18n.
- Playwright: navegación, cambio de idioma y pruebas de humo en móvil y escritorio; axe para accesibilidad.
- GitHub Actions: lint, typecheck, pruebas y build en cada PR.

## 9. Despliegue

Vercel. Dominio `emanuelfmdc.vercel.app`, parametrizado con una variable de entorno (`NEXT_PUBLIC_SITE_URL`) para cambiarlo sin tocar código.

## 10. Riesgos y supuestos

- Los resultados medibles de los casos no existen aún; se redactan cualitativos y no se inventan cifras.
- El CV en inglés declara inglés B1; la versión en inglés del sitio debe ser clara y sencilla, sin sobrerredactar.
- El proyecto `portafolio-2` aún no es repositorio git; se inicializa al empezar la implementación.
- GSAP añade peso: se mitiga con importación dinámica y animaciones solo donde aportan.
