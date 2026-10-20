// Geometría de la mora de la portada: cada drupa es una app; las que sobran son fruta.
// La usan el componente de la portada y la imagen para compartir.

const ROWS = [3, 4, 5, 4, 3, 2];
export const R = 1;
const ROW_H = Math.sqrt(3) * R;
export const LEAF_SPACE = 2.4;
export const WIDTH = 10 * R;
export const HEIGHT = LEAF_SPACE + (ROWS.length - 1) * ROW_H + 2 * R;
export const MAX_APPS = 12;

export type Spot = { x: number; y: number; scale: number };

export const spots: Spot[] = ROWS.flatMap((n, row) =>
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

/** Ubica las apps en las drupas del centro; devuelve índice de drupa → app. */
export function placeApps<T>(apps: T[]): Map<number, T> {
  const at = new Map<number, T>();
  apps.slice(0, MAX_APPS).forEach((app, n) => at.set(byCloseness[n], app));
  return at;
}
