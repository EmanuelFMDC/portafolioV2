const DEFAULT_SITE_URL = "https://emanuelfmdc.vercel.app";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv || DEFAULT_SITE_URL).replace(/\/+$/, "");
}
