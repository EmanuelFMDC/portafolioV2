import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renombró middleware a proxy. Los activos estáticos viven en /img y
// /cv para no chocar con la ruta /proyectos/[slug].
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|img|cv|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
