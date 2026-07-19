import { Schema, model } from "mongoose";

import { IConversation } from "../types/chat.types";

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length === 2,
        message: "A conversation must have exactly 2 participants.",
      },
    },

    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });

export default model<IConversation>("Conversation", conversationSchema);
