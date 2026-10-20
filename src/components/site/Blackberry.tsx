import Link from "next/link";
import type { App } from "@/lib/types";
import { HEIGHT, LEAF_SPACE, R, WIDTH, placeApps, spots } from "@/lib/berry";
import { AppIcon } from "./AppIcon";

const fillers = ["var(--drupe-a)", "var(--drupe-b)", "var(--drupe-c)"];

export function Blackberry({ apps }: { apps: App[] }) {
  const appAt = placeApps(apps);

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
