"use client";

import { Bell, Heart, Menu, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="flex h-20 items-center justify-between px-8">

        {/* Left */}

        <div className="flex items-center gap-5">

          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
            <Menu size={24} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Welcome back,
              <span className="ml-1 font-semibold text-blue-600">
                {user?.fullName ?? "User"}
              </span>
            </p>
          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="relative hidden md:block">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search equipment..."
              className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
            />

          </div>

          {/* Wishlist */}

          <button className="relative rounded-xl bg-slate-100 p-3 transition hover:bg-pink-100">

            <Heart
              size={20}
              className="text-pink-500"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
              0
            </span>

          </button>

          {/* Notification */}

          <button className="relative rounded-xl bg-slate-100 p-3 transition hover:bg-blue-100">

            <Bell
              size={20}
              className="text-blue-600"
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              0
            </span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white">
              {user?.fullName?.charAt(0) ?? "U"}
            </div>

            <div className="hidden md:block">

              <p className="font-semibold text-slate-800">
                {user?.fullName ?? "User"}
              </p>

              <p className="text-sm text-slate-500">
                {user?.role ?? "Member"}
              </p>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}