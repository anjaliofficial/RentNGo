import { Schema, model } from "mongoose";

import {
  INotification,
  NotificationType,
} from "../types/notification.types";

const notificationSchema = new Schema<INotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * -------------------------
 * Database Indexes
 * -------------------------
 */

// User notifications
notificationSchema.index({
  receiver: 1,
});

// Read / unread notifications
notificationSchema.index({
  isRead: 1,
});

// Notification type
notificationSchema.index({
  type: 1,
});

// Latest notifications first
notificationSchema.index({
  createdAt: -1,
});

export default model<INotification>(
  "Notification",
  notificationSchema
);