import { Quote } from "lucide-react";
import Container from "../layout/Container";
import { Avatar } from "../ui";

const TESTIMONIALS = [
  { name: "Aarav Sharma", review: "RentNGo helped me rent a DSLR camera for my trip. The trust score made it easy to pick a reliable owner." },
  { name: "Priya Rai", review: "Listing my power tools was simple, and my deposit requirement dropped after a few clean returns." },
  { name: "Suman Karki", review: "The booking flow felt genuinely secure - identity verification and escrow made me comfortable renting gear I'd never used before." },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <Container>
        <h2 className="text-center font-headline text-3xl font-bold text-primary-900">
          What Our Community Says
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="card">
              <Quote className="h-6 w-6 text-secondary-400" />
              <p className="mt-4 text-sm italic leading-relaxed text-neutral-600">
                &ldquo;{item.review}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar name={item.name} />
                <span className="text-sm font-semibold text-primary-900">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
