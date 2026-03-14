import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { MenuClient } from '@/components/dashboard/menu/MenuClient';
import { getMenuItems } from '@/app/actions/restaurant';

export default async function MenuPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Fetch initial items (first page, no filters)
  const { items, total, totalPages } = await getMenuItems({ page: 1, limit: 12 });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <MenuClient 
        initialCategories={categories || []} 
        initialItems={items || []} 
        initialTotal={total}
        initialPages={totalPages}
      />
    </div>
  );
}

