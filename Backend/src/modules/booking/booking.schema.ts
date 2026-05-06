import { payments_paymentMethod } from "../../prisma/enums.js";

export interface BookPitchForUser {
    pitchId: string,
    phone: string,
    startTime: Date,
    endTime: Date,
    pitchPriceAtBooking: number,
    service: Array<{
        serviceId: string,
        quantity: number,
        servicePriceAtBooking: number,
    }>;

}

export interface Payment {
    bookingId: string,
    amount: number,
    paymentMethod: payments_paymentMethod,
}

export interface CancelBookingForUser {
    bookId: string,
    content: string
}


export interface bookingPitchForAdmin {
    pitchId: string,
    phone: string,
    startTime: Date,
    endTime: Date,
    pitchPriceAtBooking: number,
    service: Array<{
        serviceId: string,
        quantity: number,
        servicePriceAtBooking: number,
    }>;  
}