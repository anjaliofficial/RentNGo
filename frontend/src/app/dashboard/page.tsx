"use client";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import TrustScoreRing from "../../components/dashboard/TrustScoreRing";
import { useAuth } from "../../components/auth/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout crumb="Dashboard">
      {/* Trust Score + Impact */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Trust Score Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-primary-900 mb-4">My Trust Score</h2>
          <div className="flex items-center gap-6">
            <TrustScoreRing score={user?.trustScore ?? 50} size={120} />
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>✅ Identity Verified (Government ID & Biometrics)</li>
              <li>✅ Zero Disputes (26 successful transactions)</li>
              <li>⭐ Avg. Rating: 5.0 (10 lender reviews)</li>
              <li>🔒 Secure Payouts (NFA Fully Enlisted)</li>
            </ul>
          </div>
        </div>

        {/* Circular Impact Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-primary-900 mb-4">Circular Impact</h2>
          <p className="text-sm text-neutral-600">142 kg carbon emissions avoided</p>
          <p className="text-sm text-neutral-600">$2,140 total net savings</p>
          <button className="mt-4 rounded bg-secondary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-600">
            Download Impact Report
          </button>
        </div>
      </div>

      {/* Active Rentals */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-primary-900 mb-4">Active Rentals</h2>
        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <p className="font-semibold">DJI Matrice 300 RTK (ID: RNT-982-04-A)</p>
            <p>Status: Pickup Scheduled</p>
            <p>Preparation Confirmed — Awaiting Pickup (Tomorrow, 10:00 AM)</p>
          </div>
          <div>
            <p className="font-semibold">EcoFlow Delta Pro (ID: RNT-65-22-B)</p>
            <p>Status: In Possession</p>
            <p>Over 3 of 5 days — Return by Monday</p>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-primary-900 mb-4">My Listings</h2>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>📷 Red Komodo 6K Package (4 Active Rentals, 1.2K Views)</li>
          <li>🔨 Hilti TE 70-ATC Rotary Hammer (1 Active Rental, 400 Views)</li>
          <li>📐 Leica TS16 Total Station (0 Active Rentals, 610 Views)</li>
        </ul>
        <p className="mt-2 text-xs text-neutral-500">Your listings have a 94% booking rate</p>
        <button className="mt-4 rounded bg-secondary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-600">
          Optimize Performance
        </button>
      </div>

      {/* Security Logs */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-primary-900 mb-4">Recent Security Logs</h2>
        <table className="w-full text-sm text-neutral-700">
          <thead>
            <tr className="border-b text-neutral-500">
              <th className="py-2 text-left">Timestamp</th>
              <th className="py-2 text-left">Action</th>
              <th className="py-2 text-left">Location</th>
              <th className="py-2 text-left">Device</th>
              <th className="py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">2024-05-24 14:42:01</td>
              <td>MFA Login Verified</td>
              <td>San Francisco, CA</td>
              <td>MacBook Pro (Chrome)</td>
              <td>SECURE</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">2024-05-23 21:00:45</td>
              <td>Contract Signed (ID: 982-A)</td>
              <td>San Francisco, CA</td>
              <td>iPhone 15 Pro</td>
              <td>ENCRYPTED</td>
            </tr>
            <tr>
              <td className="py-2">2024-05-20 23:45:32</td>
              <td>New Payout Method Added</td>
              <td>San Francisco, CA</td>
              <td>MacBook Pro (Chrome)</td>
              <td>VERIFIED</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
