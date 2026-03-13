export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderSource = 'Tablet' | 'Takeaway' | 'Dine-in';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  source: string;
  tableNumber?: string;
  timeAgoInMins: number;
  status: string;
}

export interface TopSellingItem {
  id: string;
  name: string;
  sold: number;
  percentage: number;
}

export interface DashboardStats {
  todaysRevenue: number;
  revenueGrowth: number;
  onlineOrdersRevenue: number;
  dineInRevenue: number;
  totalOrders: number;
  avgWaitTimeMins: number;
  avgRating: number;
}
