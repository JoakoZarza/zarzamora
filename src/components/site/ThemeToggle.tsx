"use client";

import { Moon, Sun } from "lucide-react";

/** Alterna claro/oscuro y recuerda la elección en este navegador. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("zz-theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre tema claro y oscuro"
      className="grid size-11 place-items-center rounded-full text-ink hover:bg-soft"
    >
      <Moon size={20} className="dark-hidden" aria-hidden />
      <Sun size={20} className="light-hidden" aria-hidden />
    </button>
  );
}
