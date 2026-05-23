export interface CreateConversationInput {
  title?: string;
  userId: string
}

export interface SendMessage {
  userId: string,
  role: "user" | "admin",
  conversationId: string,
  content: string
}


export interface GetConversations {
  userId: string
}

export interface GetMessages {
  userId: string,
  conversationId: string
}