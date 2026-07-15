import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold">
          Ready to Rent Equipment?
        </h2>

        <p className="mt-4 text-lg text-blue-100">
          Join RentNGo today and start renting or earning from your equipment.
        </p>

        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}