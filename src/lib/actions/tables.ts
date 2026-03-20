'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getActiveRestaurantId } from './utils'

export async function getTables(options?: {
  status?: string;
  section?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient()
  const { status, section, page = 1, limit = 20 } = options || {}
  const restaurantId = await getActiveRestaurantId()

  if (!restaurantId) return { items: [], total: 0 }

  let query = supabase
    .from('tables')
    .select('*', { count: 'exact' })
    .eq('restaurant_id', restaurantId)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (section && section !== 'all') {
    query = query.eq('section', section)
  }

  const { data: tables, count, error } = await query
    .order('number', { ascending: true })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw new Error(error.message)

  const formattedTables = tables?.map(t => ({
    ...t,
    name: t.number
  }))

  return {
    items: formattedTables || [],
    total: count || 0
  }
}

export async function getTableStats() {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()

  if (!restaurantId) return { total: 0, available: 0, occupied: 0, reserved: 0, cleaning: 0, maintenance: 0 }

  const { data: allStats, error } = await supabase
    .from('tables')
    .select('status')
    .eq('restaurant_id', restaurantId)

  if (error) throw new Error(error.message)

  return {
    total: allStats?.length || 0,
    available: allStats?.filter(t => t.status === 'available').length || 0,
    occupied: allStats?.filter(t => t.status === 'occupied').length || 0,
    reserved: allStats?.filter(t => t.status === 'reserved').length || 0,
    cleaning: allStats?.filter(t => t.status === 'cleaning').length || 0,
    maintenance: allStats?.filter(t => t.status === 'maintenance').length || 0,
  }
}

export async function createTable(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const capacity = parseInt(formData.get('capacity') as string)
  const section = formData.get('section') as string
  const status = 'available'
  const restaurantId = await getActiveRestaurantId()

  const { error } = await supabase.from('tables').insert({
    number: name,
    capacity,
    section,
    status,
    restaurant_id: restaurantId
  })

  if (error) return { error: error.message }
  
  revalidatePath('/[locale]/(dashboard)/tables', 'page')
  return { success: true }
}

export async function updateTable(id: string, updates: any) {
  const supabase = await createClient()
  const data = { ...updates }
  if (data.name) {
    data.number = data.name
    delete data.name
  }
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('tables').update(data).eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/tables', 'page')
  return { success: true }
}

export async function deleteTable(id: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('tables').delete().eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/tables', 'page')
  return { success: true }
}
