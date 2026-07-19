export interface StartConversationDto {
  recipientId: string;

  equipmentId?: string;
}

export interface SendMessageDto {
  text: string;
}
