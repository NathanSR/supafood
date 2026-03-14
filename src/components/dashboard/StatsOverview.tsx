'use client';

import React from 'react';
import { 
  Banknote, 
  TrendingUp, 
  Receipt, 
  Clock, 
  Star 
} from 'lucide-react';
import type { DashboardStats } from '@/types/restaurant';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function StatsOverview({ stats }: { stats: DashboardStats }) {
  const t = useTranslations('Dashboard');
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Today's Revenue Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-2 glass rounded-xl p-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 text-primary/10">
          <Banknote className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">
              {t('revenue')}
            </p>
            <div className="flex items-baseline gap-4 mt-2">
              <h3 className="text-5xl font-extrabold tracking-tight">
                {formatter.format(stats.todaysRevenue)}
              </h3>
              <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-sm font-bold rounded-lg flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stats.revenueGrowth}%
              </span>
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-8">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('onlineOrders')}</p>
              <p className="text-xl font-bold">{formatter.format(stats.onlineOrdersRevenue)}</p>
            </div>
            
            <div className="w-px h-10 bg-white/10"></div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('dineIn')}</p>
              <p className="text-xl font-bold">{formatter.format(stats.dineInRevenue)}</p>
            </div>
            
            <div className="ml-auto">
              <Link href="/analytics" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform inline-block">
                {t('viewReport')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mini Stat Cards */}
      <div className="flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-xl p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('totalOrders')}</p>
            <h4 className="text-2xl font-bold">{stats.totalOrders}</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass rounded-xl p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('avgWaitTime')}</p>
            <h4 className="text-2xl font-bold">{stats.avgWaitTimeMins} min</h4>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass rounded-xl p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('avgRating')}</p>
            <h4 className="text-2xl font-bold">{stats.avgRating} / 5</h4>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
