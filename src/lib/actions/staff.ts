'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getActiveRestaurantId } from './utils'

export async function getStaff(options?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient()
  const { search, role, page = 1, limit = 12 } = options || {}
  const restaurantId = await getActiveRestaurantId()

  let query = supabase
    .from('staff')
    .select('*', { count: 'exact' })

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId)
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (role && role !== 'all') {
    query = query.eq('role', role)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query
    .order('full_name', { ascending: true })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    staff: data?.map(s => ({ ...s, name: s.full_name })) || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function createStaffMember(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const role = formData.get('role') as string
  const shift = formData.get('shift') as string
  const status = 'off_duty'
  const restaurantId = await getActiveRestaurantId()

  const { error } = await supabase.from('staff').insert({
    full_name: name,
    email,
    phone,
    role,
    shift,
    status,
    restaurant_id: restaurantId
  })

  if (error) return { error: error.message }
  
  revalidatePath('/[locale]/(dashboard)/staff', 'page')
  return { success: true }
}

export async function updateStaffMember(id: string, updates: any) {
  const supabase = await createClient()
  const data = { ...updates }
  if (data.name) {
    data.full_name = data.name
    delete data.name
  }
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('staff').update(data).eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/staff', 'page')
  return { success: true }
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('staff').delete().eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/staff', 'page')
  return { success: true }
}
