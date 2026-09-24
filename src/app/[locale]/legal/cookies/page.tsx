import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Container className="py-10 md:py-14">
      <h1>{dict.footer.cookies}</h1>
      <p className="mt-4 max-w-2xl text-granito">
        [PENDIENTE: contenido a la espera de la decisión de analítica de la fase 3. Si se sigue
        la recomendación del plan (Plausible o Vercel Web Analytics, sin cookies de seguimiento),
        esta página lo explicará en vez de listar un banner de consentimiento.]
      </p>
    </Container>
  );
}
