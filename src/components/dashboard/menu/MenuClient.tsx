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
  Loader2,
  Filter
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { deleteMenuItem, updateMenuItem } from '@/app/actions/restaurant';
import { MenuItemForm } from './MenuItemForm';
import { CategoryForm } from './CategoryForm';

interface MenuClientProps {
  initialCategories: any[];
  initialItems: any[];
}

export function MenuClient({ initialCategories, initialItems }: MenuClientProps) {
  const t = useTranslations('Menu');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
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

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const categoryCounts: Record<string, number> = {
    all: initialItems.length,
    ...initialCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: initialItems.filter(i => i.category_id === cat.id).length
    }), {})
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:border-primary/50 hover:text-primary transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t('addCategory')}
          </button>
          <button 
            onClick={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('addItem')}
          </button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchItem')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
           <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            {t('all')}
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
            }`}>
              {categoryCounts['all']}
            </span>
          </button>
          {initialCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span className="text-base">{cat.emoji || '🍽️'}</span>
              {cat.name}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
              }`}>
                {categoryCounts[cat.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {isPending && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[110] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Atualizando Cardápio...</p>
            </div>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className={`group bg-white dark:bg-white/5 rounded-[32px] p-2 flex flex-col border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ${!item.is_available ? 'grayscale opacity-60' : ''}`}
            >
              <div className="relative aspect-square rounded-[26px] overflow-hidden bg-slate-100 dark:bg-white/5 mb-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                )}
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                  <button 
                     onClick={() => {
                        setEditingItem(item);
                        setIsItemModalOpen(true);
                      }}
                    className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-primary hover:text-white transition-all transform hover:rotate-12"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-all transform hover:-rotate-12"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {item.menu_categories?.name}
                    </span>
                  </div>
                  {item.is_popular && (
                    <div className="bg-amber-500 shadow-lg shadow-amber-500/50 p-2 rounded-xl">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 truncate">
                    {item.name}
                  </h3>
                  <span className="font-black text-primary text-lg">
                    {formatter.format(item.price)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <Clock className="w-3 h-3 text-primary" />
                    {item.prep_time} {t('mins')}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {item.calories} KCAL
                  </span>
                </div>

                <button
                  onClick={() => handleToggleAvailability(item.id, item.is_available)}
                  className={`w-full mt-2 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all border ${
                    item.is_available 
                      ? 'bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-200'
                  }`}
                >
                  {item.is_available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  {item.is_available ? t('available') : t('unavailable')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <MenuItemForm 
        isOpen={isItemModalOpen}
        categories={initialCategories}
        initialData={editingItem}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
      />

      <CategoryForm 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-4xl grayscale">🍽️</div>
          <div className="space-y-1">
            <p className="text-xl font-black text-slate-400 tracking-tight">{t('noItems')}</p>
            <p className="text-sm text-slate-500">Tente ajustar seus filtros ou busca.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
