"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { youtubeId } from "@/lib/format";
import type { Media } from "@/lib/types";

function thumbFor(m: Media): string {
  if (m.kind === "youtube") {
    const id = youtubeId(m.url);
    return m.poster_url || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
  }
  if (m.kind === "video") return m.poster_url ?? "";
  return m.url;
}

export function MediaGallery({ media, appName }: { media: Media[]; appName: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
        aria-label={`Capturas y videos de ${appName}`}
      >
        {media.map((m, i) => {
          const thumb = thumbFor(m);
          const isVideo = m.kind !== "image";
          return (
            <li key={m.id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className={`relative block overflow-hidden rounded-[20px] border border-line bg-soft ${
                  m.kind === "youtube" ? "aspect-video h-[340px] sm:h-[420px]" : "aspect-[9/19.5] h-[340px] sm:h-[420px]"
                }`}
                aria-label={isVideo ? `Ver video${m.caption ? `: ${m.caption}` : ""}` : `Ampliar captura ${i + 1}${m.caption ? `: ${m.caption}` : ""}`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" loading="lazy" className="size-full object-cover" />
                ) : (
                  m.kind === "video" && <video src={m.url} muted preload="metadata" className="size-full object-cover" />
                )}
                {isVideo && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/20">
                    <span className="grid size-16 place-items-center rounded-full bg-purple text-on-purple">
                      <Play size={28} fill="currentColor" aria-hidden />
                    </span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {media.length > 2 && (
        <div className="mt-3 hidden justify-end gap-2 sm:flex">
          <ArrowButton onClick={() => scrollBy(-1)} label="Anterior">
            <ChevronLeft size={20} aria-hidden />
          </ArrowButton>
          <ArrowButton onClick={() => scrollBy(1)} label="Siguiente">
            <ChevronRight size={20} aria-hidden />
          </ArrowButton>
        </div>
      )}
      {open !== null && <Lightbox media={media} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ArrowButton(props: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.label}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface hover:bg-soft"
    >
      {props.children}
    </button>
  );
}

function Lightbox({
  media,
  index,
  onIndex,
  onClose,
}: {
  media: Media[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => onIndex((index + d + media.length) % media.length), [index, media.length, onIndex]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const m = media[index];
  const yt = m.kind === "youtube" ? youtubeId(m.url) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visor de capturas"
      className="fixed inset-0 z-50 flex flex-col bg-[#170a21]/95 text-white"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between p-4">
        <span className="text-sm opacity-80">
          {index + 1} de {media.length}
          {m.caption && <span className="ml-3">{m.caption}</span>}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="grid size-11 place-items-center rounded-full hover:bg-white/10"
        >
          <X size={24} aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        {m.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.url} alt={m.caption ?? ""} className="max-h-full max-w-full rounded-[20px] object-contain" />
        )}
        {m.kind === "video" && (
          <video key={m.id} src={m.url} poster={m.poster_url ?? undefined} controls autoPlay className="max-h-full max-w-full rounded-[20px]" />
        )}
        {yt && (
          <iframe
            key={m.id}
            src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
            title={m.caption ?? "Video"}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="aspect-video w-full max-w-4xl rounded-[20px]"
          />
        )}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="absolute left-2 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid"
            >
              <ChevronLeft size={26} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="absolute right-2 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid"
            >
              <ChevronRight size={26} aria-hidden />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4">
          {media.map((t, i) => {
            const thumb = thumbFor(t);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Ir a ${i + 1}`}
                aria-current={i === index}
                className={`h-16 w-10 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? "border-lime" : "border-transparent opacity-60"}`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center bg-white/10">
                    <Play size={14} aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
