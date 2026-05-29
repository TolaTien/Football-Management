import { axiosInstance } from '@/shared/api';

export const aiService = {
    createConversation: (title?: string) =>
        axiosInstance.post('/ai/conversations', { title }),

    getConversations: () =>
        axiosInstance.get('/ai/get-conversations'),

    getMessages: (conversationId: string) =>
        axiosInstance.get(`/ai/get-messages/${conversationId}`),

    sendMessage: (conversationId: string, content: string) =>
        axiosInstance.post(`/ai/send-message/${conversationId}`, { content }),
};
