'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function getActiveRestaurantId() {
  const cookieStore = await cookies()
  return cookieStore.get('active_restaurant_id')?.value
}

// MENU ITEMS
export async function getMenuItems(options?: {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient()
  const { search, categoryId, page = 1, limit = 12 } = options || {}
  const restaurantId = await getActiveRestaurantId()

  let query = supabase
    .from('menu_items')
    .select('*, menu_categories(name, slug)', { count: 'exact' })

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (categoryId && categoryId !== 'all') {
    query = query.eq('category_id', categoryId)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    items: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const prep_time = parseInt(formData.get('prep_time') as string)
  const calories = parseInt(formData.get('calories') as string)
  const is_popular = formData.get('is_popular') === 'on'
  const is_spicy = formData.get('is_spicy') === 'on'
  const imageFile = formData.get('image') as File

  let image_url = ''

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('menu-items')
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('menu-items')
        .getPublicUrl(filePath)
      image_url = publicUrl
    }
  }

  const restaurantId = await getActiveRestaurantId()

  const { error } = await supabase.from('menu_items').insert({
    name,
    category_id,
    description,
    price,
    prep_time,
    calories,
    is_popular,
    is_spicy,
    image_url: image_url || null,
    restaurant_id: restaurantId
  })

  if (error) return { error: error.message }
  
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}

export async function updateMenuItem(id: string, data: any) {
  const supabase = await createClient()
  
  let updates = { ...data }
  let image_url = updates.image_url

  if (data instanceof FormData) {
    const formData = data
    updates = {
      name: formData.get('name') as string,
      category_id: formData.get('category_id') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      prep_time: parseInt(formData.get('prep_time') as string),
      calories: parseInt(formData.get('calories') as string),
      is_popular: formData.get('is_popular') === 'on',
      is_spicy: formData.get('is_spicy') === 'on',
    }

    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('menu-items')
        .upload(filePath, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('menu-items')
          .getPublicUrl(filePath)
        image_url = publicUrl
      }
    }
  }

  if (image_url) {
    updates.image_url = image_url
  }

  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('menu_items').update(updates).eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('menu_items').delete().eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}

// ORDERS
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

// STAFF
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

// TABLES
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

// CATEGORIES
export async function createCategory(name: string, slug: string, emoji?: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('menu_categories').insert({ name, slug, emoji: emoji || '🍽️', restaurant_id: restaurantId })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}

export async function getRestaurantSettings() {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()

  if (restaurantId) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data
  }

  // If no active restaurant, get the first one owned by the user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

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

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const restaurantId = await getActiveRestaurantId()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id).eq('restaurant_id', restaurantId)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/orders', 'page')
  return { success: true }
}
