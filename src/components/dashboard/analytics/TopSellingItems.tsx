'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TopItem {
  name: string;
  count: number;
  revenue: number;
  emoji: string;
}

interface TopSellingItemsProps {
  data: TopItem[];
}

export function TopSellingItems({ data }: TopSellingItemsProps) {
  const t = useTranslations('Analytics');
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const maxCount = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="font-bold text-base mb-4">{t('topItems')}</h3>
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3 group">
              <span className="text-xl w-8 text-center bg-slate-100 dark:bg-white/5 h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/5 group-hover:border-primary/50 transition-colors">
                {item.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-wider">
                    {item.count} {t('orders')}
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                    className="h-full rounded-full bg-[#FF5F15] shadow-[0_0_10px_#FF5F15]"
                  />
                </div>
              </div>
              <p className="text-sm font-black whitespace-nowrap min-w-[80px] text-right">
                {formatter.format(item.revenue)}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 italic text-sm">
            {t('noResults')}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TopSellingItemsSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-200 dark:bg-white/5 rounded mb-6" />
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 dark:bg-white/5 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-slate-200 dark:bg-white/5 rounded" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-white/10 rounded" />
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded" />
            </div>
            <div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
