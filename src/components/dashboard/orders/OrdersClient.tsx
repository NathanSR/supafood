'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  Clock,
  Tablet,
  ShoppingBag,
  Utensils,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { updateOrderStatus } from '@/app/actions/restaurant';
import { OrderForm } from './OrderForm';

type OrderStatus = 'all' | 'pending' | 'inPrep' | 'ready' | 'delivered' | 'cancelled';
type OrderSource = 'Tablet' | 'Takeaway' | 'Dine-in';

interface OrdersClientProps {
  initialOrders: any[];
  tables: any[];
  menuItems: any[];
}

const statusStyles: Record<Exclude<OrderStatus, 'all'>, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  pending: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'pending', icon: Clock },
  inPrep: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'inPrep', icon: Timer },
  ready: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'ready', icon: CheckCircle2 },
  delivered: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'delivered', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'cancelled', icon: XCircle },
};

const sourceIcons: Record<string, React.ElementType> = {
  'Tablet': Tablet,
  'Takeaway': ShoppingBag,
  'Dine-in': Utensils,
};

const tabs: OrderStatus[] = ['all', 'pending', 'inPrep', 'ready', 'delivered', 'cancelled'];

export function OrdersClient({ initialOrders, tables, menuItems }: OrdersClientProps) {
  const t = useTranslations('Orders');
  const g = useTranslations('General');
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = initialOrders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.orderNumber.includes(search) || 
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((i: string) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const tabCounts: Record<string, number> = {
    all: initialOrders.length,
    pending: initialOrders.filter(o => o.status === 'pending').length,
    inPrep: initialOrders.filter(o => o.status === 'inPrep').length,
    ready: initialOrders.filter(o => o.status === 'ready').length,
    delivered: initialOrders.filter(o => o.status === 'delivered').length,
    cancelled: initialOrders.filter(o => o.status === 'cancelled').length,
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    startTransition(async () => {
      await updateOrderStatus(id, status);
    });
  };

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{g('refresh')}</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" />
            {t('newOrder')}
          </button>
        </div>
      </motion.div>

      {/* ... previous code ... */}

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('orderNumber')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        {/* ... */}
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {t(tab as any)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
            }`}>
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Row List */}
      <div className="glass rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-semibold">{g('noResults')}</div>
        ) : filtered.map((order, i) => {
           const style = statusStyles[order.status as Exclude<OrderStatus, 'all'>] || statusStyles.pending;
           const StatusIcon = style.icon;
           const SourceIcon = sourceIcons[order.source] || Utensils;
           return (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_120px_100px_140px_48px] gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center font-black text-sm text-slate-700 dark:text-slate-200">#{order.orderNumber}</div>
              <div className="flex items-center">
                <div>
                  <p className="font-bold text-sm">{order.customer}</p>
                  <p className="text-[10px] text-slate-400">{order.timeAgoInMins} min</p>
                </div>
              </div>
              <div className="flex items-center text-sm truncate">{order.items.join(', ')}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <SourceIcon className="w-4 h-4" />
                {order.source}
              </div>
              <div className="flex items-center font-bold">{formatter.format(order.total)}</div>
              <div className="flex items-center">
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold outline-none cursor-pointer ${style.bg} ${style.text}`}
                >
                  {Object.entries(statusStyles).map(([key, cfg]) => (
                    <option key={key} value={key}>{t(cfg.label as any)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end">
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </motion.div>
           )
        })}
      </div>

      {isModalOpen && (
        <OrderForm 
          tables={tables}
          menuItems={menuItems}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
