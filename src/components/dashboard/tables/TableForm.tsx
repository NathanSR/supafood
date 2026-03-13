'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createTable, updateTable } from '@/app/actions/restaurant';
import { Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableFormProps {
  initialData?: any;
  onClose: () => void;
}

const sections = ['Indoor', 'Outdoor', 'VIP', 'Bar', 'Terrace'];

export function TableForm({ initialData, onClose }: TableFormProps) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? t('editTable') || 'Edit Table' : t('addTable')}</h2>
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
            <label className="text-sm font-semibold">{t('name') || 'Table Name'}</label>
            <input 
              name="name"
              defaultValue={initialData?.name}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: T01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('capacity') || 'Capacity'}</label>
            <input 
              name="capacity"
              type="number"
              defaultValue={initialData?.capacity || 2}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('section') || 'Section'}</label>
            <select 
              name="section"
              defaultValue={initialData?.section}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
            >
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
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
              {initialData ? t('saveChanges') || 'Save Changes' : t('addTable')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
