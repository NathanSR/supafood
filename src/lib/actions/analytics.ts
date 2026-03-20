'use server';

import { createClient } from '@/utils/supabase/server';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subDays,
  isSameDay,
  subHours,
  parseISO
} from 'date-fns';
import { cache } from 'react';
import { getActiveRestaurantId } from './utils';

export type Period = 'today' | 'week' | 'month' | 'year';

// Auxiliar para datas
const getInterval = (period: Period) => {
  const now = new Date();
  let start: Date;
  let end: Date = now;
  let prevStart: Date;
  let prevEnd: Date;

  switch (period) {
    case 'today':
      start = startOfDay(now);
      prevStart = startOfDay(subDays(now, 1));
      prevEnd = endOfDay(subDays(now, 1));
      break;
    case 'week':
      start = startOfWeek(now, { weekStartsOn: 1 });
      prevStart = startOfWeek(subDays(start, 1), { weekStartsOn: 1 });
      prevEnd = endOfWeek(subDays(start, 1), { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(now);
      prevStart = startOfMonth(subDays(start, 1));
      prevEnd = endOfMonth(subDays(start, 1));
      break;
    case 'year':
      start = startOfYear(now);
      prevStart = startOfYear(subDays(start, 1));
      prevEnd = endOfYear(subDays(start, 1));
      break;
  }
  return { start, end, prevStart, prevEnd };
};

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number(((current - previous) / previous * 100).toFixed(1));
};

/**
 * 1. Busca apenas as estatísticas principais (Cards)
 */
export const getStats = cache(async (period: Period) => {
  const supabase = await createClient();
  const { start, end, prevStart, prevEnd } = getInterval(period);
  const restaurantId = await getActiveRestaurantId();

  if (!restaurantId) return {
    revenue: 0, revenueChange: 0,
    orders: 0, ordersChange: 0,
    customers: 0, customersChange: 0,
    avgOrder: 0, avgOrderChange: 0
  };

  const [current, prev] = await Promise.all([
    supabase.from('orders').select('total_amount, customer_name').eq('restaurant_id', restaurantId).gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
    supabase.from('orders').select('total_amount, customer_name').eq('restaurant_id', restaurantId).gte('created_at', prevStart.toISOString()).lte('created_at', prevEnd.toISOString())
  ]);

  const revenue = current.data?.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0;
  const prevRevenue = prev.data?.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0;
  
  const orders = current.data?.length || 0;
  const prevOrders = prev.data?.length || 0;

  const customers = new Set(current.data?.map(o => o.customer_name)).size;
  const prevCustomers = new Set(prev.data?.map(o => o.customer_name)).size;

  const avgOrder = orders > 0 ? revenue / orders : 0;
  const prevAvgOrder = prevOrders > 0 ? prevRevenue / prevOrders : 0;

  return {
    revenue, revenueChange: calculateChange(revenue, prevRevenue),
    orders, ordersChange: calculateChange(orders, prevOrders),
    customers, customersChange: calculateChange(customers, prevCustomers),
    avgOrder, avgOrderChange: calculateChange(avgOrder, prevAvgOrder)
  };
});

/**
 * 2. Busca dados para o gráfico de Receita
 */
export const getRevenueChartData = cache(async (period: Period) => {
  const supabase = await createClient();
  const { start, end } = getInterval(period);
  const now = new Date();
  const restaurantId = await getActiveRestaurantId();

  if (!restaurantId) return [];

  const { data } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  const chartData: number[] = [];
  if (period === 'today') {
    for (let i = 6; i >= 0; i--) {
      const s = subHours(now, i * 3);
      const e = subHours(now, (i - 1) * 3);
      chartData.push(data?.filter(o => {
        const d = parseISO(o.created_at);
        return d >= s && d < e;
      }).reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0);
    }
  } else {
    for (let i = 6; i >= 0; i--) {
      const d = subDays(now, i);
      chartData.push(data?.filter(o => isSameDay(parseISO(o.created_at), d))
        .reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0);
    }
  }
  return chartData;
});

/**
 * 3. Distribuição por Categoria
 */
export const getCategoryDistribution = cache(async (period: Period) => {
  const supabase = await createClient();
  const { start, end } = getInterval(period);
  const restaurantId = await getActiveRestaurantId();

  if (!restaurantId) return [];

  const { data } = await supabase
    .from('order_items')
    .select('quantity, menu_items!inner(restaurant_id, menu_categories(name))')
    .eq('menu_items.restaurant_id', restaurantId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  const map: Record<string, number> = {};
  data?.forEach((item: any) => {
    const name = item.menu_items?.menu_categories?.name || 'Outros';
    map[name] = (map[name] || 0) + item.quantity;
  });

  const total = Object.values(map).reduce((a, b) => a + b, 0);
  const colors = ['#FF5F15', '#3b82f6', '#f59e0b', '#22c55e', '#ec4899'];
  
  return Object.entries(map).map(([name, value], i) => ({
    name,
    value: total > 0 ? Math.round((value / total) * 100) : 0,
    color: colors[i % colors.length]
  })).sort((a, b) => b.value - a.value).slice(0, 5);
});

/**
 * 4. Horários de Pico
 */
export const getPeakHours = cache(async (period: Period) => {
  const supabase = await createClient();
  const { start, end } = getInterval(period);
  const restaurantId = await getActiveRestaurantId();

  if (!restaurantId) return new Array(24).fill(0);

  const { data } = await supabase
    .from('orders')
    .select('created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  const hourly = new Array(24).fill(0);
  data?.forEach(o => hourly[parseISO(o.created_at).getHours()]++);
  const max = Math.max(...hourly, 1);
  return hourly.map(v => Math.round((v / max) * 100));
});

/**
 * 5. Itens Mais Vendidos
 */
export const getTopItems = cache(async (period: Period) => {
  const supabase = await createClient();
  const { start, end } = getInterval(period);
  const restaurantId = await getActiveRestaurantId();

  if (!restaurantId) return [];

  const { data } = await supabase
    .from('order_items')
    .select('quantity, unit_price, menu_items!inner(name, restaurant_id)')
    .eq('menu_items.restaurant_id', restaurantId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  const map: Record<string, { name: string, count: number, revenue: number }> = {};
  data?.forEach((item: any) => {
    const name = item.menu_items?.name || 'Unknown';
    if (!map[name]) map[name] = { name, count: 0, revenue: 0 };
    map[name].count += item.quantity;
    map[name].revenue += item.quantity * Number(item.unit_price);
  });

  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({ ...item, emoji: '🍳' }));
});
