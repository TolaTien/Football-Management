import type { RootState } from '@/app/store/store';
export const selectConversations = (state: RootState) => state.ai.conversations;
export const selectActiveConversationId = (state: RootState) => state.ai.activeConversationId;
export const selectMessages = (state: RootState) => state.ai.messages;
export const selectLoadingConversations = (state: RootState) => state.ai.loadingConversations;
export const selectLoadingMessages = (state: RootState) => state.ai.loadingMessages;
export const selectLoadingSend = (state: RootState) => state.ai.loadingSend;
