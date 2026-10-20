"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { ExternalLink, LayoutGrid, LoaderCircle, LogOut, Type } from "lucide-react";
import { refreshSite } from "@/app/admin/actions";
import { BerryMark } from "@/components/site/Logo";
import { browserSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Toast = { id: number; text: string; tone: "ok" | "error" };

type AdminCtx = {
  sb: SupabaseClient;
  session: Session;
  /** Publica los cambios en el sitio (agrupa varias llamadas seguidas). */
  publish: () => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
};

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin fuera del panel");
  return ctx;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNeeded />;
  return <AuthGate>{children}</AuthGate>;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const sb = browserSupabase();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!session) return;
    sb.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [sb, session]);

  if (session === undefined || (session && isAdmin === null)) return <FullScreenLoader />;
  if (!session) return <Login sb={sb} />;
  if (!isAdmin) {
    return (
      <Centered>
        <h1 className="font-display text-2xl font-bold">Esta cuenta no es administradora</h1>
        <p className="mt-2 text-muted">
          Entraste como {session.user.email}. Agregala a la tabla <code>admins</code> en Supabase (ver docs/SETUP.md).
        </p>
        <button onClick={() => sb.auth.signOut()} className="mt-6 h-11 rounded-full border border-line px-5 font-semibold">
          Salir
        </button>
      </Centered>
    );
  }
  return (
    <Shell sb={sb} session={session}>
      {children}
    </Shell>
  );
}

function Shell({ sb, session, children }: { sb: SupabaseClient; session: Session; children: React.ReactNode }) {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 6000 : 2500);
  }, []);

  const publish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { data } = await sb.auth.getSession();
      const res = await refreshSite(data.session?.access_token ?? "");
      if (!res.ok) toast("Se guardó, pero no se pudo actualizar el sitio. Recargá y probá de nuevo.", "error");
    }, 800);
  }, [sb, toast]);

  const nav = [
    { href: "/admin", label: "Apps", icon: LayoutGrid, active: pathname === "/admin" || pathname.startsWith("/admin/apps") },
    { href: "/admin/sitio", label: "Textos del sitio", icon: Type, active: pathname === "/admin/sitio" },
  ];

  return (
    <Ctx.Provider value={{ sb, session, publish, toast }}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-line bg-surface">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
            <Link href="/admin" className="mr-4 flex items-center gap-2 font-display text-lg font-extrabold text-purple">
              <BerryMark size={26} /> <span className="max-sm:hidden">Panel</span>
            </Link>
            <nav className="flex gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ${
                    n.active ? "bg-soft text-purple" : "hover:bg-soft"
                  }`}
                >
                  <n.icon size={17} aria-hidden /> {n.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1">
              <a href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold hover:bg-soft">
                <ExternalLink size={17} aria-hidden /> <span className="max-sm:hidden">Ver sitio</span>
              </a>
              <button
                onClick={() => sb.auth.signOut()}
                aria-label="Salir"
                className="grid size-10 place-items-center rounded-full hover:bg-soft"
              >
                <LogOut size={18} aria-hidden />
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </div>
      <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg ${
              t.tone === "ok" ? "bg-ink text-bg" : "bg-[#ba1a1a] text-white"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setError("El email o la contraseña no coinciden.");
    setBusy(false);
  }

  return (
    <Centered>
      <BerryMark size={44} />
      <h1 className="font-display mt-4 text-3xl font-extrabold">Panel de Zarzamora</h1>
      <form onSubmit={submit} className="mt-8 flex w-full flex-col gap-4 text-left">
        <Field label="Email">
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>
        {error && <p className="text-sm font-semibold text-[#ba1a1a]">{error}</p>}
        <button disabled={busy} className="mt-2 h-12 rounded-full bg-lime font-semibold text-on-lime disabled:opacity-60">
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </Centered>
  );
}

function SetupNeeded() {
  return (
    <Centered>
      <BerryMark size={44} />
      <h1 className="font-display mt-4 text-2xl font-bold">Falta conectar la base de datos</h1>
      <p className="mt-3 text-muted">
        El panel necesita Supabase para guardar las apps y los archivos. Seguí los pasos de <code>docs/SETUP.md</code> y completá el archivo{" "}
        <code>.env.local</code>. Mientras tanto, el sitio muestra las apps de ejemplo.
      </p>
      <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-full border border-line px-5 font-semibold">
        Volver al sitio
      </Link>
    </Centered>
  );
}

function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center" aria-busy="true">
      <LoaderCircle className="animate-spin text-purple" size={32} aria-label="Cargando" />
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center text-center">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
