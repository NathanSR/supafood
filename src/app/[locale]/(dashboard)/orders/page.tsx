import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { OrdersClient } from '@/components/dashboard/orders/OrdersClient';

export default async function OrdersPage() {
  const supabase = await createClient();

  // Fetch orders with items and tables
  const { data: orders } = await supabase
    .from('orders')
    .select('*, tables(name), order_items(*, menu_items(name))')
    .order('created_at', { ascending: false });

  // Map to the expected format
  const formattedOrders = orders?.map(order => ({
    id: order.id,
    orderNumber: order.order_number.toString().padStart(4, '0'),
    customer: order.table_id ? `Mesa ${order.tables?.name}` : 'Takeaway',
    items: order.order_items?.map((oi: any) => `${oi.menu_items?.name} x${oi.quantity}`) || [],
    total: Number(order.total_amount),
    source: order.type === 'dine-in' ? 'Dine-in' : 'Takeaway',
    timeAgoInMins: Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000),
    status: order.status === 'pending' ? 'pending' : order.status === 'preparing' ? 'inPrep' : order.status === 'ready' ? 'ready' : order.status === 'delivered' ? 'delivered' : 'cancelled'
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <OrdersClient initialOrders={formattedOrders || []} />
    </div>
  );
}

