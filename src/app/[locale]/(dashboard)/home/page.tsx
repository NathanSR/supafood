import React from 'react';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { LiveOrders } from '@/components/dashboard/LiveOrders';
import { TopSellingItems } from '@/components/dashboard/TopSellingItems';
import { mockDashboardStats, mockLiveOrders, mockTopSellingItems } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <StatsOverview stats={mockDashboardStats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <LiveOrders orders={mockLiveOrders} />
        <TopSellingItems items={mockTopSellingItems} />
      </div>
    </div>
  );
}
