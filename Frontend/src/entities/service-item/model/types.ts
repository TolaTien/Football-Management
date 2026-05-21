export type ServiceType = 'drink' | 'equipment' | 'food' | 'other';
export type ServiceStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  type: ServiceType;
  status: ServiceStockStatus;
  totalQuantity: number;
  borrowed: number;
  returned: number;
}

export interface CreateServiceDto {
  nameProduct: string;
  price: number;
  totalQuantity: number;
  borrowed: number;
  returned: number;
}

export interface UpdateServiceDto {
  nameProduct: string;
  price: number;
  totalQuantity: number;
  borrowed: number;
  returned: number;
}
