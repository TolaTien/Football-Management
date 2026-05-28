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
    accessToken: string;
    refreshToken: string;
    user: UserInfo;
  };
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
