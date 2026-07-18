"use client";

import { Bell, Globe, Search } from "lucide-react";
import { Avatar } from "../ui";
import { useAuth } from "../auth/AuthProvider";

export default function Topbar({ crumb = "Dashboard" }: { crumb?: string }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
      <p className="text-sm text-neutral-500">
        Account <span className="mx-1">/</span>
        <span className="font-medium text-primary-900">{crumb}</span>
      </p>

      <div className="flex items-center gap-4">
        <button
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          aria-label="Language"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50 md:flex"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary-500" />
        </button>
        {user && <Avatar name={user.name} size={32} />}
      </div>
    </header>
  );
}
