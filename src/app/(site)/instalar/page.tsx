import type { Metadata } from "next";
import Link from "next/link";
import { InstallGuide } from "@/components/site/InstallGuide";

export const metadata: Metadata = {
  title: "Cómo instalar las apps",
  description: "Guía para instalar apps web en Android y iPhone, y archivos APK en Android.",
};

const faqs = [
  {
    q: "¿Qué es una app web?",
    a: "Es una app que funciona desde el navegador. Si la instalás, queda en tu pantalla de inicio con su ícono, se abre sin la barra del navegador y muchas funcionan sin internet. Ocupa poco espacio y se actualiza sola.",
  },
  {
    q: "¿Por qué las apps Android no están en Google Play?",
    a: "Publicar en las tiendas tiene costos y demoras. Con el APK podés probar las apps directamente, y cada versión nueva se instala encima de la anterior.",
  },
  {
    q: "¿Es seguro instalar un APK?",
    a: "Instalá APKs solo de fuentes que conocés. Los de esta tienda los compilo y publico yo. Puede que Google Play Protect te muestre un aviso porque la app no viene de Play Store: es normal en apps que se distribuyen por fuera de la tienda.",
  },
  {
    q: "¿Cómo la desinstalo?",
    a: "Como cualquier otra app: mantené apretado el ícono y elegí “Desinstalar” o “Eliminar app”.",
  },
];

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display max-w-3xl text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">Cómo instalar las apps</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Hay dos tipos de apps en esta tienda: apps web, que se instalan desde el navegador, y apps Android, que se instalan con un archivo APK.
        Elegí tu caso.
      </p>

      <div className="mt-10">
        <InstallGuide />
      </div>

      <section aria-labelledby="preguntas" className="mt-16 max-w-3xl">
        <h2 id="preguntas" className="font-display text-2xl font-bold">
          Preguntas frecuentes
        </h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {f.q}
                <span aria-hidden className="text-2xl text-purple transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Link href="/#apps" className="mt-12 inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-on-lime">
        Ver todas las apps
      </Link>
    </div>
  );
}
