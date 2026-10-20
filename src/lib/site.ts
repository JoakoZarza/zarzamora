/**
 * Dirección pública del sitio, sin barra final.
 * Usa NEXT_PUBLIC_SITE_URL; si en Vercel quedó apuntando a localhost (o vacía),
 * cae a la dirección de producción que Vercel informa sola.
 */
export function siteUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel && (!configured || /localhost|127\.0\.0\.1/.test(configured))) return `https://${vercel}`;
  return configured || null;
}
