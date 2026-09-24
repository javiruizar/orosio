import { ChevronDown } from "lucide-react";

/**
 * Acordeón accesible con <details>/<summary> nativos: funciona sin JavaScript
 * y no necesita "use client" ni estado.
 */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <details key={i} className="group border-b border-arena">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              size={20}
              aria-hidden
              className="shrink-0 text-granito transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="pb-4 text-granito">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
