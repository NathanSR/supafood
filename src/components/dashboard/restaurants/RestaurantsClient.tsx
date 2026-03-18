'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Plus, Star, MapPin, Mail, Phone, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRestaurant, updateRestaurant, deleteRestaurant, switchRestaurant } from '@/app/actions/restaurant';
import { useRouter } from '@/i18n/routing';

interface Restaurant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
  timezone?: string;
  language?: string;
  is_primary: boolean;
  created_at: string;
}

interface RestaurantsClientProps {
  restaurants: Restaurant[];
  activeRestaurantId?: string;
}

export function RestaurantsClient({ restaurants: initialRestaurants, activeRestaurantId }: RestaurantsClientProps) {
  const t = useTranslations('Restaurants');
  const gt = useTranslations('General');
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createRestaurant({ name: name.trim(), currency: 'BRL', timezone: 'America/Sao_Paulo', language: 'pt-BR' });
      if (!result.error) {
        setName('');
        setShowForm(false);
        router.refresh();
      }
    });
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    startTransition(async () => {
      const result = await updateRestaurant(id, { name: editName.trim() });
      if (!result.error) {
        setEditingId(null);
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string, restaurantName: string) => {
    if (!confirm(t('confirmDelete', { name: restaurantName }))) return;
    startTransition(async () => {
      const result = await deleteRestaurant(id);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleSwitch = (id: string) => {
    startTransition(async () => {
      await switchRestaurant(id);
      router.refresh();
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{t('title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#FF5F15] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#FF5F15]/20 hover:shadow-[#FF5F15]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('addRestaurant')}
        </motion.button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-white/5 p-5 shadow-sm">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-[#FF5F15]">
                <Plus className="w-4 h-4" />
                {t('newRestaurant')}
              </h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#FF5F15]/20 font-semibold transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={isPending || !name.trim()}
                  className="bg-[#FF5F15] text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all hover:bg-[#FF5F15]/90"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : gt('save')}
                </button>
                <button
                  onClick={() => { setShowForm(false); setName(''); }}
                  className="px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restaurant Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {initialRestaurants.map((restaurant) => {
          const isActive = activeRestaurantId === restaurant.id;
          const isEditing = editingId === restaurant.id;

          return (
            <motion.div
              key={restaurant.id}
              variants={itemVariants}
              layout
              className={`relative bg-white dark:bg-surface-dark rounded-2xl border-2 p-5 shadow-sm transition-all ${
                isActive
                  ? 'border-[#FF5F15] shadow-[#FF5F15]/10'
                  : 'border-slate-200 dark:border-white/5 hover:border-[#FF5F15]/30'
              }`}
            >
              {/* Active badge */}
              {isActive && (
                <div className="absolute -top-2.5 left-4 bg-[#FF5F15] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {t('active')}
                </div>
              )}

              {/* Primary badge */}
              {restaurant.is_primary && (
                <div className="absolute top-3 right-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
              )}

              <div className="space-y-3 mt-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-[#FF5F15]/30"
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(restaurant.id)}
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(restaurant.id)} className="text-green-500 hover:text-green-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-base font-black flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF5F15]" />
                    {restaurant.name}
                  </h3>
                )}

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {restaurant.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{restaurant.email}</span>
                    </div>
                  )}
                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{restaurant.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  {!isActive && (
                    <button
                      onClick={() => handleSwitch(restaurant.id)}
                      disabled={isPending}
                      className="flex-1 text-xs font-bold text-[#FF5F15] bg-[#FF5F15]/5 hover:bg-[#FF5F15]/10 px-3 py-2 rounded-lg transition-all"
                    >
                      {t('switchTo')}
                    </button>
                  )}
                  <button
                    onClick={() => { setEditingId(restaurant.id); setEditName(restaurant.name); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                    title={gt('edit')}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {!restaurant.is_primary && (
                    <button
                      onClick={() => handleDelete(restaurant.id, restaurant.name)}
                      disabled={isPending}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      title={gt('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {initialRestaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-slate-400"
        >
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm font-bold">{t('noRestaurants')}</p>
        </motion.div>
      )}
    </div>
  );
}
