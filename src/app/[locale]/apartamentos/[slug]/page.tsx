import { notFound } from "next/navigation";

import { AmenitiesList } from "@/components/apartments/amenities-list";
import { Gallery } from "@/components/apartments/gallery";
import { FinalCta } from "@/components/sections/final-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { apartamentos, getApartamento } from "@/data/apartamentos";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return locales.flatMap((locale) => apartamentos.map((a) => ({ locale, slug: a.slug })));
}

export default async function ApartmentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const apartamento = getApartamento(slug);
  if (!apartamento) notFound();

  const bedroomsLabel =
    apartamento.dormitorios === 1 ? dict.apartments.bedrooms : dict.apartments.bedroomsPlural;
  const bathroomsLabel =
    apartamento.banos === 1 ? dict.apartments.bathrooms : dict.apartments.bathroomsPlural;

  return (
    <>
      <Container className="py-10 md:py-14">
        <Breadcrumbs
          label={dict.common.breadcrumbLabel}
          items={[
            { label: dict.nav.home, href: routes.home(locale) },
            { label: dict.nav.apartments, href: routes.apartments(locale) },
            { label: apartamento.nombre[locale] },
          ]}
        />

        <h1 className="mt-6">{apartamento.nombre[locale]}</h1>
        <p className="mt-2 text-granito">
          {apartamento.plazas} {dict.apartments.guests} · {apartamento.dormitorios}{" "}
          {bedroomsLabel} · {apartamento.banos} {bathroomsLabel} · {apartamento.metros}{" "}
          {dict.apartments.surface}
        </p>

        <div className="mt-8">
          <Gallery
            imagenes={apartamento.galeria}
            nombre={apartamento.nombre[locale]}
            labels={{
              open: dict.apartment.galleryOpen,
              close: dict.apartment.galleryClose,
              prev: dict.apartment.galleryPrev,
              next: dict.apartment.galleryNext,
            }}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2>{dict.apartment.aboutTitle}</h2>
            <div className="mt-4 space-y-4 text-carbon">
              {apartamento.descripcionLarga[locale].map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>

            <h2 className="mt-10">{dict.apartment.amenitiesTitle}</h2>
            <div className="mt-4">
              <AmenitiesList claves={apartamento.equipamiento} locale={locale} />
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-arena bg-white p-6">
              <h3>{dict.apartment.bookTitle}</h3>
              <p className="mt-2 text-carbon">
                {dict.apartments.from}{" "}
                <span className="text-xl font-semibold">{apartamento.precioDesde} €</span>{" "}
                {dict.apartments.perNight}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <Button href={routes.book(locale)} className="w-full">
                  {dict.apartment.bookDirect}
                </Button>

                {apartamento.urlBooking && (
                  <Button
                    href={apartamento.urlBooking}
                    external
                    variant="secondary"
                    className="w-full"
                  >
                    {dict.apartment.bookBooking}
                  </Button>
                )}
                {apartamento.urlAirbnb && (
                  <Button
                    href={apartamento.urlAirbnb}
                    external
                    variant="secondary"
                    className="w-full"
                  >
                    {dict.apartment.bookAirbnb}
                  </Button>
                )}
                {!apartamento.urlBooking && !apartamento.urlAirbnb && (
                  <p className="text-sm text-granito">{dict.apartment.bookPending}</p>
                )}
              </div>

              <p className="mt-5 text-sm text-granito">
                {dict.apartment.licence}: {apartamento.licenciaVFT ?? dict.apartment.licencePending}
              </p>
            </div>
          </div>
        </div>
      </Container>

      <FinalCta
        title={dict.home.finalCtaTitle}
        text={dict.home.finalCtaText}
        buttonLabel={dict.home.finalCtaButton}
        href={routes.book(locale)}
      />
    </>
  );
}
