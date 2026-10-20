"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { createContext, useContext } from "react";

type HandleProps = Record<string, unknown>;
const HandleCtx = createContext<HandleProps | null>(null);

/** Lista reordenable con mouse, dedo o teclado (espacio para agarrar, flechas para mover). */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  layout = "list",
  className,
  children,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  layout?: "list" | "grid";
  className?: string;
  children: (item: T, index: number) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = items.findIndex((i) => i.id === e.active.id);
    const to = items.findIndex((i) => i.id === e.over!.id);
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, i) => (
            <SortableItem key={item.id} id={item.id}>
              {children(item, i)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, transform, transition, isDragging, listeners, attributes } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={isDragging ? "relative opacity-80" : "relative"}
    >
      <HandleCtx.Provider value={{ ...listeners, ...attributes }}>{children}</HandleCtx.Provider>
    </div>
  );
}

/** Manija para arrastrar; va dentro de cada elemento de SortableList. */
export function DragHandle({ label = "Arrastrar para reordenar" }: { label?: string }) {
  const props = useContext(HandleCtx);
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:bg-soft active:cursor-grabbing"
    >
      <GripVertical size={18} aria-hidden />
    </button>
  );
}
