"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../auth/AuthProvider";
import { getSocket } from "@/lib/socket";
import notificationService from "@/services/notification.service";
import { AppNotification } from "@/types/notification.types";

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;

    notificationService
      .list()
      .then(({ data }) => setNotifications(data.data.slice(0, 20)))
      .catch(() => undefined);

    notificationService
      .unreadCount()
      .then(({ data }) => setUnreadCount(data.data.unread))
      .catch(() => undefined);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket(user.id);

    const onNotification = (notification: AppNotification) => {
      setNotifications((prev) =>
        prev.some((n) => n._id === notification._id)
          ? prev
          : [notification, ...prev].slice(0, 20)
      );
      setUnreadCount((prev) => prev + 1);
      toast(notification.title, { icon: "🔔" });
    };

    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [user?.id]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openNotification = async (notification: AppNotification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      notificationService.markAsRead(notification._id).catch(() => undefined);
    }
    setOpen(false);
    if (notification.type === "booking") {
      router.push("/bookings");
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationService.markAllAsRead().catch(() => undefined);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 rounded-card border border-neutral-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-semibold text-primary-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-secondary-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-neutral-400">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => openNotification(notification)}
                  className={`flex w-full flex-col items-start gap-0.5 border-b border-neutral-50 px-4 py-3 text-left last:border-0 hover:bg-neutral-50 ${
                    notification.isRead ? "" : "bg-tertiary-50/40"
                  }`}
                >
                  <div className="flex w-full items-center gap-2">
                    {!notification.isRead && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-500" />
                    )}
                    <p className="truncate text-sm font-medium text-primary-900">
                      {notification.title}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-xs text-neutral-500">{notification.message}</p>
                  <p className="text-[10px] text-neutral-400">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
