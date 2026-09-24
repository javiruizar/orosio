import type { Locale } from "@/i18n/config";

export type Apartamento = {
  slug: string;
  /** Nombre visible. Provisional: Javier lo cambiará en la fase 2. */
  nombre: Record<Locale, string>;
  descripcionCorta: Record<Locale, string>;
  descripcionLarga: Record<Locale, string[]>;
  dormitorios: number;
  banos: number;
  plazas: number;
  metros: number;
  planta: string;
  ascensor: boolean;
  /** Claves de equipamiento. Ver src/data/equipamiento.ts */
  equipamiento: string[];
  /** Rutas a imágenes dentro de /public. */
  galeria: string[];
  precioDesde: number;
  /** Pendiente: Javier facilitará los códigos VFT reales. */
  licenciaVFT: string | null;
  /** Pendiente: Javier facilitará las URLs. Si es null, el botón no se muestra. */
  urlBooking: string | null;
  urlAirbnb: string | null;
  destacado: boolean;
};

/**
 * Los 5 apartamentos son intencionadamente idénticos salvo el número.
 * Decisión de Javier (2026-09-22): los nombres, descripciones y fotos reales
 * los cargará él mismo desde el CMS en la fase 2.
 */
export const apartamentos: Apartamento[] = [1, 2, 3, 4, 5].map((n) => ({
  slug: `apartamento-${n}`,
  nombre: { es: `Apartamento ${n}`, en: `Apartment ${n}` },
  descripcionCorta: {
    es: "Un dormitorio y cocina independiente en el centro de Pozoblanco.",
    en: "One bedroom and a separate kitchen in the centre of Pozoblanco.",
  },
  descripcionLarga: {
    es: [
      "Apartamento de un dormitorio con cocina independiente, pensado tanto para una escapada de fin de semana como para estancias largas de trabajo.",
      "Está en el centro de Pozoblanco, a pocos minutos a pie de comercios, bares y servicios, con la tranquilidad de una calle residencial.",
      "Incluye ropa de cama y toallas, wifi y todo lo necesario para cocinar sin depender de restaurantes.",
    ],
    en: [
      "One-bedroom apartment with a separate kitchen, suited both to a weekend getaway and to longer work stays.",
      "It sits in the centre of Pozoblanco, a few minutes' walk from shops, bars and services, on a quiet residential street.",
      "Bed linen and towels, wifi and a fully equipped kitchen are included, so you need not rely on restaurants.",
    ],
  },
  dormitorios: 1,
  banos: 1,
  plazas: 2,
  metros: 45,
  planta: "—",
  ascensor: false,
  equipamiento: [
    "wifi",
    "cocina",
    "lavadora",
    "aire",
    "calefaccion",
    "tv",
    "ropa-cama",
    "menaje",
  ],
  galeria: [
    `/placeholder/apartamento-${n}-1.svg`,
    `/placeholder/apartamento-${n}-2.svg`,
    `/placeholder/apartamento-${n}-3.svg`,
    `/placeholder/apartamento-${n}-4.svg`,
  ],
  precioDesde: 55,
  licenciaVFT: null,
  urlBooking: null,
  urlAirbnb: null,
  destacado: n <= 3,
}));

export function getApartamento(slug: string) {
  return apartamentos.find((a) => a.slug === slug);
}
