"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { formatDate, primaryAction } from "@/lib/format";
import type { App } from "@/lib/types";
import { AppIcon } from "./AppIcon";
import { PlatformChip, StatusChip } from "./Chips";

type Filter = "todas" | "web" | "android" | "desarrollo";
type Sort = "recomendadas" | "recientes" | "nombre";
type View = "grid" | "list";

const filters: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "web", label: "Web" },
  { id: "android", label: "Android" },
  { id: "desarrollo", label: "En desarrollo" },
];

export function Catalog({ apps }: { apps: App[] }) {
  const [filter, setFilter] = useState<Filter>("todas");
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recomendadas");
  const [view, setView] = useState<View>("grid");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zz-view");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preferencia guardada en este navegador
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {}
  }, []);

  function changeView(v: View) {
    setView(v);
    try {
      localStorage.setItem("zz-view", v);
    } catch {}
  }

  const categories = useMemo(() => [...new Set(apps.map((a) => a.category).filter(Boolean))].sort(), [apps]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = apps.filter((a) => {
      if (filter === "web" && a.platform !== "web") return false;
      if (filter === "android" && a.platform !== "android") return false;
      if (filter === "desarrollo" && a.status !== "desarrollo") return false;
      if (category && a.category !== category) return false;
      if (q && !`${a.name} ${a.tagline} ${a.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "nombre") return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (sort === "recientes") return [...list].sort((a, b) => (b.released_on ?? "").localeCompare(a.released_on ?? ""));
    return list;
  }, [apps, filter, category, query, sort]);

  function reset() {
    setFilter("todas");
    setCategory(null);
    setQuery("");
  }

  return (
    <section id="apps" aria-labelledby="apps-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="apps-title" className="font-display text-3xl font-bold sm:text-4xl">
            Todas las apps
          </h2>
          <p className="mt-1 text-muted">
            {apps.length} {apps.length === 1 ? "app" : "apps"}
          </p>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Buscar apps</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar apps"
            className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 outline-none focus:border-purple"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filtrar por tipo" className="flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${
                filter === f.id ? "bg-purple text-on-purple" : "text-ink hover:bg-soft"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="orden">Ordenar</label>
          <select
            id="orden"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 rounded-full border border-line bg-surface px-4 text-sm font-medium"
          >
            <option value="recomendadas">Recomendadas</option>
            <option value="recientes">Más recientes</option>
            <option value="nombre">Por nombre</option>
          </select>
          <div role="group" aria-label="Vista" className="flex rounded-full border border-line bg-surface p-1">
            <ViewButton active={view === "grid"} onClick={() => changeView("grid")} label="Cuadrícula">
              <LayoutGrid size={18} aria-hidden />
            </ViewButton>
            <ViewButton active={view === "list"} onClick={() => changeView("list")} label="Lista">
              <List size={18} aria-hidden />
            </ViewButton>
          </div>
        </div>
      </div>

      {categories.length > 1 && (
        <div role="group" aria-label="Categorías" className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(category === c ? null : c)}
              className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3.5 text-sm font-medium ${
                category === c ? "border-purple bg-soft text-purple" : "border-line text-muted hover:text-ink"
              }`}
            >
              {c}
              {category === c && <X size={14} aria-hidden />}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-xl font-bold">No hay apps que coincidan con la búsqueda</p>
          <p className="mt-1 text-muted">Probá con otra palabra o sacá los filtros.</p>
          <button type="button" onClick={reset} className="mt-5 h-11 rounded-full bg-lime px-6 font-semibold text-on-lime">
            Ver todas las apps
          </button>
        </div>
      ) : view === "grid" ? (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((app) => (
            <li key={app.id}>
              <AppTile app={app} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {visible.map((app) => (
            <li key={app.id}>
              <AppRow app={app} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ViewButton(props: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={props.label}
      aria-pressed={props.active}
      onClick={props.onClick}
      className={`grid size-9 place-items-center rounded-full ${props.active ? "bg-purple text-on-purple" : "text-muted hover:bg-soft"}`}
    >
      {props.children}
    </button>
  );
}

function AppTile({ app }: { app: App }) {
  return (
    <Link
      href={`/apps/${app.slug}`}
      className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-purple sm:p-5"
    >
      <AppIcon app={app} size={72} className="sm:!h-24 sm:!w-24" />
      <h3 className="font-display mt-4 text-lg font-bold leading-tight">{app.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{app.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        <PlatformChip platform={app.platform} />
        <StatusChip status={app.status} />
      </div>
    </Link>
  );
}

function AppRow({ app }: { app: App }) {
  const action = primaryAction(app);
  return (
    <div className="flex items-center gap-4 py-4 transition-colors hover:bg-soft/50 sm:px-3">
      <Link href={`/apps/${app.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
        <AppIcon app={app} size={56} />
        <div className="min-w-0">
          <h3 className="font-display truncate text-lg font-bold">{app.name}</h3>
          <p className="truncate text-sm text-muted">{app.tagline}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5 md:hidden">
            <PlatformChip platform={app.platform} />
            <StatusChip status={app.status} />
          </div>
        </div>
      </Link>
      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <PlatformChip platform={app.platform} />
        <StatusChip status={app.status} />
      </div>
      <div className="hidden w-36 shrink-0 text-sm text-muted lg:block">
        <div>Versión {app.version}</div>
        {app.released_on && <div>{formatDate(app.released_on)}</div>}
      </div>
      {action.href ? (
        <a
          href={action.href}
          {...(action.external ? { target: "_blank", rel: "noreferrer" } : { download: true })}
          className={`hidden h-10 shrink-0 items-center rounded-full px-5 text-sm font-semibold sm:inline-flex ${
            app.platform === "web" ? "bg-lime text-on-lime" : "border border-purple text-purple hover:bg-soft"
          }`}
        >
          {app.platform === "web" ? "Abrir" : "Descargar APK"}
        </a>
      ) : (
        <span className="hidden w-28 shrink-0 text-center text-sm text-muted sm:block">Próximamente</span>
      )}
    </div>
  );
}
