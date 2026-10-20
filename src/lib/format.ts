import type { App, Platform, Status } from "./types";

export const platformLabel: Record<Platform, string> = { web: "Web", android: "Android" };

export const statusLabel: Record<Status, string> = {
  estable: "Estable",
  beta: "Beta",
  desarrollo: "En desarrollo",
};

const dateFmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return dateFmt.format(new Date(`${iso}T00:00:00Z`)).replace(".", "");
}

export type PrimaryAction = { label: string; href: string | null; external: boolean };

/** El botón principal de cada app: abrirla, descargar el APK o "próximamente". */
export function primaryAction(app: App): PrimaryAction {
  if (app.platform === "web" && app.web_url) return { label: "Abrir app", href: app.web_url, external: true };
  if (app.platform === "android" && app.apk_url) {
    return { label: app.size_label ? `Descargar APK (${app.size_label})` : "Descargar APK", href: app.apk_url, external: false };
  }
  return { label: "Próximamente", href: null, external: false };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
