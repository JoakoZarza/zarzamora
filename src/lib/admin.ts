import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "./supabase";
import type { App } from "./types";

export type AppRow = Omit<App, "media">;

/** Sube un archivo al bucket público y devuelve su URL. */
export async function uploadFile(sb: SupabaseClient, file: File, folder: "icons" | "media" | "apks" | "site") {
  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || (ext === "apk" ? "application/vnd.android.package-archive" : undefined),
  });
  if (error) throw new Error(error.message.includes("exceeded") ? "El archivo supera el tamaño máximo (50 MB)." : error.message);
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Borra un archivo del bucket a partir de su URL pública (si es nuestro). */
export async function removeFileByUrl(sb: SupabaseClient, url: string) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return;
  await sb.storage.from(MEDIA_BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))]);
}

export function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${Math.round(bytes / (1024 * 1024))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const emptyApp: Omit<AppRow, "id" | "slug" | "name" | "position"> = {
  tagline: "",
  description: "",
  features: [],
  category: "",
  platform: "web",
  status: "desarrollo",
  version: "1.0",
  released_on: null,
  language: "Español",
  size_label: "",
  web_url: "",
  apk_url: "",
  repo_url: "",
  icon_url: "",
  color: "#6B2BC2",
  is_pwa: false,
  works_offline: false,
  whats_new: [],
  build_tools: [],
  build_time: "",
  build_quote: "",
  privacy: [],
  featured: false,
  published: false,
};
