"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type Labels = { open: string; close: string; prev: string; next: string };

export function Gallery({
  imagenes,
  nombre,
  labels,
}: {
  imagenes: string[];
  nombre: string;
  labels: Labels;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowLeft") {
        setIndex((i) => (i === null ? i : (i - 1 + imagenes.length) % imagenes.length));
      }
      if (event.key === "ArrowRight") {
        setIndex((i) => (i === null ? i : (i + 1) % imagenes.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, imagenes.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {imagenes.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={labels.open}
            className={cn(
              "relative overflow-hidden rounded-lg",
              i === 0 ? "col-span-2 row-span-2" : "aspect-square",
            )}
          >
            <Image
              src={src}
              alt={`${nombre} · ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-carbon/95 p-4"
        >
          <button
            type="button"
            onClick={() => setIndex(null)}
            aria-label={labels.close}
            className="absolute right-4 top-4 text-white"
          >
            <X size={28} />
          </button>

          <button
            type="button"
            onClick={() =>
              setIndex((i) => (i === null ? i : (i - 1 + imagenes.length) % imagenes.length))
            }
            aria-label={labels.prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image
              src={imagenes[index]}
              alt={`${nombre} · ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => (i === null ? i : (i + 1) % imagenes.length))}
            aria-label={labels.next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
          >
            <ChevronRight size={32} />
          </button>

          <p className="mt-4 text-sm text-white/80">
            {index + 1} / {imagenes.length}
          </p>
        </div>
      )}
    </>
  );
}
