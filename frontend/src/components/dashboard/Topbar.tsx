"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Search } from "lucide-react";
import { Avatar } from "../ui";
import { useAuth } from "../auth/AuthProvider";
import { resolveMediaUrl } from "@/utils/format";
import NotificationBell from "./NotificationBell";

export default function Topbar({ crumb = "Dashboard" }: { crumb?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/dashboard/explore?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <div className="border-b border-neutral-100 bg-white">
      <header className="flex h-16 items-center justify-between gap-4 px-6">
        <p className="shrink-0 text-sm text-neutral-500">
          Account <span className="mx-1">/</span>
          <span className="font-medium text-primary-900">{crumb}</span>
        </p>

        <form onSubmit={onSearch} className="hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search equipment..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary-500 focus:bg-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50 md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Language"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50 md:flex"
          >
            <Globe className="h-4 w-4" />
          </button>
          <NotificationBell />
          {user && (
            <Link href="/settings" aria-label="Your profile">
              <Avatar name={user.fullName} src={resolveMediaUrl(user.avatar)} size={32} />
            </Link>
          )}
        </div>
      </header>

      {searchOpen && (
        <form onSubmit={onSearch} className="border-t border-neutral-100 px-6 py-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search equipment..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary-500 focus:bg-white"
            />
          </div>
        </form>
      )}
    </div>
  );
}
