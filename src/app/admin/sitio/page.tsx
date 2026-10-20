"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { Field, useAdmin } from "@/components/admin/AdminShell";
import { DropZone, Section, TagEditor } from "@/components/admin/Fields";
import { uploadFile } from "@/lib/admin";
import { defaultSettings } from "@/lib/seed";
import type { SiteSettings } from "@/lib/types";

export default function SiteTexts() {
  const { sb, toast, publish } = useAdmin();
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sb.from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        const s = { ...defaultSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) };
        setSaved(s);
        setDraft(s);
      });
  }, [sb]);

  if (!draft) return <LoaderCircle className="mx-auto mt-20 animate-spin text-purple" size={28} aria-label="Cargando" />;

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setDraft((d) => d && { ...d, [k]: v });

  async function save() {
    setSaving(true);
    const { error } = await sb.from("site_settings").upsert({ id: 1, data: draft });
    setSaving(false);
    if (error) return toast(`No se pudo guardar: ${error.message}`, "error");
    setSaved(draft);
    toast("Textos guardados");
    publish();
  }

  async function uploadPhoto(files: File[]) {
    try {
      set("about_photo_url", await uploadFile(sb, files[0], "site"));
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  return (
    <div className="pb-28">
      <h1 className="font-display text-3xl font-extrabold">Textos del sitio</h1>
      <p className="text-muted">Lo que se ve en la portada, en “Sobre mí” y en el pie de página.</p>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Section title="Portada">
          <Field label="Título" hint="Corto y directo. Se ve muy grande.">
            <input value={draft.hero_title} onChange={(e) => set("hero_title", e.target.value)} className="input" />
          </Field>
          <Field label="Bajada">
            <textarea value={draft.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} rows={3} className="input" />
          </Field>
        </Section>

        <Section title="Sobre mí">
          <div className="flex items-center gap-5">
            {draft.about_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.about_photo_url} alt="" className="size-24 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="font-display grid size-24 shrink-0 place-items-center rounded-full bg-[#6b2bc2] text-3xl font-extrabold text-white">
                JZ
              </div>
            )}
            <DropZone accept="image/*" onFiles={uploadPhoto} className="h-24 flex-1">
              <span>
                <strong className="text-ink">Soltá tu foto acá</strong> o tocá para elegirla
              </span>
            </DropZone>
          </div>
          <Field label="Título">
            <input value={draft.about_title} onChange={(e) => set("about_title", e.target.value)} className="input" />
          </Field>
          <Field label="Texto">
            <textarea value={draft.about_text} onChange={(e) => set("about_text", e.target.value)} rows={5} className="input" />
          </Field>
          <Field label="Herramientas">
            <TagEditor value={draft.tools} onChange={(v) => set("tools", v)} placeholder="Escribí y apretá Enter" />
          </Field>
        </Section>

        <Section title="Contacto y pie de página">
          <Field label="Email de contacto">
            <input type="email" value={draft.contact_email} onChange={(e) => set("contact_email", e.target.value)} className="input" />
          </Field>
          <Field label="GitHub">
            <input type="url" value={draft.github_url} onChange={(e) => set("github_url", e.target.value)} className="input" />
          </Field>
          <Field label="Texto del pie">
            <input value={draft.footer_text} onChange={(e) => set("footer_text", e.target.value)} className="input" />
          </Field>
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm text-muted">{dirty ? "Tenés cambios sin guardar" : "Todo guardado"}</p>
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
  );
}
