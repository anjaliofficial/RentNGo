"use client";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardFooter from "../../components/dashboard/DashboardFooter";

export default function BookingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar crumb="My Rentals" />
        <main className="flex-1 p-8 space-y-6">
          <h1 className="text-2xl font-bold text-primary-900">My Rentals</h1>
          <p className="text-neutral-600">Here you’ll see all your active and past bookings.</p>
          {/* TODO: Replace with dynamic rentals list */}
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-neutral-500">No rentals yet. Start booking equipment today!</p>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
