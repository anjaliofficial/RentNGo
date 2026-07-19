import Message from "../models/message.model";
import { IMessage } from "../types/chat.types";

class MessageRepository {
  /**
   * Create Message
   */
  async create(data: Partial<IMessage>): Promise<IMessage> {
    return Message.create(data);
  }

  /**
   * Find Messages For A Conversation
   */
  async findByConversation(conversationId: string): Promise<IMessage[]> {
    return Message.find({ conversation: conversationId })
      .populate("sender", "fullName avatar")
      .sort({ createdAt: 1 });
  }

  /**
   * Mark All Messages In A Conversation As Read (excluding the reader's own messages)
   */
  async markConversationRead(conversationId: string, readerId: string): Promise<void> {
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: readerId }, read: false },
      { read: true }
    );
  }
}

export default new MessageRepository();
