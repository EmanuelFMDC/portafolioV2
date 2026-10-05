import { routing, type Locale } from "./routing";

// Cambia el idioma de una ruta real (con o sin prefijo) conservando el resto.
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] as Locale | undefined;
  if (first && routing.locales.includes(first)) segments.shift();
  if (target !== routing.defaultLocale) segments.unshift(target);
  return `/${segments.join("/")}`;
}
