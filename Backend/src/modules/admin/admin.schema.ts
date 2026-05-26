import { payments_paymentMethod } from "../../prisma/enums.js"

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
    paymentMethod: payments_paymentMethod
}

export interface UpdateUserStatus {
    userId: string,
    status: 'active' | 'banned'
}
