import { notFound } from "next/navigation";

import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Container className="py-10 md:py-14">
      <Heading title={dict.faq.title} subtitle={dict.faq.intro} />
      <div className="mt-8 rounded-lg bg-arena p-4 text-carbon">{dict.faq.pendingNote}</div>
      <div className="mt-8">
        <Accordion items={dict.faq.items} />
      </div>
    </Container>
  );
}
