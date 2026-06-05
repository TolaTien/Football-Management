import { payments_paymentMethod } from "@prisma/client"

export interface ApproveRequestUser {
    bookId: string,

}

export interface CancelBookingForAdmin {
    bookId: string,
}

export interface RefundForUser {
    bookId: string
}

export interface GetAllHistoryOfUser {
    userId: string
};

export interface VerifyPaymentOfUser {
    bookId: string,
    paymentMethod: payments_paymentMethod,
    paymentStatus?: 'partial' | 'paid'
}

export interface UpdateUserStatus {
    userId: string,
    status: 'active' | 'banned'
}
