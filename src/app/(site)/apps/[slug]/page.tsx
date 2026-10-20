import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, ChevronLeft, Clock, ShieldCheck, Smartphone, WifiOff } from "lucide-react";
import { ActionButton } from "@/components/site/ActionButton";
import { AppIcon } from "@/components/site/AppIcon";
import { GithubIcon } from "@/components/site/BrandIcons";
import { Chip, PlatformChip, StatusChip } from "@/components/site/Chips";
import { MediaGallery } from "@/components/site/MediaGallery";
import { QrCode } from "@/components/site/QrCode";
import { getApp, getCatalog } from "@/lib/data";
import { formatDate, primaryAction } from "@/lib/format";
import type { App } from "@/lib/types";

export async function generateStaticParams() {
  const apps = await getCatalog();
  // Con Cache Components tiene que haber al menos uno; sin apps, esa ruta da "no encontrada".
  return apps.length ? apps.map((a) => ({ slug: a.slug })) : [{ slug: "sin-apps" }];
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) return { title: "App no encontrada" };
  return {
    title: app.name,
    description: app.tagline,
    openGraph: { title: app.name, description: app.tagline, siteName: "Zarzamora", locale: "es_AR", type: "website" },
  };
}

export default function AppPage(props: PageProps<"/apps/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <AppDetail params={props.params} />
    </Suspense>
  );
}

async function AppDetail({ params }: { params: PageProps<"/apps/[slug]">["params"] }) {
  const { slug } = await params;
  const [app, all] = await Promise.all([getApp(slug), getCatalog()]);
  if (!app) notFound();
  const others = all.filter((a) => a.id !== app.id).slice(0, 6);
  const paragraphs = app.description.split(/\n\s*\n/).filter(Boolean);
  const qrTarget = qrFor(app);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16">
      <Link href="/#apps" className="inline-flex h-11 items-center gap-1 rounded-full pr-3 font-medium text-purple hover:underline">
        <ChevronLeft size={20} aria-hidden /> Todas las apps
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <AppIcon app={app} size={112} className="max-sm:!h-22 max-sm:!w-22" />
            <div className="min-w-0">
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">{app.name}</h1>
              <p className="mt-2 text-lg text-muted">{app.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <PlatformChip platform={app.platform} pwa={app.is_pwa} />
                {app.category && <Chip>{app.category}</Chip>}
                <StatusChip status={app.status} />
                {app.works_offline && (
                  <Chip>
                    <WifiOff size={13} aria-hidden /> Funciona sin internet
                  </Chip>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ActionButton app={app} className="max-lg:hidden" />
                {app.repo_url && (
                  <a
                    href={app.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-13 items-center gap-2 rounded-full border border-line px-6 font-semibold hover:bg-soft max-sm:h-11 max-sm:text-sm"
                  >
                    <GithubIcon size={18} /> Ver el código
                  </a>
                )}
              </div>
            </div>
          </header>

          <dl className="no-scrollbar mt-8 flex overflow-x-auto rounded-2xl border border-line bg-surface">
            <Info label="Versión" value={app.version} />
            {app.released_on && <Info label="Actualizada" value={formatDate(app.released_on)} />}
            <Info label="Idioma" value={app.language} />
            {app.size_label && <Info label="Tamaño" value={app.size_label} />}
          </dl>

          {app.media.length > 0 && (
            <section aria-labelledby="galeria" className="mt-10">
              <h2 id="galeria" className="font-display mb-4 text-2xl font-bold">
                Capturas
              </h2>
              <MediaGallery media={app.media} appName={app.name} />
            </section>
          )}

          {(paragraphs.length > 0 || app.features.length > 0) && (
            <section aria-labelledby="sobre" className="mt-12 max-w-[68ch]">
              <h2 id="sobre" className="font-display text-2xl font-bold">
                Sobre esta app
              </h2>
              {paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-[17px] leading-relaxed">
                  {p}
                </p>
              ))}
              {app.features.length > 0 && (
                <>
                  <h3 className="font-display mt-8 text-xl font-bold">Qué podés hacer</h3>
                  <ul className="mt-3 space-y-2.5">
                    {app.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check size={20} className="mt-0.5 shrink-0 text-purple" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {app.whats_new.length > 0 && (
              <Card title={`Novedades de la versión ${app.version}`}>
                {app.released_on && <p className="text-sm text-muted">{formatDate(app.released_on)}</p>}
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  {app.whats_new.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </Card>
            )}

            {app.privacy.length > 0 && (
              <Card title="Privacidad" icon={<ShieldCheck size={22} className="text-purple" aria-hidden />}>
                <ul className="space-y-2">
                  {app.privacy.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <Check size={18} className="mt-0.5 shrink-0 text-purple" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {(app.build_tools.length > 0 || app.build_time || app.build_quote) && (
              <section className="rounded-2xl bg-soft p-6 md:col-span-2">
                <h2 className="font-display text-xl font-bold">Cómo la hice</h2>
                {app.build_tools.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Herramientas">
                    {app.build_tools.map((t) => (
                      <li key={t} className="rounded-full bg-surface px-3 py-1 text-sm font-medium">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {app.build_time && (
                  <p className="mt-4 flex items-center gap-2">
                    <Clock size={18} className="text-purple" aria-hidden /> Tiempo de desarrollo: <strong>{app.build_time}</strong>
                  </p>
                )}
                {app.build_quote && (
                  <blockquote className="font-display mt-5 max-w-2xl text-xl font-semibold leading-snug">
                    “{app.build_quote}”
                  </blockquote>
                )}
              </section>
            )}

            {app.platform === "android" ? <ApkSteps /> : app.is_pwa && <PwaHint />}
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <AppIcon app={app} size={56} />
              <div className="min-w-0">
                <p className="font-display truncate text-lg font-bold">{app.name}</p>
                <p className="text-sm text-muted">Versión {app.version}</p>
              </div>
            </div>
            <ActionButton app={app} size="md" className="w-full" />
            {qrTarget && (
              <QrCode
                value={qrTarget}
                label={app.platform === "web" ? "Escaneá para abrirla en tu celular" : "Escaneá para descargarla en tu celular"}
              />
            )}
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="mas" className="mt-16">
          <div className="flex items-end justify-between">
            <h2 id="mas" className="font-display text-2xl font-bold">
              Más apps de Joako
            </h2>
            <Link href="/#apps" className="font-medium text-purple hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="no-scrollbar -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {others.map((o) => (
              <li key={o.id} className="w-40 shrink-0">
                <Link href={`/apps/${o.slug}`} className="block rounded-2xl p-2 hover:bg-soft">
                  <AppIcon app={o} size={72} />
                  <p className="mt-3 truncate font-semibold">{o.name}</p>
                  <p className="line-clamp-2 text-sm text-muted">{o.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg p-3 lg:hidden">
        <ActionButton app={app} className="w-full" />
      </div>
    </div>
  );
}

function qrFor(app: App): string | null {
  const action = primaryAction(app);
  if (!action.href) return null;
  if (app.platform === "android" && process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/apps/${app.slug}`;
  }
  return action.href.startsWith("http") ? action.href : null;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-32 flex-1 border-r border-line px-5 py-4 last:border-r-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold whitespace-nowrap">{value}</dd>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display mb-3 flex items-center gap-2 text-xl font-bold">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function ApkSteps() {
  const steps = [
    "Tocá “Descargar APK” y esperá a que termine la descarga.",
    "Abrí el archivo desde la notificación o desde la carpeta Descargas.",
    "Si Android te lo pide, permití instalar apps desde tu navegador.",
    "Tocá “Instalar” y listo.",
  ];
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 md:col-span-2">
      <h2 className="font-display flex items-center gap-2 text-xl font-bold">
        <Smartphone size={22} className="text-purple" aria-hidden /> Cómo instalar el APK
      </h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="font-display grid size-8 shrink-0 place-items-center rounded-full bg-purple font-bold text-on-purple">
              {i + 1}
            </span>
            <span className="pt-1">{s}</span>
          </li>
        ))}
      </ol>
      <Link href="/instalar?para=apk" className="mt-5 inline-block font-medium text-purple hover:underline">
        Ver la guía completa
      </Link>
    </section>
  );
}

function PwaHint() {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display flex items-center gap-2 text-xl font-bold">
        <Smartphone size={22} className="text-purple" aria-hidden /> Instalala en tu celular
      </h2>
      <p className="mt-3">
        Es una app web: se agrega a tu pantalla de inicio desde el navegador, sin pasar por ninguna tienda, y se abre como cualquier otra app.
      </p>
      <Link href="/instalar" className="mt-4 inline-block font-medium text-purple hover:underline">
        Ver cómo se instala
      </Link>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 pt-16 sm:px-6" aria-busy="true" aria-label="Cargando">
      <div className="flex gap-5">
        <div className="squircle size-28 bg-soft" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-10 w-1/2 rounded-full bg-soft" />
          <div className="h-5 w-2/3 rounded-full bg-soft" />
        </div>
      </div>
      <div className="mt-10 h-80 rounded-2xl bg-soft" />
    </div>
  );
}
