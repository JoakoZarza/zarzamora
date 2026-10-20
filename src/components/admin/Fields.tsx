"use client";

import { useId, useRef, useState } from "react";
import { LoaderCircle, Plus, Upload, X } from "lucide-react";
import { DragHandle, SortableList } from "./Sortable";

/** Zona para soltar archivos (o tocar para elegirlos). */
export function DropZone({
  accept,
  multiple = false,
  onFiles,
  children,
  className = "",
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handle(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    try {
      await onFiles(multiple ? [...list] : [list[0]]);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
      className={`relative rounded-2xl border-2 border-dashed transition-colors ${
        over ? "border-purple bg-soft" : "border-line hover:border-purple"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        className="flex size-full flex-col items-center justify-center gap-2 p-5 text-center text-sm text-muted"
      >
        {busy ? <LoaderCircle className="animate-spin text-purple" size={24} aria-hidden /> : <Upload size={22} aria-hidden />}
        {busy ? "Subiendo…" : children}
      </button>
      <input ref={input} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => handle(e.target.files)} />
    </div>
  );
}

type Line = { id: string; text: string };
const toLines = (items: string[]): Line[] => items.map((text, i) => ({ id: `${i}-${text}`, text }));

/** Lista de renglones editable y reordenable (funciones, novedades, privacidad). */
export function ListEditor({
  value,
  onChange,
  placeholder,
  addLabel = "Agregar",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  addLabel?: string;
}) {
  const [lines, setLines] = useState<Line[]>(() => toLines(value));
  const [prev, setPrev] = useState(value);
  if (value !== prev && value.join("\n") !== lines.map((l) => l.text).join("\n")) {
    setPrev(value);
    setLines(toLines(value));
  }
  const refs = useRef(new Map<string, HTMLInputElement>());

  function commit(next: Line[]) {
    setLines(next);
    setPrev(next.map((l) => l.text));
    onChange(next.map((l) => l.text));
  }

  function add(after?: number) {
    const line = { id: crypto.randomUUID(), text: "" };
    const next = [...lines];
    next.splice(after === undefined ? next.length : after + 1, 0, line);
    commit(next);
    requestAnimationFrame(() => refs.current.get(line.id)?.focus());
  }

  return (
    <div className="flex flex-col gap-2">
      <SortableList items={lines} onReorder={commit} className="flex flex-col gap-2">
        {(line, i) => (
          <div className="flex items-center gap-1">
            <DragHandle />
            <input
              ref={(el) => {
                if (el) refs.current.set(line.id, el);
                else refs.current.delete(line.id);
              }}
              value={line.text}
              placeholder={placeholder}
              aria-label={`${placeholder} ${i + 1}`}
              onChange={(e) => commit(lines.map((l) => (l.id === line.id ? { ...l, text: e.target.value } : l)))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add(i);
                }
                if (e.key === "Backspace" && line.text === "" && lines.length > 0) {
                  e.preventDefault();
                  const prevLine = lines[i - 1];
                  commit(lines.filter((l) => l.id !== line.id));
                  if (prevLine) requestAnimationFrame(() => refs.current.get(prevLine.id)?.focus());
                }
              }}
              className="input"
            />
            <button
              type="button"
              onClick={() => commit(lines.filter((l) => l.id !== line.id))}
              aria-label="Quitar"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-soft"
            >
              <X size={17} aria-hidden />
            </button>
          </div>
        )}
      </SortableList>
      <button
        type="button"
        onClick={() => add()}
        className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-purple hover:bg-soft"
      >
        <Plus size={16} aria-hidden /> {addLabel}
      </button>
    </div>
  );
}

/** Etiquetas: escribís y apretás Enter o coma. */
export function TagEditor({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  const id = useId();

  function add() {
    const t = draft.trim().replace(/,$/, "");
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-line bg-surface p-1.5 focus-within:outline-2 focus-within:outline-purple">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-soft py-1 pl-3 pr-1 text-sm font-medium">
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x !== t))}
            aria-label={`Quitar ${t}`}
            className="grid size-6 place-items-center rounded-full hover:bg-surface"
          >
            <X size={13} aria-hidden />
          </button>
        </span>
      ))}
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.endsWith(",") ? (setDraft(e.target.value), add()) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="h-8 min-w-32 flex-1 bg-transparent px-2 outline-none"
      />
    </div>
  );
}

/** Selector de opciones como botones (más rápido que un desplegable). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-fit flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-9 rounded-full px-4 text-sm font-semibold ${value === o.value ? "bg-purple text-on-purple" : "hover:bg-soft"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-purple" : "bg-line"}`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      <span className="font-medium">{label}</span>
    </label>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
