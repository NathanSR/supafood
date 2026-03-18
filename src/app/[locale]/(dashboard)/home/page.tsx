import React from 'react';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { LiveOrders } from '@/components/dashboard/LiveOrders';
import { TopSellingItems } from '@/components/dashboard/TopSellingItems';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get('active_restaurant_id')?.value;

  // Fetch orders scoped to the active restaurant
  let query = supabase
    .from('orders')
    .select('*, tables(number), order_items(*, menu_items(*))');

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data: orders } = await query
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate stats logic (simplified for now)
  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;
  const totalOrders = orders?.length || 0;
  
  const stats = {
    todaysRevenue: totalRevenue,
    revenueGrowth: 15.5, // Mock growth for UI
    onlineOrdersRevenue: orders?.filter(o => o.type !== 'dine-in').reduce((acc, o) => acc + Number(o.total_amount), 0) || 0,
    dineInRevenue: orders?.filter(o => o.type === 'dine-in').reduce((acc, o) => acc + Number(o.total_amount), 0) || 0,
    totalOrders: totalOrders,
    avgWaitTimeMins: 12, // Mock average
    avgRating: 4.8
  };

  const formattedOrders = orders?.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number?.toString() || '0',
    items: order.order_items?.map((oi: any) => ({
      id: oi.id,
      name: oi.menu_items?.name,
      quantity: oi.quantity
    })) || [],
    tableNumber: order.tables?.number,
    source: order.type === 'dine-in' ? 'Dine-in' : 'Takeaway',
    timeAgoInMins: Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000),
    status: order.status
  }));

  // Calculate top items (simplified)
  const itemCounts: Record<string, { name: string, count: number }> = {};
  orders?.forEach(order => {
    order.order_items?.forEach((oi: any) => {
      const id = oi.menu_item_id;
      if (!itemCounts[id]) {
        itemCounts[id] = { name: oi.menu_items?.name, count: 0 };
      }
      itemCounts[id].count += oi.quantity;
    });
  });

  const sortedItems = Object.entries(itemCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([id, data]) => ({
      id,
      name: data.name,
      sold: data.count,
      percentage: Math.min(100, (data.count / (totalOrders || 1)) * 100)
    }));

  return (
    <div className="p-4 md:p-8 space-y-8">
      <StatsOverview stats={stats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <LiveOrders orders={formattedOrders || []} />
        <TopSellingItems items={sortedItems || []} />
      </div>
    </div>
  );
}

