import { cacheLife, cacheTag } from "next/cache";
import { defaultSettings, seedCatalog } from "./seed";
import { isSupabaseConfigured, publicClient } from "./supabase";
import type { App, SiteSettings } from "./types";

export const CATALOG_TAG = "catalog";

export async function getCatalog(): Promise<App[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CATALOG_TAG);

  if (!isSupabaseConfigured) return seedCatalog;

  const { data, error } = await publicClient()
    .from("apps")
    .select("*, media:app_media(*)")
    .eq("published", true)
    .order("position");

  if (error) {
    console.error("No se pudo leer el catálogo:", error.message);
    return [];
  }
  return (data as App[]).map((app) => ({
    ...app,
    media: [...(app.media ?? [])].sort((a, b) => a.position - b.position),
  }));
}

export async function getApp(slug: string): Promise<App | undefined> {
  const apps = await getCatalog();
  return apps.find((a) => a.slug === slug);
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("max");
  cacheTag(CATALOG_TAG);

  if (!isSupabaseConfigured) return defaultSettings;

  const { data } = await publicClient().from("site_settings").select("data").eq("id", 1).maybeSingle();
  return { ...defaultSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) };
}
