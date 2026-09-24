import {
  AirVent,
  BedDouble,
  CookingPot,
  Flame,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { Locale } from "@/i18n/config";

export const equipamiento: Record<
  string,
  { icon: LucideIcon; label: Record<Locale, string> }
> = {
  wifi: { icon: Wifi, label: { es: "Wifi", en: "Wifi" } },
  cocina: { icon: CookingPot, label: { es: "Cocina independiente", en: "Separate kitchen" } },
  lavadora: { icon: WashingMachine, label: { es: "Lavadora", en: "Washing machine" } },
  aire: { icon: AirVent, label: { es: "Aire acondicionado", en: "Air conditioning" } },
  calefaccion: { icon: Flame, label: { es: "Calefacción", en: "Heating" } },
  tv: { icon: Tv, label: { es: "Televisión", en: "Television" } },
  "ropa-cama": { icon: BedDouble, label: { es: "Ropa de cama y toallas", en: "Linen and towels" } },
  menaje: { icon: Utensils, label: { es: "Menaje completo", en: "Full kitchenware" } },
};
