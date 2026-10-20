import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-on-lime"
      >
        Ir al contenido
      </a>
      <Header githubUrl={settings.github_url} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
