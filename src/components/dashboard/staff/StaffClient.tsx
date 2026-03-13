'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail,
  Users,
  ChefHat,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StaffClientProps {
  initialStaff: any[];
}

const roles = ['all', 'chef', 'cook', 'waiter', 'cashier', 'manager', 'cleaner'];

const roleColors: Record<string, string> = {
  chef: 'bg-primary/10 text-primary',
  cook: 'bg-orange-500/10 text-orange-500',
  waiter: 'bg-blue-500/10 text-blue-500',
  cashier: 'bg-green-500/10 text-green-600',
  manager: 'bg-purple-500/10 text-purple-500',
  cleaner: 'bg-slate-500/10 text-slate-500',
};

const shiftColors: Record<string, string> = {
  morning: 'text-amber-500',
  afternoon: 'text-blue-500',
  evening: 'text-purple-500',
  night: 'text-indigo-400',
};

const shiftEmoji: Record<string, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
};

export function StaffClient({ initialStaff }: StaffClientProps) {
  const t = useTranslations('Staff');
  const [activeRole, setActiveRole] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = initialStaff.filter(m => {
    const matchesRole = activeRole === 'all' || m.role === activeRole;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const onDutyCount = initialStaff.filter(m => m.status === 'on_duty').length;
  const avgPerformance = initialStaff.length > 0 
    ? Math.round(initialStaff.reduce((acc, m) => acc + (m.performance || 0), 0) / initialStaff.length)
    : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t('subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform self-start">
          <Plus className="w-4 h-4" />
          {t('addMember')}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, label: t('totalStaff'), value: initialStaff.length, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: ChefHat, label: t('onDutyNow'), value: onDutyCount, color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: Award, label: t('performance'), value: `${avgPerformance}%`, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
              <p className="text-2xl font-black">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('searchStaff')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl overflow-x-auto w-full md:w-auto">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeRole === role
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              {t(role as any)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 group hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{member.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${roleColors[member.role]}`}>
                    {t(member.role as any)}
                  </span>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  member.status === 'on_duty' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'on_duty' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                  {member.status === 'on_duty' ? t('onDuty') : t('offDuty')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <span className={`flex items-center gap-1 text-xs font-semibold ${shiftColors[member.shift]}`}>
                  {shiftEmoji[member.shift]} {t(member.shift as any)}
                </span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3 h-3 ${si < Math.round((member.performance || 0) / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-white/10'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold">{member.performance || 0}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
