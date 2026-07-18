"use client";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function HelpPage() {
  return (
    <DashboardLayout crumb="Help">
      <h1 className="text-2xl font-bold text-primary-900">Help Center</h1>
      <p className="text-neutral-600">Find answers to common questions or contact support.</p>

      <div className="rounded-lg bg-white p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold text-primary-900">Frequently Asked Questions</h2>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>❓ How do I verify my ID?</li>
          <li>❓ How do I list equipment for rent?</li>
          <li>❓ What happens if a rental is disputed?</li>
        </ul>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-primary-900">Contact Support</h2>
        <p className="text-sm text-neutral-600">Email us at support@rentngo.com or call +1-800-555-1234.</p>
      </div>
    </DashboardLayout>
  );
}
