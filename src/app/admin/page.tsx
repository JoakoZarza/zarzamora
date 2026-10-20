"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminShell";
import { DragHandle, SortableList } from "@/components/admin/Sortable";
import { AppIcon } from "@/components/site/AppIcon";
import { emptyApp, type AppRow } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { seedApps } from "@/lib/seed";

export default function AppsSheet() {
  const { sb, publish, toast } = useAdmin();
  const router = useRouter();
  const [apps, setApps] = useState<AppRow[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await sb.from("apps").select("*").order("position");
    if (error) toast(error.message, "error");
    setApps((data as AppRow[]) ?? []);
  }, [sb, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial desde Supabase
    load();
  }, [load]);

  async function patch(id: string, values: Partial<AppRow>) {
    setApps((list) => list?.map((a) => (a.id === id ? { ...a, ...values } : a)) ?? null);
    const { error } = await sb.from("apps").update(values).eq("id", id);
    if (error) {
      toast(`No se pudo guardar: ${error.message}`, "error");
      load();
      return;
    }
    toast("Guardado");
    publish();
  }

  async function reorder(next: AppRow[]) {
    setApps(next);
    const results = await Promise.all(next.map((a, i) => sb.from("apps").update({ position: i }).eq("id", a.id)));
    if (results.some((r) => r.error)) {
      toast("No se pudo guardar el orden", "error");
      load();
      return;
    }
    toast("Orden guardado");
    publish();
  }

  async function create() {
    setBusy(true);
    const name = "Nueva app";
    const { data, error } = await sb
      .from("apps")
      .insert({ ...emptyApp, name, slug: `${slugify(name)}-${Date.now().toString(36)}`, position: apps?.length ?? 0 })
      .select("id")
      .single();
    setBusy(false);
    if (error) return toast(error.message, "error");
    router.push(`/admin/apps/${data.id}`);
  }

  async function remove(app: AppRow) {
    if (!confirm(`¿Borrar "${app.name}"? También se borran sus capturas y videos de la lista. No se puede deshacer.`)) return;
    const { error } = await sb.from("apps").delete().eq("id", app.id);
    if (error) return toast(error.message, "error");
    setApps((list) => list?.filter((a) => a.id !== app.id) ?? null);
    toast("App borrada");
    publish();
  }

  async function importSeed() {
    setBusy(true);
    for (const [i, { media = [], ...app }] of seedApps.entries()) {
      const { data, error } = await sb
        .from("apps")
        .insert({ ...app, position: i, published: app.published })
        .select("id")
        .single();
      if (error) {
        toast(`${app.name}: ${error.message}`, "error");
        continue;
      }
      if (media.length) {
        await sb.from("app_media").insert(media.map((m, j) => ({ ...m, app_id: data.id, position: j })));
      }
    }
    setBusy(false);
    toast("Apps de ejemplo importadas");
    publish();
    load();
  }

  if (!apps) {
    return <LoaderCircle className="mx-auto mt-20 animate-spin text-purple" size={28} aria-label="Cargando" />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Apps</h1>
          <p className="text-muted">
            Arrastrá las filas para cambiar el orden. Los cambios de la planilla se guardan solos.
          </p>
        </div>
        <button
          onClick={create}
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 font-semibold text-on-lime disabled:opacity-60"
        >
          <Plus size={18} aria-hidden /> Nueva app
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-xl font-bold">Todavía no cargaste ninguna app</p>
          <p className="mt-1 text-muted">Creá una desde cero o importá las apps de ejemplo para editarlas.</p>
          <button
            onClick={importSeed}
            disabled={busy}
            className="mt-5 h-11 rounded-full border border-line px-5 font-semibold hover:bg-soft disabled:opacity-60"
          >
            {busy ? "Importando…" : "Importar apps de ejemplo"}
          </button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[36px_44px_1.1fr_1.6fr_110px_130px_80px_150px_120px] items-center gap-3 border-b border-line px-3 py-2.5 text-xs font-semibold text-muted">
              <span />
              <span />
              <span>Nombre</span>
              <span>Frase corta</span>
              <span>Tipo</span>
              <span>Estado</span>
              <span>Versión</span>
              <span>Visibilidad</span>
              <span className="text-right">Acciones</span>
            </div>
            <SortableList items={apps} onReorder={reorder} className="divide-y divide-line">
              {(app) => (
                <div className="grid grid-cols-[36px_44px_1.1fr_1.6fr_110px_130px_80px_150px_120px] items-center gap-3 bg-surface px-3 py-2">
                  <DragHandle />
                  <AppIcon app={app} size={40} />
                  <CellInput value={app.name} label="Nombre" onCommit={(v) => patch(app.id, { name: v })} bold />
                  <CellInput value={app.tagline} label="Frase corta" onCommit={(v) => patch(app.id, { tagline: v })} />
                  <select
                    aria-label="Tipo"
                    value={app.platform}
                    onChange={(e) => patch(app.id, { platform: e.target.value as AppRow["platform"] })}
                    className="input !h-9 !px-2 text-sm"
                  >
                    <option value="web">Web</option>
                    <option value="android">Android</option>
                  </select>
                  <select
                    aria-label="Estado"
                    value={app.status}
                    onChange={(e) => patch(app.id, { status: e.target.value as AppRow["status"] })}
                    className="input !h-9 !px-2 text-sm"
                  >
                    <option value="estable">Estable</option>
                    <option value="beta">Beta</option>
                    <option value="desarrollo">En desarrollo</option>
                  </select>
                  <CellInput value={app.version} label="Versión" onCommit={(v) => patch(app.id, { version: v })} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => patch(app.id, { published: !app.published })}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ${
                        app.published ? "bg-soft text-purple" : "border border-line text-muted"
                      }`}
                    >
                      {app.published ? <Eye size={15} aria-hidden /> : <EyeOff size={15} aria-hidden />}
                      {app.published ? "Visible" : "Oculta"}
                    </button>
                    <button
                      onClick={() => patch(app.id, { featured: !app.featured })}
                      aria-label={app.featured ? "Quitar de destacada" : "Marcar como destacada"}
                      aria-pressed={app.featured}
                      title="Destacada"
                      className="grid size-9 place-items-center rounded-full hover:bg-soft"
                    >
                      <Star size={18} className={app.featured ? "fill-mustard text-mustard" : "text-muted"} aria-hidden />
                    </button>
                  </div>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/apps/${app.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold hover:bg-soft"
                    >
                      <Pencil size={15} aria-hidden /> Editar
                    </Link>
                    <button
                      onClick={() => remove(app)}
                      aria-label={`Borrar ${app.name}`}
                      className="grid size-9 place-items-center rounded-full text-muted hover:bg-soft hover:text-[#ba1a1a]"
                    >
                      <Trash2 size={17} aria-hidden />
                    </button>
                  </div>
                </div>
              )}
            </SortableList>
          </div>
        </div>
      )}
    </div>
  );
}

/** Celda editable: guarda al salir del campo o con Enter; Escape cancela. */
function CellInput({ value, label, onCommit, bold }: { value: string; label: string; onCommit: (v: string) => void; bold?: boolean }) {
  const [draft, setDraft] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setDraft(value);
  }

  return (
    <input
      aria-label={label}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft.trim() !== value && onCommit(draft.trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(value);
          requestAnimationFrame(() => e.currentTarget?.blur());
        }
      }}
      className={`h-9 w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 hover:border-line focus:border-purple focus:bg-surface focus:outline-none ${
        bold ? "font-semibold" : "text-sm"
      }`}
    />
  );
}
