'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('Dashboard');
  
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-10 glass px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">{t('overview')}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{currentDate}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t('search')}
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border-none outline-none rounded-xl focus:ring-2 focus:ring-primary/50 w-64 text-sm transition-all"
          />
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all relative">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
        </button>
      </div>
    </header>
  );
}
