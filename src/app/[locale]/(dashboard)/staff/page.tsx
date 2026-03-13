import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { StaffClient } from '@/components/dashboard/staff/StaffClient';

export default async function StaffPage() {
  const supabase = await createClient();

  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <StaffClient initialStaff={staff || []} />
    </div>
  );
}

