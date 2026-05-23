import { $api } from '@/shared/api/axiosInstance';
import type { Conversation, AiMessage, CreateConversationPayload, SendMessagePayload } from './types';

export const aiService = {
  createConversation: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const { data } = await $api.post('/ai/conversations', payload);
    return data.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await $api.get('/ai/get-conversations');
    return data.data;
  },

  getMessages: async (conversationId: string): Promise<AiMessage[]> => {
    const { data } = await $api.get(`/ai/conversations/${conversationId}/messages`);
    return data.data;
  },

  sendMessage: async (conversationId: string, payload: SendMessagePayload): Promise<AiMessage> => {
    const { data } = await $api.post(`/ai/conversations/${conversationId}/messages`, payload);
    return data.data;
  }
};
