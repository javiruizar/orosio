# Fase 3 — Conversión y SEO

> Documento de ejecución. Requiere la fase 2 terminada y verificada.
> Leer antes [`../plan.md`](../plan.md).

**Objetivo de la fase**: que la web capte de verdad. Que el formulario envíe, que Google entienda
qué se ofrece y dónde, que las páginas legales existan y que compartir un enlace produzca una
tarjeta decente.

**Al terminar esta fase la web está lista para recibir tráfico.** Lo único que faltará para
publicarla es la fase 4: dominio, analítica y alta en Google.

---

## 3.1 Formulario de solicitud funcional

### Decisión de implementación

Se usa una **Server Action** de Next.js y **Resend** para enviar el correo. No se monta backend
propio ni se usa un servicio de formularios externo. Resend tiene plan gratuito de 3.000 correos
al mes, muy por encima de lo que necesita esta web.

- [ ] Instalar dependencias:

```bash
npm install resend zod
```

- [ ] Crear cuenta en [resend.com](https://resend.com), verificar el dominio (o usar el dominio
      de pruebas de Resend hasta que la fase 4 configure el definitivo) y generar una API key.
- [ ] Añadir a `.env.local` y a Vercel:

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=          # email de Javier, pendiente
CONTACT_FROM_EMAIL=web@<dominio>   # remitente verificado en Resend
```

- [ ] Crear `src/lib/validation.ts` con el esquema de Zod:

```ts
import { z } from "zod";

export const solicitudSchema = z.object({
  nombre: z.string().min(2).max(80),
  email: z.string().email(),
  telefono: z.string().max(30).optional().or(z.literal("")),
  fechas: z.string().max(120).optional().or(z.literal("")),
  huespedes: z.coerce.number().int().min(1).max(6).optional(),
  apartamento: z.string().max(80).optional().or(z.literal("")),
  mensaje: z.string().min(10).max(2000),
  // Campo trampa contra bots: debe llegar vacío.
  website: z.string().max(0).optional().or(z.literal("")),
  // Consentimiento explícito RGPD.
  consentimiento: z.literal("on", { message: "Hay que aceptar la política de privacidad" }),
});

export type SolicitudInput = z.infer<typeof solicitudSchema>;
```

- [ ] Crear `src/app/actions/enviar-solicitud.ts` como Server Action (`"use server"`), que:
  1. Valide con `solicitudSchema`.
  2. Si `website` viene relleno, devuelva éxito **sin enviar nada** (es un bot).
  3. Envíe el correo con Resend a `CONTACT_TO_EMAIL`, con `replyTo` al email del huésped, asunto
     `Solicitud de reserva — <nombre>` y cuerpo con todos los campos.
  4. Devuelva `{ ok: true }` o `{ ok: false, errores }`.
  5. **Nunca** exponga la API key ni detalles del error al cliente: registrar el error en el
     servidor y devolver un mensaje genérico.

- [ ] Añadir **limitación de frecuencia** sencilla: rechazar más de 3 envíos por IP en 10
      minutos, guardando los contadores en un `Map` en memoria. Es suficiente para el volumen de
      esta web y no añade dependencias. Documentar en un comentario que se pierde en cada
      despliegue y que es intencionado.

- [ ] Reescribir `src/components/forms/contact-form.tsx` para que:
  - Use `useActionState` con la Server Action.
  - Muestre errores por campo, asociados con `aria-describedby`.
  - Deshabilite el botón mientras se envía (`useFormStatus` o el `pending` de `useActionState`).
  - Al enviarse bien, sustituya el formulario por un mensaje de confirmación con `role="status"`.
  - Incluya el campo trampa oculto: `<input name="website" tabIndex={-1} autoComplete="off"
    className="hidden" aria-hidden="true" />`.
  - Incluya la casilla de consentimiento con enlace a la política de privacidad.
  - Acepte una prop opcional `apartamentoPreseleccionado` para que, al llegar desde una ficha,
    el campo venga relleno.

- [ ] Añadir a los diccionarios (ES y EN) las claves nuevas: `form.success`, `form.error`,
      `form.sending`, `form.consent`, `form.consentLink`, y los mensajes de error por campo.

---

## 3.2 WhatsApp

- [ ] Crear `src/components/ui/whatsapp-button.tsx` que construya el enlace
      `https://wa.me/<numero>?text=<mensaje codificado>`, con el número tomado de
      `ajustesSitio.whatsapp` (Sanity) y un mensaje inicial distinto por idioma:
  - ES: `Hola, me interesa reservar en Apartamentos Orosio.`
  - EN: `Hello, I'd like to book at Apartamentos Orosio.`
- [ ] Si `ajustesSitio.whatsapp` está vacío, **no renderizar nada**. Mismo criterio que con las
      URLs de las OTAs.
- [ ] Colocarlo en: la página de contacto, la tarjeta de reserva de cada ficha de apartamento y
      la página de reservar.
- [ ] **No** añadir un botón flotante fijo en todas las páginas: molesta en móvil, tapa contenido
      y perjudica las métricas de Core Web Vitals. Si Javier lo pide expresamente, se añade.

---

## 3.3 Botones a Booking y Airbnb

Ya quedaron condicionales en la fase 1. Aquí se rematan.

- [ ] Crear `src/components/apartments/channel-links.tsx` que reciba `urlBooking` y `urlAirbnb`
      y aplique estas reglas:
  - Si hay alguna URL, renderizar sus botones con `variant="secondary"`, `target="_blank"`,
    `rel="noopener noreferrer nofollow"` e icono `ExternalLink`.
  - **`nofollow` es importante**: son enlaces salientes comerciales.
  - Si no hay ninguna, mostrar el mensaje `apartment.bookPending`.
  - El botón de reserva directa va **siempre primero** y con `variant="primary"`, para que sea
    visualmente dominante frente a los de las plataformas.
- [ ] Añadir junto a los botones de plataforma el texto (ES) "Reservando directamente pagas
      menos" / (EN) "Booking direct costs you less", en `text-sm text-granito`.

---

## 3.4 Metadatos

- [ ] Añadir a `.env.local` y a Vercel `NEXT_PUBLIC_SITE_URL`. Hasta la fase 4, el valor es la
      URL de Vercel.
- [ ] Crear `src/lib/seo.ts` con una función `buildMetadata()` que reciba
      `{ locale, title, description, path, images? }` y devuelva un objeto `Metadata` con:
  - `title`, `description`
  - `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)`
  - `alternates.canonical` con la URL de la página en su idioma
  - `alternates.languages` con `es-ES`, `en-GB` y `x-default` apuntando al español
  - `openGraph` con `type: "website"`, `locale`, `siteName: "Apartamentos Orosio"`, `url`, imagen
  - `twitter.card: "summary_large_image"`
- [ ] **Atención con los rewrites**: el canonical de las páginas inglesas debe ser la URL con
      slug en inglés (`/en/apartments`), no la interna (`/en/apartamentos`). Construirlo siempre
      con las funciones de `src/lib/routes.ts`, nunca con `usePathname` ni con la ruta del
      archivo.
- [ ] Añadir `generateMetadata` a **todas** las páginas. Títulos y descripciones (ES):

| Página | Título | Descripción |
|---|---|---|
| Home | Apartamentos Orosio · Apartamentos turísticos en Pozoblanco | Cinco apartamentos de un dormitorio con cocina independiente en el centro de Pozoblanco, Los Pedroches. Reserva directa sin comisiones. |
| Apartamentos | Nuestros apartamentos en Pozoblanco | Cinco apartamentos con cocina independiente en el centro de Pozoblanco. Consulta fotos, equipamiento y disponibilidad. |
| Ficha | `<Nombre>` · Apartamento en Pozoblanco | `<descripcionCorta>` |
| La zona | Qué hacer en Los Pedroches | Guía de Pozoblanco y el valle de Los Pedroches: qué ver, dónde comer y cómo llegar. |
| Reservar | Reservar apartamento en Pozoblanco | Solicita disponibilidad directamente y evita la comisión de las plataformas. |
| Contacto | Contacto | Escríbenos y te respondemos con disponibilidad y precio. |
| FAQ | Preguntas frecuentes | Horarios, fianza, mascotas, aparcamiento y cancelaciones. |

- [ ] Traducir todos al inglés con el mismo criterio.
- [ ] Longitudes: título por debajo de 60 caracteres, descripción entre 120 y 155.
- [ ] Las páginas legales llevan `robots: { index: false }`. `/studio` ya lo lleva de la fase 2.

---

## 3.5 Datos estructurados (schema.org)

Es lo que hace que Google pueda mostrar los apartamentos como resultado enriquecido.

- [ ] Crear `src/components/seo/json-ld.tsx`, un componente que reciba un objeto y lo pinte en
      `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`.
- [ ] En el layout, insertar un `LodgingBusiness` con:
  - `name`, `url`, `image`
  - `address` de tipo `PostalAddress`: `addressLocality: "Pozoblanco"`,
    `addressRegion: "Córdoba"`, `addressCountry: "ES"`, y `streetAddress` y `postalCode`
    desde `ajustesSitio` (dejar fuera los campos vacíos, no ponerlos en blanco)
  - `telephone` y `email` desde `ajustesSitio`, solo si existen
  - `geo` con las coordenadas de Pozoblanco. ⚠️ **VERIFICAR las coordenadas exactas del edificio
    con Javier**; no inventarlas ni usar el centro del pueblo como si fuera la dirección.
- [ ] En cada ficha, insertar un `Apartment` con `name`, `description`,
      `numberOfBedrooms`, `numberOfBathroomsTotal`, `occupancy` (`QuantitativeValue` con
      `maxValue: plazas`), `floorSize` (`QuantitativeValue` en `MTK`), `amenityFeature` (un
      `LocationFeatureSpecification` por equipamiento) e `image`.
- [ ] En la FAQ, insertar un `FAQPage`. **Excluir las preguntas marcadas como `pendiente`**:
      publicar respuestas que dicen "pendiente de confirmar" como dato estructurado es peor que
      no publicarlas.
- [ ] **No** añadir `aggregateRating` ni `Review` a partir de las reseñas copiadas de Booking y
      Airbnb. Google exige que las reseñas marcadas sean reseñas recogidas por el propio sitio;
      marcar reseñas de terceros como propias incumple sus directrices y puede acarrear una
      penalización manual. Las reseñas se muestran, pero sin marcado.
- [ ] Validar cada tipo en [validator.schema.org](https://validator.schema.org) y en la prueba
      de resultados enriquecidos de Google. Anotar aquí el resultado.

---

## 3.6 Sitemap y robots

- [ ] Crear `src/app/sitemap.ts` que genere las URLs de ambos idiomas usando las funciones de
      `routes.ts` y los slugs reales de Sanity. Incluir `alternates.languages` en cada entrada.
      Excluir `/studio` y las páginas legales.
- [ ] Prioridades: home `1.0`, listado de apartamentos y fichas `0.8`, reservar `0.8`, guía de la
      zona `0.6`, resto `0.5`.
- [ ] Crear `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
```

- [ ] Comprobar que `/sitemap.xml` y `/robots.txt` responden y que el sitemap no contiene URLs
      con slug español bajo `/en/`.

---

## 3.7 Imágenes Open Graph

- [ ] Crear `src/app/[locale]/opengraph-image.tsx` usando `ImageResponse` de `next/og`, de
      1200×630, con: fondo `#FAF7F2`, franja inferior `#B85C38`, el texto "Apartamentos Orosio"
      en grande y "Pozoblanco · Los Pedroches" debajo en `#6E6B66`.
      **Nota (Next.js 16)**: la función de imagen recibe `params` como una **promesa**
      (`{ params }: { params: Promise<{ locale: string }> }`, con `await`), a diferencia de Next
      15 donde llegaba ya resuelto.
- [ ] Para las fichas de apartamento, usar la **primera foto de la galería** como imagen Open
      Graph en lugar de la generada. Si la galería está vacía, caer a la genérica. Mismo aviso:
      `params` (y `id`, si se usa `generateImageMetadata`) llegan como promesas.
- [ ] Comprobar el resultado pegando una URL en el validador de LinkedIn o en un chat de
      WhatsApp con la web ya desplegada.

---

## 3.8 Páginas legales

**Estas páginas requieren datos de Javier** (razón social, NIF, domicilio fiscal, email). Si
todavía no los ha dado, escribir la estructura completa dejando marcadores visibles
`[PENDIENTE: razón social]` y **avisarle de que la web no se puede publicar así**.

**Aviso**: lo que sigue es una plantilla razonable para una web de este tipo, no asesoramiento
jurídico. Antes de publicar conviene que lo revise un profesional o que Javier use el generador
de su gestoría.

- [ ] **Aviso legal** (`legal/aviso-legal`). Secciones: titular del sitio con razón social, NIF,
      domicilio y email; objeto y condiciones de uso; propiedad intelectual de textos y
      fotografías; enlaces a terceros (Booking, Airbnb); exención de responsabilidad; legislación
      aplicable y fuero. Incluir los **códigos VFT de los cinco apartamentos**, leídos de Sanity.

- [ ] **Política de privacidad** (`legal/privacidad`). Secciones: responsable del tratamiento;
      datos que se recogen (los del formulario de contacto: nombre, email, teléfono, fechas,
      mensaje); finalidad (responder a la solicitud y gestionar la reserva); base jurídica
      (consentimiento y ejecución de contrato); plazo de conservación; destinatarios, nombrando
      expresamente a **Vercel** (alojamiento), **Sanity** (contenido) y **Resend** (envío de
      correo); transferencias internacionales si las hay; derechos de acceso, rectificación,
      supresión, oposición, limitación y portabilidad, con el email para ejercerlos; y derecho a
      reclamar ante la **Agencia Española de Protección de Datos**.

- [ ] **Política de cookies** (`legal/cookies`). Debe reflejar lo que la web realmente instala.
      Si se sigue la recomendación del punto 3.9, la web **no instala ninguna cookie de
      seguimiento**, y así hay que decirlo: es una ventaja, no una carencia.

- [ ] Enlazar las tres desde el pie, cosa que ya hace la fase 0.

---

## 3.9 Cookies y analítica

### Recomendación: evitar el banner por completo

- [ ] Usar **Plausible** o **Vercel Web Analytics** en lugar de Google Analytics. Ninguno de los
      dos instala cookies ni recoge datos personales, lo que significa que **no hace falta banner
      de consentimiento**. Un banner reduce la conversión, estorba en móvil y es una fuente
      constante de incumplimientos mal resueltos.
- [ ] Si Javier prefiere Google Analytics 4 (por ejemplo, para enlazarlo con Google Ads más
      adelante), entonces **sí** es obligatorio un banner con consentimiento previo y granular,
      que cumpla lo que exige la AEPD:
  - No se puede cargar el script antes de aceptar.
  - Rechazar debe ser tan fácil como aceptar: **dos botones del mismo tamaño y peso visual** en
    la primera capa. Nada de "Aceptar" destacado y "Configurar" en letra pequeña.
  - La decisión debe poder cambiarse después, mediante un enlace permanente en el pie.
  - La elección se guarda en `localStorage`, no en una cookie.
- [ ] Implementar la opción elegida. Si es la recomendada, dejar en `docs/` una nota explicando
      por qué no hay banner, para que nadie lo "arregle" más adelante añadiendo uno.

---

## 3.10 Accesibilidad y rendimiento

- [ ] Pasar Lighthouse en móvil sobre la home y sobre una ficha de apartamento. Objetivos:
      Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas 100, SEO 100.
- [ ] Comprobar que la imagen del hero lleva `priority` y que ninguna otra lo lleva.
- [ ] Comprobar que todas las imágenes tienen `sizes` correcto, para no servir 1600 px a un móvil.
- [ ] Recorrer la web entera **solo con teclado**: debe poder navegarse y enviarse el formulario.
- [ ] Verificar que la jerarquía de encabezados es correcta: un solo `<h1>` por página y sin
      saltos de nivel.
- [ ] Verificar los contrastes reales con las herramientas del navegador, no de memoria.
- [ ] Comprobar que los `alt` de las fotos describen la foto, y que las imágenes decorativas
      llevan `alt=""`.

---

## 3.11 Lista de verificación de cierre

- [ ] `npm run build` y `npm run lint` pasan limpios.
- [ ] El formulario envía un correo real y llega a la bandeja de Javier.
- [ ] Responder al correo recibido escribe al huésped, gracias a `replyTo`.
- [ ] El campo trampa bloquea un envío simulado de bot.
- [ ] La limitación de frecuencia corta al cuarto envío seguido.
- [ ] Sin marcar la casilla de consentimiento no se puede enviar.
- [ ] Cada página tiene título y descripción propios, distintos entre sí y del resto.
- [ ] Los `canonical` de las páginas inglesas usan el slug inglés.
- [ ] `hreflang` correcto en ambos idiomas, incluido `x-default`.
- [ ] El sitemap contiene todas las páginas públicas y ninguna interna.
- [ ] Los datos estructurados validan sin errores.
- [ ] **No** hay marcado de reseñas de terceros.
- [ ] Compartir un enlace en WhatsApp muestra la tarjeta con imagen.
- [ ] Las tres páginas legales existen, sin marcadores `[PENDIENTE]` si Javier ya dio los datos.
- [ ] Los códigos VFT aparecen en la web, o consta por escrito que siguen pendientes.
- [ ] Lighthouse cumple los objetivos del punto 3.10.
- [ ] La web se puede recorrer entera con teclado.
- [ ] Marcada la fase 3 como completada en la tabla de [`../plan.md`](../plan.md).

---

## Lo que queda bloqueado esperando a Javier

Al cerrar esta fase, anotar aquí qué falta realmente para poder publicar:

- [ ] Razón social, NIF y domicilio fiscal
- [ ] Email y teléfono de contacto
- [ ] Número de WhatsApp
- [ ] Códigos VFT de los cinco apartamentos
- [ ] Fotos reales
- [ ] Nombres y descripciones reales
- [ ] URLs de Booking y Airbnb
- [ ] Coordenadas exactas del edificio
- [ ] Respuestas a las FAQ marcadas como pendientes
- [ ] Verificación de los datos de la guía de la zona
- [ ] Dominio
