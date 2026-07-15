"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CalendarDays,
  Heart,
  Bell,
  Star,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Equipment",
    href: "/equipment/my",
    icon: Package,
  },
  {
    name: "Add Equipment",
    href: "/equipment/create",
    icon: PlusCircle,
  },
  {
    name: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Reviews",
    href: "/reviews",
    icon: Star,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden w-72 flex-col border-r bg-white lg:flex">

      {/* Logo */}

      <div className="border-b p-6">
        <Link
          href="/dashboard"
          className="text-3xl font-extrabold text-blue-600"
        >
          RentNGo
        </Link>

        <p className="mt-2 text-sm text-gray-500">
          Secure Equipment Rental
        </p>
      </div>

      {/* User */}

      <div className="border-b p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
            {user?.fullName?.charAt(0) ?? "U"}
          </div>

          <div>

            <h3 className="font-semibold">
              {user?.fullName ?? "Guest"}
            </h3>

            <p className="text-sm text-gray-500">
              {user?.email ?? ""}
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200

              ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }
            `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}

      <div className="border-t p-5">

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
}