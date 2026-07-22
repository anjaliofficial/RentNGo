"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar, Badge, Modal } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import verificationService from "@/services/verification.service";
import { resolveMediaUrl } from "@/utils/format";

interface PendingUser {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  governmentIdUrl?: string;
  updatedAt: string;
}

export default function AdminVerificationsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingUser | null>(null);
  const [note, setNote] = useState("");

  const load = async () => {
    try {
      const { data } = await verificationService.pending();
      setUsers(data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not load pending verifications");
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const approve = async (user: PendingUser) => {
    try {
      setBusyId(user._id);
      await verificationService.approve(user._id);
      toast.success("Verification approved");
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not approve verification");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    try {
      setBusyId(rejectTarget._id);
      await verificationService.reject(rejectTarget._id, note);
      toast.success("Verification rejected");
      setRejectTarget(null);
      setNote("");
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not reject verification");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout crumb="Verifications">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Verifications</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review submitted government IDs and approve or reject them.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500">
          No pending verifications right now.
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user._id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={user.fullName} src={resolveMediaUrl(user.avatar)} size={44} />
              <div className="flex-1">
                <p className="font-headline text-sm font-semibold text-primary-900">
                  {user.fullName}
                </p>
                <p className="text-xs text-neutral-500">{user.email}</p>
                <Badge tone="warning">Pending review</Badge>
              </div>
              {user.governmentIdUrl && (
                <a
                  href={resolveMediaUrl(user.governmentIdUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-secondary-600 hover:text-secondary-700"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View document
                </a>
              )}
              <div className="flex shrink-0 gap-2">
                <Button size="sm" disabled={busyId === user._id} onClick={() => approve(user)}>
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === user._id}
                  onClick={() => setRejectTarget(user)}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject this verification?"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">
            Let {rejectTarget?.fullName} know why their submission was rejected.
          </p>
          <textarea
            rows={3}
            placeholder="Reason for rejection..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
          />
          <Button
            variant="danger"
            className="w-full"
            onClick={reject}
            disabled={busyId === rejectTarget?._id}
          >
            Reject Verification
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
