import { booking_paymentStatus, booking_status, payments_paymentMethod, payments_type } from "../../prisma/enums.js";

export interface BookPitchForUser {
    pitchId: string,
    phone: string,
    startTime: Date,
    endTime: Date,
    pitchPriceAtBooking: number,
    total: number,
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