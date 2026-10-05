import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  // "load": entrada al cargar (hero). "scroll": entra al aparecer en pantalla.
  on?: "load" | "scroll";
  // Segundos de retraso; solo aplica a "load".
  delay?: number;
  className?: string;
  children: ReactNode;
};

// Animación 100% CSS (ver globals.css): sin JavaScript, sin hidratación y sin
// ocultar el contenido en estilos en línea. Con reduced motion o en navegadores
// sin animation-timeline el contenido simplemente se ve.
export function Reveal({
  as: Tag = "div",
  on = "scroll",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const base = on === "load" ? "reveal-load" : "reveal-scroll";
  const style =
    on === "load" && delay > 0
      ? ({ "--reveal-delay": `${delay}s` } as CSSProperties)
      : undefined;

  return (
    <Tag className={className ? `${base} ${className}` : base} style={style}>
      {children}
    </Tag>
  );
}
