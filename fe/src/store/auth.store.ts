import { create } from 'zustand';

interface User {
  userId: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  phone?: string;
  avt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userRole: 'user' | 'admin';
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setInitialized: () => void;
  isInitialized: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  userRole: 'user',
  isInitialized: false,
  setAuth: (user) => set({ isAuthenticated: true, user, userRole: user.role, isInitialized: true }),
  clearAuth: () => set({ isAuthenticated: false, user: null, userRole: 'user', isInitialized: true }),
  setInitialized: () => set({ isInitialized: true }),
}));
