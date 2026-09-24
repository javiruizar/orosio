import { CookingPot, MapPin, MessageCircle, PiggyBank } from "lucide-react";

const icons = [MapPin, CookingPot, PiggyBank, MessageCircle];

export function ValueProps({
  title,
  values,
}: {
  title: string;
  values: { title: string; text: string }[];
}) {
  return (
    <div>
      <h2 className="text-center">{title}</h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {values.map((value, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={value.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-oliva/10 text-oliva">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-4">{value.title}</h3>
              <p className="mt-2 text-granito">{value.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
