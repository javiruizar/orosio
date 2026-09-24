# Plan de acción — Apartamentos Orosio

> Documento vivo. Marcar `[x]` según se completen tareas.
> Creado: 2026-09-22 · Última actualización: 2026-09-22 (plan detallado de ejecución para fases 0-3)

## Cómo usar este plan

Este archivo es el **documento maestro**: contexto, decisiones tomadas y visión de conjunto.
Léelo entero antes de tocar código.

El detalle de ejecución paso a paso vive en archivos separados, uno por fase:

| Fase | Documento de ejecución | Estado |
|---|---|---|
| 0 — Cimientos | [`plan/fase-0-cimientos.md`](plan/fase-0-cimientos.md) | ✅ Completada (2026-09-24) |
| 1 — Maqueta completa | [`plan/fase-1-maqueta.md`](plan/fase-1-maqueta.md) | 🟡 En progreso |
| 2 — Sanity | [`plan/fase-2-sanity.md`](plan/fase-2-sanity.md) | Pendiente |
| 3 — Conversión y SEO | [`plan/fase-3-conversion-seo.md`](plan/fase-3-conversion-seo.md) | Pendiente |
| 4 — Lanzamiento | Sin detallar todavía | Pendiente |
| 5 — Calendarios | Sin detallar todavía (ver §5 de este archivo) | Pendiente |

**Reglas para quien ejecute el plan:**

1. Las fases van **en orden**. No empezar una sin haber terminado y verificado la anterior.
2. Cada documento de fase termina con una **lista de verificación**. Hay que superarla entera
   antes de dar la fase por cerrada.
3. Todo lo que aparece en los documentos de fase está **ya decidido**. No hay que inventar
   nombres de archivo, colores, textos ni estructura: están escritos literalmente.
4. Si algo del plan resulta imposible o está claramente equivocado al ejecutarlo, **parar y
   avisar** en lugar de improvisar una alternativa.
5. Al terminar cada tarea, marcar su `[x]` en el documento de la fase y actualizar la tabla de
   arriba.

---

## 1. Contexto del proyecto

Web para promocionar y alquilar **5 apartamentos turísticos** en **Pozoblanco (Los Pedroches, Córdoba)**.

Objetivos, por orden:
1. Tener presencia propia y profesional (hoy la captación depende de OTAs).
2. Captar reservas directas y reducir la comisión del 15-18 % de Booking/Airbnb.
3. Posicionar en Google para búsquedas locales ("apartamentos Pozoblanco", "alojamiento Los Pedroches").

### Notas de mercado

- **Pozoblanco tiene demanda mixta**: estancia de trabajo entre semana (COVAP, hospital comarcal,
  polígonos, ferias agroganaderas) y turismo/familia en fin de semana. La web debe hablar a los dos
  perfiles, no solo al turista.
- **Licencia VFT obligatoria**: en Andalucía las Viviendas con Fines Turísticos deben mostrar su
  código del Registro de Turismo de Andalucía (`VFT/CO/xxxxx`) en toda su publicidad, web incluida.
  Previsto como campo por apartamento en el CMS.

---

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Gestor de paquetes | pnpm |
| Estilos | Tailwind CSS v4 |
| CMS | Sanity, studio embebido en `/studio` |
| Idiomas | Español + Inglés (rutas `/es` y `/en`) |
| Hosting | Vercel (plan gratuito) |
| Estética | Cálido mediterráneo adaptado a la dehesa |
| Reservas | Híbrido por fases: enlaces a OTAs + solicitud directa → motor propio más adelante |
| Calendarios | Channel manager como fuente única de verdad, sincronizado por API con Booking y Airbnb (ver §5) |
| Contenido SEO | Guía de la zona en páginas fijas, sin blog |

### Identidad visual

**Paleta definitiva** (contrastes calculados, no estimados)

| Token Tailwind | Hex | Uso | Contraste sobre `cal` |
|---|---|---|---|
| `terracota-500` | `#B85C38` | Decorativo: bordes, iconos, titulares ≥24 px | 4.07:1 |
| `terracota-600` | `#A34A2A` | Fondo de botón primario, enlaces de texto | 5.51:1 |
| `terracota-700` | `#8A3D22` | Hover y estado activo del botón primario | 7.15:1 |
| `arena` | `#E8DCC8` | Fondos de sección y tarjetas | — |
| `arena-light` | `#F2EADC` | Separadores y fondos muy suaves | — |
| `cal` | `#FAF7F2` | Fondo base de la página | — |
| `oliva` | `#5C6B4A` | Iconos, badges, acento secundario | 5.29:1 |
| `granito` | `#6E6B66` | Texto secundario | 4.96:1 |
| `carbon` | `#2E2A26` | Texto principal | 13.3:1 |

**Reglas de uso obligatorias** (derivadas de los contrastes, no negociables):

- `terracota-500` **nunca** como texto por debajo de 24 px: no llega a 4.5:1.
- Texto blanco solo sobre `terracota-600` (5.88:1), `terracota-700` (7.64:1) u `oliva` (5.65:1).
  Nunca sobre `terracota-500` (4.35:1).
- Sobre fondo `arena` o `arena-light`, el texto solo puede ser `carbon` o `terracota-700`.
  **Prohibido `granito` (3.92:1) y `terracota-600` (4.34:1) sobre arena.**
- `granito` solo sobre `cal` o blanco.

El gris `granito` es un guiño a la piedra con la que está construido el casco de Pozoblanco.

**Tipografía**: `Fraunces` (serif cálida) para titulares, `Inter` para texto corrido.
Ambas vía `next/font/google`, autoalojadas, sin petición a red externa.

---

## 3. Mapa de páginas

```
/es                              Home
/es/apartamentos                 Listado de los 5
/es/apartamentos/[slug]          Ficha de apartamento (×5)
/es/la-zona                      Guía de Los Pedroches
/es/la-zona/que-ver
/es/la-zona/donde-comer
/es/la-zona/como-llegar
/es/reservar                     Solicitud directa + comparativa de canales
/es/contacto
/es/faq
/es/legal/aviso-legal
/es/legal/privacidad
/es/legal/cookies
/en/...                          espejo completo en inglés
/studio                          panel de edición (Sanity)
```

---

## 4. Modelo de datos (Sanity)

- **`apartamento`** — nombre, slug, orden, descripción corta y larga (ES/EN), dormitorios, baños,
  plazas, m², planta, ascensor, equipamiento (refs), galería, precio desde (orientativo),
  `licenciaVFT`, `urlBooking`, `urlAirbnb`, **`channelManagerId`**, destacado
- **`equipamiento`** — nombre ES/EN + icono (wifi, cocina, A/A, parking…)
- **`puntoDeInteres`** — guía de la zona: nombre, categoría, descripción, distancia, imagen
- **`faq`** — pregunta/respuesta ES/EN
- **`resena`** — reseñas copiadas de Booking/Airbnb (autor, texto, puntuación, origen)
- **`ajustesSitio`** — contacto, WhatsApp, redes, datos fiscales, textos del hero

**URLs de OTAs**: `urlBooking` y `urlAirbnb` son **opcionales**. Si están vacías el botón no se
renderiza; en cuanto se pegue la URL en el panel, aparece. No requiere cambios de código.

**Reparto de responsabilidades**: Sanity guarda **contenido** (textos, fotos, características).
El **channel manager** guarda **disponibilidad, precios reales y reservas**. `channelManagerId`
es el campo que enlaza cada apartamento de Sanity con su unidad en el channel manager.
El "precio desde" de Sanity es solo orientativo para las tarjetas del listado; el precio real de
cada fecha lo sirve siempre el channel manager. **No habrá base de datos propia**: el libro de
reservas es el channel manager.

**Estado provisional acordado**: los 5 apartamentos se llaman `apartamento-1` … `apartamento-5`,
todos idénticos (1 dormitorio, cocina independiente). Nombres, descripciones y fotos reales los
actualizará Javier a mano desde el CMS.

---

## 5. Sincronización de calendarios (web ↔ Booking ↔ Airbnb)

**Objetivo**: que una reserva en cualquiera de los tres canales bloquee esas fechas en los otros dos
de forma automática y casi inmediata.

### 5.1 Limitación que condiciona el diseño

Ni Airbnb ni Booking abren su API a propietarios individuales: la API de Airbnb es solo para
partners certificados y la Connectivity API de Booking exige certificarse como proveedor.
**La web no puede conectarse directamente a las OTAs.** Solo hay dos vías:

| | iCal directo | Channel manager |
|---|---|---|
| Coste | 0 € | 15-30 €/mes |
| Latencia de propagación | 2-24 h | 1-5 min |
| Riesgo de overbooking | Real | Muy bajo |
| Sincroniza precios y estancia mínima | No | Sí |
| Datos de la reserva (huésped, importe) | No, solo fechas bloqueadas | Sí, completos |
| Soporte en Booking.com | Limitado y variable según cuenta | Conexión oficial |
| Cobro directo en la web | Hay que montarlo aparte | Incluido |

"Tiempo real" estricto no existe en este sector. Con channel manager hablamos de **1-5 minutos**,
que a efectos prácticos elimina el overbooking. Con iCal, de horas.

**Decisión: channel manager como núcleo.**

### 5.2 Arquitectura

```
   ┌─────────────┐                                        ┌─────────────┐
   │ Booking.com │◄───────── API oficial ────────┐        │   Airbnb    │
   └─────────────┘                               │        └─────────────┘
                                                 │               ▲
                                                 │               │ API oficial
                                      ┌──────────┴───────────────┴──┐
                                      │      CHANNEL MANAGER        │
                                      │  fuente única de verdad de  │
                                      │  disponibilidad y reservas  │
                                      └──────────┬──────────────────┘
                                                 │
                                REST + webhooks  │
                                                 ▼
                                      ┌─────────────────────────────┐
                                      │       Web Orosio            │
                                      │   Next.js  +  Sanity        │
                                      │  contenido → Sanity         │
                                      │  calendario → CM            │
                                      └─────────────────────────────┘
```

**Los tres flujos:**

1. **Reserva en Booking** → el CM la recibe por API en segundos → cierra esas fechas en Airbnb y
   dispara un webhook a la web, que invalida su caché de disponibilidad.
2. **Reserva en la web** → la web crea la reserva en el CM por API → el CM cierra esas fechas en
   Booking y Airbnb.
3. **Bloqueo manual** (uso propio, obras, limpieza) → se hace una sola vez en el CM y se propaga
   a los tres canales.

### 5.3 Qué hay que construir en la web

- `GET /api/availability/[slug]` — disponibilidad y precios por rango de fechas, leídos del CM.
  Cacheado con la directiva `"use cache"` y `cacheTag("availability:[slug]")` (API de caché de
  Next.js 16; sustituye a `unstable_cache`, desaconsejado en esta versión).
- `POST /api/webhooks/channel-manager` — recibe los avisos de cambio del CM y llama a
  `revalidateTag(tag, "max")` (Next.js 16 exige el segundo argumento; la forma de un solo
  argumento está deprecada). Es lo que hace que la web se entere al instante. Firma verificada.
- **Vercel Cron cada 15 min** — refresco de seguridad por si se pierde un webhook.
- `POST /api/bookings` — crea la reserva en el CM tras el pago.
- **Bloqueo temporal (hold) de 15 min** cuando el huésped entra en el checkout, para que nadie
  reserve las mismas fechas mientras paga.
- **Componente de calendario** en la ficha de apartamento y en `/reservar`, con fechas ocupadas,
  estancia mínima y precio por noche.
- Cobro con **Stripe** o con el checkout que ya trae el propio CM.

### 5.4 Elección de channel manager (pendiente)

| | Coste aprox. 5 uds. | Valoración |
|---|---|---|
| **Beds24** | 15-20 €/mes | API v2 muy completa con webhooks, la mejor para una web a medida. Interfaz anticuada y curva de aprendizaje alta. |
| **Smoobu** | 25-30 €/mes | API más sencilla pero suficiente, webhooks, interfaz cómoda, soporte en español. El equilibrio más razonable. |
| **Octorate** | 20-30 €/mes | Muy implantado en España, buena conexión con Booking. API algo menos documentada. |

Recomendación: **Beds24** si prioriza coste y control técnico, **Smoobu** si prioriza facilidad de
uso diaria.

**Decidido (2026-09-22): la elección se pospone a la fase 5.** Para que eso no genere deuda
técnica, el código se escribe contra una **interfaz propia** `ChannelManagerAdapter`
(`getAvailability`, `getRates`, `createBooking`, `createHold`, `parseWebhook`), con una
implementación por proveedor. La web nunca llama a la API del proveedor directamente. Cambiar de
channel manager, o empezar con el plan B de iCal y migrar después, se reduce a escribir un
adaptador nuevo sin tocar páginas ni componentes.

### 5.5 Plan B sin coste (solo iCal)

Si se decide no pagar channel manager:

- `GET /api/ical/[slug].ics` — la web publica sus reservas directas como calendario iCal.
- Esa URL se pega en Airbnb y en Booking para que la importen.
- Un cron cada 15 min importa los `.ics` de Airbnb y Booking a la web.
- La web pasa a **"solicitud de reserva" con confirmación manual**, no reserva instantánea.
- Margen de seguridad de 1 día de bloqueo alrededor de cada reserva.
- **Riesgo residual real de overbooking**, que se asume conscientemente.

---

## 6. Fases de trabajo

Las fases 0 a 3 están desarrolladas paso a paso en sus propios documentos. Lo que sigue es solo
el resumen; **para ejecutar hay que abrir el documento de la fase**.

### Fase 0 — Cimientos → [`plan/fase-0-cimientos.md`](plan/fase-0-cimientos.md)

Repositorio, proyecto Next.js + TypeScript + Tailwind, tokens de diseño, tipografías, enrutado
i18n ES/EN, componentes base (Container, Button, Card, Header, Footer, LocaleSwitcher) y
despliegue en Vercel.

*Resultado: URL pública viva con cabecera, pie y cambio de idioma funcionando.*

### Fase 1 — Maqueta completa → [`plan/fase-1-maqueta.md`](plan/fase-1-maqueta.md)

Las 13 páginas del mapa del sitio, en ES y EN, con los 5 apartamentos provisionales, galería con
lightbox, guía de la zona, FAQ y formularios maquetados. Imágenes de relleno generadas.

*Resultado: web entera navegable, pendiente de contenido real.*

### Fase 2 — Sanity → [`plan/fase-2-sanity.md`](plan/fase-2-sanity.md)

Proyecto Sanity, esquemas, studio embebido en `/studio`, consultas GROQ tipadas y migración del
contenido provisional al CMS.

*A partir de aquí Javier edita nombres, descripciones, fotos, licencias y URLs de OTAs.*

### Fase 3 — Conversión y SEO → [`plan/fase-3-conversion-seo.md`](plan/fase-3-conversion-seo.md)

Formulario de solicitud funcional con envío de email, WhatsApp, botones condicionales a las OTAs,
metadatos y `hreflang`, datos estructurados, sitemap, robots, imágenes Open Graph, páginas
legales y banner de cookies.

*Resultado: web lista para recibir tráfico y convertirlo.*

### Fase 4 — Lanzamiento
- [ ] Contratar y conectar dominio
- [ ] Analítica (Plausible o GA4)
- [ ] Google Business Profile
- [ ] Verificación en Search Console
- [ ] Auditoría de rendimiento y accesibilidad

### Fase 5 — Sincronización de calendarios y reserva directa

Desarrollo de lo descrito en §5. Se puede **adelantar antes de la fase 4** si se prefiere lanzar
la web ya con reserva directa en lugar de salir antes con el formulario de solicitud.

**5a. Alta y configuración del channel manager**
- [ ] Elegir channel manager (ver §5.4)
- [ ] Dar de alta las 5 unidades y cargar tarifas, temporadas y estancias mínimas
- [ ] Conectar Booking.com por API oficial
- [ ] Conectar Airbnb por API oficial
- [ ] Importar reservas ya existentes y verificar que no se solapan
- [ ] Obtener credenciales de API y secreto de webhook

**5b. Lectura de disponibilidad en la web**
- [ ] Definir la interfaz `ChannelManagerAdapter` (ver §5.4)
- [ ] Implementar el adaptador del proveedor elegido
- [ ] `GET /api/availability/[slug]` con caché etiquetada
- [ ] `POST /api/webhooks/channel-manager` con verificación de firma → `revalidateTag()`
- [ ] Vercel Cron cada 15 min como refresco de seguridad
- [ ] Mapear cada apartamento de Sanity con su unidad del CM vía `channelManagerId`
- [ ] Componente de calendario con fechas ocupadas, estancia mínima y precio por noche

**5c. Reserva directa desde la web**
- [ ] Flujo de checkout con bloqueo temporal de 15 min
- [ ] Pago con Stripe (o checkout nativo del CM)
- [ ] `POST /api/bookings` → alta de la reserva en el CM
- [ ] Emails de confirmación al huésped y a Javier
- [ ] Página de "mi reserva" con los datos y las instrucciones de llegada

**5d. Verificación**
- [ ] Prueba real: reservar en Booking y comprobar el bloqueo en web y Airbnb
- [ ] Prueba real: reservar en Airbnb y comprobar el bloqueo en web y Booking
- [ ] Prueba real: reservar en la web y comprobar el bloqueo en Booking y Airbnb
- [ ] Prueba de bloqueo manual desde el CM
- [ ] Medir la latencia real de propagación en cada sentido

---

## 7. Información pendiente de Javier

No bloquea las fases 0-2. Necesario antes de publicar (fase 4).

- [ ] Nombres reales de los 5 apartamentos
- [ ] Descripciones y características reales de cada uno
- [ ] Fotografías (¿profesionales? ¿cuántas por apartamento?)
- [ ] URLs de los anuncios en Booking y Airbnb
- [ ] Números de licencia VFT de cada apartamento
- [ ] Datos fiscales para el aviso legal (razón social, NIF, dirección, email, teléfono)
- [ ] Dominio deseado
- [ ] Precios orientativos, temporadas, mínimo de noches, check-in/out
- [ ] Origen y perfil de los huéspedes actuales
- [ ] ¿Usa ya algún PMS o channel manager?

Para la fase 5 concretamente:

- [ ] **Decidir channel manager** y asumir su coste mensual — pospuesto a la fase 5 (ver §5.4)
- [ ] Acceso al extranet de Booking.com para autorizar la conexión
- [ ] Acceso a la cuenta de anfitrión de Airbnb para autorizar la conexión
- [ ] Credenciales de API y secreto de webhook del channel manager
- [ ] Cuenta de Stripe, si el cobro no se hace con el checkout del propio CM
- [ ] Política de cancelación y de fianza para la reserva directa
