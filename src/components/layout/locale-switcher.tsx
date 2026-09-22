"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  /** Sustituye el primer segmento de la ruta por el idioma destino. */
  function pathFor(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-granito">/</span>}
          <Link
            href={pathFor(l)}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "uppercase transition-colors",
              l === locale ? "font-semibold text-carbon" : "text-granito hover:text-terracota-700",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
