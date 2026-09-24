import type { Locale } from "@/i18n/config";

export type CategoriaZona = "que-ver" | "donde-comer" | "como-llegar";

export type PuntoInteres = {
  categoria: CategoriaZona;
  nombre: Record<Locale, string>;
  descripcion: Record<Locale, string>;
  /** null cuando no aplica una distancia (p. ej. un bloque temático de "cómo llegar"). */
  distanciaKm: number | null;
  orden: number;
  /**
   * Dato verificado por Javier. Mientras sea false, la página debe mostrar el aviso
   * `zone.unverified`. Ninguno de estos datos está confirmado todavía (fase 1, 2026-09-24).
   */
  verificado: boolean;
};

/**
 * Contenido provisional pero publicable de la guía de la zona (fase 1). Se migra a
 * los documentos `puntoInteres` de Sanity en la fase 2 (mismo modelo de campos).
 * ⚠️ Ninguna distancia ni dato de esta lista está verificado: no publicar sin que
 * Javier los confirme.
 */
export const puntosInteres: PuntoInteres[] = [
  {
    categoria: "que-ver",
    orden: 1,
    nombre: { es: "La dehesa de Los Pedroches", en: "The Los Pedroches dehesa" },
    descripcion: {
      es: "El mayor bosque de encinas de la península. Buena época: primavera y otoño. Rutas a pie y en bici desde el propio pueblo.",
      en: "The largest holm oak woodland in the peninsula. Best visited in spring and autumn, with walking and cycling routes starting right from the village.",
    },
    distanciaKm: 0,
    verificado: true,
  },
  {
    categoria: "que-ver",
    orden: 2,
    nombre: { es: "Villanueva de Córdoba", en: "Villanueva de Córdoba" },
    descripcion: {
      es: "Pueblo de granito con casco histórico y buena oferta de ibérico.",
      en: "A granite town with a historic centre and a good choice of Iberian ham.",
    },
    distanciaKm: 25,
    verificado: false,
  },
  {
    categoria: "que-ver",
    orden: 3,
    nombre: { es: "Castillo de Belalcázar", en: "Belalcázar Castle" },
    descripcion: {
      es: "Torre del homenaje de las más altas de España, visible desde kilómetros.",
      en: "One of Spain's tallest keeps, visible from miles away.",
    },
    distanciaKm: 35,
    verificado: false,
  },
  {
    categoria: "que-ver",
    orden: 4,
    nombre: {
      es: "Parque Natural Sierra de Cardeña y Montoro",
      en: "Sierra de Cardeña y Montoro Natural Park",
    },
    descripcion: {
      es: "Encinares y alcornocales, con fauna ibérica.",
      en: "Holm oak and cork oak woodland, home to native Iberian wildlife.",
    },
    distanciaKm: 50,
    verificado: false,
  },
  {
    categoria: "que-ver",
    orden: 5,
    nombre: { es: "Córdoba capital", en: "Córdoba city" },
    descripcion: {
      es: "Mezquita-Catedral, Judería y Alcázar, en excursión de un día.",
      en: "The Mosque-Cathedral, the Jewish Quarter and the Alcázar, as a day trip.",
    },
    distanciaKm: 70,
    verificado: false,
  },
  {
    categoria: "donde-comer",
    orden: 1,
    nombre: {
      es: "Ibérico de bellota D.O. Los Pedroches",
      en: "Acorn-fed Iberian ham, D.O. Los Pedroches",
    },
    descripcion: {
      es: "La comarca tiene denominación de origen propia para su ibérico de bellota. Es el producto de referencia de la zona.",
      en: "The region has its own protected designation of origin for acorn-fed Iberian ham. It's the area's signature product.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "donde-comer",
    orden: 2,
    nombre: { es: "Quesos y lácteos de la comarca", en: "Local cheeses and dairy" },
    descripcion: {
      es: "Los Pedroches es también tierra ganadera con tradición quesera y láctea, gracias en buena parte a la cooperativa COVAP.",
      en: "Los Pedroches is also livestock country, with a cheese and dairy tradition built in large part around the COVAP cooperative.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "donde-comer",
    orden: 3,
    nombre: { es: "Guisos de cuchara", en: "Hearty stews" },
    descripcion: {
      es: "Cocina de cuchara sencilla y contundente, pensada para el frío del invierno de la dehesa.",
      en: "Simple, generous stews, made for the cold dehesa winters.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "donde-comer",
    orden: 4,
    nombre: { es: "Comprar en el mercado y cocinar en casa", en: "Shop at the market, cook at home" },
    descripcion: {
      es: "Con una cocina independiente en el apartamento, comprar producto local y cocinarlo tú mismo es una opción tan buena como salir a comer.",
      en: "With a separate kitchen in the apartment, buying local produce and cooking it yourself is just as good an option as eating out.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "como-llegar",
    orden: 1,
    nombre: { es: "En coche desde Córdoba", en: "By car from Córdoba" },
    descripcion: {
      es: "Por carretera, en algo menos de una hora. Verificar la carretera exacta y el tiempo real antes de publicar.",
      en: "By road, in a little under an hour. Verify the exact route and the real journey time before publishing.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "como-llegar",
    orden: 2,
    nombre: { es: "En coche desde Madrid", en: "By car from Madrid" },
    descripcion: {
      es: "Por autovía, en torno a tres horas. Verificar la ruta y el tiempo real antes de publicar.",
      en: "By motorway, around three hours. Verify the route and the real journey time before publishing.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "como-llegar",
    orden: 3,
    nombre: { es: "En coche desde Extremadura", en: "By car from Extremadura" },
    descripcion: {
      es: "Buena conexión por carretera. Verificar la ruta y el tiempo real antes de publicar.",
      en: "Well connected by road. Verify the route and the real journey time before publishing.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "como-llegar",
    orden: 4,
    nombre: { es: "En autobús", en: "By bus" },
    descripcion: {
      es: "Hay línea regular de autobús con Córdoba capital. Horarios pendientes de verificar.",
      en: "There's a regular bus line to Córdoba city. Timetables still to be verified.",
    },
    distanciaKm: null,
    verificado: false,
  },
  {
    categoria: "como-llegar",
    orden: 5,
    nombre: { es: "En tren", en: "By train" },
    descripcion: {
      es: "La estación más práctica es la de Córdoba; desde allí se continúa por carretera hasta Pozoblanco. Verificar antes de publicar.",
      en: "The most practical station is Córdoba; from there you continue by road to Pozoblanco. Verify before publishing.",
    },
    distanciaKm: null,
    verificado: false,
  },
];

export function getPuntosInteres(categoria: CategoriaZona) {
  return puntosInteres
    .filter((p) => p.categoria === categoria)
    .sort((a, b) => a.orden - b.orden);
}
