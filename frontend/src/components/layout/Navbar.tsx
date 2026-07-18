"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Search, Bell, ShieldCheck, User } from "lucide-react";

import { Avatar } from "../ui";
import { useAuth } from "../auth/AuthProvider";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sustainability", label: "Sustainability" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query ? `/browse?search=${encodeURIComponent(query)}` : "/browse");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900">
            <Shield className="h-4.5 w-4.5 text-tertiary-400" strokeWidth={2.5} />
          </span>
          <span className="font-headline text-lg font-bold text-primary-900">
            RentNGo
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-secondary-600 ${
                pathname === link.href ? "font-semibold text-secondary-600" : "text-primary-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden flex-1 md:block">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search secure equipment..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary-500 focus:bg-white"
            />
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            aria-label="Notifications"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50 md:flex"
          >
            <Bell className="h-4 w-4" />
          </button>
          <span
            title="Protocol-verified network"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-tertiary-600 hover:bg-neutral-50 md:flex"
          >
            <ShieldCheck className="h-4 w-4" />
          </span>
          <Link
            href="/dashboard/list-equipment"
            className="hidden rounded-lg bg-primary-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-700 md:inline-flex md:items-center"
          >
            List Equipment
          </Link>

          {user ? (
            <Link href="/dashboard">
              <Avatar name={user.fullName} size={36} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-outline hidden md:inline-flex">
                <User className="h-4 w-4" />
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
