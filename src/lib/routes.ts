import type { Locale } from "@/i18n/config";

/** Slugs de cada ruta por idioma. Mantener sincronizado con las carpetas de src/app/[locale]. */
const segments = {
  apartments: { es: "apartamentos", en: "apartments" },
  zone: { es: "la-zona", en: "the-area" },
  zoneSee: { es: "que-ver", en: "what-to-see" },
  zoneEat: { es: "donde-comer", en: "where-to-eat" },
  zoneGetThere: { es: "como-llegar", en: "how-to-get-here" },
  book: { es: "reservar", en: "book" },
  contact: { es: "contacto", en: "contact" },
  faq: { es: "faq", en: "faq" },
  legal: { es: "legal", en: "legal" },
  legalNotice: { es: "aviso-legal", en: "legal-notice" },
  privacy: { es: "privacidad", en: "privacy" },
  cookies: { es: "cookies", en: "cookies" },
} as const;

export const routes = {
  home: (l: Locale) => `/${l}`,
  apartments: (l: Locale) => `/${l}/${segments.apartments[l]}`,
  apartment: (l: Locale, slug: string) => `/${l}/${segments.apartments[l]}/${slug}`,
  zone: (l: Locale) => `/${l}/${segments.zone[l]}`,
  zoneSee: (l: Locale) => `/${l}/${segments.zone[l]}/${segments.zoneSee[l]}`,
  zoneEat: (l: Locale) => `/${l}/${segments.zone[l]}/${segments.zoneEat[l]}`,
  zoneGetThere: (l: Locale) => `/${l}/${segments.zone[l]}/${segments.zoneGetThere[l]}`,
  book: (l: Locale) => `/${l}/${segments.book[l]}`,
  contact: (l: Locale) => `/${l}/${segments.contact[l]}`,
  faq: (l: Locale) => `/${l}/${segments.faq[l]}`,
  legalNotice: (l: Locale) => `/${l}/${segments.legal[l]}/${segments.legalNotice[l]}`,
  privacy: (l: Locale) => `/${l}/${segments.legal[l]}/${segments.privacy[l]}`,
  cookies: (l: Locale) => `/${l}/${segments.legal[l]}/${segments.cookies[l]}`,
};

/** Reconoce a qué página corresponden los segmentos de una ruta (sin el idioma). */
type RouteMatch =
  | { kind: "home" }
  | { kind: "apartments" }
  | { kind: "apartment"; slug: string }
  | { kind: "zone" }
  | { kind: "zoneSee" }
  | { kind: "zoneEat" }
  | { kind: "zoneGetThere" }
  | { kind: "book" }
  | { kind: "contact" }
  | { kind: "faq" }
  | { kind: "legalNotice" }
  | { kind: "privacy" }
  | { kind: "cookies" };

function matchRoute(parts: string[], locale: Locale): RouteMatch | null {
  const [a, b] = parts;

  if (parts.length === 0) return { kind: "home" };

  if (a === segments.apartments[locale]) {
    if (parts.length === 1) return { kind: "apartments" };
    if (parts.length === 2) return { kind: "apartment", slug: b };
    return null;
  }

  if (a === segments.zone[locale]) {
    if (parts.length === 1) return { kind: "zone" };
    if (parts.length === 2 && b === segments.zoneSee[locale]) return { kind: "zoneSee" };
    if (parts.length === 2 && b === segments.zoneEat[locale]) return { kind: "zoneEat" };
    if (parts.length === 2 && b === segments.zoneGetThere[locale]) return { kind: "zoneGetThere" };
    return null;
  }

  if (a === segments.book[locale] && parts.length === 1) return { kind: "book" };
  if (a === segments.contact[locale] && parts.length === 1) return { kind: "contact" };
  if (a === segments.faq[locale] && parts.length === 1) return { kind: "faq" };

  if (a === segments.legal[locale] && parts.length === 2) {
    if (b === segments.legalNotice[locale]) return { kind: "legalNotice" };
    if (b === segments.privacy[locale]) return { kind: "privacy" };
    if (b === segments.cookies[locale]) return { kind: "cookies" };
    return null;
  }

  return null;
}

/**
 * Traduce la ruta actual (tal como la ve el navegador, con el slug en `from`) a su
 * equivalente en el idioma `to`. Si no reconoce la ruta (por ejemplo, una página 404),
 * cae a la home de `to` en lugar de construir una URL rota.
 *
 * Úsalo siempre que necesites cambiar de idioma conservando la página: nunca sustituyas
 * a mano el segmento de idioma de un `pathname`, porque los slugs difieren entre `es` y `en`.
 */
export function localizedPathname(pathname: string, from: Locale, to: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const [, ...rest] = parts; // el primer segmento es el idioma actual; se descarta

  const match = matchRoute(rest, from);
  if (!match) return routes.home(to);

  switch (match.kind) {
    case "home":
      return routes.home(to);
    case "apartments":
      return routes.apartments(to);
    case "apartment":
      return routes.apartment(to, match.slug);
    case "zone":
      return routes.zone(to);
    case "zoneSee":
      return routes.zoneSee(to);
    case "zoneEat":
      return routes.zoneEat(to);
    case "zoneGetThere":
      return routes.zoneGetThere(to);
    case "book":
      return routes.book(to);
    case "contact":
      return routes.contact(to);
    case "faq":
      return routes.faq(to);
    case "legalNotice":
      return routes.legalNotice(to);
    case "privacy":
      return routes.privacy(to);
    case "cookies":
      return routes.cookies(to);
  }
}
