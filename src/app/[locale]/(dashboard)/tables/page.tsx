import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { TablesClient } from '@/components/dashboard/tables/TablesClient';

export default async function TablesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 20;
  const status = params.status as string;
  const section = params.section as string;

  const supabase = await createClient();

  // Query for paginated and filtered tables
  let query = supabase
    .from('tables')
    .select('*', { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (section && section !== 'all') {
    query = query.eq('section', section);
  }

  const { data: tables, count } = await query
    .order('number', { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  // Separate query for summary stats (all tables)
  const { data: allStats } = await supabase
    .from('tables')
    .select('status');

  const stats = {
    total: allStats?.length || 0,
    available: allStats?.filter(t => t.status === 'available').length || 0,
    occupied: allStats?.filter(t => t.status === 'occupied').length || 0,
    reserved: allStats?.filter(t => t.status === 'reserved').length || 0,
    cleaning: allStats?.filter(t => t.status === 'cleaning').length || 0,
    maintenance: allStats?.filter(t => t.status === 'maintenance').length || 0,
  };

  const formattedTables = tables?.map(t => ({
    ...t,
    name: t.number // Map database number to UI name
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <TablesClient 
        initialTables={formattedTables || []} 
        totalCount={count || 0}
        currentPage={page}
        pageSize={limit}
        summaryStats={stats}
      />
    </div>
  );
}
