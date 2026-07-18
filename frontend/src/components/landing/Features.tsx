import { ShieldCheck, Clock3, Wallet, Star } from "lucide-react";
import Container from "../layout/Container";

const FEATURES = [
  { icon: ShieldCheck, title: "Trusted Owners", description: "Verified owners with live trust scores and secure, escrow-backed rentals." },
  { icon: Clock3, title: "Quick Booking", description: "Book equipment in minutes with instant, server-verified confirmation." },
  { icon: Wallet, title: "Affordable Prices", description: "Rent instead of buying expensive gear, deposits shrink as trust grows." },
  { icon: Star, title: "Highly Rated", description: "Quality equipment backed by real reviews from completed rentals only." },
];

export default function Features() {
  return (
    <section className="bg-neutral-50/60 py-20">
      <Container>
        <h2 className="text-center font-headline text-3xl font-bold text-primary-900">
          Why Choose RentNGo?
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900">
                <feature.icon className="h-5 w-5 text-tertiary-400" />
              </span>
              <h3 className="mt-4 font-headline text-base font-semibold text-primary-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
