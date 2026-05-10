export interface CreateServiceDto {
    nameProduct: string;
    price: number;
    totalQuantity: number;
}

export interface UpdateServiceDto {
    serviceId: string;
    nameProduct?: string;
    price?: number;
    totalQuantity?: number;
}

