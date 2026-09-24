# Fase 0 — Cimientos

> Documento de ejecución. Leer antes [`../plan.md`](../plan.md).
> Marcar `[x]` cada tarea al completarla.

**Objetivo de la fase**: que exista un proyecto Next.js desplegado en una URL pública, con la
identidad visual cargada, el enrutado en dos idiomas funcionando y los componentes base listos
para que la fase 1 solo tenga que componer páginas.

**Directorio de trabajo**: `/home/javierruiz/Documentos/proyectos/orosio`
(en adelante, la "raíz del proyecto"). Todas las rutas de este documento son relativas a ella.

**Al terminar esta fase NO debe haber**: páginas de contenido, fichas de apartamento, textos de
marketing ni imágenes reales. Eso es la fase 1.

---

## 0.1 Comprobación del entorno

- [x] Ejecutar `node --version`. **Debe ser 20.x o superior.** Si es menor, parar y avisar.
      → **v20.19.3** ✅
- [x] Ejecutar `npm --version` y `git --version` para confirmar que están disponibles.
      → npm 10.8.2, git 2.53.0 (además, pnpm 11.5.2: el proyecto usa pnpm, ver nota en 0.2). ✅
- [ ] Confirmar que la raíz del proyecto contiene solo `plan.md` y la carpeta `plan/`.
      → No verificable a posteriori: el proyecto ya se generó sobre esta carpeta. Sin consecuencias.

---

## 0.2 Crear el proyecto Next.js

`create-next-app` se niega a instalar en un directorio que ya tiene archivos. Por eso se genera
en una carpeta temporal y se mueve el contenido a la raíz.

> **Nota (2026-09-24)**: el proyecto usa **pnpm**, no npm (hay `pnpm-lock.yaml` y
> `pnpm-workspace.yaml`; no hay `package-lock.json`). Todos los `npm install` / `npm run` de este
> documento y de los siguientes deben leerse como `pnpm add` / `pnpm <script>`. Ver CLAUDE.md.

- [x] Generar el proyecto en una carpeta temporal:

```bash
cd /home/javierruiz/Documentos/proyectos/orosio
npx create-next-app@latest .tmp-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --no-turbopack \
  --yes
```

- [x] Mover todo el contenido generado a la raíz y borrar la carpeta temporal:

```bash
cd /home/javierruiz/Documentos/proyectos/orosio
mv .tmp-app/* .tmp-app/.* . 2>/dev/null || true
rmdir .tmp-app
```

- [x] Comprobar que en la raíz existen ahora: `package.json`, `next.config.ts`, `tsconfig.json`,
      `src/app/`, `public/`, `.gitignore`, y que **siguen** estando `plan.md` y `plan/`.

### Verificar la versión de Tailwind

- [x] Abrir `package.json` y mirar la versión de `tailwindcss`. → **v4 confirmado** ✅
  - **Si es `^4.x`** (lo esperado): seguir con el documento tal cual.
  - **Si es `^3.x`**: parar y avisar. Este plan está escrito para Tailwind v4, cuya configuración
    es CSS-first (`@theme` dentro del CSS) y no usa `tailwind.config.ts`. Habría que adaptar los
    pasos 0.4 y 0.5.

---

## 0.3 Repositorio git

- [x] Inicializar el repositorio (`create-next-app` puede haberlo hecho ya; si existe `.git`,
      saltar este comando):

```bash
cd /home/javierruiz/Documentos/proyectos/orosio
git init -b main
```

- [x] Añadir al final de `.gitignore` las siguientes líneas:

```
# Entorno
.env
.env.local
.env*.local

# Sanity (fase 2)
.sanity/

# Sistema
.DS_Store
```

- [x] Primer commit:

```bash
git add -A
git commit -m "Fase 0: proyecto Next.js inicial"
```

---

## 0.4 Tokens de diseño en Tailwind

- [x] **Sustituir por completo** el contenido de `src/app/globals.css` por:

```css
@import "tailwindcss";

@theme {
  /* ---- Paleta Orosio ----
     Contrastes verificados. Ver reglas de uso en plan.md §2.
     No añadir ni modificar colores sin recalcular el contraste. */
  --color-terracota-500: #b85c38;
  --color-terracota-600: #a34a2a;
  --color-terracota-700: #8a3d22;
  --color-arena: #e8dcc8;
  --color-arena-light: #f2eadc;
  --color-cal: #faf7f2;
  --color-oliva: #5c6b4a;
  --color-granito: #6e6b66;
  --color-carbon: #2e2a26;

  /* ---- Tipografías ----
     Las variables --font-fraunces y --font-inter las inyecta next/font
     desde src/app/[locale]/layout.tsx */
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;

  /* ---- Anchura del contenedor ---- */
  --container-site: 80rem; /* 1280px */
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-cal);
    color: var(--color-carbon);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3 {
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: -0.015em;
    text-wrap: balance;
  }

  h1 {
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    line-height: 1.1;
  }

  h2 {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    line-height: 1.2;
  }

  h3 {
    font-size: clamp(1.25rem, 2vw, 1.5rem);
    line-height: 1.3;
  }

  p {
    text-wrap: pretty;
  }

  /* Foco visible y coherente en toda la web (accesibilidad) */
  :focus-visible {
    outline: 2px solid var(--color-terracota-600);
    outline-offset: 2px;
  }
}
```

**Nota para quien ejecuta**: con Tailwind v4 estos tokens generan automáticamente las utilidades
`bg-terracota-600`, `text-carbon`, `border-arena`, `font-display`, etc. No hay que declararlas
en ningún otro sitio ni crear `tailwind.config.ts`.

---

## 0.5 Estructura de carpetas

- [x] Crear estas carpetas vacías dentro de `src/`:

```
src/
├─ app/
│  └─ [locale]/          ← todas las páginas viven aquí
├─ components/
│  ├─ layout/            ← Header, Footer, LocaleSwitcher
│  └─ ui/                ← Container, Button, Card, Section
├─ i18n/
│  └─ dictionaries/      ← es.json, en.json
└─ lib/                  ← utilidades
```

- [x] Borrar `src/app/page.tsx` y `src/app/layout.tsx` que generó `create-next-app`.
      Se sustituyen por versiones dentro de `[locale]` en los pasos siguientes.
- [x] Borrar `src/app/favicon.ico` **no**: se conserva.
- [x] Vaciar la carpeta `public/` de los SVG de ejemplo de Next.js
      (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).

---

## 0.6 Configuración de idiomas

- [x] Crear `src/i18n/config.ts`:

```ts
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
```

- [x] Crear `src/i18n/dictionaries/es.json`. En la fase 0 solo contiene lo que usan la cabecera y
      el pie; la fase 1 lo ampliará:

```json
{
  "nav": {
    "home": "Inicio",
    "apartments": "Apartamentos",
    "zone": "La zona",
    "book": "Reservar",
    "contact": "Contacto",
    "faq": "Preguntas frecuentes"
  },
  "header": {
    "cta": "Ver disponibilidad",
    "openMenu": "Abrir menú",
    "closeMenu": "Cerrar menú",
    "skipToContent": "Saltar al contenido"
  },
  "footer": {
    "tagline": "Cinco apartamentos en el centro de Pozoblanco, en pleno valle de Los Pedroches.",
    "sections": "Secciones",
    "legal": "Legal",
    "contact": "Contacto",
    "legalNotice": "Aviso legal",
    "privacy": "Política de privacidad",
    "cookies": "Política de cookies",
    "rights": "Todos los derechos reservados.",
    "licenceNote": "Viviendas con fines turísticos inscritas en el Registro de Turismo de Andalucía."
  },
  "localeSwitcher": {
    "label": "Cambiar idioma"
  },
  "common": {
    "brand": "Apartamentos Orosio",
    "city": "Pozoblanco, Córdoba"
  }
}
```

- [x] Crear `src/i18n/dictionaries/en.json` con **exactamente las mismas claves**:

```json
{
  "nav": {
    "home": "Home",
    "apartments": "Apartments",
    "zone": "The area",
    "book": "Book",
    "contact": "Contact",
    "faq": "FAQ"
  },
  "header": {
    "cta": "Check availability",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "skipToContent": "Skip to content"
  },
  "footer": {
    "tagline": "Five apartments in the centre of Pozoblanco, in the heart of the Los Pedroches valley.",
    "sections": "Sections",
    "legal": "Legal",
    "contact": "Contact",
    "legalNotice": "Legal notice",
    "privacy": "Privacy policy",
    "cookies": "Cookie policy",
    "rights": "All rights reserved.",
    "licenceNote": "Tourist accommodation registered with the Andalusian Tourism Registry."
  },
  "localeSwitcher": {
    "label": "Change language"
  },
  "common": {
    "brand": "Apartamentos Orosio",
    "city": "Pozoblanco, Córdoba"
  }
}
```

- [x] Crear `src/i18n/get-dictionary.ts`:

```ts
import "server-only";

import type { Locale } from "./config";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["es"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
```

- [x] Instalar la dependencia que exige `import "server-only"`:

```bash
npm install server-only
```

**Nota**: el tipo `Dictionary` se deriva del JSON español. Por eso `en.json` **debe** tener
exactamente las mismas claves: si falta una, TypeScript no avisa pero la web mostrará
`undefined`. Cada vez que se añada una clave hay que añadirla en los dos archivos.

---

## 0.7 Middleware de redirección de idioma

Su única función es que quien entre en `/` o en una ruta sin idioma acabe en `/es`.

- [x] Crear `src/proxy.ts` (en Next.js 16 `middleware` se renombró a `proxy`):

> **Nota (2026-09-24)**: En Next.js 16, la convención `middleware.ts` fue deprecada y
> renombrada a `proxy.ts`, con la función exportada como `proxy`. El plan original
> mencionaba `middleware.ts` porque se escribió para Next.js 15, pero el proyecto usa
> Next.js 16.3.6 y ya está implementado correctamente como `proxy.ts`. ✅

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Excluye archivos estáticos, rutas de API, el studio de Sanity (fase 2)
  // y cualquier archivo con extensión.
  matcher: ["/((?!api|_next|studio|.*\\..*).*)"],
};
```

---

## 0.8 Layout raíz

**Aviso importante para quien ejecuta**: en Next.js 15 la prop `params` de páginas y layouts es
una **promesa**. Hay que declararla como `Promise<{ locale: string }>` y hacerle `await`.
Olvidarlo es el error más frecuente al portar código de versiones anteriores.

- [x] Crear `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, localeHtmlLang, locales } from "@/i18n/config";

import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apartamentos Orosio",
  description: "Apartamentos turísticos en Pozoblanco, Los Pedroches.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html
      lang={localeHtmlLang[locale]}
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-terracota-600 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.header.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
```

> **Nota (2026-09-24)**: se ha añadido `data-scroll-behavior="smooth"` al `<html>`, que no estaba
> en el plan original. En Next.js 16 el framework ya no neutraliza automáticamente el
> `scroll-behavior: smooth` de `globals.css` durante la navegación entre páginas; sin este
> atributo, cada cambio de página produce un scroll animado hasta arriba en vez del salto
> instantáneo esperado. ✅

- [x] Crear `src/app/[locale]/page.tsx` como marcador temporal. **La fase 1 lo reemplaza entero**:

```tsx
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <Container className="py-24">
      <h1>Apartamentos Orosio</h1>
      <p className="mt-4 text-granito">
        Cimientos listos. El contenido llega en la fase 1.
      </p>
    </Container>
  );
}
```

- [x] Crear `src/app/not-found.tsx` (página 404 global, sin idioma):

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          backgroundColor: "#faf7f2",
          color: "#2e2a26",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Página no encontrada</h1>
        <Link href="/es" style={{ color: "#a34a2a", textDecoration: "underline" }}>
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
```

---

## 0.9 Utilidad `cn`

- [x] Instalar dependencias:

```bash
npm install clsx tailwind-merge
```

- [x] Crear `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 0.10 Componentes de interfaz

- [x] Crear `src/components/ui/container.tsx`:

```tsx
import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-(--container-site) px-5 md:px-8", className)}>
      {children}
    </div>
  );
}
```

- [x] Crear `src/components/ui/section.tsx`:

```tsx
import { Container } from "./container";
import { cn } from "@/lib/cn";

type Tone = "cal" | "arena" | "arena-light";

const tones: Record<Tone, string> = {
  cal: "bg-cal",
  arena: "bg-arena",
  "arena-light": "bg-arena-light",
};

export function Section({
  tone = "cal",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(tones[tone], "py-16 md:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}
```

- [x] Crear `src/components/ui/button.tsx`. Es un componente polimórfico: si recibe `href`
      renderiza un `Link` de Next, y si no, un `button`.

```tsx
import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Blanco sobre terracota-600 = 5.88:1
  primary: "bg-terracota-600 text-white hover:bg-terracota-700",
  // Carbón sobre cal, borde terracota
  secondary:
    "border border-terracota-600 bg-transparent text-terracota-700 hover:bg-terracota-600 hover:text-white",
  ghost: "bg-transparent text-carbon underline underline-offset-4 hover:text-terracota-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
```

- [x] Crear `src/components/ui/card.tsx`:

```tsx
import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-arena bg-white shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

---

## 0.11 Rutas y navegación

- [x] Crear `src/lib/routes.ts`. **Todos los enlaces internos de la web deben pasar por aquí**;
      así, si un día cambian los slugs, solo se toca este archivo:

```ts
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
```

**Decisión tomada**: los slugs se traducen (`/es/apartamentos` y `/en/apartments`), porque para
SEO es mejor que repetir el slug español en inglés. Las carpetas de `src/app/[locale]/` se crean
**solo con los nombres en español**, y las URLs inglesas se resuelven con `rewrites` en
`next.config.ts`. La lista completa de rewrites está en el paso 1.1 de
[`fase-1-maqueta.md`](fase-1-maqueta.md). En la fase 0 todavía no hace falta configurarlos.

---

## 0.12 Cabecera, pie y selector de idioma

- [x] Instalar los iconos:

```bash
npm install lucide-react
```

- [x] Crear `src/components/layout/locale-switcher.tsx` (componente de cliente: necesita conocer
      la ruta actual para no perderla al cambiar de idioma):

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();

  /** Sustituye el primer segmento de la ruta por el idioma destino. */
  function pathFor(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-granito">/</span>}
          <Link
            href={pathFor(l)}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "uppercase transition-colors",
              l === locale ? "font-semibold text-carbon" : "text-granito hover:text-terracota-700",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
```

- [x] Crear `src/components/layout/header.tsx`:

```tsx
import Link from "next/link";

import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: routes.apartments(locale), label: dict.nav.apartments },
    { href: routes.zone(locale), label: dict.nav.zone },
    { href: routes.faq(locale), label: dict.nav.faq },
    { href: routes.contact(locale), label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-arena bg-cal/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href={routes.home(locale)}
          className="font-display text-lg font-semibold tracking-tight text-carbon md:text-xl"
        >
          Apartamentos <span className="text-terracota-600">Orosio</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-carbon transition-colors hover:text-terracota-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher locale={locale} label={dict.localeSwitcher.label} />
          <Button href={routes.book(locale)} size="sm" className="hidden sm:inline-flex">
            {dict.header.cta}
          </Button>
          <MobileNav
            links={links}
            openLabel={dict.header.openMenu}
            closeLabel={dict.header.closeMenu}
            ctaHref={routes.book(locale)}
            ctaLabel={dict.header.cta}
          />
        </div>
      </Container>
    </header>
  );
}
```

- [x] Crear `src/components/layout/mobile-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileNav({
  links,
  openLabel,
  closeLabel,
  ctaHref,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú al navegar a otra página.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-carbon"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-arena bg-cal px-5 pb-6 pt-2 shadow-lg">
          <nav className="flex flex-col" aria-label="Principal móvil">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-arena py-3 text-carbon"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="mt-4 rounded-lg bg-terracota-600 px-5 py-3 text-center font-medium text-white"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
```

> **Nota (2026-09-24)**: la implementación real de `mobile-nav.tsx` cierra el menú con `onClick`
> en cada enlace en lugar del `useEffect` sobre `pathname` de este documento (mismo resultado,
> evita una dependencia de `usePathname` en un componente que no la necesitaba para nada más).
> `button.tsx` incluye además un `// eslint-disable-next-line` en la desestructuración de props no
> usadas, que este documento no menciona. Ninguna de las dos diferencias afecta al comportamiento.

- [x] Crear `src/components/layout/footer.tsx`:

```tsx
import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const sectionLinks = [
    { href: routes.apartments(locale), label: dict.nav.apartments },
    { href: routes.zone(locale), label: dict.nav.zone },
    { href: routes.book(locale), label: dict.nav.book },
    { href: routes.faq(locale), label: dict.nav.faq },
  ];

  const legalLinks = [
    { href: routes.legalNotice(locale), label: dict.footer.legalNotice },
    { href: routes.privacy(locale), label: dict.footer.privacy },
    { href: routes.cookies(locale), label: dict.footer.cookies },
  ];

  return (
    <footer className="border-t border-arena bg-arena-light">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold text-carbon">
            Apartamentos <span className="text-terracota-700">Orosio</span>
          </p>
          {/* Sobre arena-light solo se admite texto carbon o terracota-700 */}
          <p className="mt-3 max-w-sm text-sm text-carbon">{dict.footer.tagline}</p>
          <p className="mt-4 text-sm text-carbon">{dict.common.city}</p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-carbon">
            {dict.footer.sections}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-carbon hover:text-terracota-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-carbon">
            {dict.footer.legal}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-carbon hover:text-terracota-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-arena">
        <Container className="flex flex-col gap-2 py-5 text-xs text-carbon md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {dict.common.brand}. {dict.footer.rights}
          </p>
          {/* Aviso obligatorio en Andalucía. Los códigos VFT reales
              se añaden por apartamento en la fase 2. */}
          <p>{dict.footer.licenceNote}</p>
        </Container>
      </div>
    </footer>
  );
}
```

---

## 0.13 Comprobación local

- [ ] Arrancar el servidor de desarrollo:

```bash
pnpm dev
```

- [x] Abrir `http://localhost:3000` y comprobar que **redirige a `/es`**.
      → Verificado con `curl` sobre la build de producción: `/` responde 307 a `/es`. ✅
- [x] Comprobar que `http://localhost:3000/en` carga con la navegación en inglés.
      → Verificado con `curl`: `/en` responde 200, `lang="en-GB"`, textos en inglés. ✅
- [x] Pulsar `EN` y `ES` en el selector y confirmar que se mantiene en la misma página.
      → Verificado por Javier en el navegador (2026-09-24). ✅
- [x] Reducir la ventana por debajo de 768 px y confirmar que aparece el menú hamburguesa,
      que se abre, que se cierra y que al navegar se cierra solo.
      → Verificado por Javier en el navegador (2026-09-24). ✅
- [x] Tabular con el teclado desde el principio de la página: el primer foco debe ser el enlace
      "Saltar al contenido", visible sobre fondo terracota.
      → Verificado por Javier en el navegador (2026-09-24). En pulsaciones de Tab posteriores
      desde la barra de direcciones, el foco puede caer en la búsqueda contextual del propio
      navegador (Chrome/Edge); es comportamiento del navegador, no de la web, y no invalida
      la prueba. ✅
- [x] Comprobar que los titulares se ven en serif (Fraunces) y el texto en sans (Inter).
      → Verificado por Javier en el navegador (2026-09-24). ✅
- [x] Parar el servidor y verificar que la compilación de producción pasa sin errores:

```bash
pnpm build
pnpm lint
```

Si `pnpm build` falla, **no continuar**: arreglar el error antes de desplegar.

---

## 0.14 Despliegue en Vercel

Este paso necesita cuentas de Javier. Si no están disponibles, dejarlo pendiente y avisar;
el resto de la fase 0 se da por buena igualmente.

- [x] Crear un repositorio vacío en GitHub llamado `orosio` (privado).
      → `github.com/javiruizar/orosio`. ✅
- [x] Conectarlo y subir el código:

```bash
git remote add origin git@github.com:<usuario>/orosio.git
git add -A
git commit -m "Fase 0: identidad visual, i18n y componentes base"
git push -u origin main
```

      → `main` sincronizado con `origin/main`. ✅

- [x] En [vercel.com](https://vercel.com), "Add New → Project", importar el repositorio.
      Todos los ajustes por defecto son correctos: Vercel detecta Next.js solo.
      → Hecho por Javier (2026-09-24). ✅
- [x] Esperar al despliegue y abrir la URL `*.vercel.app` que devuelve.
      → Desplegado. ✅
- [x] Repetir sobre esa URL las comprobaciones de 0.13.
      → Verificado por Javier en producción (2026-09-24). ✅
- [ ] Anotar la URL de producción en este documento:

```
URL de producción: [PENDIENTE: pegar la URL de *.vercel.app]
```

---

## 0.15 Lista de verificación de cierre

No dar la fase por terminada hasta que todo esto se cumpla:

- [x] `pnpm build` termina sin errores ni avisos de TypeScript. ✅
- [x] `pnpm lint` termina limpio. ✅
- [x] `/` redirige a `/es`; `/es` y `/en` funcionan.
      → Verificado con `curl` sobre la build de producción. ✅
- [x] El selector de idioma conserva la página actual.
      → Verificado por Javier en el navegador (2026-09-24). ✅
- [x] La cabecera es pegajosa y el menú móvil funciona.
      → Verificado por Javier en el navegador (2026-09-24). ✅
- [x] Los colores usados coinciden con los tokens; no hay ningún hexadecimal suelto en los
      componentes salvo en `not-found.tsx`, que va sin Tailwind a propósito.
      → Verificado con grep sobre `src/`. ✅
- [x] No se ha usado `granito` como texto sobre fondo `arena` ni `arena-light`.
      → Verificado con grep sobre `src/`. ✅
- [x] `es.json` y `en.json` tienen exactamente las mismas claves.
      → Verificado por script (22 claves de primer nivel, mismo conjunto anidado). ✅
- [x] Todos los enlaces internos pasan por `routes` de `src/lib/routes.ts`.
      → Verificado con grep: ningún `href` literal fuera de `not-found.tsx`. ✅
- [x] Commit hecho y subido a GitHub (`javiruizar/orosio`, rama `main`, sincronizada con
      `origin/main`). Despliegue en Vercel hecho y verificado por Javier (2026-09-24); solo falta
      anotar la URL exacta en 0.14. ✅
- [x] Marcada la fase 0 como completada en la tabla de [`../plan.md`](../plan.md).
