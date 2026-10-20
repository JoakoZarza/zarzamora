import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Logo } from "./Logo";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted">{settings.footer_text}</p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/#apps" className="hover:text-purple">Apps</Link>
          <Link href="/instalar" className="hover:text-purple">Cómo instalar</Link>
          {settings.github_url && (
            <a href={settings.github_url} target="_blank" rel="noreferrer" className="hover:text-purple">GitHub</a>
          )}
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="hover:text-purple">Contacto</a>
          )}
        </nav>
      </div>
    </footer>
  );
}
