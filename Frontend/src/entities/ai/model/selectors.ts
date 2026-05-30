import type { AiConversation, AiMessage } from '../types';

interface AiState {
    conversations: AiConversation[];
    activeConversationId: string | null;
    messages: AiMessage[];
    loadingConversations: boolean;
    loadingMessages: boolean;
    loadingSend: boolean;
}

export const selectConversations = (state: { ai: AiState }) => state.ai.conversations;
export const selectActiveConversationId = (state: { ai: AiState }) => state.ai.activeConversationId;
export const selectMessages = (state: { ai: AiState }) => state.ai.messages;
export const selectLoadingConversations = (state: { ai: AiState }) => state.ai.loadingConversations;
export const selectLoadingMessages = (state: { ai: AiState }) => state.ai.loadingMessages;
export const selectLoadingSend = (state: { ai: AiState }) => state.ai.loadingSend;

