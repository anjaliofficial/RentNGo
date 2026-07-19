"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  CalendarDays,
  Compass,
  Heart,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageCircle,
  PlusSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/explore", label: "Explore", icon: Compass },
  { href: "/bookings", label: "My rentals", icon: CalendarDays },
  { href: "/dashboard/list-equipment", label: "List Equipment", icon: PlusSquare },
  { href: "/dashboard/my-listings", label: "My Listings", icon: ListChecks },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

const DASHBOARD_FOOTER_NAV = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-100 bg-white md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900">
          <ShieldCheck className="h-4.5 w-4.5 text-tertiary-400" strokeWidth={2.5} />
        </span>
        <span className="font-headline text-lg font-bold text-primary-900">RentNGo</span>
      </div>

      {user && (
        <div className="mx-4 mb-4 rounded-lg bg-tertiary-50 px-3 py-2.5">
          <p className="text-xs font-semibold text-primary-900">{user.fullName}</p>
          <p className="text-xs text-tertiary-700">Score: {user.trustScore}/100</p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {DASHBOARD_NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-900 text-white"
                  : "text-primary-700 hover:bg-neutral-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-neutral-100 px-3 py-4">
        {DASHBOARD_FOOTER_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
