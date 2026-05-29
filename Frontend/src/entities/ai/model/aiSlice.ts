import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { aiService } from '../api/aiService';
import type { AiConversation, AiMessage } from '../types';

// Async Thunks 
export const fetchConversations = createAsyncThunk(
    'ai/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const res = await aiService.getConversations();
            return res.data.data as AiConversation[];
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message || 'Lỗi tải hội thoại');
        }
    }
);

export const createConversation = createAsyncThunk(
    'ai/createConversation',
    async (title: string | undefined, { rejectWithValue }) => {
        try {
            const res = await aiService.createConversation(title);
            return res.data.data as AiConversation;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message || 'Lỗi tạo hội thoại');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'ai/fetchMessages',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            const res = await aiService.getMessages(conversationId);
            return res.data.data as AiMessage[];
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message || 'Lỗi tải tin nhắn');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'ai/sendMessage',
    async (
        { conversationId, content }: { conversationId: string; content: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await aiService.sendMessage(conversationId, content);
            return res.data.data as AiMessage;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message || 'Lỗi gửi tin nhắn');
        }
    }
);

// State 
interface AiState {
    conversations: AiConversation[];
    activeConversationId: string | null;
    messages: AiMessage[];
    loadingConversations: boolean;
    loadingMessages: boolean;
    loadingSend: boolean;
}

const initialState: AiState = {
    conversations: [],
    activeConversationId: null,
    messages: [],
    loadingConversations: false,
    loadingMessages: false,
    loadingSend: false,
};

// Slice 
const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setActiveConversation: (state, action: PayloadAction<string | null>) => {
            state.activeConversationId = action.payload;
            state.messages = [];
        },
        appendOptimisticMessage: (state, action: PayloadAction<AiMessage>) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchConversations
            .addCase(fetchConversations.pending, (state) => {
                state.loadingConversations = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loadingConversations = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.loadingConversations = false;
            })
            // createConversation
            .addCase(createConversation.fulfilled, (state, action) => {
                state.conversations.unshift(action.payload);
                state.activeConversationId = action.payload.conversationId;
                state.messages = [];
            })
            // fetchMessages
            .addCase(fetchMessages.pending, (state) => {
                state.loadingMessages = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loadingMessages = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.loadingMessages = false;
            })
            // sendMessage
            .addCase(sendMessage.pending, (state) => {
                state.loadingSend = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loadingSend = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loadingSend = false;
                message.error(action.payload as string || 'Gửi thất bại');
            });
    },
});

export const { setActiveConversation, appendOptimisticMessage } = aiSlice.actions;
export default aiSlice.reducer;
