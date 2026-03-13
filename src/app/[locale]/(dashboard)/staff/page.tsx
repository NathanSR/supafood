import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { StaffClient } from '@/components/dashboard/staff/StaffClient';

export default async function StaffPage() {
  const supabase = await createClient();

  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .order('full_name', { ascending: true });

  const formattedStaff = staff?.map(s => ({
    ...s,
    name: s.full_name // Map database full_name to UI name
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <StaffClient initialStaff={formattedStaff || []} />
    </div>
  );
}

