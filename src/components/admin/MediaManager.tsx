"use client";

import { useCallback, useEffect, useState } from "react";
import { Film, Play, Trash2 } from "lucide-react";
import { removeFileByUrl, uploadFile } from "@/lib/admin";
import { youtubeId } from "@/lib/format";
import type { Media } from "@/lib/types";
import { useAdmin } from "./AdminShell";
import { DropZone } from "./Fields";
import { DragHandle, SortableList } from "./Sortable";

/** Galería de capturas y videos. Cada cambio se guarda al instante. */
export function MediaManager({ appId }: { appId: string }) {
  const { sb, toast, publish } = useAdmin();
  const [items, setItems] = useState<Media[]>([]);
  const [yt, setYt] = useState("");

  const load = useCallback(async () => {
    const { data } = await sb.from("app_media").select("*").eq("app_id", appId).order("position");
    setItems((data as Media[]) ?? []);
  }, [sb, appId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial desde Supabase
    load();
  }, [load]);

  async function addFiles(files: File[]) {
    let position = items.length;
    for (const file of files) {
      const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
      if (!kind) {
        toast(`${file.name}: solo imágenes o videos`, "error");
        continue;
      }
      try {
        const url = await uploadFile(sb, file, "media");
        const { error } = await sb.from("app_media").insert({ app_id: appId, kind, url, position: position++ });
        if (error) throw new Error(error.message);
      } catch (e) {
        toast(`${file.name}: ${(e as Error).message}`, "error");
      }
    }
    await load();
    toast("Galería actualizada");
    publish();
  }

  async function addYoutube(e: React.FormEvent) {
    e.preventDefault();
    if (!youtubeId(yt)) return toast("Ese enlace no parece de YouTube", "error");
    const { error } = await sb.from("app_media").insert({ app_id: appId, kind: "youtube", url: yt.trim(), position: items.length });
    if (error) return toast(error.message, "error");
    setYt("");
    await load();
    toast("Video agregado");
    publish();
  }

  async function reorder(next: Media[]) {
    setItems(next);
    await Promise.all(next.map((m, i) => sb.from("app_media").update({ position: i }).eq("id", m.id)));
    toast("Orden guardado");
    publish();
  }

  async function updateCaption(m: Media, caption: string) {
    if ((m.caption ?? "") === caption) return;
    await sb.from("app_media").update({ caption: caption || null }).eq("id", m.id);
    setItems((list) => list.map((x) => (x.id === m.id ? { ...x, caption } : x)));
    toast("Guardado");
    publish();
  }

  async function remove(m: Media) {
    if (!confirm("¿Quitar este elemento de la galería?")) return;
    await sb.from("app_media").delete().eq("id", m.id);
    if (m.kind !== "youtube") await removeFileByUrl(sb, m.url);
    setItems((list) => list.filter((x) => x.id !== m.id));
    toast("Quitado");
    publish();
  }

  return (
    <div className="flex flex-col gap-4">
      <DropZone accept="image/*,video/mp4,video/webm" multiple onFiles={addFiles} className="h-32">
        <span>
          <strong className="text-ink">Soltá capturas o videos acá</strong> o tocá para elegirlos.
          <br />
          Capturas verticales, videos MP4 de hasta 50 MB.
        </span>
      </DropZone>

      <form onSubmit={addYoutube} className="flex gap-2">
        <label className="sr-only" htmlFor="yt">
          Enlace de YouTube
        </label>
        <input
          id="yt"
          value={yt}
          onChange={(e) => setYt(e.target.value)}
          placeholder="O pegá un enlace de YouTube"
          className="input"
        />
        <button className="h-11 shrink-0 rounded-full border border-line px-4 text-sm font-semibold hover:bg-soft">Agregar</button>
      </form>

      {items.length > 0 && (
        <SortableList items={items} onReorder={reorder} layout="grid" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(m, i) => (
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-bg p-2">
              <div className="relative aspect-[9/14] overflow-hidden rounded-lg bg-soft">
                <Thumb m={m} />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-bold text-bg">{i + 1}</span>
              </div>
              <input
                defaultValue={m.caption ?? ""}
                placeholder="Descripción (opcional)"
                aria-label={`Descripción del elemento ${i + 1}`}
                onBlur={(e) => updateCaption(m, e.target.value.trim())}
                className="input !h-9 text-sm"
              />
              <div className="flex items-center justify-between">
                <DragHandle />
                <button
                  type="button"
                  onClick={() => remove(m)}
                  aria-label={`Quitar elemento ${i + 1}`}
                  className="grid size-9 place-items-center rounded-lg text-muted hover:bg-soft hover:text-[#ba1a1a]"
                >
                  <Trash2 size={17} aria-hidden />
                </button>
              </div>
            </div>
          )}
        </SortableList>
      )}
    </div>
  );
}

function Thumb({ m }: { m: Media }) {
  if (m.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={m.url} alt="" className="size-full object-cover" draggable={false} />;
  }
  if (m.kind === "youtube") {
    const id = youtubeId(m.url);
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="size-full object-cover" draggable={false} />
        <span className="absolute inset-0 grid place-items-center">
          <Play className="fill-white text-white" size={28} aria-hidden />
        </span>
      </>
    );
  }
  return (
    <>
      <video src={m.url} muted preload="metadata" className="size-full object-cover" />
      <span className="absolute inset-0 grid place-items-center">
        <Film className="text-white" size={28} aria-hidden />
      </span>
    </>
  );
}
