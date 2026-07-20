"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardFooter from "./DashboardFooter";
import { useAuth } from "../auth/AuthProvider";

export default function DashboardLayout({
  children,
  crumb = "Dashboard",
}: {
  children: React.ReactNode;
  crumb?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar crumb={crumb} />
          <main className="flex-1 p-8 space-y-8">{children}</main>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}
