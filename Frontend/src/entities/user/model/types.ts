export type UserRole = 'Quản trị' | 'Khách hàng';
export type UserStatus = 'active' | 'banned';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export interface CreateUserDto {
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'user';
  password?: string;
}

export interface UserInfo {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  avt?: string;
  role: 'user' | 'admin';
}


export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: 'admin' | 'user';
  password?: string;
}

export type User = UserItem;
