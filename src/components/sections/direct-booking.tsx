import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function DirectBooking({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <h2>{dict.home.directTitle}</h2>
        {/* Sobre fondo arena solo se admite texto carbon o terracota-700: nunca granito. */}
        <p className="mt-4 text-carbon">{dict.home.directText}</p>
        <ul className="mt-6 space-y-3">
          {dict.home.directPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-carbon">
              <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-oliva" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex md:justify-end">
        <Button href={routes.book(locale)} size="lg">
          {dict.home.directCta}
        </Button>
      </div>
    </div>
  );
}
