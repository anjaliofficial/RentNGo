import { apiClient } from "../lib/api-client";
import { StartConversationInput } from "../types/chat.types";

class ChatService {
  start(data: StartConversationInput) {
    return apiClient.post("/conversations", data);
  }

  myConversations() {
    return apiClient.get("/conversations");
  }

  getConversation(id: string) {
    return apiClient.get(`/conversations/${id}`);
  }

  getMessages(id: string) {
    return apiClient.get(`/conversations/${id}/messages`);
  }

  sendMessage(id: string, text: string) {
    return apiClient.post(`/conversations/${id}/messages`, { text });
  }
}

export default new ChatService();
