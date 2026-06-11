// app/types/order.ts
export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  customization?: Record<string, any> | null;
}

export interface Order {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
    sku: string;
  };
  variantId: string;
  quantity: number;
  selectedRingSize?: number | null;
  engravingText?: string;
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  productSnapshot?: {
    name: string;
    sku: string;
    image?: string;
    metal?: string;
    gemstone?: string;
    price: number;
    discountPrice?: number;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "placed"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "return_requested"
    | "returned"
    | "return_rejected"
    | "rto";
  returnReason?: string;
  rtoReason?: string;
  createdAt: string;
  updatedAt?: string;
}
