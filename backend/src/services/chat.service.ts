import { Types } from "mongoose";

import conversationRepository from "../repositories/conversation.repository";
import messageRepository from "../repositories/message.repository";
import User from "../models/user.model";
import { getIO } from "../socket/socket";

import { SendMessageDto, StartConversationDto } from "../dto/chat.dto";

import ApiError from "../error/ApiError";

class ChatService {
  /**
   * Start (or resume) a conversation with another user
   */
  async startConversation(userId: string, body: StartConversationDto) {
    if (body.recipientId === userId) {
      throw new ApiError(400, "You can't start a conversation with yourself.");
    }

    const recipient = await User.findById(body.recipientId);

    if (!recipient) {
      throw new ApiError(404, "Recipient not found.");
    }

    const existing = await conversationRepository.findBetween(
      userId,
      body.recipientId,
      body.equipmentId
    );

    if (existing) {
      return conversationRepository.findById(String(existing._id));
    }

    const created = await conversationRepository.create({
      participants: [new Types.ObjectId(userId), new Types.ObjectId(body.recipientId)],
      equipment: body.equipmentId ? new Types.ObjectId(body.equipmentId) : undefined,
    });

    return conversationRepository.findById(String(created._id));
  }

  /**
   * List Current User's Conversations
   */
  async getMyConversations(userId: string) {
    return conversationRepository.findByParticipant(userId);
  }

  /**
   * Get A Single Conversation (must be a participant)
   */
  async getConversationById(conversationId: string, userId: string) {
    const conversation = await this.assertParticipant(conversationId, userId);

    return conversationRepository.findById(conversationId) ?? conversation;
  }

  /**
   * Get Messages In A Conversation (marks the other participant's messages as read)
   */
  async getMessages(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);

    await messageRepository.markConversationRead(conversationId, userId);

    return messageRepository.findByConversation(conversationId);
  }

  /**
   * Send A Message
   */
  async sendMessage(conversationId: string, userId: string, body: SendMessageDto) {
    const conversation = await this.assertParticipant(conversationId, userId);

    if (!body.text?.trim()) {
      throw new ApiError(400, "Message text can't be empty.");
    }

    const message = await messageRepository.create({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(userId),
      text: body.text.trim(),
    });

    await conversationRepository.touchLastMessage(conversationId, message.text);

    const recipientId = conversation.participants
      .map((p) => String(p))
      .find((id) => id !== userId);

    if (recipientId) {
      try {
        getIO().to(recipientId).emit("message:new", {
          conversationId,
          message,
        });
      } catch {
        // Socket.IO is optional for real-time delivery — the message is already persisted.
      }
    }

    return message;
  }

  /**
   * Ensure the requesting user is a participant of the conversation
   */
  private async assertParticipant(conversationId: string, userId: string) {
    const conversation = await conversationRepository.findRawById(conversationId);

    if (!conversation) {
      throw new ApiError(404, "Conversation not found.");
    }

    const isParticipant = conversation.participants
      .map((p) => String(p))
      .includes(userId);

    if (!isParticipant) {
      throw new ApiError(403, "You are not part of this conversation.");
    }

    return conversation;
  }
}

export default new ChatService();
