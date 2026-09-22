"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileNav({
  links,
  openLabel,
  closeLabel,
  ctaHref,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-carbon"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-arena bg-cal px-5 pb-6 pt-2 shadow-lg">
          <nav className="flex flex-col" aria-label="Principal móvil">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-arena py-3 text-carbon"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={close}
              className="mt-4 rounded-lg bg-terracota-600 px-5 py-3 text-center font-medium text-white"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

