"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
};

// Visible por defecto: sin JS o con reduced motion el contenido queda estático.
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const node = ref.current;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const tween = gsap.from(node, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(node, { clearProps: "opacity,transform" });
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
