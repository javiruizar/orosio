@AGENTS.md

# Apartamentos Orosio — guía para Claude

Web para promocionar y alquilar 5 apartamentos turísticos en Pozoblanco (Los Pedroches, Córdoba).
Objetivos: presencia propia, reservas directas (evitar el 15-18 % de comisión de las OTAs) y SEO
local. Habla a dos públicos: estancias de trabajo entre semana y turismo/familia en fin de semana.

El **documento maestro** es `plan.md` (contexto y decisiones). El detalle de ejecución de cada
fase está en `plan/fase-N-*.md`. Todo lo que dicen los planes está ya decidido: no inventar
nombres de archivo, colores, textos ni estructura. Si algo del plan resulta imposible o
claramente equivocado, **parar y avisar** en vez de improvisar.

## Cómo trabajar con los ficheros de plan (plan.md y plan/*.md)

- Nunca edites estos ficheros directamente. Cuando revises el estado del proyecto,
  propon los cambios (qué marcarías como [x], qué añadirías o corregirías) y espera
  mi aprobación antes de escribirlos.
- Al evaluar si una tarea está completa, distingue dos tipos:
  a) Verificable por ti de forma objetiva (el fichero existe con el contenido
     esperado, un comando como `npm run build` o `npm run lint` pasa, dos
     diccionarios de idioma tienen las mismas claves, etc.) → puedes darla por
     completada en tu propuesta.
  b) Requiere verificación visual, de comportamiento interactivo en navegador,
     o acceso a cuentas externas (GitHub, Vercel, Sanity...) → NO la des por
     completada. Indícamela como pendiente de mi verificación.
- Para cada tarea del tipo (b) que quede pendiente, dame instrucciones paso a
  paso de cómo comprobarla yo mismo: qué abrir, qué mirar o hacer exactamente,
  y qué resultado esperar para considerarla superada.

## Commits y push

**No hagas `git commit` ni `git push` por tu cuenta.** Cuando el trabajo de una sesión esté listo
y verificado, haz `git add` de los ficheros que correspondan (código y/o ficheros de plan ya
aprobados) y dime que haga yo mismo el commit y el push. Esta regla se añadió el 2026-09-24 al
cerrar la fase 1; los commits de las fases 0 y 1 ya estaban hechos antes de la regla y no hay que
deshacerlos.

## Estado actual (2026-09-24)

- **Fase 0 — Cimientos**: ✅ completada. Código en GitHub (`origin` = `javiruizar/orosio`, rama
  `main`) y desplegado en Vercel, verificado por Javier.
- **Fase 1 — Maqueta completa**: ✅ completada. Las 13 páginas, en ES/EN, con los 5 apartamentos
  provisionales, guía de la zona, FAQ y formularios maquetados (sin envío real, eso es fase 3).
  Verificado por mí de forma objetiva (build, lint, rutas, contraste, `alt`, interactividad
  probada con clics/teclas reales simulados en Chrome) y por Javier en navegador y en producción.
- **Fase 2 — Sanity**: siguiente fase a ejecutar.
- **Fase 3**: sin empezar. Fases 4 (lanzamiento) y 5 (calendarios/channel manager) sin detallar.
- Las fases van **en orden**: no empezar una sin cerrar y verificar la anterior.

## Stack

| | |
|---|---|
| Framework | **Next.js 16.3.6** (App Router, Turbopack) + React 19.2 + TypeScript estricto |
| Estilos | Tailwind CSS v4 (CSS-first: tokens en `@theme` de `src/app/globals.css`, **sin** `tailwind.config.ts`) |
| Iconos | `lucide-react` |
| Utilidades | `clsx` + `tailwind-merge` vía `cn()` en `src/lib/cn.ts` |
| CMS (fase 2) | Sanity, studio embebido en `/studio` |
| Formularios (fase 3) | Server Actions + Resend + Zod |
| Hosting | Vercel (plan gratuito) |
| Gestor de paquetes | **pnpm** (hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`; no hay `package-lock.json`) |

**Los planes se escribieron para Next.js 15 y npm.** Al ejecutarlos, traducir `npm install X` →
`pnpm add X` y `npm run X` → `pnpm X`, y adaptar las APIs de Next 16. Diferencias ya conocidas:

- `middleware.ts` se llama ahora `src/proxy.ts` y exporta `function proxy`.
- `revalidateTag(tag)` de un argumento está deprecado: usar `revalidateTag(tag, "max")`.
- `unstable_cache` está desaconsejado en favor de la directiva `"use cache"` + `cacheTag`.
- En `opengraph-image`/`icon` y en `sitemap` (con `generateSitemaps`), `params`/`id` son promesas.
- `next lint` ya no existe: el script `lint` ejecuta `eslint` directamente (flat config).
- `scroll-behavior: smooth` global ya no se neutraliza en las navegaciones salvo que `<html>`
  lleve `data-scroll-behavior="smooth"`.

Ante cualquier duda de API, leer `node_modules/next/dist/docs/` (en especial
`01-app/02-guides/upgrading/version-16.md`) antes de escribir código.

## Comandos

```bash
pnpm dev        # servidor de desarrollo en http://localhost:3000
pnpm build      # compilación de producción (debe pasar sin errores ni avisos de TS)
pnpm lint       # ESLint (eslint-config-next core-web-vitals + typescript)
pnpm start      # servir la build de producción
```

No hay tests automatizados. La verificación de cada fase es `build` + `lint` + la lista de
comprobación de su documento. Comprobación de claves de los diccionarios (deben coincidir):

```bash
node -e "const a=require('./src/i18n/dictionaries/es.json'),b=require('./src/i18n/dictionaries/en.json');const k=(o,p='')=>Object.entries(o).flatMap(([x,v])=>v&&typeof v==='object'&&!Array.isArray(v)?k(v,p+x+'.'):[p+x]).sort();console.log(JSON.stringify(k(a))===JSON.stringify(k(b))?'OK':'DIFERENCIAS')"
```

## Estructura de carpetas

```
src/
├─ proxy.ts                 redirige rutas sin idioma a /es (excluye api, _next, studio y ficheros)
├─ app/
│  ├─ globals.css           tokens de diseño (@theme) y estilos base
│  ├─ not-found.tsx         404 global, sin Tailwind a propósito (hex en línea permitidos solo aquí)
│  └─ [locale]/             TODAS las páginas; carpetas siempre con slug en español
│     ├─ layout.tsx         layout raíz: <html lang>, fuentes, Header, Footer, skip link
│     └─ page.tsx           home (marcador temporal hasta la fase 1)
├─ components/
│  ├─ layout/               Header, Footer, LocaleSwitcher, MobileNav
│  ├─ ui/                   Container, Section, Button, Card, Heading, Accordion, Breadcrumbs
│  ├─ apartments/           ApartmentCard, AmenitiesList, Gallery (lightbox)
│  ├─ sections/             ValueProps, DirectBooking, FinalCta
│  └─ forms/                ContactForm (fase 1: solo maquetación, sin envío real)
├─ data/                    contenido provisional bilingüe (fase 1; se borra/migra en fase 2):
│                            apartamentos.ts, equipamiento.ts, puntos-interes.ts
├─ i18n/
│  ├─ config.ts             locales, defaultLocale, localeHtmlLang, isLocale()
│  ├─ get-dictionary.ts     carga server-only; el tipo Dictionary se deriva de es.json
│  └─ dictionaries/         es.json, en.json
└─ lib/
   ├─ cn.ts
   └─ routes.ts             ÚNICA fuente de URLs internas; también `localizedPathname()`
                             (traduce una ruta entre idiomas, ver nota de LocaleSwitcher abajo)
plan.md, plan/              planes (ver reglas arriba)
scripts/generate-placeholders.mjs   genera public/placeholder/ (25 SVG de relleno)
```

Previstos en fases posteriores: `scripts/seed-sanity.mjs`, `sanity/` + `sanity.config.ts` en la
raíz y `src/lib/sanity/` (fase 2), `docs/`.

**`LocaleSwitcher` (nota importante, Next.js 16)**: en páginas estáticas servidas mediante
`rewrites` (las inglesas), `usePathname()` puede devolver permanentemente la ruta interna en
español en una carga completa de página, sin autocorregirse (contradice el matiz de la
documentación oficial sobre "Avoid hydration mismatch with rewrites"; verificado con Chrome real).
Por eso el cambio de idioma no confía en el `href` ya renderizado: recalcula el destino con
`window.location.pathname` en el `onClick` y navega con el router. Si se toca este componente,
no revertir a leer solo `usePathname()`.

## Convenciones de código

- Componentes como `export function Nombre()` (exportación con nombre), ficheros en kebab-case.
  Solo las páginas/layouts usan `export default`.
- Imports con alias `@/*` → `src/*`. Orden: externos, línea en blanco, internos.
- Nombres de dominio en español (`apartamento`, `precioDesde`, `licenciaVFT`); nombres técnicos
  y de componentes en inglés (`Header`, `routes`, `getDictionary`). Comentarios en español.
- Server Components por defecto; `"use client"` solo cuando haga falta (ej. `usePathname`, estado).
- Páginas y layouts: `params` es una **promesa** → `params: Promise<{ locale: string }>`, `await`,
  y `if (!isLocale(locale)) notFound()` antes de `getDictionary(locale)`.
- Clases de Tailwind combinadas siempre con `cn()`. Colores **solo** vía tokens; ningún hex suelto
  en componentes (excepción: `not-found.tsx`).
- **Ningún texto visible escrito a mano en un componente**: los textos de interfaz salen de los
  diccionarios; el contenido, de `src/data/` (fase 1) o de Sanity (fase 2+).
- **Todos los enlaces internos pasan por `routes` de `src/lib/routes.ts`.**
- Imágenes siempre con `next/image` (`width`/`height`, o `fill` dentro de contenedor `relative`
  con `aspect-ratio`) y con `alt`.
- Accesibilidad: `<label htmlFor>` reales, `aria-label` en botones de icono, foco visible (ya
  definido globalmente), un único `<h1>` por página.

## Identidad visual

Paleta (tokens Tailwind definidos en `globals.css`; **no añadir ni modificar colores sin
recalcular contraste**):

| Token | Hex | Uso | Contraste sobre `cal` |
|---|---|---|---|
| `terracota-500` | `#B85C38` | Decorativo: bordes, iconos, titulares ≥ 24 px | 4.07:1 |
| `terracota-600` | `#A34A2A` | Fondo de botón primario, enlaces de texto | 5.51:1 |
| `terracota-700` | `#8A3D22` | Hover/activo del primario; texto de acento sobre arena | 7.15:1 |
| `arena` | `#E8DCC8` | Fondos de sección y tarjetas | — |
| `arena-light` | `#F2EADC` | Separadores, fondos muy suaves (pie) | — |
| `cal` | `#FAF7F2` | Fondo base de la página | — |
| `oliva` | `#5C6B4A` | Iconos, badges, acento secundario | 5.29:1 |
| `granito` | `#6E6B66` | Texto secundario | 4.96:1 |
| `carbon` | `#2E2A26` | Texto principal | 13.3:1 |

**Reglas obligatorias de contraste:**

- `terracota-500` **nunca** como texto por debajo de 24 px.
- Texto blanco solo sobre `terracota-600`, `terracota-700` u `oliva`. Nunca sobre `terracota-500`.
- Sobre `arena` o `arena-light` el texto solo puede ser `carbon` o `terracota-700`.
  **Prohibidos `granito` y `terracota-600` sobre arena.**
- `granito` solo sobre `cal` o blanco.

Tipografía: `Fraunces` (titulares, `font-display`) e `Inter` (texto, `font-sans`), vía
`next/font/google` en `[locale]/layout.tsx`. Contenedor máximo `max-w-(--container-site)` = 1280 px.

## i18n

- Idiomas `es` (por defecto, `lang="es-ES"`) y `en` (`lang="en-GB"`, inglés británico natural).
  Rutas `/es/...` y `/en/...`; `/` redirige a `/es` desde `src/proxy.ts`.
- **Slugs traducidos**: las carpetas de `src/app/[locale]/` usan solo los slugs españoles; las URLs
  inglesas (`/en/apartments`, `/en/the-area/what-to-see`…) se sirven con `rewrites` en
  `next.config.ts` (fase 1.1). Una ruta nueva se añade en tres sitios: carpeta, `routes.ts` y
  `rewrites`. Canonical, hreflang y sitemap se construyen con `routes.ts`, nunca con la ruta del
  archivo ni con `usePathname`.
- Diccionarios `es.json` y `en.json` con **exactamente las mismas claves** (y mismo número de
  elementos en los arrays). TypeScript no avisa si falta una clave en `en.json`.
- A Sanity va el contenido editorial; los textos de interfaz (botones, menús, etiquetas) **se
  quedan siempre** en los diccionarios.

## Modelo de datos (Sanity, fase 2)

Multiidioma con objetos simples de un campo por idioma (`textoLocalizado`,
`textoLargoLocalizado`, `bloqueLocalizado` con `es`/`en`); **sin** plugin de i18n ni documentos
duplicados. Las consultas GROQ devuelven el campo ya resuelto con
`coalesce(campo[$locale], campo.es)` (cae al español si falta traducción).

- `apartamento`: nombre, slug, orden, descripción corta/larga, dormitorios, baños, plazas, metros,
  planta, ascensor, equipamiento (refs), galería (con `alt` localizado obligatorio), precioDesde
  (orientativo), licenciaVFT, urlBooking, urlAirbnb, channelManagerId, destacado.
- `equipamiento`: nombre + `iconKey` (debe existir en `src/data/equipamiento.ts`, que mapea a lucide).
- `puntoInteres`: nombre, categoría (`que-ver`/`donde-comer`/`como-llegar`), descripción,
  distanciaKm, `verificado` (si es `false`, la web muestra aviso), imagen, orden.
- `faq`: pregunta, respuesta, orden, `pendiente` (las pendientes no van al JSON-LD).
- `resena`: autor, país, texto, puntuación /10, origen (Booking/Airbnb/Directa), fecha.
  **Nunca** marcarlas con `Review`/`aggregateRating` en schema.org.
- `ajustesSitio`: singleton (`_id: "ajustesSitio"`): contacto, WhatsApp, datos fiscales, hero.

Reglas de negocio:

- `urlBooking`, `urlAirbnb` y `ajustesSitio.whatsapp` son opcionales: si están vacíos, el botón
  **no se renderiza** (si faltan ambas URLs de OTA, se muestra `apartment.bookPending`).
- `licenciaVFT` (`VFT/CO/xxxxx`) es obligatoria por ley en Andalucía en toda publicidad; si
  falta, se muestra `apartment.licencePending`.
- Sanity guarda **contenido**. Disponibilidad, precios por fecha y reservas serán del channel
  manager (fase 5); no habrá base de datos propia. `channelManagerId` enlaza ambos.
- Provisionalmente los 5 apartamentos (`apartamento-1` … `apartamento-5`) son **idénticos** a
  propósito (1 dormitorio, cocina independiente). No inventar diferencias.

## Otras decisiones de arquitectura

- **Channel manager** (fase 5, proveedor sin elegir): todo el código habla con una interfaz
  propia `ChannelManagerAdapter` (`getAvailability`, `getRates`, `createBooking`, `createHold`,
  `parseWebhook`); la web nunca llama al proveedor directamente.
- Analítica sin cookies (Plausible o Vercel Web Analytics) para **evitar banner de cookies**.
- Mapas con OpenStreetMap, **no Google Maps** (cookies/RGPD).
- Enlaces a OTAs con `rel="noopener noreferrer nofollow"`; la reserva directa siempre primero
  y como botón primario.
- Datos de la guía de la zona marcados "⚠️ VERIFICAR" no se publican sin confirmación de Javier.
  No inventar nombres de restaurantes ni coordenadas del edificio.
- Secretos solo en `.env.local` y en Vercel. `.gitignore` ignora `.env*`.
