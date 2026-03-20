'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getActiveRestaurantId } from './utils'

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
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
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

    const shouldRemoveImage = formData.get('remove_image') === 'true'

    // If removing image, delete from storage and set null
    if (shouldRemoveImage) {
      // Get current item to find existing image URL
      const { data: currentItem } = await supabase
        .from('menu_items')
        .select('image_url')
        .eq('id', id)
        .single()

      if (currentItem?.image_url) {
        // Extract file path from the public URL
        const urlParts = currentItem.image_url.split('/menu-items/')
        if (urlParts.length > 1) {
          const filePath = urlParts[urlParts.length - 1]
          await supabase.storage.from('menu-items').remove([filePath])
        }
      }
      updates.image_url = null
    }

    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists before uploading new one
      const { data: currentItem } = await supabase
        .from('menu_items')
        .select('image_url')
        .eq('id', id)
        .single()

      if (currentItem?.image_url) {
        const urlParts = currentItem.image_url.split('/menu-items/')
        if (urlParts.length > 1) {
          const filePath = urlParts[urlParts.length - 1]
          await supabase.storage.from('menu-items').remove([filePath])
        }
      }

      const fileExt = imageFile.name.split('.').pop()
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('menu-items')
        .upload(filePath, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('menu-items')
          .getPublicUrl(filePath)
        updates.image_url = publicUrl
      }
    }
  }

  if (image_url && !updates.image_url) {
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
