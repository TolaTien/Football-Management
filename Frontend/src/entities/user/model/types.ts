export interface UserInfo {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  avt?: string;
  role: 'user' | 'admin';
}
