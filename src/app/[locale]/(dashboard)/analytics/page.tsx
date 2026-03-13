'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Receipt, 
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Period = 'today' | 'week' | 'month' | 'year';

const periodData: Record<Period, {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  avgOrder: number;
  avgOrderChange: number;
  chartData: number[];
  hourlyData: number[];
  categoryData: { name: string; value: number; color: string }[];
}> = {
  today: {
    revenue: 12482.50,
    revenueChange: 14.2,
    orders: 342,
    ordersChange: 8.5,
    customers: 218,
    customersChange: -3.1,
    avgOrder: 36.50,
    avgOrderChange: 5.2,
    chartData: [8500, 9200, 8800, 9800, 10500, 11200, 12482],
    hourlyData: [5, 8, 15, 22, 38, 52, 68, 74, 72, 65, 58, 42, 35, 40, 55, 62, 78, 88, 92, 85, 70, 55, 38, 22],
    categoryData: [
      { name: 'Pratos Principais', value: 45, color: '#ff5f14' },
      { name: 'Bebidas', value: 25, color: '#3b82f6' },
      { name: 'Entradas', value: 15, color: '#f59e0b' },
      { name: 'Acompanhamentos', value: 10, color: '#22c55e' },
      { name: 'Sobremesas', value: 5, color: '#ec4899' },
    ]
  },
  week: {
    revenue: 87340.00,
    revenueChange: 9.8,
    orders: 2389,
    ordersChange: 12.1,
    customers: 1520,
    customersChange: 6.4,
    avgOrder: 36.56,
    avgOrderChange: -2.3,
    chartData: [11200, 9800, 10500, 13100, 14800, 15200, 12740],
    hourlyData: [12, 18, 28, 35, 48, 62, 75, 88, 92, 85, 78, 65, 55, 62, 72, 82, 88, 95, 100, 92, 78, 62, 48, 32],
    categoryData: [
      { name: 'Pratos Principais', value: 42, color: '#ff5f14' },
      { name: 'Bebidas', value: 28, color: '#3b82f6' },
      { name: 'Entradas', value: 14, color: '#f59e0b' },
      { name: 'Acompanhamentos', value: 10, color: '#22c55e' },
      { name: 'Sobremesas', value: 6, color: '#ec4899' },
    ]
  },
  month: {
    revenue: 342800.00,
    revenueChange: 18.3,
    orders: 9420,
    ordersChange: 15.2,
    customers: 5890,
    customersChange: 22.1,
    avgOrder: 36.39,
    avgOrderChange: 2.7,
    chartData: [38000, 41000, 35500, 42000, 44500, 48000, 44800],
    hourlyData: [15, 22, 32, 45, 58, 70, 82, 90, 95, 88, 80, 70, 62, 68, 78, 85, 90, 96, 100, 94, 82, 68, 52, 38],
    categoryData: [
      { name: 'Pratos Principais', value: 44, color: '#ff5f14' },
      { name: 'Bebidas', value: 26, color: '#3b82f6' },
      { name: 'Entradas', value: 16, color: '#f59e0b' },
      { name: 'Acompanhamentos', value: 9, color: '#22c55e' },
      { name: 'Sobremesas', value: 5, color: '#ec4899' },
    ]
  },
  year: {
    revenue: 4120000.00,
    revenueChange: 24.5,
    orders: 112800,
    ordersChange: 19.8,
    customers: 71400,
    customersChange: 28.3,
    avgOrder: 36.52,
    avgOrderChange: 3.8,
    chartData: [290000, 315000, 298000, 340000, 368000, 352000, 401000],
    hourlyData: [20, 28, 38, 52, 65, 76, 86, 92, 96, 90, 83, 75, 68, 74, 82, 88, 93, 98, 100, 95, 85, 72, 58, 42],
    categoryData: [
      { name: 'Pratos Principais', value: 43, color: '#ff5f14' },
      { name: 'Bebidas', value: 27, color: '#3b82f6' },
      { name: 'Entradas', value: 15, color: '#f59e0b' },
      { name: 'Acompanhamentos', value: 10, color: '#22c55e' },
      { name: 'Sobremesas', value: 5, color: '#ec4899' },
    ]
  }
};

const topItems = [
  { name: 'Truffle Burger Clássico', count: 842, revenue: 38647.80, emoji: '🍔' },
  { name: 'Ramen Picante Supremo', count: 624, revenue: 24878.40, emoji: '🍜' },
  { name: 'Mediterranean Wrap', count: 512, revenue: 15360.00, emoji: '🌯' },
  { name: 'Limonada Siciliana', count: 488, revenue: 7271.20, emoji: '🍋' },
  { name: 'Petit Gâteau', count: 390, revenue: 10140.00, emoji: '🍫' },
];

const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function AnalyticsPage() {
  const t = useTranslations('Analytics');
  const [period, setPeriod] = useState<Period>('today');
  const data = periodData[period];

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const statCards = [
    { key: 'totalRevenue', value: formatter.format(data.revenue), change: data.revenueChange, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'totalOrders', value: data.orders.toLocaleString(), change: data.ordersChange, icon: Receipt, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'newCustomers', value: data.customers.toLocaleString(), change: data.customersChange, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { key: 'avgOrder', value: formatter.format(data.avgOrder), change: data.avgOrderChange, icon: BarChart3, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const maxChart = Math.max(...data.chartData);
  const maxHourly = Math.max(...data.hourlyData);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
          {(['today', 'week', 'month', 'year'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                period === p
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t(p as any)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t(card.key as any)}
              </p>
              <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight">{card.value}</p>
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {card.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(card.change)}% {t('vsLastPeriod')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base">{t('revenueOverTime')}</h3>
          </div>
          <div className="flex items-end gap-1.5 h-44">
            {data.chartData.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxChart) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className="flex-1 rounded-t-lg bg-primary/20 hover:bg-primary/40 transition-colors cursor-pointer relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatter.format(val)}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxChart) * 100}%` }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%' }}
                  className="w-full rounded-t-lg bg-primary"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            {dayLabels.map(day => (
              <span key={day} className="flex-1 text-center text-[10px] text-slate-400 font-medium">{day}</span>
            ))}
          </div>
        </motion.div>

        {/* Category Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-bold text-base mb-6">{t('ordersByCategory')}</h3>
          <div className="flex flex-col gap-3">
            {data.categoryData.map((cat, i) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{cat.name}</span>
                  <span className="font-bold">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                    style={{ backgroundColor: cat.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-bold text-base mb-6">{t('peakHours')}</h3>
          <div className="flex items-end gap-0.5 h-28">
            {data.hourlyData.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxHourly) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.02, duration: 0.4, ease: 'easeOut' }}
                title={`${i}:00 — ${val}%`}
                className={`flex-1 rounded-t cursor-pointer transition-opacity hover:opacity-80 ${
                  val > 75 ? 'bg-primary' : val > 50 ? 'bg-primary/60' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400">0h</span>
            <span className="text-[10px] text-slate-400">6h</span>
            <span className="text-[10px] text-slate-400">12h</span>
            <span className="text-[10px] text-slate-400">18h</span>
            <span className="text-[10px] text-slate-400">23h</span>
          </div>
        </motion.div>

        {/* Top Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-bold text-base mb-4">{t('topItems')}</h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 ml-2 whitespace-nowrap">{item.count} pedidos</p>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / topItems[0].count) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {formatter.format(item.revenue)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
