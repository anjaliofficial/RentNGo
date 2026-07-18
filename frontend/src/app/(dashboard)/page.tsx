"use client";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardFooter from "../../components/dashboard/DashboardFooter";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-primary-900">Welcome to your Dashboard</h1>
          <p className="mt-2 text-neutral-600">
            Here you’ll see your trust score, rentals, and community updates.
          </p>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
