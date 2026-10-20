import type { App } from "@/lib/types";

type Props = {
  app: Pick<App, "name" | "icon_url" | "color">;
  /** Tamaño en px; sin tamaño ocupa todo el contenedor. */
  size?: number;
  round?: boolean;
  className?: string;
};

/** Ícono de la app; si todavía no tiene imagen, muestra la inicial sobre su color. */
export function AppIcon({ app, size, round = false, className = "" }: Props) {
  const shape = round ? "rounded-full" : "squircle";
  const dims = size ? { width: size, height: size } : { width: "100%", height: "100%" };

  if (app.icon_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={app.icon_url} alt="" className={`${shape} block shrink-0 object-cover ${className}`} style={dims} />
    );
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`${shape} block shrink-0 ${className}`} style={dims}>
      <rect width="100" height="100" fill={app.color || "#6b2bc2"} />
      <text
        x="50"
        y="50"
        dy="0.35em"
        textAnchor="middle"
        fill="#fff"
        fontSize="46"
        fontWeight="800"
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        {app.name.trim().charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}
