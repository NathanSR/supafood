import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { OrdersClient } from '@/components/dashboard/orders/OrdersClient';

export default async function OrdersPage() {
  const supabase = await createClient();

  // Fetch orders with items and tables
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*, tables(number), order_items(*, menu_items(name))')
    .order('created_at', { ascending: false });

  if (ordersError) console.error('Erro ao buscar pedidos:', ordersError);

  // Fetch tables and menu items for the new order form
  const { data: tablesData, error: tablesError } = await supabase
    .from('tables')
    .select('id, number')
    .order('number', { ascending: true });
    
  if (tablesError) {
    console.error('Erro ao buscar mesas:', tablesError);
  }

  const tables = tablesData?.map(t => ({
    ...t,
    name: t.number
  })) || [];

  console.log('Mesas carregadas:', tables);

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, price, image_url, menu_categories(name)')
    .eq('is_available', true);

  // Map to the expected format for OrdersClient
  const formattedOrders = orders?.map(order => ({
    ...order,
    orderNumber: order.order_number?.toString().padStart(4, '0') || '0000',
    customer: order.customer_name || (order.table_id ? `Mesa ${(order.tables as any)?.number || (order.tables as any)?.name}` : 'Cliente'),
    items: order.order_items?.map((oi: any) => (oi.menu_items as any)?.name) || [],
    timeAgoInMins: Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000),
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <OrdersClient
        initialOrders={formattedOrders || []}
        tables={tables || []}
        menuItems={menuItems || []}
      />
    </div>
  );
}
