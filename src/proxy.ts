import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renombró middleware a proxy.
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|favicon.ico|sitemap.xml|robots.txt|cv/|proyectos/.+\.|freelance/).*)",
  ],
};
