import { cn } from "@/lib/cn";

type Tone = "cal" | "arena";

/** Color del subtítulo según el fondo de la sección (regla de contraste de plan.md §2:
 *  `granito` solo sobre `cal`/blanco; sobre `arena` o `arena-light` solo `carbon` o `terracota-700`). */
const subtitleTone: Record<Tone, string> = {
  cal: "text-granito",
  arena: "text-carbon",
};

export function Heading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "cal",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: Tone;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-oliva">{eyebrow}</p>
      )}
      <h2 className={cn(eyebrow && "mt-2")}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-lg",
            subtitleTone[tone],
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
