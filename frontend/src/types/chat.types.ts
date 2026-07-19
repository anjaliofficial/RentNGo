import { EquipmentOwner } from "./equipment.types";

export interface ConversationEquipment {
  _id: string;
  title: string;
  images: string[];
}

export interface Conversation {
  _id: string;
  participants: EquipmentOwner[];
  equipment?: ConversationEquipment;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageSender {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: MessageSender | string;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StartConversationInput {
  recipientId: string;
  equipmentId?: string;
}
