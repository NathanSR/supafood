'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createMenuItem, updateMenuItem } from '@/app/actions/restaurant';
import { Loader2, X, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface MenuItemFormProps {
  categories: any[];
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
}

export function MenuItemForm({ categories, initialData, onClose, isOpen }: MenuItemFormProps) {
  const t = useTranslations('Menu');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        const entries = Object.fromEntries(formData.entries());
        const updates: any = { ...entries };
        updates.is_popular = formData.get('is_popular') === 'on';
        updates.is_spicy = formData.get('is_spicy') === 'on';
        delete updates.image;
        
        result = await updateMenuItem(initialData.id, updates);
      } else {
        result = await createMenuItem(formData);
      }

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? t('editItem') : t('addItem')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('itemName')}</label>
            <input 
              name="name"
              defaultValue={initialData?.name}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              placeholder="Ex: Classic Burger"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('category')}</label>
            <select 
              name="category_id"
              defaultValue={initialData?.category_id}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('description')}</label>
          <textarea 
            name="description"
            defaultValue={initialData?.description}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
            placeholder="..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('price')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                name="price"
                type="number"
                step="0.01"
                defaultValue={initialData?.price}
                required
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-primary"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('prepTime')}</label>
            <input 
              name="prep_time"
              type="number"
              defaultValue={initialData?.prep_time || 15}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('calories')}</label>
            <input 
              name="calories"
              type="number"
              defaultValue={initialData?.calories || 0}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 py-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                name="is_popular"
                type="checkbox"
                defaultChecked={initialData?.is_popular}
                className="peer w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none appearance-none cursor-pointer checked:bg-primary transition-all"
              />
              <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{t('popular')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
             <div className="relative flex items-center justify-center">
              <input 
                name="is_spicy"
                type="checkbox"
                defaultChecked={initialData?.is_spicy}
                className="peer w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 border-none outline-none appearance-none cursor-pointer checked:bg-primary transition-all"
              />
              <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{t('spicy')}</span>
          </label>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('image')}</label>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-slate-100 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-white/5 shadow-inner flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="flex-1 w-full">
              <label className="flex flex-col items-center justify-center gap-2 w-full p-6 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-primary">{t('uploadImage')}</span>
                <span className="text-[10px] text-slate-400">JPG, PNG or WEBP. Max 2MB.</span>
                <input 
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            disabled={isPending}
            className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {initialData ? t('saveChanges') : t('addItem')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
