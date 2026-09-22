import { Container } from "./container";
import { cn } from "@/lib/cn";

type Tone = "cal" | "arena" | "arena-light";

const tones: Record<Tone, string> = {
  cal: "bg-cal",
  arena: "bg-arena",
  "arena-light": "bg-arena-light",
};

export function Section({
  tone = "cal",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(tones[tone], "py-16 md:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}
