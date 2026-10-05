import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site-url";

export const alt = "Emanuel Frías, Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Una sola imagen para todas las páginas: el texto no depende del idioma.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#ede9e3",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", color: "#ff5a1f", fontSize: 30 }}>
          React · TypeScript · Redux Toolkit
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, lineHeight: 1, letterSpacing: -3 }}>
            Emanuel Frías
          </div>
          <div style={{ fontSize: 44, color: "#a39f97", marginTop: 24 }}>
            Frontend Developer
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a39f97" }}>
          {getSiteUrl().replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
