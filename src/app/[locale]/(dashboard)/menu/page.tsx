import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { MenuClient } from '@/components/dashboard/menu/MenuClient';

export default async function MenuPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Fetch items
  const { data: items } = await supabase
    .from('menu_items')
    .select('*, menu_categories(name, slug)');

  return (
    <div className="p-4 md:p-8 space-y-6">
      <MenuClient 
        initialCategories={categories || []} 
        initialItems={items || []} 
      />
    </div>
  );
}

