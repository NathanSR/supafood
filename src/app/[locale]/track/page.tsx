import { getLocale, getTranslations } from 'next-intl/server';
import TrackClient from './TrackClient';
import { getOrderById, getOrderByNumber, getActiveOrdersByTable } from '@/lib/actions/orders';
import { notFound } from 'next/navigation';

interface TrackPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; table?: string }>;
}

export default async function TrackPage(props: TrackPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;
  const orderId = searchParams.id;
  const tableId = searchParams.table;

  let initialOrders: any[] = [];

  if (orderId) {
    // Try by UID first, then by Order Number
    let order = await getOrderById(orderId);
    if (!order) {
      const orderNum = parseInt(orderId);
      if (!isNaN(orderNum)) {
        order = await getOrderByNumber(orderNum);
      }
    }

    if (order) {
      // Security check: not archived, or completed < 24h
      const isArchived = order.status === 'archived';
      const isCompletedOld = order.status === 'delivered' && 
        (Date.now() - new Date(order.updated_at || order.created_at).getTime() > 24 * 60 * 60 * 1000);
      
      if (!isArchived && !isCompletedOld) {
        initialOrders = [order];
      }
    }
  } else if (tableId) {
    initialOrders = await getActiveOrdersByTable(tableId);
  }

  return (
    <TrackClient 
      initialOrders={initialOrders} 
      orderId={orderId} 
      tableId={tableId}
      locale={locale}
    />
  );
}
