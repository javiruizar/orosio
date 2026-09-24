"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { cn } from "@/lib/cn";
import { locales, type Locale } from "@/i18n/config";
import { localizedPathname } from "@/lib/routes";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  // `usePathname()` sirve para el `href` estático (hover, clic derecho, rastreadores y
  // navegación sin JavaScript). En las páginas servidas mediante rewrite (las inglesas:
  // routes.ts + next.config.ts) puede devolver la ruta interna en español en lugar de la
  // URL real, sin llegar a corregirse en una carga completa de página (ver "Avoid hydration
  // mismatch with rewrites" en la documentación de next/navigation usePathname). Por eso, al
  // hacer clic normal, se recalcula el destino con `window.location.pathname` —siempre
  // exacto— y se navega con el router en vez de fiarse del href ya renderizado.
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(target: Locale, event: MouseEvent<HTMLAnchorElement>) {
    if (target === locale) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return; // clic modificado (nueva pestaña, etc.): que el navegador use el href tal cual
    }
    event.preventDefault();
    router.push(localizedPathname(window.location.pathname, locale, target));
  }

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-granito">/</span>}
          <Link
            href={l === locale ? pathname : localizedPathname(pathname, locale, l)}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            onClick={(event) => handleClick(l, event)}
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
