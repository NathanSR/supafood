import React from 'react';
import { Header } from '@/components/dashboard/Header';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { LiveOrders } from '@/components/dashboard/LiveOrders';
import { TopSellingItems } from '@/components/dashboard/TopSellingItems';
import { mockDashboardStats, mockLiveOrders, mockTopSellingItems } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      
      <div className="p-8 space-y-8 flex-1">
        <StatsOverview stats={mockDashboardStats} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <LiveOrders orders={mockLiveOrders} />
          <TopSellingItems items={mockTopSellingItems} />
        </div>
      </div>
    </div>
  );
}
