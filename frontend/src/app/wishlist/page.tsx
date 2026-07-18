"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function WishlistPage() {
  return (
    <DashboardLayout crumb="Wishlist">
      <h1 className="text-2xl font-bold text-primary-900">Wishlist</h1>
      <p className="text-neutral-600">Save items you want to rent later.</p>

      <div className="rounded-lg bg-white p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold text-primary-900">Saved Items</h2>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>📷 Sony A7 IV Mirrorless Camera</li>
          <li>🎤 Shure SM7B Microphone</li>
          <li>🔦 Goal Zero Portable Solar Kit</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
