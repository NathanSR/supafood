import React from 'react';
import { getUser } from '@/app/actions/auth';
import { getRestaurantSettings } from '@/app/actions/restaurant';
import { SettingsClient } from '@/components/dashboard/settings/SettingsClient';

export default async function SettingsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch data in parallel
  const [userData, restaurantData] = await Promise.all([
    getUser(),
    getRestaurantSettings()
  ]);

  const initialProfile = {
    fullName: userData?.profile?.full_name || '',
    avatarUrl: userData?.profile?.avatar_url || ''
  };

  const initialRestaurant = {
    name: restaurantData?.name || '',
    email: restaurantData?.email || '',
    phone: restaurantData?.phone || '',
    address: restaurantData?.address || '',
    currency: restaurantData?.currency || 'BRL — Real Brasileiro',
    timezone: restaurantData?.timezone || 'America/Sao_Paulo (GMT-3)',
    language: restaurantData?.language || 'Português (Brasil)',
  };

  return (
    <SettingsClient 
      initialProfile={initialProfile}
      initialRestaurant={initialRestaurant}
      locale={locale}
    />
  );
}
