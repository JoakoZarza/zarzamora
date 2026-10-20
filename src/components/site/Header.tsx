"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#apps", label: "Apps" },
  { href: "/instalar", label: "Cómo instalar" },
  { href: "/#sobre-mi", label: "Sobre mí" },
];

export function Header({ githubUrl }: { githubUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-none">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Zarzamora, inicio" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 font-medium text-ink hover:bg-soft">
              {l.label}
            </Link>
          ))}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub de Joako"
              className="grid size-11 place-items-center rounded-full hover:bg-soft"
            >
              <GithubIcon />
            </a>
          )}
          <ThemeToggle />
        </nav>

        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full hover:bg-soft"
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Principal" className="border-t border-line bg-bg px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-4 text-lg font-medium"
            >
              {l.label}
            </Link>
          ))}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-4 text-lg font-medium">
              <GithubIcon /> GitHub
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
