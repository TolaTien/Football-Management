import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiService } from '../api/aiService';
import type { Conversation, AiMessage, SendMessagePayload } from '../api/types';

interface AiChatState {
  conversations: Conversation[];
  messages: AiMessage[];
  currentConversationId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

const initialState: AiChatState = {
  conversations: [],
  messages: [],
  currentConversationId: null,
  isOpen: false,
  isLoading: false,
  isSending: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'aiChat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await aiService.getConversations();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'aiChat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const data = await aiService.getMessages(conversationId);
      return { conversationId, messages: data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const createNewConversation = createAsyncThunk(
  'aiChat/createNewConversation',
  async (_, { rejectWithValue }) => {
    try {
      const data = await aiService.createConversation({ title: 'Cuộc trò chuyện mới' });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async (
    { conversationId, content }: { conversationId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await aiService.sendMessage(conversationId, { content });
      return data; // This is the assistant's reply message from the backend. The backend also creates the user's message. 
      // We will need to optimistically add the user's message in the component or handle it here.
      // But actually, the backend returns ONLY the assistant message.
      // Let's return the user content too so we can add it to the state.
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const aiSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    optimisticUserMessage: (state, action: PayloadAction<{ content: string }>) => {
       // Optimistically append the user message before the API returns the bot message
       if (state.currentConversationId) {
          state.messages.push({
            messageId: Date.now().toString(), // temporary ID
            conversationId: state.currentConversationId,
            sender: 'user',
            content: action.payload.content,
            createdAt: new Date().toISOString()
          });
       }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        if (action.payload.length > 0 && !state.currentConversationId) {
          state.currentConversationId = action.payload[0].conversationId;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.messages;
        state.currentConversationId = action.payload.conversationId;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Conversation
      .addCase(createNewConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.unshift(action.payload);
        state.currentConversationId = action.payload.conversationId;
        state.messages = []; // Reset messages for new conversation
      })
      .addCase(createNewConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        // Append the bot's reply
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleChat, setCurrentConversation, optimisticUserMessage } = aiSlice.actions;
export default aiSlice.reducer;
