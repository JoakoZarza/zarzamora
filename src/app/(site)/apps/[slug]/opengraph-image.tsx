import { ImageResponse } from "next/og";
import { getApp } from "@/lib/data";
import { platformLabel, statusLabel } from "@/lib/format";
import { OgBrand, OgIcon, og, ogFonts, ogSize } from "@/lib/og";

export const alt = "Ficha de la app en Zarzamora";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [app, fonts] = await Promise.all([getApp(slug), ogFonts()]);

  if (!app) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", background: og.bg, alignItems: "center", justifyContent: "center" }}>
          <OgBrand size={72} />
        </div>
      ),
      { ...size, fonts },
    );
  }

  const chips = [
    app.platform === "web" && app.is_pwa ? "App web instalable" : platformLabel[app.platform],
    app.category,
    statusLabel[app.status],
  ].filter(Boolean);

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: og.bg, padding: "64px 72px" }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 64 }}>
          <div style={{ display: "flex", padding: 8, borderRadius: 72, background: "#3b244c" }}>
            <OgIcon app={app} size={264} radius={60} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 20 }}>
            <span
              style={{
                fontFamily: "Bricolage",
                fontSize: app.name.length > 16 ? 68 : 88,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: og.text,
              }}
            >
              {app.name}
            </span>
            <span style={{ fontFamily: "Hanken", fontSize: 34, lineHeight: 1.3, color: og.muted }}>{app.tagline}</span>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {chips.map((c) => (
                <span
                  key={c}
                  style={{
                    fontFamily: "Hanken",
                    fontSize: 24,
                    color: og.text,
                    border: "2px solid #4a2f5c",
                    padding: "8px 20px",
                    borderRadius: 999,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <OgBrand size={36} />
          <span style={{ fontFamily: "Hanken", fontSize: 26, color: og.muted }}>Apps de Joako Zarza</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
