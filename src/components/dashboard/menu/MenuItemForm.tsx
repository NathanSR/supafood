'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createMenuItem, updateMenuItem } from '@/app/actions/restaurant';
import { Loader2, X, Image as ImageIcon, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemFormProps {
  categories: any[];
  initialData?: any;
  onClose: () => void;
}

export function MenuItemForm({ categories, initialData, onClose }: MenuItemFormProps) {
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
        // Handle updates separately if they include image? 
        // For now, simplify and just do create or simple update
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? t('editItem') : t('addItem')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('name')}</label>
              <input 
                name="name"
                defaultValue={initialData?.name}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: Burger Bacon"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('category')}</label>
              <select 
                name="category_id"
                defaultValue={initialData?.category_id}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('description')}</label>
            <textarea 
              name="description"
              defaultValue={initialData?.description}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('price')}</label>
              <input 
                name="price"
                type="number"
                step="0.01"
                defaultValue={initialData?.price}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('prepTime') || 'Prep Time'}</label>
              <input 
                name="prep_time"
                type="number"
                defaultValue={initialData?.prep_time || 15}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('calories') || 'Calories'}</label>
              <input 
                name="calories"
                type="number"
                defaultValue={initialData?.calories || 0}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                name="is_popular"
                type="checkbox"
                defaultChecked={initialData?.is_popular}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{t('popular') || 'Popular'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                name="is_spicy"
                type="checkbox"
                defaultChecked={initialData?.is_spicy}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{t('spicy') || 'Spicy'}</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('image') || 'Image'}</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors cursor-pointer text-sm font-bold text-slate-500 hover:text-primary">
                  <Upload className="w-4 h-4" />
                  {t('uploadImage') || 'Upload Image'}
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
              {initialData ? t('saveChanges') : t('addItem')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
