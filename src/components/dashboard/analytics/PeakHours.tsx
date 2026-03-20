'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PeakHoursProps {
  data: number[];
}

export function PeakHours({ data }: PeakHoursProps) {
  const t = useTranslations('Analytics');

  const chartData = data.map((val, i) => ({
    hour: `${i}h`,
    value: val
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-2 rounded-lg shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] text-slate-900 dark:text-white font-bold">{payload[0].payload.hour}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="font-bold text-base mb-6">{t('peakHours')}</h3>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.1 }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value > 75 ? '#FF5F15' : entry.value > 50 ? 'rgba(255, 95, 21, 0.6)' : 'rgba(255, 95, 21, 0.3)'}
                />
              ))}
            </Bar>
            <XAxis
              dataKey="hour"
              hide={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval={5}
            />
            <YAxis hide domain={[0, 100]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-[10px] text-slate-500 font-bold">0h</span>
        <span className="text-[10px] text-slate-500 font-bold">12h</span>
        <span className="text-[10px] text-slate-500 font-bold">23h</span>
      </div>
    </motion.div>
  );
}

export function PeakHoursSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-200 dark:bg-white/5 rounded mb-6" />
      <div className="h-44 bg-slate-200 dark:bg-white/5 rounded" />
    </div>
  );
}
