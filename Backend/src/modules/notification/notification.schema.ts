export interface GetAllNotification {
    userId: string,
    query: any
}

export interface MarkRead {
    userId: string,
    notificationId: string
}

export interface MarkReadAll {
    userId: string
}