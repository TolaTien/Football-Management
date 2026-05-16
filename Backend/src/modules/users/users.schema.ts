export interface UpdateProfileUser {
    email?: string ;
    fullName?: string ;
    avt?: string;
    phone?: string;
}

export interface GetHistoryBooking {
    userId: string, 
    query: any
}