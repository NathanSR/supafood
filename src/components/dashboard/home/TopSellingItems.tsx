'use client';

import React from 'react';
import type { TopSellingItem } from '@/types/restaurant';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopSellingItems({ items }: { items: TopSellingItem[] }) {
  const t = useTranslations('Dashboard');
  const g = useTranslations('General');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass rounded-xl p-8 flex flex-col h-[500px]"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg">{t('topSelling')}</h3>
        <select className="bg-slate-100 dark:bg-white/5 border-none rounded-lg text-xs font-semibold py-1.5 focus:ring-1 focus:ring-primary outline-none">
          <option>{t('last7Days')}</option>
          <option>{t('last30Days')}</option>
        </select>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {items.map((item, index) => {
          // Adjust opacity based on index to mimic the design (85, 65, 55, 45, 35...)
          const opacityClasses = [
            'bg-primary',
            'bg-primary/80',
            'bg-primary/60',
            'bg-primary/40',
            'bg-primary/30'
          ];
          const bgClass = opacityClasses[index % opacityClasses.length];

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>{item.name}</span>
                <span>{g('sold', { count: item.sold })}</span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                  className={cn("h-full rounded-full transition-all duration-1000", bgClass)} 
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 mt-auto flex justify-center border-t border-black/5 dark:border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('mainCourses')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/60"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('sides')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/30"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('drinks')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
