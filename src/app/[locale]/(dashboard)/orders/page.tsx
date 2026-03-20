import React from 'react';
import { getOrders } from '@/lib/actions/orders';
import { getTables } from '@/lib/actions/tables';
import { getMenuItems } from '@/lib/actions/menu';
import { OrdersClient } from '@/components/dashboard/orders/OrdersClient';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; page?: string; today?: string }>;
}) {
  const { query, status, page, today } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageSize = 10;
  
  // 1. Fetch filtered orders and counts using server action
  const { items: formattedOrders, total: count, tabCounts } = await getOrders({
    query,
    status,
    page: currentPage,
    limit: pageSize,
    today: today === 'true'
  });

  // 2. Fetch tables and menu items for the new order form (filtered by restaurant_id in actions)
  const { items: tables } = await getTables({ limit: 100 });
  const { items: menuItems } = await getMenuItems({ limit: 100 });

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
