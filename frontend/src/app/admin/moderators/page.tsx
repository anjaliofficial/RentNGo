"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/auth/AuthProvider";
import adminService from "@/services/admin.service";
import { resolveMediaUrl } from "@/utils/format";

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function AdminModeratorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [moderators, setModerators] = useState<AdminUser[]>([]);
  const [loadingModerators, setLoadingModerators] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<AdminUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/admin/verifications");
    }
  }, [user, router]);

  const loadModerators = async () => {
    try {
      const { data } = await adminService.listModerators();
      setModerators(data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not load moderators");
    }
  };

  useEffect(() => {
    loadModerators().finally(() => setLoadingModerators(false));
  }, []);

  const onSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await adminService.listUsers(search);
      setResults(data.data);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not search users");
    }
  };

  const promote = async (target: AdminUser) => {
    try {
      setBusyId(target._id);
      await adminService.promoteModerator(target._id);
      toast.success(`${target.fullName} promoted to moderator`);
      setResults((prev) => prev.filter((u) => u._id !== target._id));
      await loadModerators();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not promote user");
    } finally {
      setBusyId(null);
    }
  };

  const demote = async (target: AdminUser) => {
    try {
      setBusyId(target._id);
      await adminService.demoteModerator(target._id);
      toast.success(`${target.fullName} demoted to customer`);
      await loadModerators();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not demote moderator");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout crumb="Moderators">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Moderators</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Promote users to moderator, or demote a moderator back to a regular account.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-headline text-sm font-semibold text-primary-900">
          Current Moderators
        </h2>
        {loadingModerators ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="card h-20 animate-pulse" />
            ))}
          </div>
        ) : moderators.length === 0 ? (
          <Card className="py-8 text-center text-sm text-neutral-500">No moderators yet.</Card>
        ) : (
          <div className="space-y-3">
            {moderators.map((m) => (
              <Card key={m._id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar name={m.fullName} src={resolveMediaUrl(m.avatar)} size={40} />
                <div className="flex-1">
                  <p className="font-headline text-sm font-semibold text-primary-900">
                    {m.fullName}
                  </p>
                  <p className="text-xs text-neutral-500">{m.email}</p>
                </div>
                <Badge tone="trust">Moderator</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === m._id}
                  onClick={() => demote(m)}
                >
                  Demote
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-headline text-sm font-semibold text-primary-900">
          Promote a User
        </h2>
        <form onSubmit={onSearchSubmit} className="flex max-w-sm items-end gap-2">
          <Input
            label="Search"
            placeholder="Name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline" size="sm">
            <Search className="h-3.5 w-3.5" />
          </Button>
        </form>

        {searched && (
          <div className="mt-4 space-y-3">
            {results.length === 0 ? (
              <Card className="py-8 text-center text-sm text-neutral-500">No users found.</Card>
            ) : (
              results.map((u) => (
                <Card key={u._id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar name={u.fullName} src={resolveMediaUrl(u.avatar)} size={40} />
                  <div className="flex-1">
                    <p className="font-headline text-sm font-semibold text-primary-900">
                      {u.fullName}
                    </p>
                    <p className="text-xs text-neutral-500">{u.email}</p>
                  </div>
                  <Button size="sm" disabled={busyId === u._id} onClick={() => promote(u)}>
                    Promote to Moderator
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
