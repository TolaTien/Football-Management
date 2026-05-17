export interface ApiEnvelope<T> {
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  total?: number;
  totalPages?: number;
  perPage?: number;
  numberPage?: number;
  totalRequest?: number;
  perpage?: number;
  limit?: number;
}
