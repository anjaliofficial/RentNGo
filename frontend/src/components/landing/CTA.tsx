import Link from "next/link";
import Container from "../layout/Container";

export default function CTA() {
  return (
    <section className="bg-primary-900">
      <Container className="py-20 text-center">
        <h2 className="font-headline text-3xl font-bold text-white md:text-4xl">
          Ready to join the secure circular economy?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-300">
          Start listing your equipment or discover professional gear in your
          neighborhood, with zero risk and maximum trust.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-secondary">
            Get Started Now
          </Link>
          <Link
            href="/how-it-works"
            className="btn-outline !border-white/20 !bg-transparent !text-white hover:!border-white"
          >
            Download Protocol Whitepaper
          </Link>
        </div>
      </Container>
    </section>
  );
}
