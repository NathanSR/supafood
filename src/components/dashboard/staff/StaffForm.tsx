'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createStaffMember, updateStaffMember } from '@/app/actions/restaurant';
import { Loader2, X, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface StaffFormProps {
  initialData?: any;
  onClose: () => void;
}

const roles = ['chef', 'cook', 'waiter', 'cashier', 'manager', 'cleaner'];
const shifts = ['morning', 'afternoon', 'evening', 'night'];

export function StaffForm({ initialData, onClose }: StaffFormProps) {
  const t = useTranslations('Staff');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        const updates = Object.fromEntries(formData.entries());
        result = await updateStaffMember(initialData.id, updates);
      } else {
        result = await createStaffMember(formData);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? t('editMember') || 'Edit Member' : t('addMember')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('name')}</label>
            <input 
              name="name"
              defaultValue={initialData?.name}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('email')}</label>
              <input 
                name="email"
                type="email"
                defaultValue={initialData?.email}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('phone') || 'Phone'}</label>
              <input 
                name="phone"
                defaultValue={initialData?.phone}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('role') || 'Role'}</label>
              <select 
                name="role"
                defaultValue={initialData?.role}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{t(role as any)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('shift') || 'Shift'}</label>
              <select 
                name="shift"
                defaultValue={initialData?.shift}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              >
                {shifts.map(shift => (
                  <option key={shift} value={shift}>{t(shift as any)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="flex-[2] px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? t('saveChanges') || 'Save Changes' : t('addMember')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
