'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { getActiveRestaurantId } from './utils'

export async function getRestaurantSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const restaurantId = await getActiveRestaurantId()

  if (restaurantId) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .eq('owner_id', user.id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (data) return data
  }

  // If no active restaurant, get the first one owned by the user
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function getAllRestaurants() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .order('name')

  if (error) throw new Error(error.message)
  return data || []
}

export async function createRestaurant(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if they already have restaurants
  const { count } = await supabase
    .from('restaurants')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  const isPrimary = count === 0

  const { error, data: restaurant } = await supabase
    .from('restaurants')
    .insert({ ...data, owner_id: user.id, is_primary: isPrimary })
    .select()
    .single()

  if (error) return { error: error.message }
  
  // Auto-switch to the newly created restaurant
  const cookieStore = await cookies()
  cookieStore.set('active_restaurant_id', restaurant.id, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })

  revalidatePath('/', 'layout')
  return { success: true, restaurant }
}

export async function updateRestaurant(id: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('restaurants')
    .update(data)
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteRestaurant(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Prevent deleting the primary restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('is_primary')
    .eq('id', id)
    .single()

  if (restaurant?.is_primary) {
    return { error: 'Cannot delete the primary restaurant' }
  }

  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) return { error: error.message }
  
  // If deleted restaurant was active, clear cookie
  const cookieStore = await cookies()
  const activeId = cookieStore.get('active_restaurant_id')?.value
  if (activeId === id) {
    cookieStore.delete('active_restaurant_id')
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function switchRestaurant(id: string) {
  const cookieStore = await cookies()
  cookieStore.set('active_restaurant_id', id, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateRestaurantSettings(data: any) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  
  if (!restaurantId) return { error: 'No active restaurant' }
  
  const { error } = await supabase
    .from('restaurants')
    .update(data)
    .eq('id', restaurantId)

  if (error) return { error: error.message }
  
  revalidatePath('/', 'layout')
  return { success: true }
}
