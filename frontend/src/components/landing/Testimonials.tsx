const testimonials = [
  {
    name: "Aarav Sharma",
    review:
      "RentNGo helped me rent a DSLR camera for my trip. Easy and affordable!",
  },
  {
    name: "Priya Rai",
    review:
      "Listing my power tools was simple, and I earned extra income.",
  },
  {
    name: "Suman Karki",
    review:
      "The booking process was smooth and the equipment was exactly as described.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">
          What Our Users Say
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-xl bg-white p-8 shadow"
            >
              <p className="italic text-gray-600">
                "{item.review}"
              </p>

              <h4 className="mt-6 text-lg font-bold">
                {item.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}