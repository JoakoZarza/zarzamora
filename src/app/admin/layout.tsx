import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

// El panel carga sus datos en el navegador, así que no puede abrirse al instante.
export const instant = false;

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
