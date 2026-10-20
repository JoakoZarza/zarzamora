import { ImageResponse } from "next/og";
import { getCatalog, getSettings } from "@/lib/data";
import { OgBerry, OgBrand, og, ogFonts, ogSize } from "@/lib/og";

export const alt = "Zarzamora, las apps de Joako Zarza";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const [apps, settings, fonts] = await Promise.all([getCatalog(), getSettings(), ogFonts()]);
  const ordered = [...apps.filter((a) => a.featured), ...apps.filter((a) => !a.featured)];

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: og.bg, padding: "64px 72px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "space-between" }}>
          <OgBrand size={44} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontFamily: "Bricolage", fontSize: 92, lineHeight: 1, letterSpacing: -3, color: og.text }}>
              {settings.hero_title}
            </span>
            <span style={{ fontFamily: "Hanken", fontSize: 34, color: og.muted }}>Apps web y Android de Joako Zarza</span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontFamily: "Hanken",
                fontSize: 26,
                color: og.bg,
                background: og.lime,
                padding: "12px 28px",
                borderRadius: 999,
              }}
            >
              {apps.length === 1 ? "1 app para probar" : `${apps.length} apps para probar`}
            </span>
          </div>
        </div>
        {apps.length > 0 && <OgBerry apps={ordered} width={400} />}
      </div>
    ),
    { ...size, fonts },
  );
}
