"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  labels: { toLight: string; toDark: string };
};

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function resolveTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const resolved = resolveTheme();
    document.documentElement.dataset.theme = resolved;
    setTheme(resolved);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Sin almacenamiento: el cambio solo dura la sesión.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? labels.toLight : labels.toDark}
      aria-pressed={theme === "light"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true" className="font-mono text-sm">
        {theme === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}
