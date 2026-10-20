import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold">No encontré esa página</h1>
      <p className="mt-3 text-muted">Puede que la app haya cambiado de nombre o que ya no esté publicada.</p>
      <Link href="/#apps" className="mt-8 inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-on-lime">
        Ver todas las apps
      </Link>
    </div>
  );
}
