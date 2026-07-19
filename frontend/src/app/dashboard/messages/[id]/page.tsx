"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import chatService from "@/services/chat.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSocket } from "@/lib/socket";
import { Conversation, Message } from "@/types/chat.types";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationId = params.id;

  useEffect(() => {
    if (!conversationId) return;
    Promise.all([
      chatService.getConversation(conversationId),
      chatService.getMessages(conversationId),
    ])
      .then(([convoRes, messagesRes]) => {
        setConversation(convoRes.data.data);
        setMessages(messagesRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!user?.id || !conversationId) return;
    const socket = getSocket(user.id);

    const onNewMessage = (payload: { conversationId: string; message: Message }) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, payload.message]);
    };

    socket.on("message:new", onNewMessage);
    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [user?.id, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const other = conversation?.participants.find((p) => p._id !== user?.id);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;

    try {
      setSending(true);
      setText("");
      const { data } = await chatService.sendMessage(conversationId, trimmed);
      setMessages((prev) => [...prev, data.data]);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout crumb="Messages">
      <Card className="flex h-[70vh] flex-col !p-0">
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
          {loading ? (
            <div className="h-6 w-40 animate-pulse rounded bg-neutral-100" />
          ) : (
            <>
              <Avatar name={other?.fullName ?? "User"} size={40} />
              <div>
                <p className="text-sm font-semibold text-primary-900">
                  {other?.fullName ?? "Unknown user"}
                </p>
                {conversation?.equipment && (
                  <Link
                    href={`/browse/${conversation.equipment._id}`}
                    className="text-xs font-medium text-secondary-600 hover:underline"
                  >
                    About: {conversation.equipment.title}
                  </Link>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-center text-sm text-neutral-400">Loading conversation...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-neutral-400">
              No messages yet — say hello 👋
            </p>
          ) : (
            messages.map((message) => {
              const senderId =
                typeof message.sender === "string" ? message.sender : message.sender._id;
              const isMine = senderId === user?.id;

              return (
                <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      isMine
                        ? "bg-primary-900 text-white"
                        : "bg-neutral-100 text-primary-900"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        isMine ? "text-white/60" : "text-neutral-400"
                      }`}
                    >
                      {format(new Date(message.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-secondary-500"
          />
          <Button type="submit" disabled={sending || !text.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
