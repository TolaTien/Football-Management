import { Pitch } from '../../pitch/model/types';
import { User } from '../../user/model/types';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export interface BookingSlot {
    startTime: string; // ISO String
    endTime: string;   // ISO String
}

export interface Order {
    id: string;
    user: User;
    pitch: Pitch;
    status: OrderStatus;
    totalPrice: number;
    slots: BookingSlot[];
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOMO';
    createdAt: string;
}

export interface OrderDTO {
    pitchId: string;
    slots: BookingSlot[];
    paymentMethod: string;
}
