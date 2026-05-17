export interface GetRevenueInput {
    month?: number;
    year?: number;
    address?: string;
}

export interface GetSystemOverview {
    address?: string
}

export interface DataForEmailReport {
    month: number;
    year: number;
}