import React from 'react';
import { StaffClient } from '@/components/dashboard/staff/StaffClient';
import { getStaff } from '@/lib/actions/staff';

export default async function StaffPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = (searchParams.query as string) || '';
  const role = (searchParams.role as string) || 'all';
  const limit = 12;

  const { staff, total, totalPages } = await getStaff({
    search: query,
    role,
    page,
    limit
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <StaffClient
        initialStaff={staff}
        totalCount={total}
        totalPages={totalPages}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  );
}

