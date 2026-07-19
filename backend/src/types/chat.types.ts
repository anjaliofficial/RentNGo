import { Document, Types } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[];

  equipment?: Types.ObjectId;

  lastMessage?: string;

  lastMessageAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface IMessage extends Document {
  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  text: string;

  read: boolean;

  createdAt: Date;

  updatedAt: Date;
}
