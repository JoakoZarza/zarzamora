"use server";

import { updateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/data";
import { readManifest, type ManifestInfo } from "@/lib/manifest";
import { clientWithToken, isSupabaseConfigured } from "@/lib/supabase";

async function isAdmin(accessToken: string) {
  if (!isSupabaseConfigured || !accessToken) return false;
  const { data, error } = await clientWithToken(accessToken).rpc("is_admin");
  return !error && data === true;
}

/** Publica los cambios del panel en el sitio. Solo funciona con una sesión de administrador. */
export async function refreshSite(accessToken: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin(accessToken))) return { ok: false };
  updateTag(CATALOG_TAG);
  return { ok: true };
}

/** Lee el ícono, el color y la descripción de una app web publicada. */
export async function fetchAppInfo(accessToken: string, url: string): Promise<ManifestInfo | null> {
  if (!(await isAdmin(accessToken)) || !/^https?:\/\//.test(url)) return null;
  return readManifest(url);
}
