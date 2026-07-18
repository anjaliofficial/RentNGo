import { Camera, Plane, Hammer, Tent, Music, Speaker } from "lucide-react";
import Container from "../layout/Container";

const CATEGORIES = [
  { icon: Camera, title: "Photography & Video", count: "312 items" },
  { icon: Plane, title: "Drones", count: "94 items" },
  { icon: Hammer, title: "Power Tools", count: "156 items" },
  { icon: Tent, title: "Camping Equipment", count: "88 items" },
  { icon: Music, title: "Musical Instruments", count: "61 items" },
  { icon: Speaker, title: "Audio Equipment", count: "70 items" },
];

export default function Categories() {
  return (
    <section className="bg-white py-20">
      <Container>
        <span className="eyebrow">Browse</span>
        <h2 className="mt-3 font-headline text-3xl font-bold text-primary-900">
          Popular Categories
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((item) => (
            <div
              key={item.title}
              className="group cursor-pointer rounded-card border border-neutral-100 bg-neutral-50/60 p-6 text-center transition-all hover:-translate-y-1 hover:border-secondary-200 hover:bg-white hover:shadow-card"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900 transition-colors group-hover:bg-secondary-500">
                <item.icon className="h-5 w-5 text-tertiary-400 group-hover:text-white" />
              </span>
              <h3 className="mt-4 font-headline text-sm font-semibold text-primary-900">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-500">{item.count}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
