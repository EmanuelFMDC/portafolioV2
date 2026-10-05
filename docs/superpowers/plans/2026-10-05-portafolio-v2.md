# Portafolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el portafolio v2 bilingüe (es `/`, en `/en`), editorial oscuro con motion fino, optimizado para SEO, móvil y accesibilidad.

**Architecture:** Next.js App Router con segmento `[locale]` y next-intl. Datos no traducibles en `src/content/site.ts`, textos en JSON por idioma y casos de estudio en MDX por idioma. Secciones como componentes de servidor; el movimiento vive en componentes cliente pequeños que importan GSAP dinámicamente y nunca ocultan contenido sin JS.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind 4, next-intl, @next/mdx, GSAP, Vitest + React Testing Library, Playwright + axe, GitHub Actions, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-05-portafolio-v2-design.md`

## Global Constraints

- Idiomas: español en `/` (locale `es`, hreflang `es-MX`), inglés en `/en` (locale `en`); `x-default` apunta al español.
- Tipografía: Instrument Serif (títulos), Schibsted Grotesk (texto), JetBrains Mono (etiquetas), cargadas con `next/font`.
- Colores como tokens CSS: fondo `#0B0B0C`, texto `#EDEAE3`, acento `#FF5A1F`; tema claro con toggle y `prefers-color-scheme`; contraste WCAG AA en ambos.
- Cifras permitidas (solo las del CV): 4+ años, 25+ pantallas, 50+ endpoints, 25+ pruebas, 10+ sitios freelance, 5+ sitios estáticos. No inventar otras.
- Contacto: correo `emanuelfmdc23@gmail.com`, `https://linkedin.com/in/emanuelfmdc`, `https://github.com/EmanuelFMDC`. **No publicar el teléfono.** Sin formulario, sin foto.
- Dominio por defecto `https://emanuelfmdc.vercel.app`, leído de `NEXT_PUBLIC_SITE_URL`.
- Cero texto fijo en componentes: todo texto visible sale de `src/content/{es,en}`.
- Áreas táctiles >= 44 px; sin scroll horizontal en 360, 768, 1280 y 1920 px.
- Con `prefers-reduced-motion` y sin JS todo el contenido es visible y estático. Sin scroll secuestrado ni 3D.
- Objetivo Lighthouse móvil >= 95 en las cuatro categorías, LCP < 2.5 s.
- Antes de escribir código de Next.js leer la guía correspondiente en `node_modules/next/dist/docs/` (esta versión puede diferir de lo conocido).

## Review Focus

- Locale inexistente (`/fr`) o slug inexistente (`/proyectos/nada`): debe responder 404 con la página `not-found` en el idioma correcto.
- Pantalla de 320 px con el nombre completo y títulos largos: sin desbordes ni scroll horizontal.
- JS deshabilitado o `prefers-reduced-motion`: el hero, las cifras y las tarjetas de proyecto siguen visibles con su valor final.
- Imagen de proyecto faltante o sin `alt`: la prueba de contenido falla, no se renderiza un hueco roto.
- Cambio de idioma estando en un caso de estudio: lleva al mismo caso en el otro idioma, no al home.

---

### Task 1: Andamiaje, herramientas y CI

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `vitest.config.mts`, `vitest.setup.ts`, `playwright.config.ts`, `.github/workflows/ci.yml`, `.gitignore`, `src/lib/site-url.ts`
- Test: `src/lib/site-url.test.ts`

**Interfaces:**
- Produces: `getSiteUrl(): string` en `src/lib/site-url.ts` (valor de `NEXT_PUBLIC_SITE_URL` sin barra final, o `https://emanuelfmdc.vercel.app`). Scripts npm: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`.

- [ ] **Step 1:** `git init` en `portafolio-2` y generar el proyecto Next.js (TypeScript, App Router, Tailwind, ESLint, `src/`) sin sobrescribir `docs/`. Instalar `next-intl`, `gsap`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, y como dev `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/*`, `@playwright/test`, `@axe-core/playwright`, `prettier`.
- [ ] **Step 2:** Escribir `site-url.test.ts` con dos casos: sin variable devuelve `https://emanuelfmdc.vercel.app`; con `NEXT_PUBLIC_SITE_URL="https://x.dev/"` devuelve `https://x.dev`. Ejecutar `npx vitest run` y verificar que FALLA.
- [ ] **Step 3:** Implementar `getSiteUrl` y configurar Vitest (jsdom, alias `@/`) y Playwright (proyectos `chromium` escritorio y `Pixel 7` móvil, `webServer` con `npm run build && npm start`).
- [ ] **Step 4:** Crear `ci.yml` que en cada PR ejecuta `npm ci`, `lint`, `typecheck`, `test`, `build`.
- [ ] **Step 5:** Verificar `npm run lint && npm run typecheck && npm test` en verde y `npm run build` sin errores.
- [ ] **Step 6:** Commit: `chore: scaffold next app with tooling and ci`.

### Task 2: Tokens de diseño, tipografía y tema

**Files:**
- Create: `src/app/globals.css`, `src/lib/fonts.ts`, `src/components/ui/theme-toggle.tsx`, `src/components/ui/theme-script.tsx`
- Test: `src/components/ui/theme-toggle.test.tsx`

**Interfaces:**
- Produces: `fonts` (`display`, `body`, `mono`: `next/font` con `.variable`) en `src/lib/fonts.ts`; `<ThemeToggle labels={{ toLight: string; toDark: string }} />` cliente; `<ThemeScript />` inline que fija `data-theme` antes de pintar (evita parpadeo). Tokens CSS `--bg`, `--fg`, `--muted`, `--accent`, `--border` para `[data-theme="dark"]` y `[data-theme="light"]`; Tailwind los expone como `bg-bg`, `text-fg`, `text-accent`.

- [ ] **Step 1:** Escribir pruebas: (a) el toggle cambia `document.documentElement.dataset.theme` de `dark` a `light` y guarda `theme` en `localStorage`; (b) sin valor guardado respeta `matchMedia('(prefers-color-scheme: light)')`; (c) el botón tiene `aria-label` tomado de `labels` y `aria-pressed`. Ejecutar y verificar que FALLAN.
- [ ] **Step 2:** Definir tokens en `globals.css` con los hex del spec y escala tipográfica fluida con `clamp()` (`--text-hero`, `--text-h2`, `--text-body`). Tema claro con contraste AA verificado.
- [ ] **Step 3:** Implementar `fonts.ts`, `ThemeScript` y `ThemeToggle` (botón de al menos 44x44 px).
- [ ] **Step 4:** Ejecutar las pruebas del toggle: PASS.
- [ ] **Step 5:** Commit: `feat: design tokens, fonts and theme toggle`.

### Task 3: Capa de movimiento segura

**Files:**
- Create: `src/components/motion/use-reduced-motion.ts`, `src/components/motion/reveal.tsx`, `src/components/motion/count-up.tsx`, `src/components/motion/magnetic.tsx`
- Test: `src/components/motion/count-up.test.tsx`, `src/components/motion/use-reduced-motion.test.ts`

**Interfaces:**
- Produces: `useReducedMotion(): boolean`; `<CountUp to={number} suffix?={string} />` (renderiza `to`+`suffix` ya en el HTML del servidor y solo anima desde 0 en cliente si no hay reduced motion); `<Reveal as? delay?>` (el contenido es visible por defecto y la animación solo se aplica tras montar con JS); `<Magnetic>` (no hace nada en dispositivos sin `(hover: hover) and (pointer: fine)`). GSAP se importa con `await import("gsap")` dentro de efectos.

- [ ] **Step 1:** Escribir pruebas: `CountUp to={25} suffix="+"` contiene el texto `25+` en el primer render; con `matchMedia` reduced-motion activo nunca cambia ese texto; `useReducedMotion` refleja el cambio del media query. Verificar que FALLAN.
- [ ] **Step 2:** Implementar los cuatro módulos; los estados iniciales nunca usan `opacity: 0` ni `visibility: hidden` en CSS estático (la animación parte de estado visible y se aplica con GSAP tras montar).
- [ ] **Step 3:** Ejecutar pruebas: PASS.
- [ ] **Step 4:** Commit: `feat: reduced-motion-safe motion primitives`.

### Task 4: Internacionalización y layout por idioma

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/middleware.ts` (o `proxy.ts` si así lo indica la guía de la versión instalada), `src/app/[locale]/layout.tsx`, `src/app/[locale]/not-found.tsx`, `src/content/es/messages.json`, `src/content/en/messages.json`, `src/components/ui/language-switcher.tsx`
- Test: `src/i18n/routing.test.ts`, `src/components/ui/language-switcher.test.tsx`, `src/content/messages.test.ts`

**Interfaces:**
- Produces: `routing` = `{ locales: ["es","en"], defaultLocale: "es", localePrefix: "as-needed" }`; `Link`, `usePathname`, `useRouter` de `src/i18n/navigation.ts`; `<LanguageSwitcher current={Locale} />` que conserva la ruta actual al cambiar de idioma; tipo `Locale = "es" | "en"`.

- [ ] **Step 1:** Escribir pruebas: `routing.locales` y `defaultLocale` exactos; `messages.test.ts` recorre ambos JSON y falla si alguna clave existe en un idioma y no en el otro, o si algún valor está vacío; el switcher, estando en `/proyectos/marketplace-renta`, enlaza a `/en/proyectos/marketplace-renta` y viceversa. Verificar que FALLAN.
- [ ] **Step 2:** Implementar routing, middleware (sin redirección por `Accept-Language`: `localeDetection: false`), layout con `<html lang>`, fuentes, `ThemeScript` y proveedor de mensajes, y un `not-found` traducido. El layout llama `generateStaticParams` para ambos locales y `setRequestLocale`.
- [ ] **Step 3:** Crear los dos `messages.json` con las claves de `nav`, `common`, `notFound` y `theme`; las demás secciones agregan las suyas en sus tareas.
- [ ] **Step 4:** Ejecutar pruebas: PASS. `npm run build` y confirmar que `/` y `/en` se generan y que `/fr` da 404.
- [ ] **Step 5:** Commit: `feat: i18n routing with es default and en prefix`.

### Task 5: Capa de contenido y activos

**Files:**
- Create: `src/content/site.ts`, `src/content/projects.ts`, `src/content/es/projects/*.mdx`, `src/content/en/projects/*.mdx`, `src/lib/projects.ts`, `src/mdx-components.tsx`, `public/proyectos/**`, `public/freelance/**`, `public/cv/CV_Emanuel_Frias_ES.pdf`, `public/cv/CV_Emanuel_Frias_EN.pdf`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Produces: `site` (`name: "Emanuel Frías"`, `fullName`, `email`, `links.linkedin`, `links.github`, `location`, `cv: Record<Locale,string>`, `stack`, `learning`, `freelanceSites`) con los valores de la sección 2 del spec; `type Project = { slug: string; image: string; imageSize: {width:number;height:number}; stack: string[]; demo?: string; repo?: string }`; `projects: Project[]` en este orden: `marketplace-renta`, `plataforma-reparaciones`, `portal-soporte`, `automatizacion-facturacion`; `getProject(slug: string): Project | undefined`; `getProjectContent(locale: Locale, slug: string)` que carga el MDX del idioma. Los textos traducibles de cada proyecto (título, resumen, rol) viven en `messages.json` bajo `projects.<slug>`.

- [ ] **Step 1:** Copiar capturas de `C:\Users\emanu\proyectos\portafolio\public\{proyectos,freelance}` y los dos CV de `C:\Users\emanu\portafolio\CV` a `public/`.
- [ ] **Step 2:** Escribir `content.test.ts`: cada proyecto tiene MDX en `es` y en `en`; su imagen existe en `public/`; `site` no contiene teléfono ni la cadena `TODO`; los cuatro `freelanceSites` tienen imagen existente; los MDX no contienen comentarios `TODO`. Verificar que FALLA.
- [ ] **Step 3:** Redactar `site.ts` y `projects.ts`, y los ocho MDX (4 casos x 2 idiomas) tomando el contenido de la v1 y de los CV. Resultados cualitativos, sin cifras fuera de las permitidas; las decisiones técnicas que la v1 dejaba en `TODO` se redactan solo con lo que consta en el CV (p. ej. Vitest/RTL/Playwright en tres niveles, JWT y rutas protegidas) o se omiten.
- [ ] **Step 4:** Implementar `getProject`, `getProjectContent` y `mdx-components.tsx` (`Figure`, `PhoneGallery` con `next/image` y `alt` obligatorio).
- [ ] **Step 5:** Ejecutar pruebas: PASS.
- [ ] **Step 6:** Commit: `feat: content layer, case studies and assets`.

### Task 6: Cabecera, pie y estructura base

**Files:**
- Create: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/skip-link.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/components/layout/site-header.test.tsx`

**Interfaces:**
- Consumes: `LanguageSwitcher`, `ThemeToggle`, `Link`.
- Produces: `<SiteHeader />` con enlaces de ancla a `#proyectos`, `#experiencia`, `#stack`, `#contacto` (visibles en escritorio, menú desplegable accesible en móvil); `<SkipLink />` hacia `#contenido`.

- [ ] **Step 1:** Prueba: el header contiene un `nav` con `aria-label`, el menú móvil se abre con teclado (`Enter`), cierra con `Escape` y los botones miden >= 44 px de alto (clase/estilo mínimo). FALLA.
- [ ] **Step 2:** Implementar header (sticky, sin tapar anclas: `scroll-margin-top`), footer con correo, LinkedIn, GitHub y año, y skip link.
- [ ] **Step 3:** Ejecutar pruebas: PASS.
- [ ] **Step 4:** Commit: `feat: header, footer and skip link`.

### Task 7: Hero

**Files:**
- Create: `src/components/sections/hero.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/content/{es,en}/messages.json` (clave `hero`)
- Test: `src/components/sections/hero.test.tsx`

**Interfaces:**
- Consumes: `CountUp`, `Reveal`, `Magnetic`, `site`.
- Produces: `<Hero />` con un único `h1` (nombre), rol, estado de disponibilidad, botones *Ver proyectos* (ancla `#proyectos`) y *Descargar CV* (`site.cv[locale]`, atributo `download`), y tres cifras: `4+` años, `25+` pantallas, `50+` endpoints.

- [ ] **Step 1:** Prueba: un solo `h1`; el enlace del CV apunta al PDF del idioma activo; las tres cifras con su valor final están en el DOM inicial. FALLA.
- [ ] **Step 2:** Implementar el hero con titular grande (Instrument Serif, cursiva en palabra clave) y textos en ambos `messages.json`.
- [ ] **Step 3:** Ejecutar pruebas: PASS.
- [ ] **Step 4:** Commit: `feat: hero section`.

### Task 8: Proyectos destacados y páginas de caso

**Files:**
- Create: `src/components/sections/projects.tsx`, `src/components/ui/project-card.tsx`, `src/app/[locale]/proyectos/[slug]/page.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/content/{es,en}/messages.json` (claves `projects`, `caseStudy`)
- Test: `src/components/sections/projects.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProject`, `getProjectContent`, `Link`.
- Produces: `<Projects />` (4 tarjetas con apilado sticky en escritorio y lista simple en móvil y en reduced motion); ruta de caso con `generateStaticParams` para cada combinación locale x slug; slug inexistente llama `notFound()`.

- [ ] **Step 1:** Prueba: `<Projects />` muestra 4 tarjetas, cada una con título, rol, stack y un enlace a `/proyectos/<slug>` (con prefijo `/en` en inglés); cada imagen tiene `alt` no vacío. FALLA.
- [ ] **Step 2:** Implementar tarjetas y la sección; el apilado sticky es CSS (`position: sticky`) y el parallax suave, un efecto opcional GSAP.
- [ ] **Step 3:** Implementar la página de caso: renderiza MDX, enlace *volver* y enlace al caso siguiente.
- [ ] **Step 4:** Ejecutar pruebas: PASS. `npm run build` y confirmar 8 rutas de caso generadas.
- [ ] **Step 5:** Commit: `feat: featured projects and case study pages`.

### Task 9: Experiencia, stack, freelance, sobre mí y contacto

**Files:**
- Create: `src/components/sections/experience.tsx`, `src/components/sections/stack.tsx`, `src/components/sections/freelance.tsx`, `src/components/sections/about.tsx`, `src/components/sections/contact.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/content/{es,en}/messages.json`
- Test: `src/components/sections/sections.test.tsx`

**Interfaces:**
- Consumes: `site`, `Reveal`.
- Produces: secciones con ids `experiencia`, `stack`, `freelance`, `sobre-mi`, `contacto`. Experiencia: Nahual Consultores `01/2025 – 09/2026` y Freelance `06/2022 – 12/2024` con los logros del CV. Stack con la cinta horizontal (animación CSS, pausada en reduced motion) y "Aprendiendo: Next.js y Node.js" aparte. Freelance: 4 sitios con captura y enlace `rel="noopener noreferrer"` y `target="_blank"`. Contacto: enlaces `mailto:`, LinkedIn, GitHub y CV, sin formulario ni teléfono. Sobre mí: Guadalajara, inglés B1, CETI egreso 2027.

- [ ] **Step 1:** Pruebas: contacto contiene `mailto:emanuelfmdc23@gmail.com` y no contiene `+52`; los enlaces externos llevan `rel` seguro; experiencia muestra ambos periodos exactos. FALLAN.
- [ ] **Step 2:** Implementar las cinco secciones y sus textos en es y en.
- [ ] **Step 3:** Ejecutar pruebas: PASS.
- [ ] **Step 4:** Commit: `feat: experience, stack, freelance, about and contact sections`.

### Task 10: SEO

**Files:**
- Create: `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[locale]/opengraph-image.tsx`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/proyectos/[slug]/page.tsx`
- Test: `src/lib/seo.test.ts`, `src/app/sitemap.test.ts`

**Interfaces:**
- Produces: `buildMetadata({ locale, path, title, description }): Metadata` con `alternates.canonical` y `alternates.languages` = `{ "es-MX": ..., en: ..., "x-default": <url es> }`; `personJsonLd(locale): object` (schema.org `Person`: `name`, `jobTitle`, `url`, `sameAs` con LinkedIn y GitHub, `email`); `websiteJsonLd(locale)`; `breadcrumbJsonLd(items)`; `sitemap()` con una entrada por locale x ruta (home + 4 casos) y `alternates.languages`.

- [ ] **Step 1:** Pruebas: para `path="/proyectos/portal-soporte"` el canonical en inglés es `https://emanuelfmdc.vercel.app/en/proyectos/portal-soporte` y `x-default` es la URL en español; `personJsonLd` no incluye `telephone`; el sitemap tiene 10 entradas (2 locales x 5 rutas) y cada una con alternates. FALLAN.
- [ ] **Step 2:** Implementar `seo.ts`, sitemap, robots (permite todo y referencia el sitemap) y OG image con nombre y rol (`ImageResponse`, 1200x630). Insertar JSON-LD con `<script type="application/ld+json">` en home y casos.
- [ ] **Step 3:** Ejecutar pruebas: PASS.
- [ ] **Step 4:** Commit: `feat: seo metadata, json-ld, sitemap and og image`.

### Task 11: Pruebas E2E, accesibilidad y responsividad

**Files:**
- Create: `e2e/navigation.spec.ts`, `e2e/i18n.spec.ts`, `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: todas las rutas anteriores.

- [ ] **Step 1:** `navigation.spec.ts`: el home carga con un solo `h1`; clic en un proyecto abre su caso; `/proyectos/nada` y `/fr` devuelven 404.
- [ ] **Step 2:** `i18n.spec.ts`: desde `/proyectos/marketplace-renta` el switcher lleva a `/en/proyectos/marketplace-renta`; `<html lang>` es `es` y `en` según ruta; existe `link[rel=alternate][hreflang]` para `es-MX`, `en` y `x-default`.
- [ ] **Step 3:** `a11y.spec.ts`: axe sin violaciones `serious` o `critical` en home y un caso, en tema oscuro y claro y en ambos idiomas.
- [ ] **Step 4:** `responsive.spec.ts`: en 320, 360, 768, 1280 y 1920 px, `document.documentElement.scrollWidth <= innerWidth`; con `reducedMotion: "reduce"` y JS deshabilitado el hero y las cifras `25+` y `50+` siguen visibles.
- [ ] **Step 5:** Ejecutar `npm run test:e2e`: todo PASS; corregir el código (no las pruebas) ante fallos reales.
- [ ] **Step 6:** Commit: `test: e2e navigation, i18n, a11y and responsive`.

### Task 12: Rendimiento, documentación y despliegue

**Files:**
- Create: `README.md`, `.env.example`
- Modify: `next.config.ts` si el análisis lo exige

- [ ] **Step 1:** `npm run build && npm start`, correr Lighthouse móvil sobre `/`, `/en` y un caso. Si alguna categoría queda < 95 o LCP >= 2.5 s, corregir (prioridad de imagen del hero, tamaño de fuentes, carga diferida de GSAP) y repetir.
- [ ] **Step 2:** Escribir `README.md` (cómo correr, estructura, cómo agregar un proyecto o idioma, variable `NEXT_PUBLIC_SITE_URL`) y `.env.example`.
- [ ] **Step 3:** Ejecutar `npm run lint && npm run typecheck && npm test && npm run test:e2e`: todo en verde.
- [ ] **Step 4:** Commit: `docs: readme and performance pass`.
- [ ] **Step 5:** Con tu autorización explícita, crear el repo en GitHub y conectar Vercel (acción externa; no se hace sin confirmar).
