import Link from "next/link";
import { Search } from "lucide-react";
import Container from "../layout/Container";

const STATS = [
  { value: "4.9/5.0", label: "Community Trust" },
  { value: "12k+", label: "Secure Exchanges" },
  { value: "340", label: "Tons CO2 Saved" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-900 py-24 text-white">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-tertiary-500/20 blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-label text-xs font-semibold uppercase tracking-wide text-tertiary-300">
            Protocol-Verified Network
          </span>

          <h1 className="mt-6 font-headline text-5xl font-bold leading-[1.08] md:text-6xl">
            Secure Community
            <br />
            Equipment Sharing
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-primary-200">
            A peer-to-peer ecosystem built on engineered trust. Borrow
            professional-grade equipment from verified owners with full
            insurance and real-time security tracking.
          </p>

          <form className="mt-8 flex max-w-lg items-center gap-2 rounded-xl bg-white p-1.5 shadow-xl">
            <Search className="ml-2 h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              placeholder="What do you need today?"
              className="w-full border-none bg-transparent py-2 text-sm text-primary-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <button type="submit" className="btn-secondary shrink-0">
              Search
            </button>
          </form>

          <div className="mt-10 flex flex-wrap gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-headline text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-primary-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
