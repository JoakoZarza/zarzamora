import Link from "next/link";
import { Mail } from "lucide-react";
import { ActionButton } from "@/components/site/ActionButton";
import { AppIcon } from "@/components/site/AppIcon";
import { Blackberry } from "@/components/site/Blackberry";
import { Catalog } from "@/components/site/Catalog";
import { PlatformChip, StatusChip } from "@/components/site/Chips";
import { getCatalog, getSettings } from "@/lib/data";
import type { App, SiteSettings } from "@/lib/types";

export default async function Home() {
  const [apps, settings] = await Promise.all([getCatalog(), getSettings()]);
  const featured = apps.find((a) => a.featured);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 pt-10 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div>
          <h1 className="font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            {settings.hero_title}
          </h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted">{settings.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#apps"
              className="inline-flex h-13 items-center rounded-full bg-lime px-7 font-semibold text-on-lime hover:brightness-105"
            >
              Ver todas las apps
            </Link>
            <Link
              href="/instalar"
              className="inline-flex h-13 items-center rounded-full border border-line px-7 font-semibold hover:bg-soft"
            >
              Cómo instalarlas
            </Link>
          </div>
        </div>
        {apps.length > 0 && <Blackberry apps={featuredFirst(apps)} />}
      </section>

      {featured && <Featured app={featured} />}

      {apps.length > 0 ? (
        <Catalog apps={apps} />
      ) : (
        <section id="apps" className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <p className="font-display text-2xl font-bold">Todavía no hay apps publicadas</p>
          <p className="mt-2 text-muted">Volvé en unos días.</p>
        </section>
      )}

      <About settings={settings} />
    </>
  );
}

function featuredFirst(apps: App[]) {
  return [...apps.filter((a) => a.featured), ...apps.filter((a) => !a.featured)];
}

function Featured({ app }: { app: App }) {
  const shots = app.media.filter((m) => m.kind === "image").slice(0, 2);
  return (
    <section aria-labelledby="destacada" className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-surface md:grid-cols-[1fr_auto]">
        <div className="p-6 sm:p-10">
          <span className="inline-flex rounded-full bg-mustard px-3 py-1 text-xs font-bold text-ink">Destacada</span>
          <div className="mt-5 flex items-center gap-4">
            <AppIcon app={app} size={72} />
            <div>
              <h2 id="destacada" className="font-display text-3xl font-bold">
                {app.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <PlatformChip platform={app.platform} pwa={app.is_pwa} />
                <StatusChip status={app.status} />
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-lg">{app.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ActionButton app={app} size="md" />
            <Link
              href={`/apps/${app.slug}`}
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold hover:bg-soft"
            >
              Ver detalles
            </Link>
          </div>
        </div>
        {shots.length > 0 && (
          <div className="relative hidden h-80 w-[360px] overflow-hidden bg-soft md:block">
            {shots.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.id}
                src={s.url}
                alt=""
                className="absolute w-[150px] rounded-[20px] border border-line"
                style={{ left: 40 + i * 130, top: 36 + i * 28, transform: `rotate(${i ? 4 : -3}deg)` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function About({ settings }: { settings: SiteSettings }) {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="scroll-mt-16 bg-band text-on-band">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
        {settings.about_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.about_photo_url} alt="Joako Zarza" className="size-36 rounded-full object-cover md:size-48" />
        ) : (
          <div aria-hidden className="font-display grid size-36 place-items-center rounded-full bg-[#6b2bc2] text-5xl font-extrabold text-white md:size-48">
            JZ
          </div>
        )}
        <div>
          <h2 id="sobre-mi-title" className="font-display text-3xl font-bold sm:text-4xl">
            {settings.about_title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">{settings.about_text}</p>
          {settings.tools.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Herramientas con las que trabajo">
              {settings.tools.map((t) => (
                <li key={t} className="rounded-full border border-band-line px-3 py-1 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 font-semibold text-on-lime"
            >
              <Mail size={18} aria-hidden /> Escribime
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
