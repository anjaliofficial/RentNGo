import {
  Camera,
  Drill,
  Tent,
  Guitar,
  Laptop,
  Bike,
} from "lucide-react";

const categories = [
  { name: "Camera", icon: Camera },
  { name: "Power Tools", icon: Drill },
  { name: "Camping", icon: Tent },
  { name: "Music", icon: Guitar },
  { name: "Electronics", icon: Laptop },
  { name: "Sports", icon: Bike },
];

export default function Categories() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Browse Categories
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className="cursor-pointer rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon
                  size={40}
                  className="mx-auto mb-4 text-blue-600"
                />

                <h3 className="font-semibold">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}