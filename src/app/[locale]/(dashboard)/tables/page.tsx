import React from 'react';
import { getTables, getTableStats } from '@/lib/actions/tables';
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

  // 1. Fetch filtered tables using server action
  const { items: formattedTables, total: count } = await getTables({
    status,
    section,
    page,
    limit
  });

  // 2. Fetch summary stats using server action
  const stats = await getTableStats();

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
