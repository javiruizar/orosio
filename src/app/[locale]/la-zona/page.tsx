import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export default async function ZonePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const cards = [
    {
      href: routes.zoneSee(locale),
      image: "/placeholder/zona-que-ver.svg",
      title: dict.zone.seeTitle,
    },
    {
      href: routes.zoneEat(locale),
      image: "/placeholder/zona-donde-comer.svg",
      title: dict.zone.eatTitle,
    },
    {
      href: routes.zoneGetThere(locale),
      image: "/placeholder/zona-como-llegar.svg",
      title: dict.zone.getThereTitle,
    },
  ];

  return (
    <Container className="py-10 md:py-14">
      <Heading title={dict.zone.title} subtitle={dict.zone.intro} />
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.href}>
            <div className="relative aspect-[3/2]">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3>{card.title}</h3>
              <Link
                href={card.href}
                className="mt-3 inline-block text-terracota-700 hover:underline"
              >
                {dict.zone.readMore}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
