import Link from "next/link";
import { Shield, Search, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sustainability", label: "Sustainability" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900">
            <Shield className="h-4.5 w-4.5 text-tertiary-400" strokeWidth={2.5} />
          </span>
          <span className="font-headline text-lg font-bold text-primary-900">
            RentNGo
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-700 transition-colors hover:text-secondary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search equipment"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-primary-700 hover:border-primary-900 md:flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link href="/login" className="btn-outline hidden md:inline-flex">
            <User className="h-4 w-4" />
            Sign In
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
