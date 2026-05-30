export interface AiConversation {
    conversationId: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    ai_message?: AiMessage[];
}

export interface AiMessage {
    messageId: string;
    conversationId: string;
    sender: 'user' | 'model';
    content: string;
    createdAt: string;
}
