# Fase 2 — Sanity

> Documento de ejecución. Requiere la fase 1 terminada y verificada.
> Leer antes [`../plan.md`](../plan.md).

**Objetivo de la fase**: que todo el contenido que hoy vive en `src/data/` y en los diccionarios
pase a un CMS donde Javier pueda editarlo sin tocar código, incluidas las fotos reales, los
códigos VFT y las URLs de Booking y Airbnb.

**Principio rector**: Sanity guarda **contenido**. No guarda disponibilidad, ni precios por
fecha, ni reservas: eso será del channel manager en la fase 5.

**Qué NO migra a Sanity**: los textos de interfaz (botones, etiquetas de formulario, nombres de
menú). Esos se quedan en `src/i18n/dictionaries/`. A Sanity solo va el contenido editorial:
apartamentos, puntos de interés, FAQ, reseñas y ajustes del sitio.

---

## 2.1 Crear el proyecto en Sanity

Requiere cuenta de Sanity. Si no está disponible, parar y avisar.

- [ ] Instalar dependencias:

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision styled-components
```

- [ ] Iniciar sesión y crear el proyecto:

```bash
npx sanity@latest login
npx sanity@latest projects create "Apartamentos Orosio"
```

- [ ] Anotar el **Project ID** que devuelve el comando.
- [ ] Crear `.env.local` en la raíz (este archivo **no** se sube a git):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
SANITY_API_READ_TOKEN=
```

- [ ] Crear también `.env.example` con las mismas claves y valores vacíos. Este **sí** se sube.
- [ ] En [sanity.io/manage](https://sanity.io/manage), dentro del proyecto, en *API → CORS
      origins*, añadir `http://localhost:3000` y la URL de producción de Vercel, ambas con
      credenciales permitidas.

---

## 2.2 Esquemas

Crear la carpeta `sanity/` en la raíz del proyecto con esta estructura:

```
sanity/
├─ env.ts
├─ structure.ts
└─ schemas/
   ├─ index.ts
   ├─ apartamento.ts
   ├─ equipamiento.ts
   ├─ punto-interes.ts
   ├─ faq.ts
   ├─ resena.ts
   ├─ ajustes-sitio.ts
   └─ objects/
      └─ texto-localizado.ts
```

### Decisión sobre multiidioma en Sanity

**No se usa el plugin `sanity-plugin-internationalized-array` ni documentos duplicados por
idioma.** Se usa un objeto simple con un campo por idioma. Es menos elegante pero mucho más fácil
de entender, tanto para Javier al editar como para quien programe. Con solo dos idiomas y pocos
documentos, es la opción correcta.

- [ ] Crear `sanity/schemas/objects/texto-localizado.ts`:

```ts
import { defineField, defineType } from "sanity";

/** Cadena corta en los dos idiomas. */
export const textoLocalizado = defineType({
  name: "textoLocalizado",
  title: "Texto",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

/** Párrafo o texto largo en los dos idiomas. */
export const textoLargoLocalizado = defineType({
  name: "textoLargoLocalizado",
  title: "Texto largo",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "text", rows: 4 }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});

/** Contenido con formato en los dos idiomas. */
export const bloqueLocalizado = defineType({
  name: "bloqueLocalizado",
  title: "Contenido",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
  ],
});
```

- [ ] Crear `sanity/schemas/apartamento.ts`:

```ts
import { Home } from "lucide-react";
import { defineField, defineType } from "sanity";

export const apartamento = defineType({
  name: "apartamento",
  title: "Apartamento",
  type: "document",
  icon: Home,
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "caracteristicas", title: "Características" },
    { name: "fotos", title: "Fotos" },
    { name: "canales", title: "Canales y licencia" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "textoLocalizado",
      group: "contenido",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (parte final de la URL)",
      type: "slug",
      group: "contenido",
      options: { source: "nombre.es", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "orden",
      title: "Orden en el listado",
      type: "number",
      group: "contenido",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta (para las tarjetas)",
      type: "textoLargoLocalizado",
      group: "contenido",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción larga (ficha)",
      type: "bloqueLocalizado",
      group: "contenido",
    }),
    defineField({ name: "dormitorios", title: "Dormitorios", type: "number", group: "caracteristicas" }),
    defineField({ name: "banos", title: "Baños", type: "number", group: "caracteristicas" }),
    defineField({ name: "plazas", title: "Plazas", type: "number", group: "caracteristicas" }),
    defineField({ name: "metros", title: "Metros cuadrados", type: "number", group: "caracteristicas" }),
    defineField({ name: "planta", title: "Planta", type: "string", group: "caracteristicas" }),
    defineField({ name: "ascensor", title: "Tiene ascensor", type: "boolean", group: "caracteristicas" }),
    defineField({
      name: "equipamiento",
      title: "Equipamiento",
      type: "array",
      group: "caracteristicas",
      of: [{ type: "reference", to: [{ type: "equipamiento" }] }],
    }),
    defineField({
      name: "galeria",
      title: "Galería de fotos",
      type: "array",
      group: "fotos",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo (describe la foto)",
              type: "textoLocalizado",
              validation: (r: any) => r.required(),
            },
          ],
        },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "precioDesde",
      title: "Precio desde (€/noche, orientativo)",
      type: "number",
      group: "contenido",
      description:
        "Solo para las tarjetas del listado. El precio real por fecha vendrá del channel manager.",
    }),
    defineField({
      name: "licenciaVFT",
      title: "Código VFT del Registro de Turismo de Andalucía",
      type: "string",
      group: "canales",
      description: "Formato VFT/CO/xxxxx. Obligatorio mostrarlo antes de publicar la web.",
    }),
    defineField({
      name: "urlBooking",
      title: "URL del anuncio en Booking",
      type: "url",
      group: "canales",
      description: "Si se deja vacío, el botón de Booking no aparece en la web.",
    }),
    defineField({
      name: "urlAirbnb",
      title: "URL del anuncio en Airbnb",
      type: "url",
      group: "canales",
      description: "Si se deja vacío, el botón de Airbnb no aparece en la web.",
    }),
    defineField({
      name: "channelManagerId",
      title: "ID de la unidad en el channel manager",
      type: "string",
      group: "canales",
      description: "Se rellenará en la fase 5. Dejar vacío por ahora.",
    }),
    defineField({ name: "destacado", title: "Destacar en la portada", type: "boolean", group: "contenido" }),
  ],
  orderings: [
    { title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre.es", media: "galeria.0", subtitle: "slug.current" },
  },
});
```

- [ ] Crear `sanity/schemas/equipamiento.ts`:

```ts
import { defineField, defineType } from "sanity";

/**
 * Las claves de icono deben coincidir con las de src/data/equipamiento.ts.
 * Si se añade una nueva, hay que añadirla también allí o no se pintará ningún icono.
 */
export const equipamiento = defineType({
  name: "equipamiento",
  title: "Equipamiento",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "textoLocalizado",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconKey",
      title: "Icono",
      type: "string",
      validation: (r) => r.required(),
      options: {
        list: [
          "wifi",
          "cocina",
          "lavadora",
          "aire",
          "calefaccion",
          "tv",
          "ropa-cama",
          "menaje",
          "parking",
          "ascensor",
        ],
      },
    }),
  ],
  preview: { select: { title: "nombre.es", subtitle: "iconKey" } },
});
```

- [ ] Crear `sanity/schemas/punto-interes.ts`:

```ts
import { defineField, defineType } from "sanity";

export const puntoInteres = defineType({
  name: "puntoInteres",
  title: "Punto de interés",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre", type: "textoLocalizado", validation: (r) => r.required() }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Qué ver", value: "que-ver" },
          { title: "Dónde comer", value: "donde-comer" },
          { title: "Cómo llegar", value: "como-llegar" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "descripcion", title: "Descripción", type: "textoLargoLocalizado" }),
    defineField({ name: "distanciaKm", title: "Distancia desde Pozoblanco (km)", type: "number" }),
    defineField({
      name: "verificado",
      title: "Dato verificado por el propietario",
      type: "boolean",
      initialValue: false,
      description:
        "Mientras esté desmarcado, la web muestra un aviso de información sin verificar.",
    }),
    defineField({ name: "imagen", title: "Imagen", type: "image", options: { hotspot: true } }),
    defineField({ name: "orden", title: "Orden", type: "number" }),
  ],
  preview: { select: { title: "nombre.es", subtitle: "categoria" } },
});
```

- [ ] Crear `sanity/schemas/faq.ts`:

```ts
import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({ name: "pregunta", title: "Pregunta", type: "textoLocalizado", validation: (r) => r.required() }),
    defineField({ name: "respuesta", title: "Respuesta", type: "textoLargoLocalizado", validation: (r) => r.required() }),
    defineField({ name: "orden", title: "Orden", type: "number" }),
    defineField({
      name: "pendiente",
      title: "Respuesta pendiente de confirmar",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "pregunta.es" } },
});
```

- [ ] Crear `sanity/schemas/resena.ts`:

```ts
import { defineField, defineType } from "sanity";

export const resena = defineType({
  name: "resena",
  title: "Reseña",
  type: "document",
  fields: [
    defineField({ name: "autor", title: "Nombre del huésped", type: "string", validation: (r) => r.required() }),
    defineField({ name: "pais", title: "País", type: "string" }),
    defineField({ name: "texto", title: "Texto", type: "textoLargoLocalizado", validation: (r) => r.required() }),
    defineField({ name: "puntuacion", title: "Puntuación sobre 10", type: "number", validation: (r) => r.min(0).max(10) }),
    defineField({
      name: "origen",
      title: "Origen",
      type: "string",
      options: { list: ["Booking", "Airbnb", "Directa"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "fecha", title: "Fecha", type: "date" }),
  ],
  preview: { select: { title: "autor", subtitle: "origen" } },
});
```

- [ ] Crear `sanity/schemas/ajustes-sitio.ts`:

```ts
import { defineField, defineType } from "sanity";

/** Documento único (singleton). Ver sanity/structure.ts. */
export const ajustesSitio = defineType({
  name: "ajustesSitio",
  title: "Ajustes del sitio",
  type: "document",
  groups: [
    { name: "contacto", title: "Contacto", default: true },
    { name: "fiscal", title: "Datos fiscales" },
    { name: "portada", title: "Portada" },
  ],
  fields: [
    defineField({ name: "email", title: "Email de contacto", type: "string", group: "contacto" }),
    defineField({ name: "telefono", title: "Teléfono", type: "string", group: "contacto" }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contacto",
      description: "Con prefijo internacional y sin espacios ni signos. Ejemplo: 34600111222",
    }),
    defineField({ name: "direccion", title: "Dirección", type: "string", group: "contacto" }),
    defineField({ name: "instagram", title: "URL de Instagram", type: "url", group: "contacto" }),
    defineField({ name: "razonSocial", title: "Nombre o razón social", type: "string", group: "fiscal" }),
    defineField({ name: "nif", title: "NIF / CIF", type: "string", group: "fiscal" }),
    defineField({ name: "domicilioFiscal", title: "Domicilio fiscal", type: "string", group: "fiscal" }),
    defineField({ name: "heroTitulo", title: "Titular de portada", type: "textoLocalizado", group: "portada" }),
    defineField({ name: "heroSubtitulo", title: "Subtítulo de portada", type: "textoLargoLocalizado", group: "portada" }),
    defineField({ name: "heroImagen", title: "Imagen de portada", type: "image", options: { hotspot: true }, group: "portada" }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del sitio" }) },
});
```

- [ ] Crear `sanity/schemas/index.ts`:

```ts
import { ajustesSitio } from "./ajustes-sitio";
import { apartamento } from "./apartamento";
import { equipamiento } from "./equipamiento";
import { faq } from "./faq";
import {
  bloqueLocalizado,
  textoLargoLocalizado,
  textoLocalizado,
} from "./objects/texto-localizado";
import { puntoInteres } from "./punto-interes";
import { resena } from "./resena";

export const schemaTypes = [
  // Objetos
  textoLocalizado,
  textoLargoLocalizado,
  bloqueLocalizado,
  // Documentos
  apartamento,
  equipamiento,
  puntoInteres,
  faq,
  resena,
  ajustesSitio,
];
```

---

## 2.3 Studio embebido

- [ ] Crear `sanity/env.ts`:

```ts
function required(value: string | undefined, name: string) {
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);
export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
```

- [ ] Crear `sanity/structure.ts` para que "Ajustes del sitio" sea un documento único y no una
      lista donde Javier pueda crear duplicados:

```ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Apartamentos")
        .child(S.documentTypeList("apartamento").title("Apartamentos")),
      S.listItem()
        .title("Puntos de interés")
        .child(S.documentTypeList("puntoInteres").title("Puntos de interés")),
      S.listItem().title("Preguntas frecuentes").child(S.documentTypeList("faq")),
      S.listItem().title("Reseñas").child(S.documentTypeList("resena")),
      S.listItem().title("Equipamiento").child(S.documentTypeList("equipamiento")),
      S.divider(),
      S.listItem()
        .title("Ajustes del sitio")
        .child(S.document().schemaType("ajustesSitio").documentId("ajustesSitio")),
    ]);
```

- [ ] Crear `sanity.config.ts` en la **raíz** del proyecto:

```ts
"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Apartamentos Orosio",
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
```

- [ ] Crear `src/app/studio/[[...tool]]/page.tsx`:

```tsx
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";
export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] Confirmar que el `matcher` del middleware (fase 0) excluye `/studio`. Ya lo hace; si se ha
      modificado, restaurarlo.
- [ ] Arrancar `npm run dev`, abrir `http://localhost:3000/studio` y comprobar que carga el panel
      con las secciones de `structure.ts`.

---

## 2.4 Cliente y consultas

- [ ] Crear `src/lib/sanity/client.ts`:

```ts
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../../../sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
```

- [ ] Crear `src/lib/sanity/image.ts`:

```ts
import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "../../../sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max");
}
```

- [ ] Crear `src/lib/sanity/queries.ts` con las consultas GROQ. Cada consulta recibe el idioma y
      **devuelve ya el campo resuelto**, para que los componentes no tengan que saber que el
      contenido es bilingüe:

```ts
import { groq } from "next-sanity";

/** Proyección de un campo localizado al idioma pedido, con caída al español. */
const loc = (field: string) => `coalesce(${field}[$locale], ${field}.es)`;

export const apartamentosQuery = groq`
  *[_type == "apartamento"] | order(orden asc) {
    "slug": slug.current,
    "nombre": ${loc("nombre")},
    "descripcionCorta": ${loc("descripcionCorta")},
    dormitorios, banos, plazas, metros, planta, ascensor,
    precioDesde, licenciaVFT, urlBooking, urlAirbnb, destacado,
    "equipamiento": equipamiento[]->{ iconKey, "nombre": ${loc("nombre")} },
    "galeria": galeria[]{ ..., "alt": ${loc("alt")} }
  }
`;

export const apartamentoQuery = groq`
  *[_type == "apartamento" && slug.current == $slug][0] {
    "slug": slug.current,
    "nombre": ${loc("nombre")},
    "descripcionCorta": ${loc("descripcionCorta")},
    "descripcionLarga": ${loc("descripcionLarga")},
    dormitorios, banos, plazas, metros, planta, ascensor,
    precioDesde, licenciaVFT, urlBooking, urlAirbnb,
    "equipamiento": equipamiento[]->{ iconKey, "nombre": ${loc("nombre")} },
    "galeria": galeria[]{ ..., "alt": ${loc("alt")} }
  }
`;

export const apartamentoSlugsQuery = groq`*[_type == "apartamento"].slug.current`;

export const puntosInteresQuery = groq`
  *[_type == "puntoInteres" && categoria == $categoria] | order(orden asc) {
    "nombre": ${loc("nombre")},
    "descripcion": ${loc("descripcion")},
    distanciaKm, verificado, imagen
  }
`;

export const faqsQuery = groq`
  *[_type == "faq"] | order(orden asc) {
    "pregunta": ${loc("pregunta")},
    "respuesta": ${loc("respuesta")},
    pendiente
  }
`;

export const resenasQuery = groq`
  *[_type == "resena"] | order(fecha desc)[0...6] {
    autor, pais, puntuacion, origen, fecha,
    "texto": ${loc("texto")}
  }
`;

export const ajustesQuery = groq`
  *[_type == "ajustesSitio"][0] {
    email, telefono, whatsapp, direccion, instagram,
    razonSocial, nif, domicilioFiscal, heroImagen,
    "heroTitulo": ${loc("heroTitulo")},
    "heroSubtitulo": ${loc("heroSubtitulo")}
  }
`;
```

- [ ] Crear `src/lib/sanity/fetch.ts` con la caché y las etiquetas de revalidación:

```ts
import type { QueryParams } from "next-sanity";

import { sanityClient } from "./client";

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { tags, revalidate: 60 },
  });
}
```

- [ ] Crear `src/lib/sanity/types.ts` con los tipos TypeScript que devuelven las consultas.
      **Escribirlos a mano** a partir de las proyecciones GROQ de arriba: son pocas y generar
      tipos automáticamente añadiría un paso de build que no compensa en este proyecto.

---

## 2.5 Migrar el contenido provisional

- [ ] Crear un token de escritura en [sanity.io/manage](https://sanity.io/manage) →
      *API → Tokens*, con permiso **Editor**. Guardarlo en `.env.local` como
      `SANITY_API_WRITE_TOKEN`. **No** subirlo a git.

- [ ] Crear `scripts/seed-sanity.mjs` que cree, mediante el cliente de Sanity:
  1. Los 8 documentos de `equipamiento` a partir de las claves de `src/data/equipamiento.ts`.
  2. Los 5 documentos de `apartamento` a partir de `src/data/apartamentos.ts`, con
     `_id` fijo `apartamento-1` … `apartamento-5` para que el script sea **idempotente**
     (usar `createOrReplace`, no `create`).
  3. Los documentos de `faq` a partir del array `faq.items` de los diccionarios.
  4. Los `puntoInteres` de la guía de la zona, todos con `verificado: false`.
  5. El singleton `ajustesSitio` con `_id: "ajustesSitio"` y los campos de contacto vacíos.

  **Las imágenes no se migran**: los SVG de relleno no tienen valor. La galería de cada
  apartamento queda vacía y Javier sube las fotos reales desde el studio. Por eso, mientras no
  haya fotos, los componentes deben tolerar `galeria` vacía y mostrar un marcador.

- [ ] Añadir a `package.json`: `"seed": "node --env-file=.env.local scripts/seed-sanity.mjs"`.
- [ ] Ejecutar `npm run seed` y comprobar en el studio que aparecen los documentos.
- [ ] Ejecutar el script **una segunda vez** y confirmar que no se duplica nada.

---

## 2.6 Conectar las páginas a Sanity

- [ ] Sustituir en cada página las importaciones de `src/data/apartamentos.ts` por llamadas a
      `sanityFetch` con la consulta correspondiente y `params: { locale }`.
- [ ] Etiquetas de caché a usar: `["apartamentos"]`, `["faq"]`, `["puntos-interes"]`,
      `["resenas"]`, `["ajustes"]`.
- [ ] En `apartamentos/[slug]/page.tsx`, cambiar `generateStaticParams` para que lea los slugs de
      Sanity con `apartamentoSlugsQuery`.
- [ ] Adaptar `Gallery` y `ApartmentCard` para que reciban imágenes de Sanity y usen
      `urlForImage(...).width(1600).url()`. Manejar el caso de galería vacía mostrando el SVG de
      relleno.
- [ ] Añadir `cdn.sanity.io` a `images.remotePatterns` en `next.config.ts`:

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
},
```

- [ ] Los textos de interfaz **siguen** viniendo de los diccionarios. No migrarlos.
- [ ] Una vez que todas las páginas leen de Sanity, **borrar** `src/data/apartamentos.ts`.
      Conservar `src/data/equipamiento.ts`, porque es el que asocia cada `iconKey` con su icono
      de lucide.

---

## 2.7 Revalidación al publicar

Sin esto, Javier edita en el studio y la web tarda hasta 60 segundos en reflejarlo, o más si hay
páginas estáticas cacheadas.

- [ ] Crear `src/app/api/revalidate/route.ts` usando `parseBody` de `next-sanity/webhook`, que
      verifica la firma del webhook. Al recibir un cambio, llamar a `revalidateTag()` con la
      etiqueta que corresponda al `_type` del documento modificado.
- [ ] Generar un secreto aleatorio y guardarlo en `.env.local` y en las variables de entorno de
      Vercel como `SANITY_REVALIDATE_SECRET`.
- [ ] En sanity.io/manage → *API → Webhooks*, crear un webhook:
  - URL: `https://<dominio-de-produccion>/api/revalidate`
  - Dataset: `production`
  - Trigger on: create, update, delete
  - Secret: el mismo valor
  - Projection: `{ "_type": _type, "slug": slug.current }`
- [ ] Probar: editar un apartamento en el studio, publicar, y comprobar que el cambio aparece en
      producción en segundos.

---

## 2.8 Variables de entorno en Vercel

- [ ] En el proyecto de Vercel, *Settings → Environment Variables*, añadir para los tres entornos
      (Production, Preview, Development):
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - `SANITY_REVALIDATE_SECRET`
- [ ] Volver a desplegar y comprobar que la web de producción carga el contenido de Sanity.

---

## 2.9 Guía rápida para Javier

- [ ] Crear `docs/como-editar-la-web.md` en castellano llano, sin jerga técnica, explicando:
  - Cómo entrar en `/studio` y con qué cuenta.
  - Cómo cambiar el nombre y la descripción de un apartamento, en español y en inglés.
  - Cómo subir fotos y por qué hay que rellenar el texto alternativo.
  - **Cómo pegar las URLs de Booking y Airbnb** y qué pasa si se dejan vacías.
  - Dónde se pone el código VFT y por qué es obligatorio.
  - Que hay que pulsar **Publish** para que los cambios salgan a la web.
  - Qué NO se puede cambiar desde el studio (los textos de botones y menús).

---

## 2.10 Lista de verificación de cierre

- [ ] `npm run build` y `npm run lint` pasan limpios.
- [ ] `/studio` carga y permite editar en local y en producción.
- [ ] "Ajustes del sitio" aparece como documento único, sin opción de crear duplicados.
- [ ] Los 5 apartamentos, el equipamiento, las FAQ y los puntos de interés están en Sanity.
- [ ] Ejecutar el seed dos veces no duplica documentos.
- [ ] Todas las páginas leen de Sanity; `src/data/apartamentos.ts` ya no existe.
- [ ] Cambiar el nombre de un apartamento en el studio se ve en la web tras publicar.
- [ ] Rellenar `urlBooking` en un apartamento hace aparecer su botón; vaciarlo lo hace desaparecer.
- [ ] La web no se rompe con un apartamento sin fotos.
- [ ] El contenido en inglés cae al español cuando falta traducción, en vez de quedar vacío.
- [ ] Ningún token ni secreto está en git. Comprobar con `git log -p | grep -i "sk"`.
- [ ] `docs/como-editar-la-web.md` escrito y comprensible para alguien no técnico.
- [ ] Marcada la fase 2 como completada en la tabla de [`../plan.md`](../plan.md).
