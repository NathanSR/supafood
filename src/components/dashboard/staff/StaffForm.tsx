'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createStaffMember, updateStaffMember } from '@/lib/actions/staff';
import { Loader2, X, User, Mail, Phone, Briefcase, Clock as ClockIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface StaffFormProps {
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
}

const roles = ['chef', 'cook', 'waiter', 'cashier', 'manager', 'cleaner'];
const shifts = ['morning', 'afternoon', 'evening', 'night'];

export function StaffForm({ initialData, onClose, isOpen }: StaffFormProps) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('editMember') || 'Editar Membro' : t('addMember')}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('name')}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="name"
              defaultValue={initialData?.name}
              required
              placeholder="Ex: João Silva"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                name="email"
                type="email"
                defaultValue={initialData?.email}
                required
                placeholder="email@exemplo.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                name="phone"
                defaultValue={initialData?.phone}
                required
                placeholder="(00) 00000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('role')}</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                name="role"
                defaultValue={initialData?.role}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
              >
                {roles.map(role => (
                  <option key={role} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t(role as any)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('shift')}</label>
            <div className="relative">
              <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                name="shift"
                defaultValue={initialData?.shift}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
              >
                {shifts.map(shift => (
                  <option key={shift} value={shift} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t(shift as any)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 text-sm"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {initialData ? t('saveChanges') || 'Salvar Alterações' : t('addMember')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
