'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getActiveRestaurantId } from './utils'

export async function getOrders(options?: {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
  today?: boolean;
}) {
  const supabase = await createClient()
  const { query, status, page = 1, limit = 10, today = false } = options || {}
  const restaurantId = await getActiveRestaurantId()

  if (!restaurantId) return { 
    items: [], 
    total: 0, 
    tabCounts: { all: 0, pending: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 } 
  }

  // 1. Get counts for status badges
  let countsQuery = supabase
    .from('orders')
    .select('status')
    .eq('restaurant_id', restaurantId)

  if (today) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    countsQuery = countsQuery.gte('created_at', startOfDay.toISOString())
  }

  const { data: countsData } = await countsQuery
    
  const tabCounts: Record<string, number> = {
    all: countsData?.length || 0,
    pending: countsData?.filter(o => o.status === 'pending').length || 0,
    preparing: countsData?.filter(o => o.status === 'preparing').length || 0,
    ready: countsData?.filter(o => o.status === 'ready').length || 0,
    delivered: countsData?.filter(o => o.status === 'delivered').length || 0,
    cancelled: countsData?.filter(o => o.status === 'cancelled').length || 0,
  }

  // 2. Build the main query
  let dbQuery = supabase
    .from('orders')
    .select('*, tables(number), order_items(*, menu_items(name))', { count: 'exact' })
    .eq('restaurant_id', restaurantId)

  if (status && status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  if (today) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    dbQuery = dbQuery.gte('created_at', startOfDay.toISOString())
  }

  if (query) {
    const queryAsNum = parseInt(query)
    if (!isNaN(queryAsNum)) {
      dbQuery = dbQuery.or(`customer_name.ilike.%${query}%,order_number.eq.${queryAsNum}`)
    } else {
      dbQuery = dbQuery.ilike('customer_name', `%${query}%`)
    }
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  
  const { data: orders, count, error } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  const formattedOrders = orders?.map(order => ({
    ...order,
    orderNumber: order.order_number?.toString().padStart(4, '0') || '0000',
    customer: order.customer_name || (order.table_id ? `Mesa ${(order.tables as any)?.number}` : 'Cliente'),
    items: order.order_items?.map((oi: any) => (oi.menu_items as any)?.name) || [],
    timeAgoInMins: Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000),
  }))

  return {
    items: formattedOrders || [],
    total: count || 0,
    tabCounts
  }
}

export async function createOrder(data: any) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  
  const { items, customer_name, ...orderData } = data
  
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ ...orderData, customer_name, restaurant_id: restaurantId })
    .select()
    .single()

  if (error) return { error: error.message }

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    menu_item_id: item.id,
    quantity: item.quantity,
    unit_price: item.price
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  revalidatePath('/')
  return { success: true, orderId: order.id }
}

export async function addItemsToOrder(orderId: string, items: any[], newTotal: number) {
  const supabase = await createClient()

  // 1. Insert new items
  const orderItems = items.map((item: any) => ({
    order_id: orderId,
    menu_item_id: item.id,
    quantity: item.quantity,
    unit_price: item.price
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  // 2. Update total amount
  const { error: updateError } = await supabase
    .from('orders')
    .update({ total_amount: newTotal })
    .eq('id', orderId)

  if (updateError) return { error: updateError.message }

  revalidatePath('/[locale]/(dashboard)/orders', 'page')
  return { success: true }
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/orders', 'page')
  return { success: true }
}
