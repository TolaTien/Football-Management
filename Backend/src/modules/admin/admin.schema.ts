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
}