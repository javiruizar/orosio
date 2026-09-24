import { notFound } from "next/navigation";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Container className="py-10 md:py-14">
      <Heading title={dict.contact.title} subtitle={dict.contact.intro} />

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <h2>{dict.contact.formTitle}</h2>
          <div className="mt-6">
            <ContactForm dict={dict} />
          </div>
        </div>

        <div>
          <h2>{dict.contact.directTitle}</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-granito">{dict.contact.email}</dt>
              <dd className="text-carbon">[pendiente]</dd>
            </div>
            <div>
              <dt className="text-sm text-granito">{dict.contact.phone}</dt>
              <dd className="text-carbon">[pendiente]</dd>
            </div>
          </dl>

          {/* TODO fase 3: número real de WhatsApp (ajustesSitio.whatsapp en Sanity) */}
          <button
            type="button"
            disabled
            className="mt-6 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-lg bg-oliva px-5 font-medium text-white opacity-50"
          >
            {dict.contact.whatsapp}
          </button>
        </div>
      </div>
    </Container>
  );
}
