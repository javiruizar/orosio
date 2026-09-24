import Image from "next/image";
import { notFound } from "next/navigation";

import { ApartmentCard } from "@/components/apartments/apartment-card";
import { DirectBooking } from "@/components/sections/direct-booking";
import { FinalCta } from "@/components/sections/final-cta";
import { ValueProps } from "@/components/sections/value-props";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { apartamentos } from "@/data/apartamentos";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const destacados = apartamentos.filter((a) => a.destacado);

  return (
    <>
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src="/placeholder/hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-carbon/45" />
        <Container className="relative z-10 flex flex-col items-center gap-6 py-24 text-center text-white">
          <h1 className="text-white">{dict.home.heroTitle}</h1>
          <p className="max-w-2xl text-lg text-white/90">{dict.home.heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href={routes.apartments(locale)} size="lg">
              {dict.home.heroCta}
            </Button>
            <Button
              href={routes.book(locale)}
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-carbon"
            >
              {dict.home.heroCtaSecondary}
            </Button>
          </div>
        </Container>
      </div>

      <Section tone="cal">
        <ValueProps title={dict.home.valuesTitle} values={dict.home.values} />
      </Section>

      <Section tone="arena-light">
        <Heading
          align="center"
          tone="arena"
          title={dict.home.apartmentsTitle}
          subtitle={dict.home.apartmentsSubtitle}
        />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {destacados.map((apartamento) => (
            <ApartmentCard
              key={apartamento.slug}
              apartamento={apartamento}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href={routes.apartments(locale)} variant="secondary">
            {dict.home.apartmentsCta}
          </Button>
        </div>
      </Section>

      <Section tone="arena">
        <DirectBooking locale={locale} dict={dict} />
      </Section>

      <Section tone="cal">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/placeholder/zona-dehesa.svg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2>{dict.home.zoneTitle}</h2>
            <p className="mt-4 text-granito">{dict.home.zoneText}</p>
            <Button href={routes.zone(locale)} className="mt-6">
              {dict.home.zoneCta}
            </Button>
          </div>
        </div>
      </Section>

      <FinalCta
        title={dict.home.finalCtaTitle}
        text={dict.home.finalCtaText}
        buttonLabel={dict.home.finalCtaButton}
        href={routes.book(locale)}
      />
    </>
  );
}
