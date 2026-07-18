import { ShieldCheck, Lock, TrendingUp } from "lucide-react";
import Container from "../layout/Container";

const PILLARS = [
  {
    icon: ShieldCheck,
    step: "01",
    title: "Biometric ID Verification",
    description:
      "Every member undergoes a multi-point identity audit before joining the community to ensure accountability.",
    points: ["Govt ID Validation", "Live Liveness Check"],
  },
  {
    icon: Lock,
    step: "02",
    title: "Escrow Protection",
    description:
      "Payments are held in a secure vault and only released once the borrower confirms successful equipment inspection.",
    points: ["Instant Fraud Detection", "256-bit Encryption"],
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Dynamic Trust Score",
    description:
      "An AI-driven metric based on historical reliability, care for gear, and community responsiveness.",
    points: ["Peer Reviews", "Loyalty Rewards"],
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-neutral-100 bg-neutral-50/60 py-20">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary-900">
              How it Works: Engineered Trust
            </h2>
            <p className="mt-3 max-w-xl text-neutral-600">
              Our three-pillar security architecture ensures your equipment
              and your capital are protected at every step of the circular
              economy.
            </p>
          </div>
          <span className="hidden items-center gap-1.5 text-xs font-medium text-tertiary-600 md:flex">
            <span className="h-2 w-2 rounded-full bg-tertiary-500" /> System Status: Secure
          </span>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.step} className="card">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900">
                  <pillar.icon className="h-5 w-5 text-tertiary-400" />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-900 font-label text-xs font-bold text-white">
                  {pillar.step}
                </span>
              </div>
              <h3 className="mt-5 font-headline text-base font-semibold text-primary-900">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {pillar.description}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-xs text-tertiary-700">
                    <span className="h-1 w-1 rounded-full bg-tertiary-500" /> {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
