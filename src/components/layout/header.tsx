import Link from "next/link";

import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: routes.apartments(locale), label: dict.nav.apartments },
    { href: routes.zone(locale), label: dict.nav.zone },
    { href: routes.faq(locale), label: dict.nav.faq },
    { href: routes.contact(locale), label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-arena bg-cal/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href={routes.home(locale)}
          className="font-display text-lg font-semibold tracking-tight text-carbon md:text-xl"
        >
          Apartamentos <span className="text-terracota-600">Orosio</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-carbon transition-colors hover:text-terracota-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher locale={locale} label={dict.localeSwitcher.label} />
          <Button href={routes.book(locale)} size="sm" className="hidden sm:inline-flex">
            {dict.header.cta}
          </Button>
          <MobileNav
            links={links}
            openLabel={dict.header.openMenu}
            closeLabel={dict.header.closeMenu}
            ctaHref={routes.book(locale)}
            ctaLabel={dict.header.cta}
          />
        </div>
      </Container>
    </header>
  );
}
