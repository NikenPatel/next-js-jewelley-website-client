// app/types/order.ts
export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  customization?: Record<string, any> | null;
}

export interface Order {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
