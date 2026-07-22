"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

const ALLOWED_ROLES = ["moderator", "admin"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!ALLOWED_ROLES.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
