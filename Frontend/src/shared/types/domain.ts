export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'banned';
export type PitchStatus = 'active' | 'maintenance';
export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'partial' | 'paid';
export type PaymentMethod = 'cash' | 'banking';
export type PostStatus = 'open' | 'closed' | 'canceled';

export interface User {
  userId: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avt?: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
}

export interface PitchPrice {
  id: string;
  pitchId?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  price?: number | null;
}

export interface Pitch {
  pitchId: string;
  namePitch: string;
  status?: PitchStatus | null;
  pitchCategory?: number | null;
  address?: string | null;
  pitchprice?: PitchPrice[];
  booking?: Booking[];
}

export interface ServiceItem {
  serviceId: string;
  nameProduct: string;
  price?: number | null;
  totalQuantity?: number | null;
  borrowed?: number | null;
  returned?: number | null;
}

export interface BookingServiceItem {
  id: string;
  quantity?: number | null;
  servicePriceAtBooking?: number | null;
  services?: ServiceItem | null;
}

export interface Payment {
  id: string;
  bookingId?: string | null;
  amount?: number | null;
  paymentMethod?: PaymentMethod | null;
  type?: string | null;
}

export interface Booking {
  bookId: string;
  userId?: string | null;
  pitchId?: string | null;
  phone?: string | null;
  status?: BookingStatus | null;
  startTime?: string | null;
  endTime?: string | null;
  paymentStatus?: PaymentStatus | null;
  pitchPriceAtBooking?: number | null;
  total?: number | null;
  pitch?: Pitch | null;
  users?: User | null;
  bookingservices?: BookingServiceItem[];
  payments?: Payment[];
}

export interface Notification {
  id: string;
  content: string;
  type?: 'system' | 'booking' | 'post' | 'payment' | null;
  isRead?: boolean | null;
  createdAt?: string | null;
}

export interface ForumPost {
  postId: string;
  hostId?: string | null;
  description?: string | null;
  status?: PostStatus | null;
  createdAt?: string | null;
  users?: Pick<User, 'userId' | 'fullName' | 'avt'> | null;
  _count?: {
    comments: number;
    postlike: number;
  };
}

export interface ForumComment {
  commentId: string;
  content: string;
  parentId?: string | null;
  createdAt?: string | null;
  users?: Pick<User, 'userId' | 'fullName' | 'avt'> | null;
  _count?: {
    commentlike: number;
  };
  replies?: ForumComment[];
}
