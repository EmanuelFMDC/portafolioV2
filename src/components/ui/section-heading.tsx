import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
};

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="mb-12 font-display text-(length:--text-h2) leading-none lg:mb-16">
      {children}
    </h2>
  );
}
