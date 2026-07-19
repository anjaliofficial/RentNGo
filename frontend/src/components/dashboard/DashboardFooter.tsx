import Link from "next/link";
import { Shield } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/browse", label: "Browse Equipment" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/register?role=owner", label: "List Your Gear" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { href: "/security", label: "Security Protocol" },
      { href: "/insurance", label: "Insurance Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/sustainability", label: "Sustainability Report" },
      { href: "/community", label: "Community Impact" },
      { href: "/support", label: "Help Support" },
    ],
  },
];

export default function DashboardFooter() {
  return (
    <footer className="border-t border-neutral-100 bg-primary-900 text-primary-200">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-4.5 w-4.5 text-tertiary-400" strokeWidth={2.5} />
              </span>
              <span className="font-headline text-lg font-bold text-white">RentNGo</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-primary-300">
              A secure, trust-based community for sharing professional equipment
              instead of buying it new.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-label text-xs font-semibold uppercase tracking-wider text-primary-400">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-300 transition-colors hover:text-secondary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-primary-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RentNGo. Secure Circular Economy.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-secondary-400">
              Data Privacy
            </Link>
            <Link href="/trust-safety" className="hover:text-secondary-400">
              Trust & Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
