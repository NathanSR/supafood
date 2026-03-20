import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { SidebarProvider } from '@/context/SidebarContext';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getAllRestaurants, getRestaurantSettings } from '@/lib/actions/restaurant';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const restaurants = await getAllRestaurants();

  if (restaurants.length === 0) {
    redirect(`/${locale}/onboarding`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const activeRestaurant = await getRestaurantSettings();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto flex flex-col">
          <Header user={{ ...user, profile }} restaurants={restaurants} activeRestaurant={activeRestaurant} />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

