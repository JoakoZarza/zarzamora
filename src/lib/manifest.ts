// Lee el manifest de una app web (PWA) para sacar su ícono, color y descripción.

export type ManifestInfo = {
  name: string | null;
  description: string | null;
  color: string | null;
  iconUrl: string | null;
};

type ManifestIcon = { src: string; sizes?: string; purpose?: string };

const UA = { "User-Agent": "Mozilla/5.0 (compatible; Zarzamora/1.0)" };

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(8000) });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

async function isImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: UA, method: "GET", signal: AbortSignal.timeout(8000) });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith("image/");
  } catch {
    return false;
  }
}

function linkHref(html: string, rel: RegExp): string | null {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const r = tag.match(/\brel=["']([^"']+)["']/i)?.[1];
    if (r && rel.test(r)) return tag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
  }
  return null;
}

/** Ordena los íconos: primero los de uso general, después los más grandes. */
function rankIcons(icons: ManifestIcon[]): ManifestIcon[] {
  const size = (i: ManifestIcon) => Math.max(0, ...(i.sizes ?? "").split(/\s+/).map((s) => parseInt(s, 10) || 0));
  const general = (i: ManifestIcon) => !i.purpose || /\bany\b/.test(i.purpose);
  return [...icons].sort((a, b) => Number(general(b)) - Number(general(a)) || size(b) - size(a));
}

export async function readManifest(pageUrl: string): Promise<ManifestInfo> {
  const info: ManifestInfo = { name: null, description: null, color: null, iconUrl: null };
  const html = await fetchText(pageUrl);
  if (!html) return info;

  const candidates: string[] = [];
  const manifestHref = linkHref(html, /\bmanifest\b/i);
  if (manifestHref) {
    const manifestUrl = new URL(manifestHref, pageUrl).href;
    const raw = await fetchText(manifestUrl);
    try {
      const m = raw ? JSON.parse(raw) : null;
      if (m) {
        info.name = m.name ?? m.short_name ?? null;
        info.description = m.description ?? null;
        info.color = m.theme_color ?? null;
        for (const icon of rankIcons(m.icons ?? [])) candidates.push(new URL(icon.src, manifestUrl).href);
      }
    } catch {
      // manifest con errores: seguimos con los íconos del HTML
    }
  }
  for (const rel of [/apple-touch-icon/i, /\bicon\b/i]) {
    const href = linkHref(html, rel);
    if (href) candidates.push(new URL(href, pageUrl).href);
  }
  info.color ??= html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? null;
  info.description ??= html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? null;

  for (const url of [...new Set(candidates)]) {
    if (await isImage(url)) {
      info.iconUrl = url;
      break;
    }
  }
  return info;
}
