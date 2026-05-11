export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export interface ApiError {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
}

export type PaginatedResponse<T> = ApiResponse<T[]>;
