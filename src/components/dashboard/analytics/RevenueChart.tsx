'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface RevenueChartProps {
  data: number[];
  period: string;
}

export function RevenueChart({ data, period }: RevenueChartProps) {
  const t = useTranslations('Analytics');
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const labels = period === 'today'
    ? ['-18h', '-15h', '-12h', '-9h', '-6h', '-3h', 'Agora']
    : [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  const chartData = data.map((value, i) => ({
    name: labels[i] || '',
    value
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{payload[0].payload.name}</p>
          <p className="text-sm font-black text-white">{formatter.format(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="xl:col-span-2 glass rounded-2xl p-6 border border-white/5"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-base">{t('revenueOverTime')}</h3>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5F15" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF5F15" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className="xl:col-span-2 glass rounded-2xl p-6 border border-white/5 animate-pulse">
      <div className="h-6 w-48 bg-white/5 rounded mb-6" />
      <div className="h-64 bg-white/5 rounded" />
    </div>
  );
}
