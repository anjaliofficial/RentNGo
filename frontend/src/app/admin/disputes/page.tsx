"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Badge, Modal } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import disputeService from "@/services/dispute.service";
import { resolveMediaUrl } from "@/utils/format";
import { Dispute, DisputeOutcome } from "@/types/dispute.types";

const REASON_LABEL: Record<string, string> = {
  damaged_equipment: "Damaged equipment",
  missing_equipment: "Missing equipment",
  other: "Other",
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolveTarget, setResolveTarget] = useState<Dispute | null>(null);
  const [outcome, setOutcome] = useState<DisputeOutcome>("approved");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await disputeService.open();
      setDisputes(data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not load disputes");
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openResolve = (dispute: Dispute) => {
    setResolveTarget(dispute);
    setOutcome("approved");
    setNote("");
  };

  const resolve = async () => {
    if (!resolveTarget) return;
    try {
      setSubmitting(true);
      await disputeService.resolve(resolveTarget._id, { outcome, note });
      toast.success("Dispute resolved");
      setResolveTarget(null);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not resolve dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout crumb="Disputes">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Disputes</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review open disputes and decide the outcome.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card h-32 animate-pulse" />
          ))}
        </div>
      ) : disputes.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500">
          No open disputes right now.
        </Card>
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <Card key={dispute._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-headline text-sm font-semibold text-primary-900">
                    {dispute.booking?.equipment?.title ?? "Equipment"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Filed by {dispute.filedBy?.fullName} against {dispute.against?.fullName} ·{" "}
                    {format(new Date(dispute.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge tone="danger">{REASON_LABEL[dispute.reason] ?? dispute.reason}</Badge>
              </div>

              <p className="text-sm text-neutral-700">{dispute.description}</p>

              {dispute.evidence.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dispute.evidence.map((url) => (
                    <a key={url} href={resolveMediaUrl(url)} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(url)}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              <div>
                <Button size="sm" onClick={() => openResolve(dispute)}>
                  Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!resolveTarget}
        onClose={() => setResolveTarget(null)}
        title="Resolve Dispute"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={outcome === "approved" ? "primary" : "outline"}
              size="sm"
              onClick={() => setOutcome("approved")}
            >
              Approve claim
            </Button>
            <Button
              variant={outcome === "rejected" ? "primary" : "outline"}
              size="sm"
              onClick={() => setOutcome("rejected")}
            >
              Deny claim
            </Button>
          </div>

          <textarea
            rows={3}
            placeholder="Resolution note (shared with both parties)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
          />

          <Button
            className="w-full"
            onClick={resolve}
            disabled={submitting || note.trim().length === 0}
          >
            {submitting ? "Submitting..." : "Submit Resolution"}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
