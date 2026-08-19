export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  estimatedMinutes: number;
  createdAt: string;
}
