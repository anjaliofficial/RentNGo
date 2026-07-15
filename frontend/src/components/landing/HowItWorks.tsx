const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Find the equipment you need from trusted owners.",
  },
  {
    number: "02",
    title: "Book",
    description:
      "Choose your rental dates and send a booking request.",
  },
  {
    number: "03",
    title: "Use",
    description:
      "Pick up the equipment and enjoy your rental.",
  },
  {
    number: "04",
    title: "Return",
    description:
      "Return the equipment safely and leave a review.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-4xl font-bold">
          How It Works
        </h2>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border p-8 text-center"
            >
              <div className="mb-5 text-5xl font-bold text-blue-600">
                {step.number}
              </div>

              <h3 className="mb-3 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}