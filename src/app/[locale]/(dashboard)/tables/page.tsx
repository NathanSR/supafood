import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { TablesClient } from '@/components/dashboard/tables/TablesClient';

export default async function TablesPage() {
  const supabase = await createClient();

  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <TablesClient initialTables={tables || []} />
    </div>
  );
}
