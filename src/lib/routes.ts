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
