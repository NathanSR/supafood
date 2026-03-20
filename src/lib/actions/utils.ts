'use server'

import { cookies } from 'next/headers'

export async function getActiveRestaurantId() {
  const cookieStore = await cookies()
  return cookieStore.get('active_restaurant_id')?.value
}
