import Conversation from "../models/conversation.model";
import { IConversation } from "../types/chat.types";

const PARTICIPANT_FIELDS = "fullName email avatar trustScore";

class ConversationRepository {
  /**
   * Create Conversation
   */
  async create(data: Partial<IConversation>): Promise<IConversation> {
    return Conversation.create(data);
  }

  /**
   * Find Existing Conversation Between Two Participants (optionally scoped to an equipment listing)
   */
  async findBetween(
    userAId: string,
    userBId: string,
    equipmentId?: string
  ): Promise<IConversation | null> {
    return Conversation.findOne({
      participants: { $all: [userAId, userBId], $size: 2 },
      equipment: equipmentId ?? { $exists: false },
    });
  }

  /**
   * Find By ID
   */
  async findById(id: string): Promise<IConversation | null> {
    return Conversation.findById(id)
      .populate("participants", PARTICIPANT_FIELDS)
      .populate("equipment", "title images");
  }

  /**
   * Find Raw By ID (no populate, for ownership checks)
   */
  async findRawById(id: string): Promise<IConversation | null> {
    return Conversation.findById(id);
  }

  /**
   * List Conversations For A User
   */
  async findByParticipant(userId: string): Promise<IConversation[]> {
    return Conversation.find({ participants: userId })
      .populate("participants", PARTICIPANT_FIELDS)
      .populate("equipment", "title images")
      .sort({ lastMessageAt: -1, createdAt: -1 });
  }

  /**
   * Update Last Message Preview
   */
  async touchLastMessage(id: string, text: string): Promise<void> {
    await Conversation.findByIdAndUpdate(id, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });
  }
}

export default new ConversationRepository();
