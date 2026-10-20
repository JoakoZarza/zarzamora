import QRCode from "qrcode";

export async function QrCode({ value, label }: { value: string; label: string }) {
  const svg = await QRCode.toString(value, { type: "svg", margin: 0, color: { dark: "#2a1238", light: "#ffffff" } });
  return (
    <figure className="flex items-center gap-4">
      <div
        className="size-28 shrink-0 rounded-xl bg-white p-2.5"
        role="img"
        aria-label={`Código QR: ${label}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="text-sm text-muted">{label}</figcaption>
    </figure>
  );
}
