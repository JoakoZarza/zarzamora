import { Globe, Smartphone } from "lucide-react";
import { platformLabel, statusLabel } from "@/lib/format";
import type { Platform, Status } from "@/lib/types";

export function PlatformChip({ platform, pwa = false }: { platform: Platform; pwa?: boolean }) {
  const Icon = platform === "web" ? Globe : Smartphone;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-purple">
      <Icon size={13} strokeWidth={2} aria-hidden />
      {platformLabel[platform]}
      {pwa && " (instalable)"}
    </span>
  );
}

export function StatusChip({ status }: { status: Status }) {
  const style =
    status === "estable"
      ? "bg-soft text-ink"
      : status === "beta"
        ? "bg-mustard-soft text-on-mustard-soft"
        : "border border-line text-muted";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{statusLabel[status]}</span>;
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  );
}
