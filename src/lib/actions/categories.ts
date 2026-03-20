'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getActiveRestaurantId } from './utils'

export async function getCategories() {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createCategory(name: string, slug: string, emoji?: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('menu_categories').insert({ name, slug, emoji: emoji || '🍽️', restaurant_id: restaurantId })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}
