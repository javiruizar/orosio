import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta({
  title,
  text,
  buttonLabel,
  href,
}: {
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="bg-terracota-700 py-16 text-white md:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-white">{title}</h2>
        <p className="max-w-xl text-white/90">{text}</p>
        <Button href={href} className="bg-white text-terracota-700 hover:bg-white/90">
          {buttonLabel}
        </Button>
      </Container>
    </div>
  );
}
