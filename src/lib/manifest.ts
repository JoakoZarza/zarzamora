// Lee el manifest de una app web (PWA) para sacar su ícono, color y descripción.

import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";

export type ManifestInfo = {
  name: string | null;
  description: string | null;
  color: string | null;
  iconUrl: string | null;
};

type ManifestIcon = { src: string; sizes?: string; purpose?: string };

const UA = { "User-Agent": "Mozilla/5.0 (compatible; Zarzamora/1.0)" };
const MAX_REDIRECCIONES = 3;
const MAX_BYTES = 1_000_000;

// Direcciones que el servidor nunca debe pedir: locales, privadas, de metadatos de la nube, etc.
// Listas separadas: BlockList cruza familias y un rango IPv6 como ::ffff:0:0/96 bloquearía toda IPv4.
const BLOQUEADAS_V4 = new BlockList();
for (const [red, prefijo] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["224.0.0.0", 3],
] as const) BLOQUEADAS_V4.addSubnet(red, prefijo, "ipv4");
const BLOQUEADAS_V6 = new BlockList();
for (const [red, prefijo] of [
  ["::", 128], ["::1", 128], ["64:ff9b::", 96], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8],
] as const) BLOQUEADAS_V6.addSubnet(red, prefijo, "ipv6");

/** IPv4 dentro de una IPv6 mapeada: ::ffff:1.2.3.4 o su forma hexadecimal ::ffff:102:304. */
function ipv4Mapeada(ip: string): string | null {
  const resto = /^::ffff:(.+)$/i.exec(ip)?.[1];
  if (!resto) return null;
  if (isIP(resto) === 4) return resto;
  const hex = /^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(resto);
  if (!hex) return null;
  const [a, b] = [parseInt(hex[1], 16), parseInt(hex[2], 16)];
  return [a >> 8, a & 255, b >> 8, b & 255].join(".");
}

function esDireccionInterna(ip: string): boolean {
  if (isIP(ip) === 4) return BLOQUEADAS_V4.check(ip, "ipv4");
  const v4 = ipv4Mapeada(ip);
  return v4 ? BLOQUEADAS_V4.check(v4, "ipv4") : BLOQUEADAS_V6.check(ip, "ipv6");
}

/** Solo URLs http(s) públicas: el nombre se resuelve y se rechaza si alguna dirección es interna. */
async function urlPublica(url: string): Promise<URL | null> {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if ((u.protocol !== "http:" && u.protocol !== "https:") || u.username || u.password) return null;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  try {
    const direcciones = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true });
    if (direcciones.length === 0 || direcciones.some((d) => esDireccionInterna(d.address))) return null;
  } catch {
    return null;
  }
  return u;
}

/** fetch que valida cada salto de redirección. Queda una ventana de DNS rebinding entre la
 * validación y la conexión; es aceptable porque solo lo usan administradores. */
async function fetchPublico(url: string): Promise<Response | null> {
  let actual = url;
  for (let salto = 0; salto <= MAX_REDIRECCIONES; salto++) {
    const u = await urlPublica(actual);
    if (!u) return null;
    const res = await fetch(u, { headers: UA, redirect: "manual", signal: AbortSignal.timeout(8000) });
    const destino = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && destino) {
      await res.body?.cancel();
      actual = new URL(destino, u).href;
      continue;
    }
    return res;
  }
  return null;
}

async function leerLimitado(res: Response): Promise<string | null> {
  if (Number(res.headers.get("content-length") ?? 0) > MAX_BYTES || !res.body) {
    await res.body?.cancel();
    return null;
  }
  const lector = res.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await lector.cancel();
      return null;
    }
    partes.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(partes));
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetchPublico(url);
    if (!res) return null;
    if (!res.ok) {
      await res.body?.cancel();
      return null;
    }
    return await leerLimitado(res);
  } catch {
    return null;
  }
}

async function isImage(url: string): Promise<boolean> {
  try {
    const res = await fetchPublico(url);
    if (!res) return false;
    await res.body?.cancel();
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
