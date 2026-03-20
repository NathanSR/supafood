'use client';

import React, { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { createMenuItem, updateMenuItem } from '@/lib/actions/menu';
import { Loader2, X, Image as ImageIcon, Upload, Check, Flame, Star, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema, type MenuItemInput } from '@/lib/validations/menu';

interface MenuItemFormProps {
  categories: any[];
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
}

export function MenuItemForm({ categories, initialData, onClose, isOpen }: MenuItemFormProps) {
  const t = useTranslations('Menu');
  const vt = useTranslations('Validation');
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: initialData?.name || '',
      category_id: initialData?.category_id || (categories.length > 0 ? categories[0].id : ''),
      description: initialData?.description || '',
      price: initialData?.price || 0,
      prep_time: initialData?.prep_time || 15,
      calories: initialData?.calories || 0,
      is_popular: initialData?.is_popular || false,
      is_spicy: initialData?.is_spicy || false,
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || '',
        category_id: initialData?.category_id || (categories.length > 0 ? categories[0].id : ''),
        description: initialData?.description || '',
        price: initialData?.price || 0,
        prep_time: initialData?.prep_time || 15,
        calories: initialData?.calories || 0,
        is_popular: initialData?.is_popular || false,
        is_spicy: initialData?.is_spicy || false,
      });
      setPreview(initialData?.image_url || null);
      setSelectedFile(null);
      setRemoveImage(false);
      setServerError(null);
    }
  }, [initialData, isOpen, reset, categories]);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setServerError(vt('fileTooLarge', { size: 2 }));
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setServerError(vt('invalidFileType', { types: 'JPG, PNG, WEBP' }));
      return;
    }
    setServerError(null);
    setSelectedFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [vt]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onSubmit = async (data: MenuItemInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category_id', data.category_id);
    if (data.description) formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('prep_time', data.prep_time.toString());
    formData.append('calories', data.calories.toString());
    formData.append('is_popular', data.is_popular ? 'on' : 'off');
    formData.append('is_spicy', data.is_spicy ? 'on' : 'off');

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateMenuItem(initialData.id, formData);
      } else {
        result = await createMenuItem(formData);
      }

      if (result?.error) {
        setServerError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('editItem') : t('addItem')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {serverError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <X className="w-4 h-4 shrink-0" />
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('itemName')}</label>
            <input
              {...register('name')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              placeholder="Ex: Classic Burger"
            />
            {errors.name && (
              <p className="text-red-500 text-xs ml-1">{vt(errors.name.message as any, { count: 3 })}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('category')}</label>
            <select
              {...register('category_id')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-xs ml-1">{vt(errors.category_id.message as any)}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('description')}</label>
          <textarea
            {...register('description')}
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
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-primary"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs ml-1">{vt(errors.price.message as any)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('prepTime')}</label>
            <input
              {...register('prep_time', { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('calories')}</label>
            <input
              {...register('calories', { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
        </div>

        {/* Toggle Badges - is_popular & is_spicy */}
        <div className="flex flex-wrap items-center gap-3 py-2">
          <Controller
            name="is_popular"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`
                  inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm
                  transition-all duration-200 ease-out select-none
                  ${field.value
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-300'
                  }
                `}
              >
                <span className={`
                  flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200
                  ${field.value
                    ? 'bg-amber-500 text-white scale-110'
                    : 'bg-slate-200 dark:bg-white/10'
                  }
                `}>
                  {field.value && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </span>
                <Star className={`w-4 h-4 transition-all duration-200 ${field.value ? 'fill-amber-500 text-amber-500' : ''}`} />
                {t('popular')}
              </button>
            )}
          />
          <Controller
            name="is_spicy"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`
                  inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm
                  transition-all duration-200 ease-out select-none
                  ${field.value
                    ? 'bg-red-500/15 text-red-600 dark:text-red-400 ring-2 ring-red-500/30 shadow-lg shadow-red-500/10'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-300'
                  }
                `}
              >
                <span className={`
                  flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200
                  ${field.value
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-slate-200 dark:bg-white/10'
                  }
                `}>
                  {field.value && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </span>
                <Flame className={`w-4 h-4 transition-all duration-200 ${field.value ? 'fill-red-500 text-red-500' : ''}`} />
                {t('spicy')}
              </button>
            )}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold ml-1 text-slate-500 dark:text-slate-400">{t('image')}</label>
            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t('removeImage')}
              </button>
            )}
          </div>
          <div
            className={`
              flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl border-2 border-dashed transition-all duration-200
              ${isDragging
                ? 'bg-primary/5 border-primary/50 scale-[1.01]'
                : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={`
              w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border transition-all duration-200
              ${preview
                ? 'border-slate-100 dark:border-white/10 shadow-lg'
                : 'border-dashed border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5'
              }
            `}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-300 dark:text-slate-600">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[10px] font-medium">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <label className={`
                flex flex-col items-center justify-center gap-2 w-full p-6 text-center rounded-2xl border-2 border-dashed transition-all cursor-pointer group
                ${isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-white/80 dark:hover:bg-white/5'
                }
              `}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isDragging
                    ? 'bg-primary/20 text-primary'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                  }
                `}>
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                  {t('uploadImage')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t('dragOrClick')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  JPG, PNG, WEBP • Max 2MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
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
            disabled={isPending || isSubmitting}
            className="flex-[2] px-6 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
          >
            {(isPending || isSubmitting) && <Loader2 className="w-5 h-5 animate-spin" />}
            {initialData ? t('saveChanges') : t('addItem')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
