// app/api/orders/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define order item type (similar to cart item)
export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  customization?: Record<string, any> | null;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  // Add more fields as needed (customer info, shipping, etc.)
}

// Simple in‑memory store for demo purposes (replace with DB in production)
const orders: Record<string, Order> = {};

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: OrderItem[] = body.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const total = calculateTotal(items);
    const newOrder: Order = {
      id,
      items,
      totalAmount: total,
      createdAt: new Date().toISOString(),
    };
    orders[id] = newOrder;
    return NextResponse.json({
      message: "Order placed successfully",
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error", error);
    return NextResponse.json({ message: "Failed to place order" }, { status: 500 });
  }
}
