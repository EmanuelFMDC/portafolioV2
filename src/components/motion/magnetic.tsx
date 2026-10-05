"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type MagneticProps = {
  strength?: number;
  className?: string;
  children: ReactNode;
};

// Solo actúa con mouse real (hover + puntero fino) y sin reduced motion.
export function Magnetic({ strength = 0.3, className, children }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (
      reduced ||
      !node ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const moveX = gsap.quickTo(node, "x", { duration: 0.4, ease: "power3" });
      const moveY = gsap.quickTo(node, "y", { duration: 0.4, ease: "power3" });
      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
        moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };
      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      teardown = () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
        gsap.set(node, { clearProps: "transform" });
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduced, strength]);

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
