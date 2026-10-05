"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type CountUpProps = {
  to: number;
  suffix?: string;
};

// El valor final ya está en el HTML del servidor; la animación solo parte de 0
// tras montar, y no ocurre con reduced motion.
export function CountUp({ to, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const node = ref.current;
    let tween: { kill: () => void } | undefined;
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const counter = { value: 0 };
      tween = gsap.to(counter, {
        value: to,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = `${Math.round(counter.value)}${suffix}`;
        },
        onComplete: () => {
          node.textContent = `${to}${suffix}`;
        },
      });
    });

    return () => {
      cancelled = true;
      tween?.kill();
      node.textContent = `${to}${suffix}`;
    };
  }, [reduced, to, suffix]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}
