import Link from "next/link";

export function Breadcrumbs({
  items,
  label,
}: {
  items: { label: string; href?: string }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="text-sm text-granito">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-granito">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-terracota-700">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
