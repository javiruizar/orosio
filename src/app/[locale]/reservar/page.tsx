import { notFound } from "next/navigation";

import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { apartamentos } from "@/data/apartamentos";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  // Apartamentos con al menos una URL de OTA publicada. Hoy no hay ninguno (todas son
  // null), así que se muestra el aviso `apartment.bookPending`. En cuanto se rellene una
  // URL desde Sanity (fase 2), esta lista deja de estar vacía sin tocar el código.
  const conCanal = apartamentos.filter((a) => a.urlBooking || a.urlAirbnb);

  return (
    <Container className="py-10 md:py-14">
      <Heading title={dict.book.title} subtitle={dict.book.intro} />

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <h2>{dict.book.directTitle}</h2>
          <p className="mt-3 text-granito">{dict.book.directText}</p>
          <div className="mt-6">
            <ContactForm dict={dict} />
          </div>
        </div>

        <div>
          <h2>{dict.book.channelsTitle}</h2>
          <p className="mt-3 text-granito">{dict.book.channelsText}</p>

          {conCanal.length === 0 ? (
            <p className="mt-6 text-granito">{dict.apartment.bookPending}</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {conCanal.map((apartamento) => (
                <li key={apartamento.slug} className="rounded-lg border border-arena p-4">
                  <p className="font-medium text-carbon">{apartamento.nombre[locale]}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {apartamento.urlBooking && (
                      <Button href={apartamento.urlBooking} external variant="secondary" size="sm">
                        {dict.apartment.bookBooking}
                      </Button>
                    )}
                    {apartamento.urlAirbnb && (
                      <Button href={apartamento.urlAirbnb} external variant="secondary" size="sm">
                        {dict.apartment.bookAirbnb}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2>{dict.book.comparisonTitle}</h2>

        {/* Escritorio: tabla */}
        <div className="mt-6 hidden overflow-hidden rounded-xl border border-arena md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-arena-light text-carbon">
              <tr>
                <th className="p-4 font-semibold"></th>
                <th className="p-4 font-semibold">{dict.book.comparisonDirect}</th>
                <th className="p-4 font-semibold">{dict.book.comparisonPlatforms}</th>
              </tr>
            </thead>
            <tbody>
              {dict.book.comparisonRows.map((row) => (
                <tr key={row.label} className="border-t border-arena">
                  <th scope="row" className="p-4 font-medium text-carbon">
                    {row.label}
                  </th>
                  <td className="p-4 text-carbon">{row.direct}</td>
                  <td className="p-4 text-carbon">{row.platforms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Móvil: tarjetas apiladas, para no meter scroll horizontal */}
        <div className="mt-6 space-y-4 md:hidden">
          {dict.book.comparisonRows.map((row) => (
            <div key={row.label} className="rounded-lg border border-arena p-4">
              <p className="font-semibold text-carbon">{row.label}</p>
              <p className="mt-2 text-sm text-granito">
                {dict.book.comparisonDirect}: <span className="text-carbon">{row.direct}</span>
              </p>
              <p className="mt-1 text-sm text-granito">
                {dict.book.comparisonPlatforms}: <span className="text-carbon">{row.platforms}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
