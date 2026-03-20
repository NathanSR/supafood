import React from 'react';
import { MenuClient } from '@/components/dashboard/menu/MenuClient';
import { getMenuItems } from '@/lib/actions/menu';
import { getCategories } from '@/lib/actions/categories';

export default async function MenuPage() {
  // Fetch categories using server action (filtered by restaurant_id)
  const categories = await getCategories();

  // Fetch initial items (first page, no filters, filtered by restaurant_id in action)
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
