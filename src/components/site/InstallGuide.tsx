"use client";

import { useEffect, useState } from "react";
import { Download, EllipsisVertical, FolderOpen, Globe, House, Share, ShieldCheck, SquarePlus, Smartphone } from "lucide-react";

type Tab = "android" | "iphone" | "apk";
type Step = { icon: React.ElementType; title: string; text: string };

const tabs: { id: Tab; label: string; intro: string; steps: Step[] }[] = [
  {
    id: "android",
    label: "App web en Android",
    intro: "Funciona con Chrome, que viene en casi todos los teléfonos Android.",
    steps: [
      { icon: Globe, title: "Abrí la app en Chrome", text: "Entrá a la app desde esta tienda con el botón “Abrir app”." },
      { icon: EllipsisVertical, title: "Abrí el menú", text: "Tocá los tres puntos de arriba a la derecha." },
      {
        icon: SquarePlus,
        title: "Tocá “Instalar app”",
        text: "En algunos teléfonos dice “Agregar a la pantalla principal”. Si Chrome te muestra un aviso para instalarla, también sirve.",
      },
      { icon: House, title: "Listo", text: "La app aparece en tu pantalla de inicio y se abre como cualquier otra, sin la barra del navegador." },
    ],
  },
  {
    id: "iphone",
    label: "App web en iPhone y iPad",
    intro: "Usá Safari. Desde iOS 16.4 también funciona con Chrome y Edge.",
    steps: [
      { icon: Globe, title: "Abrí la app en Safari", text: "Entrá a la app desde esta tienda con el botón “Abrir app”." },
      {
        icon: Share,
        title: "Tocá Compartir",
        text: "Es el cuadrado con una flecha hacia arriba. En iPhone está abajo; en iPad, arriba a la derecha.",
      },
      {
        icon: SquarePlus,
        title: "Elegí “Agregar a inicio”",
        text: "Bajá en la lista hasta encontrarlo. Si no aparece, tocá “Editar acciones” y agregalo.",
      },
      { icon: House, title: "Tocá “Agregar”", text: "Está arriba a la derecha. La app queda en tu pantalla de inicio." },
    ],
  },
  {
    id: "apk",
    label: "Archivo APK en Android",
    intro: "Las apps Android de esta tienda se instalan desde un archivo APK, sin pasar por Google Play.",
    steps: [
      { icon: Download, title: "Descargá el APK", text: "En la página de la app, tocá “Descargar APK” y esperá a que termine." },
      { icon: FolderOpen, title: "Abrí el archivo", text: "Tocá la notificación de descarga o buscalo en la app Archivos, carpeta Descargas." },
      {
        icon: ShieldCheck,
        title: "Permití la instalación",
        text: "La primera vez, Android te pide permiso para instalar apps desde tu navegador. Tocá “Configuración”, activá “Permitir de esta fuente” y volvé atrás.",
      },
      { icon: Smartphone, title: "Tocá “Instalar”", text: "Cuando termine, tocá “Abrir”. Las próximas versiones se instalan encima, sin perder tus datos." },
    ],
  },
];

function detectTab(): Tab | null {
  const para = new URLSearchParams(window.location.search).get("para");
  if (para === "android" || para === "iphone" || para === "apk") return para;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "iphone";
  return null;
}

export function InstallGuide() {
  const [tab, setTab] = useState<Tab>("android");

  useEffect(() => {
    const detected = detectTab();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende del dispositivo, solo existe en el navegador
    if (detected) setTab(detected);
  }, []);

  const current = tabs.find((t) => t.id === tab)!;

  return (
    <div>
      <div role="tablist" aria-label="Tipo de instalación" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="panel-instalar"
            onClick={() => setTab(t.id)}
            className={`h-11 shrink-0 rounded-full px-5 font-semibold ${
              tab === t.id ? "bg-purple text-on-purple" : "border border-line hover:bg-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="panel-instalar" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
        <p className="max-w-2xl text-lg text-muted">{current.intro}</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {current.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-purple text-lg font-bold text-on-purple">
                {i + 1}
              </span>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  {s.title}
                  <s.icon size={20} className="text-purple" aria-hidden />
                </h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
