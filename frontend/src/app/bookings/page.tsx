"use client";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function BookingsPage() {
  return (
    <DashboardLayout crumb="My Rentals">
      <h1 className="text-2xl font-bold text-primary-900">My Rentals</h1>
      <p className="text-neutral-600">Track your active and past bookings.</p>

      <div className="rounded-lg bg-white p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold text-primary-900">Active Rentals</h2>
        <div>
          <p className="font-semibold">DJI Phantom 4 Pro</p>
          <p>Status: In Possession — Return by Tuesday</p>
        </div>
        <div>
          <p className="font-semibold">Canon EOS R5</p>
          <p>Status: Pickup Scheduled — Tomorrow 9:00 AM</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-primary-900">Past Rentals</h2>
        <p className="text-sm text-neutral-500">You have completed 12 rentals successfully.</p>
      </div>
    </DashboardLayout>
  );
}
