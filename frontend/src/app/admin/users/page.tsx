"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar, Badge, Modal } from "@/components/ui";
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
  trustScore: number;
  isSuspended: boolean;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/admin/verifications");
    }
  }, [user, router]);

  const load = async (query?: string) => {
    try {
      const { data } = await adminService.listUsers(query);
      setUsers(data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not load users");
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load(search);
  };

  const suspend = async () => {
    if (!suspendTarget) return;
    try {
      setBusyId(suspendTarget._id);
      await adminService.suspendUser(suspendTarget._id);
      toast.success("User suspended");
      setSuspendTarget(null);
      await load(search);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not suspend user");
    } finally {
      setBusyId(null);
    }
  };

  const reinstate = async (target: AdminUser) => {
    try {
      setBusyId(target._id);
      await adminService.reinstateUser(target._id);
      toast.success("User reinstated");
      await load(search);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not reinstate user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout crumb="Users">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Users</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View customers and owners, and suspend or reinstate accounts.
        </p>
      </div>

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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500">No users found.</Card>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u._id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={u.fullName} src={resolveMediaUrl(u.avatar)} size={40} />
              <div className="flex-1">
                <p className="font-headline text-sm font-semibold text-primary-900">
                  {u.fullName}
                </p>
                <p className="text-xs text-neutral-500">{u.email}</p>
              </div>
              <Badge tone="neutral">{u.role === "owner" ? "Owner" : "Customer"}</Badge>
              <Badge tone={u.isSuspended ? "danger" : "success"}>
                {u.isSuspended ? "Suspended" : "Active"}
              </Badge>
              {u.isSuspended ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === u._id}
                  onClick={() => reinstate(u)}
                >
                  Reinstate
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  disabled={busyId === u._id}
                  onClick={() => setSuspendTarget(u)}
                >
                  Suspend
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title="Suspend this user?"
      >
        <p className="text-sm text-neutral-600">
          &ldquo;{suspendTarget?.fullName}&rdquo; will not be able to log in until you reinstate
          them.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setSuspendTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={suspend} disabled={busyId === suspendTarget?._id}>
            Suspend User
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
