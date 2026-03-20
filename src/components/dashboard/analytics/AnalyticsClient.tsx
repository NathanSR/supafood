'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Period } from '@/lib/actions/analytics';

interface AnalyticsClientProps {
  initialPeriod: Period;
}

export function AnalyticsClient({ initialPeriod }: AnalyticsClientProps) {
  const t = useTranslations('Analytics');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setPeriod = (p: Period) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', p);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{t('subtitle')}</p>
      </div>
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
        {(['today', 'week', 'month', 'year'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${initialPeriod === p
              ? 'bg-white/10 text-[#FF5F15] shadow-lg border border-white/5'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {t(p as any)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
