import { ShieldCheck, Clock3, Wallet, Star } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Owners",
    description: "Verified owners with ratings and secure rentals.",
  },
  {
    icon: Clock3,
    title: "Quick Booking",
    description: "Book equipment in minutes with instant confirmation.",
  },
  {
    icon: Wallet,
    title: "Affordable Prices",
    description: "Rent instead of buying expensive equipment.",
  },
  {
    icon: Star,
    title: "Highly Rated",
    description: "Quality equipment reviewed by real users.",
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Why Choose RentNGo?
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-8 text-center shadow transition hover:shadow-lg"
              >
                <Icon
                  size={45}
                  className="mx-auto mb-4 text-blue-600"
                />

                <h3 className="mb-2 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}