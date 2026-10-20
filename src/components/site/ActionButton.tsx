import { Download, ExternalLink } from "lucide-react";
import { primaryAction } from "@/lib/format";
import type { App } from "@/lib/types";

/** Botón principal de una app: abrir, descargar o deshabilitado si aún no está lista. */
export function ActionButton({ app, size = "lg", className = "" }: { app: App; size?: "md" | "lg"; className?: string }) {
  const action = primaryAction(app);
  const dims = size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm";
  const Icon = app.platform === "web" ? ExternalLink : Download;

  if (!action.href) {
    return (
      <span
        aria-disabled
        className={`inline-flex items-center justify-center rounded-full border border-line font-semibold text-muted ${dims} ${className}`}
      >
        Próximamente
      </span>
    );
  }

  return (
    <a
      href={action.href}
      {...(action.external ? { target: "_blank", rel: "noreferrer" } : { download: true })}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-lime font-semibold text-on-lime transition-[filter] hover:brightness-105 ${dims} ${className}`}
    >
      <Icon size={18} aria-hidden />
      {action.label}
    </a>
  );
}
