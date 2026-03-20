'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createTable, updateTable } from '@/lib/actions/tables';
import { Loader2, X, Users, MapPin, Hash } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface TableFormProps {
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
}

const sections = ['Indoor', 'Outdoor', 'VIP', 'Bar', 'Terrace'];

export function TableForm({ initialData, onClose, isOpen }: TableFormProps) {
  const t = useTranslations('Tables');
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
        result = await updateTable(initialData.id, updates);
      } else {
        result = await createTable(formData);
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
      title={initialData ? t('editTable') || 'Editar Mesa' : t('addTable')}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('tableNumber')}</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="name"
              defaultValue={initialData?.name}
              required
              placeholder="Ex: T01"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('capacity')}</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="capacity"
              type="number"
              defaultValue={initialData?.capacity || 2}
              required
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('section')}</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              name="section"
              defaultValue={initialData?.section || 'Indoor'}
              required
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
            >
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
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
            {initialData ? t('saveChanges') || 'Salvar Alterações' : t('addTable')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
