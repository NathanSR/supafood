'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryDistributionProps {
  data: CategoryData[];
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const t = useTranslations('Analytics');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6 border border-white/5"
    >
      <h3 className="font-bold text-base mb-6">{t('ordersByCategory')}</h3>
      <div className="flex flex-col gap-3">
        {data.length > 0 ? (
          data.map((cat, i) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-400">{cat.name}</span>
                <span className="font-bold text-primary">{cat.value}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.value}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  style={{ backgroundColor: cat.color }}
                  className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                />
              </div>
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

export function CategoryDistributionSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 animate-pulse">
      <div className="h-6 w-48 bg-white/5 rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-4 w-8 bg-white/10 rounded" />
            </div>
            <div className="h-2 w-full bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
