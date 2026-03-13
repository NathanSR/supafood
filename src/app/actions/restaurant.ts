'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// MENU ITEMS
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

  const { error } = await supabase.from('menu_items').insert({
    name,
    category_id,
    description,
    price,
    prep_time,
    calories,
    is_popular,
    is_spicy,
    image_url: image_url || null
  })

  if (error) return { error: error.message }
  
  revalidatePath('/')
  return { success: true }
}

export async function updateMenuItem(id: string, updates: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_items').update(updates).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

// ORDERS
export async function createOrder(data: any) {
  const supabase = await createClient()
  
  const { items, customer_name, ...orderData } = data
  
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ ...orderData, customer_name })
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

// STAFF
export async function createStaffMember(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const role = formData.get('role') as string
  const shift = formData.get('shift') as string
  const status = 'off_duty'

  const { error } = await supabase.from('staff').insert({
    full_name: name,
    email,
    phone,
    role,
    shift,
    status
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
  const { error } = await supabase.from('staff').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/staff', 'page')
  return { success: true }
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('staff').delete().eq('id', id)
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

  const { error } = await supabase.from('tables').insert({
    number: name,
    capacity,
    section,
    status
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
  const { error } = await supabase.from('tables').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/tables', 'page')
  return { success: true }
}

export async function deleteTable(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tables').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/tables', 'page')
  return { success: true }
}

// CATEGORIES
export async function createCategory(name: string, slug: string, emoji?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('menu_categories').insert({ name, slug, emoji: emoji || '🍽️' })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/menu', 'page')
  return { success: true }
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/(dashboard)/orders', 'page')
  return { success: true }
}
