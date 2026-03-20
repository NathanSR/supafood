'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createCategory } from '@/lib/actions/restaurant';
import { Loader2, X, Tag, FileText, Smile } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface CategoryFormProps {
  onClose: () => void;
  isOpen: boolean;
}

export function CategoryForm({ onClose, isOpen }: CategoryFormProps) {
  const t = useTranslations('Menu');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const emoji = formData.get('emoji') as string;

    startTransition(async () => {
      const result = await createCategory(name, slug, emoji);
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
      title={t('addCategory') || 'Adicionar Categoria'}
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
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('categoryName') || 'Nome da Categoria'}</label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="name"
              required
              placeholder="Ex: Hambúrgueres"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">Emoji (Opcional)</label>
          <div className="relative">
            <Smile className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              name="emoji"
              placeholder="Ex: 🍔"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm"
          >
            {t('cancel') || 'Cancelar'}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 text-sm"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {t('save') || 'Salvar Categoria'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
