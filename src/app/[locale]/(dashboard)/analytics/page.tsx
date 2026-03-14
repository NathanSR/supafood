import React, { Suspense } from 'react';
import { 
  getStats, 
  getRevenueChartData, 
  getCategoryDistribution, 
  getPeakHours, 
  getTopItems, 
  Period 
} from '@/lib/actions/analytics';
import { StatsCards, StatsCardsSkeleton } from '@/components/analytics/StatsCards';
import { RevenueChart, RevenueChartSkeleton } from '@/components/analytics/RevenueChart';
import { CategoryDistribution, CategoryDistributionSkeleton } from '@/components/analytics/CategoryDistribution';
import { PeakHours, PeakHoursSkeleton } from '@/components/analytics/PeakHours';
import { TopSellingItems, TopSellingItemsSkeleton } from '@/components/analytics/TopSellingItems';
import { AnalyticsClient } from '@/components/analytics/AnalyticsClient';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ period?: Period }>;
}

export default async function AnalyticsPage({ params, searchParams }: PageProps) {
  const { period = 'today' } = await searchParams;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <AnalyticsClient initialPeriod={period as Period} />

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsDataContainer period={period as Period} />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChartContainer period={period as Period} />
        </Suspense>
        
        <Suspense fallback={<CategoryDistributionSkeleton />}>
          <CategoryDistributionContainer period={period as Period} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Suspense fallback={<PeakHoursSkeleton />}>
          <PeakHoursContainer period={period as Period} />
        </Suspense>
        
        <Suspense fallback={<TopSellingItemsSkeleton />}>
          <TopSellingItemsContainer period={period as Period} />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsDataContainer({ period }: { period: Period }) {
  const data = await getStats(period);
  return <StatsCards data={data} />;
}

async function RevenueChartContainer({ period }: { period: Period }) {
  const data = await getRevenueChartData(period);
  return <RevenueChart data={data} period={period} />;
}

async function CategoryDistributionContainer({ period }: { period: Period }) {
  const data = await getCategoryDistribution(period);
  return <CategoryDistribution data={data} />;
}

async function PeakHoursContainer({ period }: { period: Period }) {
  const data = await getPeakHours(period);
  return <PeakHours data={data} />;
}

async function TopSellingItemsContainer({ period }: { period: Period }) {
  const data = await getTopItems(period);
  return <TopSellingItems data={data} />;
}
