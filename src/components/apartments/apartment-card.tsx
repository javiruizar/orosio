import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Apartamento } from "@/data/apartamentos";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function ApartmentCard({
  apartamento,
  locale,
  dict,
}: {
  apartamento: Apartamento;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = routes.apartment(locale, apartamento.slug);
  const bedroomsLabel =
    apartamento.dormitorios === 1 ? dict.apartments.bedrooms : dict.apartments.bedroomsPlural;
  const bathroomsLabel =
    apartamento.banos === 1 ? dict.apartments.bathrooms : dict.apartments.bathroomsPlural;

  return (
    <Card>
      <div className="relative aspect-[3/2]">
        <Image
          src={apartamento.galeria[0]}
          alt={apartamento.nombre[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h3>
          <Link href={href} className="hover:text-terracota-700">
            {apartamento.nombre[locale]}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-granito">{apartamento.descripcionCorta[locale]}</p>
        <p className="mt-3 text-sm text-granito">
          {apartamento.plazas} {dict.apartments.guests} · {apartamento.dormitorios}{" "}
          {bedroomsLabel} · {apartamento.banos} {bathroomsLabel} · {apartamento.metros}{" "}
          {dict.apartments.surface}
        </p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-carbon">
            {dict.apartments.from}{" "}
            <span className="font-semibold">{apartamento.precioDesde} €</span>{" "}
            {dict.apartments.perNight}
          </p>
          <Button href={href} variant="secondary" size="sm">
            {dict.apartments.viewDetail}
          </Button>
        </div>
      </div>
    </Card>
  );
}
