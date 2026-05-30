export interface Conversation {
  conversationId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  messageId: string;
  conversationId: string;
  sender: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface CreateConversationPayload {
  title?: string;
}

export interface SendMessagePayload {
  content: string;
}
