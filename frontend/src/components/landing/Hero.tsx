import Link from "next/link";
import Container from "../layout/Container";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Rent Equipment.
            <br />
            Save Money.
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Rent cameras, drones, power tools, camping gear, musical
            instruments, and more from trusted owners near you.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/equipment"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Browse Equipment
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-blue-700"
            >
              Become an Owner
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-blue-100">Equipment</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">250+</h3>
              <p className="text-blue-100">Users</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">1K+</h3>
              <p className="text-blue-100">Bookings</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">4.9★</h3>
              <p className="text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}