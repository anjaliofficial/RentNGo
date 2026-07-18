"use client";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardFooter from "../../components/dashboard/DashboardFooter";

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar crumb="Wishlist" />
        <main className="flex-1 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-primary-900">Wishlist</h1>
          <p className="text-neutral-600">Save items you want to rent later.</p>
          {/* TODO: Replace with dynamic wishlist items */}
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-neutral-500">Your wishlist is empty.</p>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
