import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Container className="py-10 md:py-14">
      <h1>{dict.footer.privacy}</h1>
      <p className="mt-4 max-w-2xl text-granito">
        [PENDIENTE: contenido a la espera de los datos fiscales de Javier — responsable del
        tratamiento, finalidad, plazo de conservación y derechos. Se redacta entero en la fase 3.]
      </p>
    </Container>
  );
}
