import Link from "next/link";
import type { App } from "@/lib/types";
import { AppIcon } from "./AppIcon";

// La mora de la portada: cada drupa es una app; las que sobran son fruta.
const ROWS = [3, 4, 5, 4, 3, 2];
const R = 1;
const ROW_H = Math.sqrt(3) * R;
const LEAF_SPACE = 2.4;
const WIDTH = 10 * R;
const HEIGHT = LEAF_SPACE + (ROWS.length - 1) * ROW_H + 2 * R;

type Spot = { x: number; y: number; scale: number };

const spots: Spot[] = ROWS.flatMap((n, row) =>
  Array.from({ length: n }, (_, k) => ({
    x: WIDTH / 2 + (k - (n - 1) / 2) * 2 * R,
    y: LEAF_SPACE + R + row * ROW_H,
    // variación chica y fija para que no se vea de molde
    scale: 0.9 + (((row * 7 + k * 13) % 5) / 5) * 0.1,
  })),
);

const center = { x: WIDTH / 2, y: LEAF_SPACE + R + ROW_H * 2 };
const byCloseness = spots
  .map((s, i) => ({ i, d: Math.hypot(s.x - center.x, (s.y - center.y) * 1.1) }))
  .sort((a, b) => a.d - b.d)
  .map((s) => s.i);

const fillers = ["var(--drupe-a)", "var(--drupe-b)", "var(--drupe-c)"];

export function Blackberry({ apps }: { apps: App[] }) {
  const shown = apps.slice(0, 12);
  const appAt = new Map<number, App>();
  shown.forEach((app, n) => appAt.set(byCloseness[n], app));

  return (
    <div
      className="relative mx-auto w-[min(100%,300px)] sm:w-[400px] lg:w-[440px]"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      <svg
        viewBox="0 0 100 40"
        className="absolute left-1/2 w-[46%] -translate-x-1/2 -translate-y-full"
        style={{ top: `${((LEAF_SPACE + 0.35) / HEIGHT) * 100}%` }}
        aria-hidden
      >
        <path d="M50 38 C49 30 50 22 53 14" stroke="#6f9a12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M51 30 C38 30 22 22 14 8 C32 6 46 16 51 30Z" fill="#b8e62e" />
        <path d="M51 30 C64 28 80 18 88 4 C70 3 55 13 51 30Z" fill="#9fcf20" />
        <path d="M51 30 C40 22 28 16 16 9" stroke="#7da312" strokeWidth="0.8" fill="none" />
        <path d="M51 30 C62 22 73 13 86 5" stroke="#7da312" strokeWidth="0.8" fill="none" />
      </svg>

      {spots.map((s, i) => {
        const size = `${((2 * R * s.scale) / WIDTH) * 100}%`;
        const style = {
          left: `${(s.x / WIDTH) * 100}%`,
          top: `${(s.y / HEIGHT) * 100}%`,
          width: size,
          aspectRatio: "1",
        } as const;
        const app = appAt.get(i);

        if (!app) {
          return (
            <span
              key={i}
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                ...style,
                background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / .28) 0 14%, transparent 15%), ${fillers[i % 3]}`,
              }}
            />
          );
        }

        return (
          <Link
            key={i}
            href={`/apps/${app.slug}`}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px] ring-bg transition-transform duration-200 hover:z-20 hover:scale-110 focus-visible:z-20 focus-visible:scale-110"
            style={style}
          >
            <AppIcon app={app} round />
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-semibold text-bg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {app.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
