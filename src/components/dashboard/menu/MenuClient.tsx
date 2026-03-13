'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ToggleLeft,
  ToggleRight,
  Star,
  Clock,
  Flame,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { deleteMenuItem, updateMenuItem, createCategory } from '@/app/actions/restaurant';
import { MenuItemForm } from './MenuItemForm';

interface MenuClientProps {
  initialCategories: any[];
  initialItems: any[];
}

export function MenuClient({ initialCategories, initialItems }: MenuClientProps) {
  const t = useTranslations('Menu');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filtered = initialItems.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleAvailability = async (id: string, current: boolean) => {
    startTransition(async () => {
      await updateMenuItem(id, { is_available: !current });
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      startTransition(async () => {
        await deleteMenuItem(id);
      });
    }
  };

  const handleAddCategory = async () => {
    const name = prompt('Category name:');
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      startTransition(async () => {
        await createCategory(name, slug);
      });
    }
  };

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const categoryCounts: Record<string, number> = {
    all: initialItems.length,
    ...initialCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: initialItems.filter(i => i.category_id === cat.id).length
    }), {})
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:border-primary/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('addCategory')}
          </button>
          <button 
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            {t('addItem')}
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative max-w-sm"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('searchItem')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-primary/50'
          }`}
        >
          {t('all')}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeCategory === 'all' ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
          }`}>
            {categoryCounts['all']}
          </span>
        </button>
        {initialCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-primary/50'
            }`}
          >
            {cat.name}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
            }`}>
              {categoryCounts[cat.id] || 0}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {isPending && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className={`glass rounded-2xl p-5 flex flex-col gap-4 group transition-all hover:shadow-lg ${!item.is_available ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                      {item.is_popular && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Flame className="w-3 h-3 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block bg-primary/10 text-primary">
                      {item.menu_categories?.name}
                    </span>
                  </div>
                </div>
                <span className="font-black text-primary text-lg whitespace-nowrap">
                  {formatter.format(item.price)}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.prep_time} {t('mins')}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {item.calories} kcal
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => handleToggleAvailability(item.id, item.is_available)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    item.is_available ? 'text-green-500' : 'text-slate-400'
                  }`}
                >
                  {item.is_available 
                    ? <ToggleRight className="w-5 h-5" /> 
                    : <ToggleLeft className="w-5 h-5" />
                  }
                  {item.is_available ? t('available') : t('unavailable')}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                     onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <MenuItemForm 
          categories={initialCategories}
          initialData={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-slate-400"
        >
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-semibold">{t('noItems')}</p>
        </motion.div>
      )}
    </div>
  );
}
