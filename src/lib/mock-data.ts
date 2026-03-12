export type OrderStatus = 'In Prep' | 'Ready' | 'Order Received';
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
  source: OrderSource;
  tableNumber?: string;
  timeAgoInMins: number;
  status: OrderStatus;
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

export const mockDashboardStats: DashboardStats = {
  todaysRevenue: 12482.50,
  revenueGrowth: 14.2,
  onlineOrdersRevenue: 8120.00,
  dineInRevenue: 4362.50,
  totalOrders: 342,
  avgWaitTimeMins: 18,
  avgRating: 4.8
};

export const mockLiveOrders: Order[] = [
  {
    id: '1',
    orderNumber: '42',
    items: [{ id: 'i1', name: 'Classic Truffle Burger', quantity: 2 }],
    source: 'Tablet',
    timeAgoInMins: 3,
    status: 'In Prep'
  },
  {
    id: '2',
    orderNumber: '41',
    items: [{ id: 'i2', name: 'Quinoa Harvest Bowl', quantity: 1 }],
    source: 'Takeaway',
    timeAgoInMins: 8,
    status: 'Ready'
  },
  {
    id: '3',
    orderNumber: '40',
    items: [{ id: 'i3', name: 'Spicy Ramen Supreme', quantity: 3 }],
    source: 'Dine-in',
    tableNumber: '12',
    timeAgoInMins: 12,
    status: 'In Prep'
  },
  {
    id: '4',
    orderNumber: '39',
    items: [{ id: 'i4', name: 'Vegan Avocado Toast', quantity: 1 }],
    source: 'Dine-in',
    tableNumber: '05',
    timeAgoInMins: 15,
    status: 'Order Received'
  }
];

export const mockTopSellingItems: TopSellingItem[] = [
  { id: 't1', name: 'Truffle Burger', sold: 842, percentage: 85 },
  { id: 't2', name: 'Crispy Tofu Bowl', sold: 624, percentage: 65 },
  { id: 't3', name: 'Mediterranean Wrap', sold: 512, percentage: 55 },
  { id: 't4', name: 'Spicy Ramen Supreme', sold: 488, percentage: 45 },
  { id: 't5', name: 'Superberry Smoothie', sold: 390, percentage: 35 }
];
