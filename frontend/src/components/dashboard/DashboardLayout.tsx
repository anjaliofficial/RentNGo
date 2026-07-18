"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardFooter from "./DashboardFooter";

export default function DashboardLayout({
  children,
  crumb = "Dashboard",
}: {
  children: React.ReactNode;
  crumb?: string;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar crumb={crumb} />
        <main className="flex-1 p-8 space-y-8">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
