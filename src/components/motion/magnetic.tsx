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

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
      node.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => {
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      node.style.transform = "";
    };
  }, [reduced, strength]);

  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
