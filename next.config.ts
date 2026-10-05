import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true, inlineCss: true },
  images: {
    // AVIF casi sin pérdida para capturas de interfaz; WebP como respaldo.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    // Los originales miden como máximo ~1900 px: más allá solo se escalaría sin ganar detalle.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withNextIntl(withMDX(nextConfig));
