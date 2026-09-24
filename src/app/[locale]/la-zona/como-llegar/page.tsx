import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getPuntosInteres } from "@/data/puntos-interes";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export default async function HowToGetTherePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const puntos = getPuntosInteres("como-llegar");

  return (
    <Container className="py-10 md:py-14">
      <Breadcrumbs
        label={dict.common.breadcrumbLabel}
        items={[
          { label: dict.nav.home, href: routes.home(locale) },
          { label: dict.nav.zone, href: routes.zone(locale) },
          { label: dict.zone.getThereTitle },
        ]}
      />
      <Heading className="mt-6" title={dict.zone.getThereTitle} subtitle={dict.zone.getThereIntro} />

      <div className="mt-8 rounded-lg bg-arena p-4 text-carbon">{dict.zone.unverified}</div>

      <ul className="mt-8 space-y-8">
        {puntos.map((punto) => (
          <li key={punto.nombre[locale]} className="border-b border-arena pb-8 last:border-0">
            <h3>{punto.nombre[locale]}</h3>
            <p className="mt-2 text-granito">{punto.descripcion[locale]}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 overflow-hidden rounded-xl border border-arena">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-4.865%2C38.360%2C-4.815%2C38.395&layer=mapnik&marker=38.3775%2C-4.8425"
          className="h-96 w-full"
          loading="lazy"
          title={dict.zone.getThereTitle}
        />
      </div>
    </Container>
  );
}
