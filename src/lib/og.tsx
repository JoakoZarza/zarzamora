import { HEIGHT, LEAF_SPACE, R, WIDTH, placeApps, spots } from "./berry";
import { siteUrl } from "./site";
import type { App } from "./types";

// Piezas compartidas de las imágenes para compartir (1200 × 630).
// Se dibujan con ImageResponse, que solo entiende flexbox y estilos en línea.

export const ogSize = { width: 1200, height: 630 };

export const og = {
  bg: "#2a1238",
  text: "#f3eef8",
  muted: "#cdbfdb",
  purple: "#a57bea",
  lime: "#b8e62e",
  mustard: "#d4a017",
  fillers: ["#6b2bc2", "#4b1d8c", "#7c3ad6"],
};

/** Descarga una tipografía de Google Fonts en TTF (el formato que acepta ImageResponse). */
async function googleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`).then((r) =>
    r.text(),
  );
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`No se encontró la tipografía ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export async function ogFonts() {
  const [display, body] = await Promise.all([googleFont("Bricolage Grotesque", 800), googleFont("Hanken Grotesk", 500)]);
  return [
    { name: "Bricolage", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Hanken", data: body, weight: 500 as const, style: "normal" as const },
  ];
}

/** Las imágenes de ImageResponse necesitan direcciones completas. */
export function absoluteUrl(url: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  const site = siteUrl();
  return site ? `${site}${url.startsWith("/") ? "" : "/"}${url}` : null;
}

export function OgMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M16 7c1.5-3.5 5-5 8.5-4.5C23.5 6 20 8 16 7Z" fill="#b8e62e" />
      <path d="M16 7c-1.2-2.6-3.8-3.8-6.4-3.4C10.4 6.2 13 7.6 16 7Z" fill="#8fbf1f" />
      <circle cx="12" cy="13" r="4.2" fill="#7c3ad6" />
      <circle cx="20" cy="13" r="4.2" fill="#5a27a3" />
      <circle cx="8.5" cy="19.5" r="4.2" fill="#5a27a3" />
      <circle cx="16" cy="19.5" r="4.2" fill="#a57bea" />
      <circle cx="23.5" cy="19.5" r="4.2" fill="#7c3ad6" />
      <circle cx="12" cy="26" r="4.2" fill="#7c3ad6" />
      <circle cx="20" cy="26" r="4.2" fill="#5a27a3" />
    </svg>
  );
}

export function OgBrand({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <OgMark size={size} />
      <span style={{ fontFamily: "Bricolage", fontSize: size * 0.85, color: og.purple }}>zarzamora</span>
    </div>
  );
}

/** Ícono de la app: la imagen subida o la inicial sobre su color. */
export function OgIcon({ app, size, radius }: { app: Pick<App, "name" | "icon_url" | "color">; size: number; radius: number }) {
  const src = absoluteUrl(app.icon_url);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} width={size} height={size} style={{ borderRadius: radius, objectFit: "cover" }} alt="" />;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: radius,
        background: app.color || "#6b2bc2",
        color: "#fff",
        fontFamily: "Bricolage",
        fontSize: size * 0.46,
      }}
    >
      {app.name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

/** La mora con los íconos de las apps, del ancho indicado. */
export function OgBerry({ apps, width }: { apps: App[]; width: number }) {
  const unit = width / WIDTH;
  const appAt = placeApps(apps);
  return (
    <div style={{ display: "flex", position: "relative", width, height: HEIGHT * unit }}>
      <svg
        width={width * 0.46}
        height={width * 0.46 * 0.4}
        viewBox="0 0 100 40"
        style={{ position: "absolute", left: width * 0.27, top: (LEAF_SPACE + 0.35) * unit - width * 0.46 * 0.4 }}
      >
        <path d="M50 38 C49 30 50 22 53 14" stroke="#6f9a12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M51 30 C38 30 22 22 14 8 C32 6 46 16 51 30Z" fill="#b8e62e" />
        <path d="M51 30 C64 28 80 18 88 4 C70 3 55 13 51 30Z" fill="#9fcf20" />
      </svg>
      {spots.map((s, i) => {
        const d = 2 * R * s.scale * unit;
        const app = appAt.get(i);
        const pos = { position: "absolute" as const, left: s.x * unit - d / 2, top: s.y * unit - d / 2 };
        if (app) {
          return (
            <div key={i} style={{ ...pos, display: "flex", padding: 3, borderRadius: d, background: og.bg }}>
              <OgIcon app={app} size={d - 6} radius={d} />
            </div>
          );
        }
        return (
          <div key={i} style={{ ...pos, display: "flex", width: d, height: d, borderRadius: d, background: og.fillers[i % 3] }}>
            <div
              style={{
                position: "absolute",
                left: d * 0.2,
                top: d * 0.16,
                width: d * 0.26,
                height: d * 0.26,
                borderRadius: d,
                background: "rgba(255,255,255,0.28)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
