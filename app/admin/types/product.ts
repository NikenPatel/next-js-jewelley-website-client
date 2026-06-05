export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  products?: any;
}

export interface ProductState {
  selectedProduct: null | any;
  products: any;
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface CreateProductPayload {
  [key: string]: unknown;
}

export interface UpdateProductPayload {
  productId: string;
  data: Record<string, unknown>;
}
