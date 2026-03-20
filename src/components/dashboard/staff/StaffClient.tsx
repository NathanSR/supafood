'use client';

import React, { useState, useEffect, useTransition } from 'react';
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
  Edit2,
  Trash2,
  ChevronRight,
  Loader2,
  Filter
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StaffForm } from './StaffForm';
import { StaffDetailsDrawer } from './StaffDetailsDrawer';
import { deleteStaffMember } from '@/lib/actions/staff';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

interface StaffClientProps {
  initialStaff: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const roles = ['all', 'chef', 'cook', 'waiter', 'cashier', 'manager', 'cleaner'];

const roleColors: Record<string, string> = {
  chef: 'bg-primary/10 text-primary border-primary/20',
  cook: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  waiter: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cashier: 'bg-green-500/10 text-green-600 border-green-500/20',
  manager: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cleaner: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const shiftColors: Record<string, string> = {
  morning: 'text-amber-500 bg-amber-500/10',
  afternoon: 'text-blue-500 bg-blue-500/10',
  evening: 'text-purple-500 bg-purple-500/10',
  night: 'text-indigo-400 bg-indigo-400/10',
};

const shiftEmoji: Record<string, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
};

export function StaffClient({ initialStaff, totalCount, totalPages, currentPage, pageSize }: StaffClientProps) {
  const t = useTranslations('Staff');
  const g = useTranslations('General');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [viewingMember, setViewingMember] = useState<any>(null);

  const activeRole = searchParams.get('role') || 'all';
  const query = searchParams.get('query') || '';
  const [localSearch, setLocalSearch] = useState(query);

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    return newParams.toString();
  };

  const handleSearch = (val: string) => {
    router.push(`${pathname}?${createQueryString({ query: val || null, page: '1' })}`);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== query) {
        handleSearch(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Sync local search when query param changes externally
  useEffect(() => {
    setLocalSearch(query);
  }, [query]);

  const handleRoleChange = (role: string) => {
    router.push(`${pathname}?${createQueryString({ role: role === 'all' ? null : role, page: '1' })}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page: page.toString() })}`);
  };

  const handleDelete = async (member: any) => {
    if (confirm(t('confirmDelete', { name: member.name }) || `Deseja realmente remover ${member.name}?`)) {
      startTransition(async () => {
        await deleteStaffMember(member.id);
        router.refresh();
      });
    }
  };

  const onDutyCount = initialStaff.filter(m => m.status === 'on_duty').length;
  const avgPerformance = initialStaff.length > 0
    ? Math.round(initialStaff.reduce((acc, m) => acc + (m.performance || 0), 0) / initialStaff.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          {t('addMember')}
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, label: t('totalStaff'), value: totalCount, color: 'text-primary', bg: 'bg-primary/10', trend: '+2 this month' },
          { icon: ChefHat, label: t('onDutyNow'), value: onDutyCount, color: 'text-green-500', bg: 'bg-green-500/10', trend: '95% capacity' },
          { icon: Award, label: t('performance'), value: `${avgPerformance}%`, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'Top 5% region' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white dark:bg-white/5 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <card.icon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.trend}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="text-3xl font-black tracking-tight mt-1">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm"
      >
        <div className="relative flex-1 w-full lg:min-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchStaff')}
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeRole === role
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
            >
              {t(role as any)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {initialStaff.map((member, i) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ delay: i * 0.04 }}
              className="group bg-white dark:bg-white/5 rounded-[32px] p-2 flex flex-col border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative"
            >
              {/* Overlay for actions on hover */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMember(member);
                    setIsModalOpen(true);
                  }}
                  className="w-9 h-9 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-primary hover:text-white transition-all transform hover:rotate-6"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(member);
                  }}
                  className="w-9 h-9 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-all transform hover:-rotate-6"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => setViewingMember(member)}
              >
                <div className="relative p-4 pb-0">
                  <div className="aspect-[4/3] rounded-[24px] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-5xl overflow-hidden mb-4 relative">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">👤</span>
                    )}

                    <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest ${member.status === 'on_duty'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-slate-400/20 text-slate-400'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'on_duty' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                      {member.status === 'on_duty' ? t('onDuty') : t('offDuty')}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 truncate">
                      {member.name}
                    </h3>
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg inline-block border mt-2 uppercase tracking-wider ${roleColors[member.role]}`}>
                      {t(member.role as any)}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${shiftColors[member.shift]}`}>
                      <span>{shiftEmoji[member.shift]}</span>
                      <span className="uppercase tracking-widest">{t(member.shift as any)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= Math.ceil((member.performance || 0) / 33) ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/10'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-black text-slate-900 dark:text-white">{member.performance || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="bg-white dark:bg-white/5 px-8 py-5 rounded-[24px] border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            {t('page', { current: currentPage, total: totalPages })}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {g('previous')}
            </button>
            <button
              disabled={currentPage >= totalPages || isPending}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {g('next')}
            </button>
          </div>
        </div>
      )}

      {initialStaff.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-4xl grayscale">👤</div>
          <div className="space-y-1">
            <p className="text-xl font-black text-slate-400 tracking-tight">{t('noStaff') || 'Nenhum colaborador encontrado'}</p>
            <p className="text-sm text-slate-500">{t('tryAdjustFilters') || 'Tente ajustar seus filtros ou busca.'}</p>
          </div>
        </motion.div>
      )}

      <StaffForm
        isOpen={isModalOpen}
        initialData={editingMember}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
      />

      <StaffDetailsDrawer
        member={viewingMember}
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        onEdit={(member) => {
          setEditingMember(member);
          setIsModalOpen(true);
          setViewingMember(null);
        }}
        onDelete={(member) => {
          handleDelete(member);
          setViewingMember(null);
        }}
      />

      {isPending && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[130] flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 border border-slate-100 dark:border-white/5">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-500">{g('loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
