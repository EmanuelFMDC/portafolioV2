"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type CountUpProps = {
  to: number;
  suffix?: string;
};

const DURATION_MS = 1400;

// El valor final ya está en el HTML del servidor. Si hay animación, empieza
// desde 0 solo cuando el número entra en pantalla (así se ve contar). Con
// reduced motion, o sin IntersectionObserver, el valor final se queda fijo.
export function CountUp({ to, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (reduced || !node || typeof IntersectionObserver === "undefined") return;

    const final = `${to}${suffix}`;
    let frame = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent =
          progress < 1 ? `${Math.round(to * eased)}${suffix}` : final;
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = final;
    };
  }, [reduced, to, suffix]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}
