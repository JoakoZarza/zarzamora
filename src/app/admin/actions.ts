"use server";

import { updateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/data";
import { clientWithToken, isSupabaseConfigured } from "@/lib/supabase";

/** Publica los cambios del panel en el sitio. Solo funciona con una sesión de administrador. */
export async function refreshSite(accessToken: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured || !accessToken) return { ok: false };
  const { data, error } = await clientWithToken(accessToken).rpc("is_admin");
  if (error || data !== true) return { ok: false };
  updateTag(CATALOG_TAG);
  return { ok: true };
}
