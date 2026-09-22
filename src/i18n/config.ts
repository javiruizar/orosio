export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Etiquetas del selector de idioma. */
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

/** Códigos para el atributo lang y para hreflang. */
export const localeHtmlLang: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
