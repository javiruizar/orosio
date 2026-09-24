import { notFound } from "next/navigation";

import { ApartmentCard } from "@/components/apartments/apartment-card";
import { FinalCta } from "@/components/sections/final-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { apartamentos } from "@/data/apartamentos";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export default async function ApartmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Container className="py-10 md:py-14">
        <Breadcrumbs
          label={dict.common.breadcrumbLabel}
          items={[
            { label: dict.nav.home, href: routes.home(locale) },
            { label: dict.nav.apartments },
          ]}
        />
        <Heading
          className="mt-6"
          title={dict.apartments.title}
          subtitle={dict.apartments.intro}
        />
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {apartamentos.map((apartamento) => (
            <ApartmentCard
              key={apartamento.slug}
              apartamento={apartamento}
              locale={locale}
              dict={dict}
            />
          ))}
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
