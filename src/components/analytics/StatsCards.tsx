'use client';

import React from 'react';
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

interface StatsCardsProps {
  data: {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    customers: number;
    customersChange: number;
    avgOrder: number;
    avgOrderChange: number;
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  const t = useTranslations('Analytics');
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const statCards = [
    { 
      key: 'totalRevenue', 
      value: formatter.format(data.revenue), 
      change: data.revenueChange, 
      icon: DollarSign, 
      color: 'text-[#FF5F15]', 
      bg: 'bg-[#FF5F15]/10' 
    },
    { 
      key: 'totalOrders', 
      value: data.orders.toLocaleString(), 
      change: data.ordersChange, 
      icon: Receipt, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      key: 'newCustomers', 
      value: data.customers.toLocaleString(), 
      change: data.customersChange, 
      icon: Users, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10' 
    },
    { 
      key: 'avgOrder', 
      value: formatter.format(data.avgOrder), 
      change: data.avgOrderChange, 
      icon: BarChart3, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10' 
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-5 border border-white/5"
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
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {card.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(card.change)}% {t('vsLastPeriod')}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl p-5 border border-white/5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-white/5 rounded" />
            <div className="w-9 h-9 rounded-xl bg-white/5" />
          </div>
          <div className="h-8 w-32 bg-white/10 rounded mb-2" />
          <div className="h-4 w-20 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}
