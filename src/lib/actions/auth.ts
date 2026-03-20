'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function login(formData: FormData, locale: string) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Clear previous cookie to avoid fetching another user's restaurant
  const cookieStore = await cookies()
  cookieStore.delete('active_restaurant_id')

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: primary } = await supabase
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .order('is_primary', { ascending: false })
      .limit(1)
      .maybeSingle()
      
    if (primary) {
      cookieStore.set('active_restaurant_id', primary.id, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      })
    }
  }

  revalidatePath('/', 'layout')
  redirect(`/${locale}/home`)
}

export async function signup(formData: FormData, locale: string) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const avatarFile = formData.get('avatar') as File

  // 1. Sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  const user = data.user
  if (!user) return { error: 'No user data' }

  // 2. Upload avatar if exists
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}-${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
    }
  }

  const cookieStore = await cookies()
  cookieStore.delete('active_restaurant_id')

  revalidatePath('/', 'layout')
  redirect(`/${locale}/home`)
}

export async function logout(locale: string) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  cookieStore.delete('active_restaurant_id')
  revalidatePath('/', 'layout')
  redirect(`/${locale}/login`)
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, profile }
}
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const fullName = formData.get('fullName') as string
  const avatarFile = formData.get('avatar') as File
  
  let avatarUrl = undefined

  // 1. Upload avatar if provided
  if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== 'string') {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, {
        upsert: true,
        contentType: avatarFile.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: `Upload failed: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
    
    avatarUrl = publicUrl
  }

  // 2. Update/Upsert profile
  const updateData: any = { 
    id: user.id,
    full_name: fullName,
    updated_at: new Date().toISOString() // Just to force update timestamp
  }
  
  if (avatarUrl) {
    updateData.avatar_url = avatarUrl
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(updateData)

  if (profileError) {
    console.error('Profile update error:', profileError)
    return { error: profileError.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
export async function updatePassword(password: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) return { error: error.message }
  
  return { success: true }
}
