# Fase 1 — Maqueta completa con contenido provisional

> Documento de ejecución. Requiere la fase 0 terminada y verificada.
> Leer antes [`../plan.md`](../plan.md) y [`fase-0-cimientos.md`](fase-0-cimientos.md).

**Objetivo de la fase**: que las 13 páginas del mapa del sitio existan, estén maquetadas en
español e inglés y sean navegables, con los 5 apartamentos provisionales y contenido de relleno.
Al terminar, la web se puede enseñar a alguien y se entiende del todo.

**Lo que esta fase NO hace**: no conecta el CMS (fase 2), no envía formularios de verdad
(fase 3), no tiene metadatos ni datos estructurados (fase 3).

---

## Aviso sobre los textos de esta fase

Todos los textos de este documento son **provisionales pero publicables**: están escritos para
que la web se entienda, no como relleno tipo *lorem ipsum*. Javier los revisará y sustituirá
desde el CMS en la fase 2.

Dos advertencias:

1. Los textos de la guía de la zona contienen **datos concretos (distancias, nombres de sitios)
   que no están verificados**. Van marcados con `⚠️ VERIFICAR` en este documento y deben llevar
   el mismo aviso en el CMS hasta que Javier los confirme. **No publicar la web sin verificarlos.**
2. Las 5 fichas de apartamento son deliberadamente idénticas, por decisión de Javier. No hay que
   inventar diferencias entre ellas.

---

## 1.0 Correcciones heredadas de la fase 0

Dos problemas detectados en el código de la fase 0 que esta fase debe corregir de paso, porque
las páginas nuevas los harían visibles:

- [ ] **`LocaleSwitcher` no traduce el slug.** Hoy sustituye solo el primer segmento de la ruta
      (`/es/xxx` → `/en/xxx`), lo que rompe en cuanto los slugs difieren entre idiomas: desde
      `/en/apartments` llevaría a `/es/apartments` (404, el slug español es `apartamentos`), y
      desde `/es/la-zona` a `/en/la-zona` (404, el slug inglés es `the-area`). Hay que reescribir
      `pathFor()` en `src/components/layout/locale-switcher.tsx` para que reconozca la página
      actual y use `routes.ts` para construir la URL en el idioma destino, no una sustitución de
      texto. Si la ruta no se puede mapear (por ejemplo, una página 404), caer a la home del
      idioma destino en lugar de a una URL rota.
- [ ] **Textos de interfaz escritos a mano en español.** `aria-label="Principal"` (en
      `header.tsx`) y `aria-label="Principal móvil"` (en `mobile-nav.tsx`) están fijos en español
      y se ven también en `/en`, incumpliendo la regla de esta fase de que ningún texto salga
      directamente de un componente. Añadir las claves correspondientes (p. ej.
      `header.navLabel`, `header.mobileNavLabel`) a `es.json` y `en.json` y usarlas en vez del
      texto literal.

---

## 1.1 URLs en inglés mediante rewrites

- [ ] **Sustituir por completo** `next.config.ts` por:

```ts
import type { NextConfig } from "next";

/**
 * Las carpetas de src/app/[locale]/ usan siempre los slugs en español.
 * Estos rewrites hacen que las URLs inglesas sirvan esas mismas páginas
 * sin cambiar la URL que ve el usuario.
 * Si se añade una ruta nueva, hay que añadirla aquí y en src/lib/routes.ts.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/en/apartments", destination: "/en/apartamentos" },
      { source: "/en/apartments/:slug", destination: "/en/apartamentos/:slug" },
      { source: "/en/the-area", destination: "/en/la-zona" },
      { source: "/en/the-area/what-to-see", destination: "/en/la-zona/que-ver" },
      { source: "/en/the-area/where-to-eat", destination: "/en/la-zona/donde-comer" },
      { source: "/en/the-area/how-to-get-here", destination: "/en/la-zona/como-llegar" },
      { source: "/en/book", destination: "/en/reservar" },
      { source: "/en/contact", destination: "/en/contacto" },
      { source: "/en/legal/legal-notice", destination: "/en/legal/aviso-legal" },
      { source: "/en/legal/privacy", destination: "/en/legal/privacidad" },
      // /en/faq y /en/legal/cookies no necesitan rewrite: el slug es igual en ambos idiomas.
    ];
  },
};

export default nextConfig;
```

- [ ] Verificar después de crear las páginas que `/en/apartments` responde 200 y que la barra de
      direcciones sigue mostrando `/en/apartments`.

---

## 1.2 Datos provisionales de los apartamentos

- [ ] Crear `src/data/apartamentos.ts`:

```ts
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
```

- [ ] Crear `src/data/equipamiento.ts`:

```ts
import {
  AirVent,
  BedDouble,
  CookingPot,
  Flame,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { Locale } from "@/i18n/config";

export const equipamiento: Record<
  string,
  { icon: LucideIcon; label: Record<Locale, string> }
> = {
  wifi: { icon: Wifi, label: { es: "Wifi", en: "Wifi" } },
  cocina: { icon: CookingPot, label: { es: "Cocina independiente", en: "Separate kitchen" } },
  lavadora: { icon: WashingMachine, label: { es: "Lavadora", en: "Washing machine" } },
  aire: { icon: AirVent, label: { es: "Aire acondicionado", en: "Air conditioning" } },
  calefaccion: { icon: Flame, label: { es: "Calefacción", en: "Heating" } },
  tv: { icon: Tv, label: { es: "Televisión", en: "Television" } },
  "ropa-cama": { icon: BedDouble, label: { es: "Ropa de cama y toallas", en: "Linen and towels" } },
  menaje: { icon: Utensils, label: { es: "Menaje completo", en: "Full kitchenware" } },
};
```

---

## 1.3 Imágenes de relleno

Se generan SVG de color plano con el nombre encima. Son ligeros, no requieren descargas externas
y dejan claro a simple vista que son provisionales.

- [ ] Crear `scripts/generate-placeholders.mjs`:

```js
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "placeholder");
mkdirSync(OUT, { recursive: true });

const COLORS = ["#E8DCC8", "#D9C9AE", "#C9B593", "#B8A178"];

function svg(label, color, w = 1600, h = 1067) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${color}"/>
  <text x="50%" y="50%" fill="#8A7A5C" font-family="system-ui, sans-serif"
        font-size="${Math.round(w / 22)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

// 4 fotos por apartamento
for (let n = 1; n <= 5; n++) {
  for (let i = 1; i <= 4; i++) {
    writeFileSync(
      join(OUT, `apartamento-${n}-${i}.svg`),
      svg(`Apartamento ${n} · foto ${i}`, COLORS[(i - 1) % COLORS.length]),
    );
  }
}

// Imágenes sueltas
const singles = [
  ["hero", "Pozoblanco", 2400, 1350],
  ["zona-dehesa", "Dehesa de Los Pedroches", 1600, 1067],
  ["zona-que-ver", "Que ver", 1600, 1067],
  ["zona-donde-comer", "Donde comer", 1600, 1067],
  ["zona-como-llegar", "Como llegar", 1600, 1067],
];

for (const [name, label, w, h] of singles) {
  writeFileSync(join(OUT, `${name}.svg`), svg(label, "#E8DCC8", w, h));
}

console.log("Placeholders generados en public/placeholder");
```

- [ ] Añadir el script a `package.json`, dentro de `"scripts"`:

```json
"placeholders": "node scripts/generate-placeholders.mjs"
```

- [ ] Ejecutarlo:

```bash
npm run placeholders
```

- [ ] Comprobar que `public/placeholder/` contiene 25 archivos SVG.

**Nota**: al ser SVG locales no hace falta configurar `remotePatterns` en `next.config.ts`.
Usar siempre `next/image` con `width` y `height` explícitos, o `fill` con un contenedor
`relative` que tenga `aspect-ratio`.

---

## 1.4 Ampliar los diccionarios

- [ ] Añadir a `src/i18n/dictionaries/es.json` estas claves de primer nivel, junto a las que ya
      existen de la fase 0:

```json
{
  "home": {
    "heroTitle": "Apartamentos en el corazón de Los Pedroches",
    "heroSubtitle": "Cinco apartamentos reformados en el centro de Pozoblanco, pensados tanto para una escapada a la dehesa como para una estancia de trabajo.",
    "heroCta": "Ver apartamentos",
    "heroCtaSecondary": "Consultar disponibilidad",
    "valuesTitle": "Por qué Orosio",
    "values": [
      {
        "title": "En el centro de Pozoblanco",
        "text": "A pie de comercios, bares, el hospital comarcal y los polígonos. Sin necesidad de coger el coche para todo."
      },
      {
        "title": "Cocina independiente",
        "text": "Equipada de verdad, no un rincón con microondas. Pensada para estancias de varios días."
      },
      {
        "title": "Reserva directa sin comisiones",
        "text": "El mismo apartamento, mejor precio que en las plataformas. Lo que te ahorras no se lo lleva un intermediario."
      },
      {
        "title": "Trato directo con el propietario",
        "text": "Sin centralitas ni respuestas automáticas. Escribes y te contesta quien tiene las llaves."
      }
    ],
    "apartmentsTitle": "Nuestros apartamentos",
    "apartmentsSubtitle": "Cinco apartamentos de un dormitorio con cocina independiente, todos en el centro.",
    "apartmentsCta": "Ver los cinco apartamentos",
    "directTitle": "Reserva directa: el mismo apartamento, mejor precio",
    "directText": "Cuando reservas por Booking o Airbnb, una parte de lo que pagas se queda en la plataforma. Reservando aquí ese margen se queda entre tú y nosotros.",
    "directPoints": [
      "Mejor precio que en las plataformas",
      "Flexibilidad para acordar horarios de entrada y salida",
      "Trato directo por teléfono o WhatsApp"
    ],
    "directCta": "Solicitar reserva directa",
    "zoneTitle": "Los Pedroches, más cerca de lo que crees",
    "zoneText": "Dehesa de encinas hasta donde alcanza la vista, pueblos de granito, castillos y el mejor ibérico de bellota de Córdoba. Pozoblanco es la puerta de entrada al valle.",
    "zoneCta": "Descubrir la zona",
    "finalCtaTitle": "¿Ya sabes cuándo vienes?",
    "finalCtaText": "Cuéntanos tus fechas y te confirmamos disponibilidad y precio.",
    "finalCtaButton": "Consultar disponibilidad"
  },
  "apartments": {
    "title": "Apartamentos",
    "intro": "Cinco apartamentos de un dormitorio con cocina independiente en el centro de Pozoblanco. Todos con la misma distribución y el mismo equipamiento.",
    "from": "Desde",
    "perNight": "por noche",
    "viewDetail": "Ver apartamento",
    "guests": "huéspedes",
    "bedrooms": "dormitorio",
    "bedroomsPlural": "dormitorios",
    "bathrooms": "baño",
    "bathroomsPlural": "baños",
    "surface": "m²"
  },
  "apartment": {
    "backToList": "Todos los apartamentos",
    "aboutTitle": "El apartamento",
    "amenitiesTitle": "Equipamiento",
    "galleryTitle": "Galería",
    "bookTitle": "Reservar este apartamento",
    "bookDirect": "Solicitar reserva directa",
    "bookBooking": "Ver en Booking",
    "bookAirbnb": "Ver en Airbnb",
    "bookPending": "Estamos terminando de publicar este apartamento en las plataformas. Mientras tanto, escríbenos y te confirmamos disponibilidad.",
    "licence": "Registro de Turismo de Andalucía",
    "licencePending": "Número de registro pendiente de publicación.",
    "galleryOpen": "Ampliar imagen",
    "galleryClose": "Cerrar",
    "galleryPrev": "Imagen anterior",
    "galleryNext": "Imagen siguiente"
  },
  "zone": {
    "title": "La zona",
    "intro": "Pozoblanco es la capital de Los Pedroches, un valle de dehesa al norte de la provincia de Córdoba. Esto es lo que puedes hacer si vienes unos días.",
    "seeTitle": "Qué ver",
    "seeIntro": "Lo que merece la pena en el valle y alrededores.",
    "eatTitle": "Dónde comer",
    "eatIntro": "Los Pedroches es tierra de ibérico de bellota y de guisos de cuchara.",
    "getThereTitle": "Cómo llegar",
    "getThereIntro": "Pozoblanco está bien conectado por carretera con Córdoba, Madrid y Extremadura.",
    "readMore": "Leer más",
    "unverified": "Información orientativa pendiente de verificar."
  },
  "book": {
    "title": "Reservar",
    "intro": "Cuéntanos tus fechas y te respondemos con disponibilidad y precio. También puedes reservar en las plataformas de siempre.",
    "directTitle": "Reserva directa",
    "directText": "Es la opción más barata para ti y la que nos permite ser flexibles con los horarios.",
    "channelsTitle": "O reserva en las plataformas",
    "channelsText": "Si prefieres la comodidad de reservar donde ya tienes cuenta, también estamos allí.",
    "comparisonTitle": "Qué cambia según dónde reserves",
    "comparisonDirect": "Reserva directa",
    "comparisonPlatforms": "Booking / Airbnb",
    "comparisonRows": [
      { "label": "Precio", "direct": "El más bajo", "platforms": "Incluye la comisión de la plataforma" },
      { "label": "Horarios de entrada y salida", "direct": "Negociables", "platforms": "Los fijados en el anuncio" },
      { "label": "Atención", "direct": "Directa con el propietario", "platforms": "A través de la plataforma" },
      { "label": "Pago", "direct": "Acordado contigo", "platforms": "Según la plataforma" }
    ]
  },
  "contact": {
    "title": "Contacto",
    "intro": "Escríbenos y te contestamos lo antes posible. Si prefieres, también puedes llamarnos o mandarnos un WhatsApp.",
    "formTitle": "Escríbenos",
    "name": "Nombre",
    "email": "Email",
    "phone": "Teléfono",
    "dates": "Fechas aproximadas",
    "guests": "Nº de huéspedes",
    "message": "Mensaje",
    "send": "Enviar",
    "required": "Campo obligatorio",
    "placeholderName": "Cómo te llamas",
    "placeholderEmail": "tu@email.com",
    "placeholderPhone": "Opcional",
    "placeholderDates": "Por ejemplo: del 12 al 15 de abril",
    "placeholderMessage": "Cuéntanos lo que necesites saber",
    "directTitle": "Contacto directo",
    "whatsapp": "Escribir por WhatsApp",
    "notWorking": "El formulario todavía no está conectado. Se activa en la fase 3."
  },
  "faq": {
    "title": "Preguntas frecuentes",
    "intro": "Lo que más nos preguntan antes de reservar.",
    "items": [
      {
        "q": "¿A qué hora puedo entrar y salir?",
        "a": "La entrada es a partir de las 16:00 y la salida antes de las 11:00. Si reservas directamente con nosotros podemos ajustar los horarios según la ocupación."
      },
      {
        "q": "¿Hay que pagar fianza?",
        "a": "Pendiente de confirmar. Lo indicaremos aquí antes de abrir las reservas directas."
      },
      {
        "q": "¿Se admiten mascotas?",
        "a": "Pendiente de confirmar."
      },
      {
        "q": "¿Hay wifi?",
        "a": "Sí, todos los apartamentos tienen wifi incluido en el precio."
      },
      {
        "q": "¿Hay dónde aparcar?",
        "a": "Pendiente de confirmar."
      },
      {
        "q": "¿Se puede fumar?",
        "a": "No. Todos los apartamentos son de no fumadores."
      },
      {
        "q": "¿Puedo reservar para una sola noche?",
        "a": "Pendiente de confirmar la estancia mínima por temporada."
      },
      {
        "q": "¿Qué pasa si tengo que cancelar?",
        "a": "La política de cancelación está pendiente de definir para la reserva directa. En Booking y Airbnb se aplica la que figure en cada anuncio."
      }
    ],
    "pendingNote": "Algunas respuestas están pendientes de confirmar. Se completarán antes de publicar la web."
  }
}
```

- [ ] Traducir **todas** esas claves en `src/i18n/dictionaries/en.json`, manteniendo exactamente
      la misma estructura, el mismo orden y el mismo número de elementos en los arrays.
      El inglés debe ser británico y natural, no traducción literal. Ejemplos de referencia para
      el tono:
  - `heroTitle`: "Apartments in the heart of Los Pedroches"
  - `heroSubtitle`: "Five refurbished apartments in the centre of Pozoblanco, made for a getaway
    into the dehesa and for work stays alike."
  - `directTitle`: "Book direct: same apartment, better price"
  - `zoneTitle`: "Los Pedroches is closer than you think"

- [ ] Tras editar los dos archivos, comprobar que tienen el mismo conjunto de claves:

```bash
node -e "const a=require('./src/i18n/dictionaries/es.json'),b=require('./src/i18n/dictionaries/en.json');const k=o=>Object.keys(o).flatMap(x=>typeof o[x]==='object'&&!Array.isArray(o[x])?Object.keys(o[x]).map(y=>x+'.'+y):[x]).sort();const A=k(a),B=k(b);console.log(JSON.stringify(A)===JSON.stringify(B)?'OK: mismas claves':'DIFERENCIAS:\n'+A.filter(x=>!B.includes(x)).map(x=>'falta en en: '+x).concat(B.filter(x=>!A.includes(x)).map(x=>'sobra en en: '+x)).join('\n'))"
```

---

## 1.5 Componentes nuevos

Crear en `src/components/`. Especificación exacta de cada uno:

### `ui/heading.tsx`
Título de sección con antetítulo opcional.
Props: `{ eyebrow?: string; title: string; subtitle?: string; align?: "left" | "center"; className?: string }`.
Estructura: `eyebrow` en `text-sm uppercase tracking-wide text-oliva font-semibold`, `title` en
`<h2>`, `subtitle` en `<p className="mt-3 max-w-2xl text-lg text-granito">`.
Si `align === "center"`, añadir `text-center` y `mx-auto` al subtítulo.

### `ui/accordion.tsx` (cliente)
Acordeón accesible para la FAQ.
Props: `{ items: { q: string; a: string }[] }`.
Implementar con `<details>` y `<summary>` nativos: es accesible sin JavaScript y no necesita
estado. Estilo: cada `<details>` con `border-b border-arena`, el `<summary>` con
`cursor-pointer list-none py-4 font-medium flex items-center justify-between`, un icono
`ChevronDown` de lucide que rote con `group-open:rotate-180`, y la respuesta en
`pb-4 text-granito`.
Al usar `<details>` el componente **no necesita** `"use client"`.

### `ui/breadcrumbs.tsx`
Props: `{ items: { label: string; href?: string }[] }`.
`<nav aria-label="Breadcrumb">` con `<ol>` en línea, separador `/` con `aria-hidden`, el último
elemento sin enlace y con `aria-current="page"`. Texto `text-sm text-granito`, enlaces con
`hover:text-terracota-700`.

### `apartments/apartment-card.tsx`
Props: `{ apartamento: Apartamento; locale: Locale; dict: Dictionary }`.
Usa `Card`. Dentro:
1. Imagen `next/image` con `fill`, contenedor `relative aspect-[3/2]`, `className="object-cover"`,
   `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"`.
2. Cuerpo con `p-5`: `<h3>` con el nombre, párrafo con `descripcionCorta` en `text-sm text-granito`.
3. Fila de datos: plazas · dormitorios · baños · m², separados por `·`, en `text-sm text-granito`.
4. Pie: "Desde **55 €** por noche" a la izquierda y `Button` `secondary` `sm` a la derecha.
La tarjeta entera **no** es un enlace; el enlace es el botón y el título. Evita enlaces anidados.

### `apartments/amenities-list.tsx`
Props: `{ claves: string[]; locale: Locale }`.
Rejilla `grid grid-cols-2 gap-4 sm:grid-cols-3`. Cada elemento: icono de lucide a 20 px en
`text-oliva` y la etiqueta en `text-sm text-carbon`.

### `apartments/gallery.tsx` (cliente)
Galería con lightbox. Props: `{ imagenes: string[]; nombre: string; labels: { open: string; close: string; prev: string; next: string } }`.
Comportamiento exacto:
- Rejilla: la primera imagen ocupa dos columnas y dos filas, el resto una celda.
  `grid grid-cols-2 gap-2 md:grid-cols-4`, la primera con `col-span-2 row-span-2`.
- Al pulsar una imagen se abre un overlay `fixed inset-0 z-50 bg-carbon/95`.
- Dentro del overlay: la imagen centrada, botón de cerrar arriba a la derecha, flechas a los
  lados y contador "3 / 12" abajo.
- Teclado: `Escape` cierra, `ArrowLeft` y `ArrowRight` navegan. Registrar el listener en un
  `useEffect` y **limpiarlo al desmontar**.
- Al abrir, poner `document.body.style.overflow = "hidden"`; restaurarlo al cerrar.
- Todos los botones con `aria-label` tomado de `labels`.
- El overlay con `role="dialog"` y `aria-modal="true"`.

### `sections/value-props.tsx`
Props: `{ title: string; values: { title: string; text: string }[] }`.
Rejilla `grid gap-8 md:grid-cols-2 lg:grid-cols-4`. Cada valor: un icono en círculo
`h-11 w-11 rounded-full bg-oliva/10 text-oliva`, título en `<h3>` y texto en `text-granito`.
Iconos por orden: `MapPin`, `CookingPot`, `PiggyBank`, `MessageCircle`.

### `sections/direct-booking.tsx`
Props: `{ locale: Locale; dict: Dictionary }`.
Bloque de dos columnas sobre fondo `arena`: a la izquierda título, texto y lista con iconos
`Check` en `text-oliva`; a la derecha un `Button` primario grande hacia `routes.book(locale)`.
**Ojo con el contraste**: sobre `arena` el texto debe ser `text-carbon`, nunca `text-granito`.

### `sections/final-cta.tsx`
Props: `{ title: string; text: string; buttonLabel: string; href: string }`.
Banda a ancho completo con fondo `terracota-700`, texto blanco centrado y botón blanco con texto
`terracota-700`.

### `forms/contact-form.tsx` (cliente)
En esta fase es **solo maquetación**: `onSubmit` hace `event.preventDefault()` y muestra el aviso
`dict.contact.notWorking`. La lógica real llega en la fase 3.
Campos: nombre (requerido), email (requerido, `type="email"`), teléfono, fechas, nº de huéspedes
(`type="number"`, `min=1`, `max=4`), mensaje (`textarea`, 5 filas).
Cada campo con `<label htmlFor>` real, no *placeholder* como etiqueta.
Estilo de los campos: `w-full rounded-lg border border-arena bg-white px-4 py-2.5 text-carbon
placeholder:text-granito focus:border-terracota-600`.

**Tareas:**

- [ ] `ui/heading.tsx`
- [ ] `ui/accordion.tsx`
- [ ] `ui/breadcrumbs.tsx`
- [ ] `apartments/apartment-card.tsx`
- [ ] `apartments/amenities-list.tsx`
- [ ] `apartments/gallery.tsx`
- [ ] `sections/value-props.tsx`
- [ ] `sections/direct-booking.tsx`
- [ ] `sections/final-cta.tsx`
- [ ] `forms/contact-form.tsx`

---

## 1.6 Páginas

Todas las páginas van en `src/app/[locale]/` y todas siguen el mismo patrón de cabecera:

```tsx
export default async function XPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  // ...
}
```

Recordatorio: `params` es una promesa en Next.js 15.

### `page.tsx` — Home
- [ ] Secciones en este orden:
  1. **Hero**: fondo con `public/placeholder/hero.svg` a ancho completo, alto `min-h-[70vh]`,
     overlay `bg-carbon/45`, texto blanco centrado, `heroTitle` como `<h1>`, `heroSubtitle`,
     y dos botones: primario hacia apartamentos y secundario (blanco, borde blanco) hacia reservar.
  2. **ValueProps** con fondo `cal`.
  3. **Apartamentos destacados**: `Heading` + rejilla de 3 `ApartmentCard` (los que tienen
     `destacado: true`) + `Button` `secondary` centrado hacia el listado. Fondo `arena-light`.
  4. **DirectBooking**.
  5. **Teaser de la zona**: dos columnas, imagen `zona-dehesa.svg` a la izquierda, texto y botón
     a la derecha. Fondo `cal`.
  6. **FinalCta**.

### `apartamentos/page.tsx` — Listado
- [ ] `Breadcrumbs` → `Heading` con `apartments.title` e `intro` → rejilla
      `grid gap-8 md:grid-cols-2 lg:grid-cols-3` con las 5 `ApartmentCard` → `FinalCta`.

### `apartamentos/[slug]/page.tsx` — Ficha
- [ ] Implementar `generateStaticParams` devolviendo el producto cartesiano de locales y slugs:

```tsx
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    apartamentos.map((a) => ({ locale, slug: a.slug })),
  );
}
```

- [ ] Si `getApartamento(slug)` devuelve `undefined`, llamar a `notFound()`.
- [ ] Estructura:
  1. `Breadcrumbs`: inicio / apartamentos / nombre.
  2. `<h1>` con el nombre y, debajo, la fila de datos (plazas, dormitorios, baños, m²).
  3. `Gallery`.
  4. Dos columnas en `lg`: a la izquierda `descripcionLarga` (un `<p>` por elemento del array) y
     `AmenitiesList`; a la derecha una tarjeta pegajosa (`lg:sticky lg:top-28`) con el precio
     desde, el botón primario "Solicitar reserva directa", y los botones a Booking y Airbnb.
  5. **Botones de plataformas condicionales**: renderizar el botón de Booking solo si
     `urlBooking` no es `null`, e igual con Airbnb. Si **ambos** son `null`, mostrar en su lugar
     el texto `dict.apartment.bookPending`. Esta lógica es importante: hoy las dos URLs son
     `null` para los cinco apartamentos.
  6. Debajo de la tarjeta, el número VFT: si `licenciaVFT` es `null`, mostrar
     `dict.apartment.licencePending`.
  7. `FinalCta`.

### `la-zona/page.tsx` — Índice de la guía
- [ ] `Heading` con `zone.title` y `zone.intro`, más tres `Card` enlazando a las subpáginas, cada
      una con su imagen (`zona-que-ver.svg`, `zona-donde-comer.svg`, `zona-como-llegar.svg`),
      título y `readMore`.

### `la-zona/que-ver/page.tsx`
- [ ] Contenido provisional. **Todo el bloque lleva el aviso `zone.unverified` visible en un
      recuadro `bg-arena` al principio de la página**, porque los datos no están comprobados.

Contenido a escribir (⚠️ VERIFICAR todas las distancias antes de publicar):

| Lugar | Texto ES | Distancia aprox. |
|---|---|---|
| La dehesa de Los Pedroches | El mayor bosque de encinas de la península. Buena época: primavera y otoño. Rutas a pie y en bici desde el propio pueblo. | 0 km |
| Villanueva de Córdoba | Pueblo de granito con casco histórico y buena oferta de ibérico. | ⚠️ ~25 km |
| Castillo de Belalcázar | Torre del homenaje de las más altas de España, visible desde kilómetros. | ⚠️ ~35 km |
| Parque Natural Sierra de Cardeña y Montoro | Encinares y alcornocales, con fauna ibérica. | ⚠️ ~50 km |
| Córdoba capital | Mezquita-Catedral, Judería y Alcázar, en excursión de un día. | ⚠️ ~70 km |

### `la-zona/donde-comer/page.tsx`
- [ ] Contenido provisional, con el mismo aviso de no verificado. **No inventar nombres de
      restaurantes concretos**: hablar de producto y tipo de local, no de establecimientos.
      Temas: ibérico de bellota con Denominación de Origen Los Pedroches, quesos y lácteos de la
      comarca, guisos de cuchara, y la recomendación de comprar en el mercado y cocinar en el
      apartamento (que enlaza con el argumento de la cocina independiente).

### `la-zona/como-llegar/page.tsx`
- [ ] Contenido provisional, con aviso de no verificado. Bloques: **en coche** desde Córdoba,
      Madrid y Extremadura (⚠️ VERIFICAR carreteras y tiempos); **en autobús**, mencionando que
      hay línea con Córdoba sin dar horarios; **en tren**, indicando que la estación más práctica
      es Córdoba y desde allí se continúa por carretera (⚠️ VERIFICAR).
      Cerrar con un mapa embebido de OpenStreetMap centrado en Pozoblanco mediante `<iframe>`
      con `loading="lazy"` y `title` descriptivo. **No usar Google Maps**: embeberlo instala
      cookies y complica el consentimiento RGPD de la fase 3.

### `reservar/page.tsx`
- [ ] `Heading` con `book.title` e `intro`, luego:
  1. Bloque "Reserva directa" con el `ContactForm`.
  2. Bloque "O reserva en las plataformas": como todas las URLs son `null`, mostrar de momento
     el texto `apartment.bookPending`. Dejar el código preparado para listar los apartamentos con
     sus botones en cuanto haya URLs.
  3. Tabla comparativa a partir de `book.comparisonRows`. En móvil, convertirla en tarjetas
     apiladas en lugar de una tabla con scroll horizontal.

### `contacto/page.tsx`
- [ ] Dos columnas: a la izquierda el `ContactForm`, a la derecha los datos de contacto
      (pendientes de Javier: dejar marcadores visibles `[pendiente]` en teléfono y email) y un
      botón de WhatsApp desactivado con un comentario `{/* TODO fase 3: número real */}`.

### `faq/page.tsx`
- [ ] `Heading` + aviso `faq.pendingNote` en recuadro `bg-arena` + `Accordion` con `faq.items`.

### Páginas legales
- [ ] Crear `legal/aviso-legal/page.tsx`, `legal/privacidad/page.tsx` y
      `legal/cookies/page.tsx` como **esqueletos**: título, un párrafo que diga que el contenido
      está pendiente de los datos fiscales, y nada más. El texto legal completo se escribe en la
      fase 3, cuando Javier facilite razón social y NIF.

---

## 1.7 Revisión responsive

- [ ] Revisar cada página a 375 px, 768 px, 1024 px y 1440 px de ancho.
- [ ] Comprobar que ninguna página produce scroll horizontal.
- [ ] Comprobar que las imágenes mantienen su proporción y no se deforman.
- [ ] Comprobar que la tarjeta pegajosa de la ficha de apartamento no se pega en móvil.
- [ ] Comprobar que la tabla comparativa de `/reservar` se apila en móvil.

---

## 1.8 Lista de verificación de cierre

- [ ] `npm run build` y `npm run lint` pasan limpios.
- [ ] Las 13 páginas existen y responden en `/es` y en `/en`.
- [ ] Las URLs inglesas con slug traducido (`/en/apartments`, `/en/the-area/what-to-see`…)
      responden 200 y conservan la URL en la barra de direcciones.
- [ ] Ningún texto visible está en el idioma equivocado. Recorrer la web entera en inglés.
- [ ] Ningún texto está escrito directamente en un componente: todo sale de los diccionarios o
      de `src/data/`.
- [ ] Los 5 apartamentos aparecen en el listado y sus 5 fichas cargan.
- [ ] En las fichas **no** aparece ningún botón de Booking ni de Airbnb (porque las URLs son
      `null`), sino el mensaje `bookPending`.
- [ ] En las fichas aparece el aviso de licencia pendiente.
- [ ] La galería se abre, navega con flechas, cierra con `Escape` y bloquea el scroll del fondo.
- [ ] El acordeón de la FAQ funciona con teclado.
- [ ] Todas las páginas de la guía de la zona muestran el aviso de información sin verificar.
- [ ] Ninguna imagen carece de `alt`.
- [ ] Se respetan las reglas de contraste de `plan.md` §2.
- [ ] Commit y despliegue en Vercel correctos.
- [ ] Marcada la fase 1 como completada en la tabla de [`../plan.md`](../plan.md).
