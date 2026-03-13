import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { OrdersClient } from '@/components/dashboard/orders/OrdersClient';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; page?: string }>;
}) {
  const { query, status, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageSize = 10;
  
  const supabase = await createClient();

  // 1. Get counts for status badges (always need this)
  const { data: countsData } = await supabase
    .from('orders')
    .select('status');
    
  const tabCounts: Record<string, number> = {
    all: countsData?.length || 0,
    pending: countsData?.filter(o => o.status === 'pending').length || 0,
    preparing: countsData?.filter(o => o.status === 'preparing').length || 0,
    ready: countsData?.filter(o => o.status === 'ready').length || 0,
    delivered: countsData?.filter(o => o.status === 'delivered').length || 0,
    cancelled: countsData?.filter(o => o.status === 'cancelled').length || 0,
  };

  // 2. Build the main query with filters
  let dbQuery = supabase
    .from('orders')
    .select('*, tables(number), order_items(*, menu_items(name))', { count: 'exact' });

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  if (query) {
    // Search in customer_name or order_number
    // Order number is numeric, so we check if query is a number
    const queryAsNum = parseInt(query);
    if (!isNaN(queryAsNum)) {
      dbQuery = dbQuery.or(`customer_name.ilike.%${query}%,order_number.eq.${queryAsNum}`);
    } else {
      dbQuery = dbQuery.ilike('customer_name', `%${query}%`);
    }
  }

  // 3. Apply pagination
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data: orders, count, error: ordersError } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  if (ordersError) console.error('Erro ao buscar pedidos:', ordersError);

  // Fetch tables and menu items for the new order form
  const { data: tablesData } = await supabase
    .from('tables')
    .select('id, number')
    .order('number', { ascending: true });

  const tables = tablesData?.map(t => ({
    ...t,
    name: t.number
  })) || [];

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, price, image_url, menu_categories(name)')
    .eq('is_available', true);

  // Map to the expected format for OrdersClient
  const formattedOrders = orders?.map(order => ({
    ...order,
    orderNumber: order.order_number?.toString().padStart(4, '0') || '0000',
    customer: order.customer_name || (order.table_id ? `Mesa ${(order.tables as any)?.number}` : 'Cliente'),
    items: order.order_items?.map((oi: any) => (oi.menu_items as any)?.name) || [],
    timeAgoInMins: Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000),
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <OrdersClient
        initialOrders={formattedOrders || []}
        tables={tables || []}
        menuItems={menuItems || []}
        totalCount={count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        tabCounts={tabCounts}
      />
    </div>
  );
}
