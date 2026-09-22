import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const sectionLinks = [
    { href: routes.apartments(locale), label: dict.nav.apartments },
    { href: routes.zone(locale), label: dict.nav.zone },
    { href: routes.book(locale), label: dict.nav.book },
    { href: routes.faq(locale), label: dict.nav.faq },
  ];

  const legalLinks = [
    { href: routes.legalNotice(locale), label: dict.footer.legalNotice },
    { href: routes.privacy(locale), label: dict.footer.privacy },
    { href: routes.cookies(locale), label: dict.footer.cookies },
  ];

  return (
    <footer className="border-t border-arena bg-arena-light">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold text-carbon">
            Apartamentos <span className="text-terracota-700">Orosio</span>
          </p>
          {/* Sobre arena-light solo se admite texto carbon o terracota-700 */}
          <p className="mt-3 max-w-sm text-sm text-carbon">{dict.footer.tagline}</p>
          <p className="mt-4 text-sm text-carbon">{dict.common.city}</p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-carbon">
            {dict.footer.sections}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-carbon hover:text-terracota-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-carbon">
            {dict.footer.legal}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-carbon hover:text-terracota-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-arena">
        <Container className="flex flex-col gap-2 py-5 text-xs text-carbon md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {dict.common.brand}. {dict.footer.rights}
          </p>
          {/* Aviso obligatorio en Andalucía. Los códigos VFT reales
              se añaden por apartamento en la fase 2. */}
          <p>{dict.footer.licenceNote}</p>
        </Container>
      </div>
    </footer>
  );
}
