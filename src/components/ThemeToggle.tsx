"use client";

import { useEffect, useState } from "react";

const storageKey = "catashop-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(storageKey, next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Cambiar modo de color"
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]"
    >
      <span className="hidden sm:inline">Modo</span>
      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full border border-[var(--line)] transition-colors duration-300 ${
          theme === "dark" ? "bg-[var(--accent)]" : "bg-[var(--sand)]"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-[var(--surface)] shadow-[0_6px_16px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
            theme === "dark" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      <span className="hidden md:inline">
        {theme === "light" ? "Oscuro" : "Claro"}
      </span>
    </button>
  );
}
