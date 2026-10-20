/** Marca: una mora de siete drupas con una hoja lima. */
export function BerryMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M16 7c1.5-3.5 5-5 8.5-4.5C23.5 6 20 8 16 7Z" fill="#b8e62e" />
      <path d="M16 7c-1.2-2.6-3.8-3.8-6.4-3.4C10.4 6.2 13 7.6 16 7Z" fill="#8fbf1f" />
      <g>
        <circle cx="12" cy="13" r="4.2" fill="var(--drupe-a)" />
        <circle cx="20" cy="13" r="4.2" fill="var(--drupe-c)" />
        <circle cx="8.5" cy="19.5" r="4.2" fill="var(--drupe-c)" />
        <circle cx="16" cy="19.5" r="4.2" fill="var(--drupe-b)" />
        <circle cx="23.5" cy="19.5" r="4.2" fill="var(--drupe-a)" />
        <circle cx="12" cy="26" r="4.2" fill="var(--drupe-a)" />
        <circle cx="20" cy="26" r="4.2" fill="var(--drupe-c)" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <BerryMark />
      <span className="font-display text-[22px] font-extrabold text-purple">zarzamora</span>
    </span>
  );
}
