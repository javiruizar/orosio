import { equipamiento } from "@/data/equipamiento";
import type { Locale } from "@/i18n/config";

export function AmenitiesList({ claves, locale }: { claves: string[]; locale: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {claves.map((clave) => {
        const item = equipamiento[clave];
        if (!item) return null;
        const Icon = item.icon;
        return (
          <li key={clave} className="flex items-center gap-2">
            <Icon size={20} aria-hidden className="shrink-0 text-oliva" />
            <span className="text-sm text-carbon">{item.label[locale]}</span>
          </li>
        );
      })}
    </ul>
  );
}
