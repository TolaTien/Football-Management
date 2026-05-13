export interface UserInfo {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  avt?: string;
  role: 'user' | 'admin';
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  data: {
    userId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    role: string;
  }; // Adjust based on exactly what backend returns inside 'data' for login
}

export interface LoginPayload {
  email: string;
  password?: string; // Optional if you also support other methods, but required here
}

export interface RegisterPayload {
  email: string;
  password?: string;
  phone: string;
  fullName: string;
}
