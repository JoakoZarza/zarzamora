"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, Download, ExternalLink, LoaderCircle, Save, Trash2 } from "lucide-react";
import { fetchAppInfo } from "@/app/admin/actions";
import { useAdmin, Field } from "@/components/admin/AdminShell";
import { DropZone, ListEditor, Section, Segmented, TagEditor, Toggle } from "@/components/admin/Fields";
import { MediaManager } from "@/components/admin/MediaManager";
import { AppIcon } from "@/components/site/AppIcon";
import { formatBytes, removeFileByUrl, uploadFile, type AppRow } from "@/lib/admin";
import { slugify } from "@/lib/format";

const categorySuggestions = ["Productividad", "Finanzas", "Fitness", "Hogar", "Herramientas 3D", "Creatividad", "Juegos", "Salud"];

export default function AppEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { sb, toast, publish } = useAdmin();
  const [saved, setSaved] = useState<AppRow | null>(null);
  const [draft, setDraft] = useState<AppRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    sb.from("apps")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) return toast("No encontré esa app", "error");
        setSaved(data as AppRow);
        setDraft(data as AppRow);
        setSlugTouched(!(data as AppRow).slug.startsWith("nueva-app"));
      });
  }, [sb, id, toast]);

  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  const set = useCallback(
    <K extends keyof AppRow>(key: K, value: AppRow[K]) => {
      setDraft((d) => {
        if (!d) return d;
        const next = { ...d, [key]: value };
        if (key === "name" && !slugTouched) next.slug = slugify(String(value)) || d.slug;
        return next;
      });
    },
    [slugTouched],
  );

  const save = useCallback(async () => {
    if (!draft || !dirty) return;
    if (!draft.slug) return toast("Falta la dirección (slug)", "error");
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...values } = draft;
    const { data, error } = await sb.from("apps").update(values).eq("id", draft.id).select("*").single();
    setSaving(false);
    if (error) {
      return toast(
        error.code === "23505" ? "Ya hay otra app con esa dirección. Cambiá el slug." : `No se pudo guardar: ${error.message}`,
        "error",
      );
    }
    setSaved(data as AppRow);
    setDraft(data as AppRow);
    toast("Cambios guardados");
    publish();
  }, [draft, dirty, sb, toast, publish]);

  // Ctrl+S / Cmd+S guarda
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Avisa antes de salir con cambios sin guardar
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function uploadIcon(files: File[]) {
    try {
      const url = await uploadFile(sb, files[0], "icons");
      set("icon_url", url);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  /** Trae el ícono, el color y la descripción desde la app publicada. */
  async function importFromApp(quiet = false) {
    if (!draft?.web_url) return;
    setImporting(true);
    const { data } = await sb.auth.getSession();
    const info = await fetchAppInfo(data.session?.access_token ?? "", draft.web_url);
    setImporting(false);
    if (!info) return quiet || toast("No pude leer esa dirección", "error");
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d };
      if (info.iconUrl) next.icon_url = info.iconUrl;
      if (info.color && /^#[0-9a-f]{6}$/i.test(info.color)) next.color = info.color;
      if (!d.tagline && info.description) next.tagline = info.description;
      return next;
    });
    if (info.iconUrl) toast("Ícono traído de la app. Guardá los cambios para publicarlo.");
    else if (!quiet) toast("La app no tiene un ícono publicado. Subilo a mano.", "error");
  }

  async function uploadApk(files: File[]) {
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".apk")) return toast("Elegí un archivo .apk", "error");
    try {
      const url = await uploadFile(sb, file, "apks");
      setDraft((d) => d && { ...d, apk_url: url, size_label: formatBytes(file.size) });
      toast("APK subido. Guardá los cambios para publicarlo.");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  async function remove() {
    if (!draft || !confirm(`¿Borrar "${draft.name}"? No se puede deshacer.`)) return;
    const { error } = await sb.from("apps").delete().eq("id", draft.id);
    if (error) return toast(error.message, "error");
    if (draft.icon_url) await removeFileByUrl(sb, draft.icon_url);
    publish();
    toast("App borrada");
    router.push("/admin");
  }

  if (!draft) return <LoaderCircle className="mx-auto mt-20 animate-spin text-purple" size={28} aria-label="Cargando" />;

  return (
    <div className="pb-28">
      <Link href="/admin" className="inline-flex h-10 items-center gap-1 font-semibold text-purple hover:underline">
        <ChevronLeft size={18} aria-hidden /> Todas las apps
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <AppIcon app={draft} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display truncate text-3xl font-extrabold">{draft.name || "Sin nombre"}</h1>
          <p className="text-sm text-muted">{draft.published ? "Visible en el sitio" : "Oculta: solo vos la ves"}</p>
        </div>
        {saved?.published && (
          <a
            href={`/apps/${saved.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:bg-soft"
          >
            <ExternalLink size={16} aria-hidden /> Ver en el sitio
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Section title="Lo básico">
          <Field label="Nombre">
            <input value={draft.name} onChange={(e) => set("name", e.target.value)} className="input" />
          </Field>
          <Field label="Frase corta" hint="Aparece debajo del nombre en el catálogo. Ideal: menos de 60 letras.">
            <input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} className="input" maxLength={90} />
          </Field>
          <Field label="Dirección de la página" hint={`zarzamora…/apps/${draft.slug || "…"}`}>
            <input
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className="input"
            />
          </Field>
          <Field label="Categoría">
            <input
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              list="categorias"
              className="input"
            />
            <datalist id="categorias">
              {categorySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Tipo de app</span>
            <Segmented
              label="Tipo de app"
              value={draft.platform}
              onChange={(v) => set("platform", v)}
              options={[
                { value: "web", label: "Web" },
                { value: "android", label: "Android (APK)" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Estado</span>
            <Segmented
              label="Estado"
              value={draft.status}
              onChange={(v) => set("status", v)}
              options={[
                { value: "estable", label: "Estable" },
                { value: "beta", label: "Beta" },
                { value: "desarrollo", label: "En desarrollo" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-x-8">
            <Toggle checked={draft.published} onChange={(v) => set("published", v)} label="Visible en el sitio" />
            <Toggle checked={draft.featured} onChange={(v) => set("featured", v)} label="Destacada en la portada" />
          </div>
        </Section>

        <Section
          title="Ícono y color"
          description="PNG o JPG cuadrado, de 512 × 512 px. En las apps web se trae solo al pegar el enlace. El color se usa cuando no hay ícono."
        >
          <div className="flex items-center gap-5">
            <AppIcon app={draft} size={96} />
            <DropZone accept="image/png,image/jpeg,image/webp,image/svg+xml" onFiles={uploadIcon} className="h-28 flex-1">
              <span>
                <strong className="text-ink">Soltá el ícono acá</strong> o tocá para elegirlo
              </span>
            </DropZone>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Field label="Color de la app">
              <input
                type="color"
                value={draft.color}
                onChange={(e) => set("color", e.target.value)}
                className="h-11 w-20 cursor-pointer rounded-xl border border-line bg-surface p-1"
              />
            </Field>
            {draft.icon_url && (
              <button
                type="button"
                onClick={() => set("icon_url", "")}
                className="mt-6 h-10 rounded-full border border-line px-4 text-sm font-semibold hover:bg-soft"
              >
                Quitar ícono
              </button>
            )}
          </div>
        </Section>

        <Section
          title={draft.platform === "web" ? "Enlace de la app" : "Archivo APK"}
          description={
            draft.platform === "web"
              ? "Adonde lleva el botón “Abrir app”."
              : "Subí el APK (hasta 50 MB) o pegá un enlace, por ejemplo de GitHub Releases."
          }
        >
          {draft.platform === "web" ? (
            <>
              <Field label="Dirección web">
                <input
                  type="url"
                  value={draft.web_url}
                  onChange={(e) => set("web_url", e.target.value)}
                  onBlur={() => !draft.icon_url && importFromApp(true)}
                  placeholder="https://"
                  className="input"
                />
              </Field>
              <button
                type="button"
                onClick={() => importFromApp()}
                disabled={!draft.web_url || importing}
                className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:bg-soft disabled:opacity-50"
              >
                {importing ? <LoaderCircle size={16} className="animate-spin" aria-hidden /> : <Download size={16} aria-hidden />}
                Traer ícono y color desde la app
              </button>
              <div className="flex flex-wrap gap-x-8">
                <Toggle checked={draft.is_pwa} onChange={(v) => set("is_pwa", v)} label="Se puede instalar (PWA)" />
                <Toggle checked={draft.works_offline} onChange={(v) => set("works_offline", v)} label="Funciona sin internet" />
              </div>
            </>
          ) : (
            <>
              <DropZone accept=".apk,application/vnd.android.package-archive" onFiles={uploadApk} className="h-28">
                <span>
                  <strong className="text-ink">Soltá el APK acá</strong> o tocá para elegirlo
                </span>
              </DropZone>
              <Field label="Enlace de descarga">
                <input type="url" value={draft.apk_url} onChange={(e) => set("apk_url", e.target.value)} className="input" />
              </Field>
              <Toggle checked={draft.works_offline} onChange={(v) => set("works_offline", v)} label="Funciona sin internet" />
            </>
          )}
          <Field label="Código fuente (opcional)" hint="Si lo completás, aparece el botón “Ver el código”.">
            <input
              type="url"
              value={draft.repo_url}
              onChange={(e) => set("repo_url", e.target.value)}
              placeholder="https://github.com/…"
              className="input"
            />
          </Field>
        </Section>

        <Section title="Versión" description="Se muestra en la ficha de la app.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Versión">
              <input value={draft.version} onChange={(e) => set("version", e.target.value)} className="input" />
            </Field>
            <Field label="Fecha de actualización">
              <input
                type="date"
                value={draft.released_on ?? ""}
                onChange={(e) => set("released_on", e.target.value || null)}
                className="input"
              />
            </Field>
            <Field label="Idioma">
              <input value={draft.language} onChange={(e) => set("language", e.target.value)} className="input" />
            </Field>
            <Field label="Tamaño">
              <input value={draft.size_label} onChange={(e) => set("size_label", e.target.value)} placeholder="12 MB" className="input" />
            </Field>
          </div>
          <Field label="Novedades de esta versión">
            <ListEditor value={draft.whats_new} onChange={(v) => set("whats_new", v)} placeholder="Novedad" addLabel="Agregar novedad" />
          </Field>
        </Section>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <Section title="Capturas y videos" description="Arrastrá para ordenarlas. La galería se guarda sola, sin tocar “Guardar”.">
          <MediaManager appId={draft.id} />
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section title="Descripción">
            <Field label="Texto" hint="Dejá una línea en blanco para separar párrafos.">
              <textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                className="input"
              />
            </Field>
            <Field label="Qué podés hacer" hint="Enter agrega un renglón nuevo.">
              <ListEditor value={draft.features} onChange={(v) => set("features", v)} placeholder="Función" addLabel="Agregar función" />
            </Field>
          </Section>

          <div className="flex flex-col gap-6">
            <Section title="Cómo la hice">
              <Field label="Herramientas">
                <TagEditor value={draft.build_tools} onChange={(v) => set("build_tools", v)} placeholder="React, Flutter…" />
              </Field>
              <Field label="Tiempo de desarrollo">
                <input value={draft.build_time} onChange={(e) => set("build_time", e.target.value)} placeholder="3 semanas" className="input" />
              </Field>
              <Field label="Frase tuya">
                <textarea
                  value={draft.build_quote}
                  onChange={(e) => set("build_quote", e.target.value)}
                  rows={2}
                  placeholder="Por qué la hiciste"
                  className="input !min-h-0"
                />
              </Field>
            </Section>

            <Section title="Privacidad">
              <ListEditor value={draft.privacy} onChange={(v) => set("privacy", v)} placeholder="No recolecta datos" addLabel="Agregar punto" />
            </Section>
          </div>
        </div>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ba1a1a]/40 p-5">
          <div>
            <h2 className="font-semibold">Borrar esta app</h2>
            <p className="text-sm text-muted">Si solo querés sacarla del sitio, apagá “Visible en el sitio”.</p>
          </div>
          <button
            onClick={remove}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#ba1a1a] px-4 text-sm font-semibold text-[#ba1a1a]"
          >
            <Trash2 size={16} aria-hidden /> Borrar app
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm text-muted">
            {dirty ? "Tenés cambios sin guardar" : "Todo guardado"}
            <span className="max-sm:hidden"> · Ctrl + S para guardar</span>
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button onClick={() => setDraft(saved)} className="h-11 rounded-full border border-line px-5 font-semibold hover:bg-soft">
                Descartar
              </button>
            )}
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-6 font-semibold text-on-lime disabled:opacity-50"
            >
              <Save size={18} aria-hidden /> {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
