'use client';

import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Category = 'all' | 'starters' | 'mainCourse' | 'sides' | 'drinks' | 'desserts';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'all'>;
  available: boolean;
  popular: boolean;
  calories: number;
  prepTimeMin: number;
  emoji: string;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Truffle Burger Clássico', description: 'Burger premium com cogumelos trufados, queijo gouda e aioli de alho negro', price: 45.90, category: 'mainCourse', available: true, popular: true, calories: 820, prepTimeMin: 18, emoji: '🍔' },
  { id: '2', name: 'Ramen Picante Supremo', description: 'Caldo de tonkotsu rico com macarrão fresco, ovo marinado e chashu de porco', price: 39.90, category: 'mainCourse', available: true, popular: true, calories: 650, prepTimeMin: 15, emoji: '🍜' },
  { id: '3', name: 'Salmão Grelhado', description: 'Filé de salmão com legumes assados e molho de ervas frescas', price: 58.00, category: 'mainCourse', available: true, popular: false, calories: 480, prepTimeMin: 20, emoji: '🐟' },
  { id: '4', name: 'Bruschetta Italiana', description: 'Pão artesanal com tomates frescos, manjericão e azeite extravirgem', price: 24.90, category: 'starters', available: true, popular: false, calories: 280, prepTimeMin: 8, emoji: '🍞' },
  { id: '5', name: 'Carpaccio de Carne', description: 'Finas fatias de filé cru, alcaparras e lascas de parmesão', price: 38.00, category: 'starters', available: true, popular: true, calories: 320, prepTimeMin: 10, emoji: '🥩' },
  { id: '6', name: 'Batata Rústica', description: 'Batatas rústicas temperadas com alecrim e alho, crocantes por fora', price: 18.90, category: 'sides', available: true, popular: false, calories: 380, prepTimeMin: 12, emoji: '🥔' },
  { id: '7', name: 'Salada Caesar', description: 'Alface americana, croutons, parmesão e molho caesar original', price: 28.00, category: 'sides', available: false, popular: false, calories: 290, prepTimeMin: 5, emoji: '🥗' },
  { id: '8', name: 'Limonada Siciliana', description: 'Limão siciliano, leite condensado, gelo e hortelã fresca', price: 14.90, category: 'drinks', available: true, popular: true, calories: 180, prepTimeMin: 3, emoji: '🍋' },
  { id: '9', name: 'Smoothie Tropical', description: 'Manga, abacaxi, maracujá e gengibre fresco batidos no whey de coco', price: 19.90, category: 'drinks', available: true, popular: false, calories: 210, prepTimeMin: 5, emoji: '🥤' },
  { id: '10', name: 'Petit Gâteau', description: 'Bolo de chocolate com interior cremoso, sorvete de baunilha e calda', price: 26.00, category: 'desserts', available: true, popular: true, calories: 520, prepTimeMin: 12, emoji: '🍫' },
];

const categories: Category[] = ['all', 'starters', 'mainCourse', 'sides', 'drinks', 'desserts'];

const categoryColors: Record<Exclude<Category, 'all'>, string> = {
  starters: 'bg-amber-500/10 text-amber-500',
  mainCourse: 'bg-primary/10 text-primary',
  sides: 'bg-green-500/10 text-green-600',
  drinks: 'bg-blue-500/10 text-blue-500',
  desserts: 'bg-pink-500/10 text-pink-500',
};

export default function MenuPage() {
  const t = useTranslations('Menu');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(menuItems);

  const filtered = items.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const categoryCounts: Record<Category, number> = {
    all: items.length,
    starters: items.filter(i => i.category === 'starters').length,
    mainCourse: items.filter(i => i.category === 'mainCourse').length,
    sides: items.filter(i => i.category === 'sides').length,
    drinks: items.filter(i => i.category === 'drinks').length,
    desserts: items.filter(i => i.category === 'desserts').length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:border-primary/50 transition-all">
            <Plus className="w-4 h-4" />
            {t('addCategory')}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
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
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-primary/50'
            }`}
          >
            {t(cat as any)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === cat ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
            }`}>
              {categoryCounts[cat]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className={`glass rounded-2xl p-5 flex flex-col gap-4 group transition-all hover:shadow-lg ${!item.available ? 'opacity-60' : ''}`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                      {item.popular && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Flame className="w-3 h-3 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                      categoryColors[item.category]
                    }`}>
                      {t(item.category as any)}
                    </span>
                  </div>
                </div>
                <span className="font-black text-primary text-lg whitespace-nowrap">
                  {formatter.format(item.price)}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.prepTimeMin} {t('mins')}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {item.calories} kcal
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    item.available ? 'text-green-500' : 'text-slate-400'
                  }`}
                >
                  {item.available 
                    ? <ToggleRight className="w-5 h-5" /> 
                    : <ToggleLeft className="w-5 h-5" />
                  }
                  {item.available ? t('available') : t('unavailable')}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
