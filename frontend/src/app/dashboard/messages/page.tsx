"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar } from "@/components/ui";
import chatService from "@/services/chat.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { resolveMediaUrl } from "@/utils/format";
import { Conversation } from "@/types/chat.types";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService
      .myConversations()
      .then(({ data }) => setConversations(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout crumb="Messages">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Messages</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Conversations with listers and renters across the marketplace.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500">
          <MessageCircle className="mx-auto h-8 w-8 text-neutral-300" />
          <p className="mt-3">
            No conversations yet — contact a lister from an equipment listing to start one.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const other =
              conversation.participants.find((p) => p._id !== user?.id) ??
              conversation.participants[0];

            return (
              <Link key={conversation._id} href={`/dashboard/messages/${conversation._id}`}>
                <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
                  <Avatar
                    name={other?.fullName ?? "User"}
                    src={resolveMediaUrl(other?.avatar)}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-primary-900">
                        {other?.fullName ?? "Unknown user"}
                      </p>
                      {conversation.lastMessageAt && (
                        <span className="shrink-0 text-xs text-neutral-400">
                          {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.equipment && (
                      <p className="truncate text-xs font-medium text-secondary-600">
                        {conversation.equipment.title}
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-sm text-neutral-500">
                      {conversation.lastMessage || "Say hello 👋"}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
