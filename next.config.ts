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
