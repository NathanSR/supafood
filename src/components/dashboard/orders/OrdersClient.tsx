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
  Loader2,
  Calendar,
  Wallet,
  PlusCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { updateOrderStatus } from '@/app/actions/restaurant';
import { OrderForm } from './OrderForm';
import { OrderDetailsDrawer } from './OrderDetailsDrawer';

type OrderStatus = 'all' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface OrdersClientProps {
  initialOrders: any[];
  tables: any[];
  menuItems: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  tabCounts: Record<string, number>;
}

const statusStyles: Record<Exclude<OrderStatus, 'all'>, { bg: string; border: string; text: string; label: string; icon: React.ElementType }> = {
  pending: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', label: 'pending', icon: Clock },
  preparing: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', label: 'preparing', icon: Timer },
  ready: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', label: 'ready', icon: CheckCircle2 },
  delivered: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', label: 'delivered', icon: CheckCircle2 },
  cancelled: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', label: 'cancelled', icon: XCircle },
};

const sourceIcons: Record<string, React.ElementType> = {
  'Tablet': Tablet,
  'takeaway': ShoppingBag,
  'dine-in': Utensils,
};

const tabs: OrderStatus[] = ['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'];

export function OrdersClient({ initialOrders, tables, menuItems, totalCount, currentPage, pageSize, tabCounts }: OrdersClientProps) {
  const t = useTranslations('Orders');
  const g = useTranslations('General');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const activeTab = (searchParams.get('status') as OrderStatus) || 'all';
  const query = searchParams.get('query') || '';
  const [localSearch, setLocalSearch] = useState(query);

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    return newParams.toString();
  };

  const handleSearch = (val: string) => {
    router.push(`${pathname}?${createQueryString({ query: val || null, page: '1' })}`);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== query) {
        handleSearch(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Sync local search when query param changes externally (e.g. back button)
  React.useEffect(() => {
    setLocalSearch(query);
  }, [query]);

  // Handle orderId from URL to open drawer
  const orderIdFromUrl = searchParams.get('orderId');
  React.useEffect(() => {
    if (orderIdFromUrl && initialOrders.length > 0) {
      const order = initialOrders.find(o => o.id === orderIdFromUrl);
      if (order) {
        setViewingOrder(order);
      }
    }
  }, [orderIdFromUrl, initialOrders]);

  const handleTabChange = (status: OrderStatus) => {
    router.push(`${pathname}?${createQueryString({ status: status === 'all' ? null : status, page: '1' })}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page: page.toString() })}`);
  };

  const handleReload = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    startTransition(async () => {
      await updateOrderStatus(id, status);
      router.refresh();
    });
  };

  const handleAddItems = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatter = React.useMemo(() => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }), []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
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
            onClick={handleReload}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm hover:border-primary/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('reload')}</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            {t('newOrder')}
          </button>
        </div>
      </motion.div>

      {/* Stats Quick View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {tabs.filter(tab => tab !== 'all').map((tab, i) => {
          const style = statusStyles[tab as Exclude<OrderStatus, 'all'>];
          const Icon = style.icon;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-2 ${
                activeTab === tab 
                  ? `${style.bg} ${style.border.replace('/20', '/50')} shadow-lg shadow-black/[0.02]` 
                  : 'bg-white dark:bg-white/5 border-transparent hover:border-slate-100 dark:hover:border-white/5'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black leading-none">{tabCounts[tab]}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t(tab as any)}</p>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchHint')}
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            {t('all')} ({tabCounts.all})
          </button>
          
          <div className="h-6 w-px bg-slate-100 dark:bg-white/10 mx-2 hidden lg:block" />
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 transition-all">
            <Calendar className="w-4 h-4" />
            {t('today')}
          </button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-white/5 rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="hidden lg:grid grid-cols-[100px_1fr_180px_150px_160px_60px] gap-6 px-8 py-5 border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{t('orderNumber')}</span>
          <span>{t('customer')} / {t('items')}</span>
          <span>Origem / Tempo</span>
          <span>Status</span>
          <span>Valor Total</span>
          <span className="text-right">Ações</span>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-white/5">
          {initialOrders.length === 0 ? (
            <div className="text-center py-40 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-5xl grayscale opacity-30">📦</div>
              <p className="text-xl font-black text-slate-400 tracking-tight">{g('noResults')}</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {initialOrders.map((order, i) => {
                const style = statusStyles[order.status as Exclude<OrderStatus, 'all'>] || statusStyles.pending;
                const StatusIcon = style.icon;
                const SourceIcon = sourceIcons[order.type] || Utensils;
                return (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.02 }}
                    className="grid grid-cols-1 lg:grid-cols-[100px_1fr_180px_160px_160px_60px] gap-4 lg:gap-6 px-8 py-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group items-center"
                  >
                    <div className="flex items-center font-black text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">{order.customer}</p>
                      <p className="text-[11px] text-slate-500 truncate font-medium">
                        {order.items.join(', ')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <SourceIcon className="w-3.5 h-3.5 text-primary" />
                        {order.type === 'dine-in' ? `Mesa ${order.tables?.name || '?'}` : 'Para Viagem'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Clock className="w-3 h-3" />
                        Há {order.timeAgoInMins} min
                      </div>
                    </div>

                    <div>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-2 transition-all ${style.bg} ${style.text} ${style.bg.replace('/10', '/30')}`}
                      >
                        {tabs.filter(tab => tab !== 'all').map(tab => (
                          <option key={tab} value={tab}>{t(tab as any)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="font-black text-lg text-slate-900 dark:text-white leading-none">
                        {formatter.format(order.total_amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAddItems(order)}
                        title="Adicionar Itens"
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center border border-transparent hover:border-slate-100 dark:hover:border-white/10"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-300 hover:text-primary hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center border border-transparent hover:border-slate-100 dark:hover:border-white/10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="px-8 py-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              {t('page', { current: currentPage, total: Math.ceil(totalCount / pageSize) })}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 transition-all"
              >
                {g('previous')}
              </button>
              <button
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 transition-all"
              >
                {g('next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsDrawer 
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        statusStyles={statusStyles}
        formatter={formatter}
        onEdit={(order) => {
          handleAddItems(order);
          setViewingOrder(null);
        }}
        onUpdateStatus={(id, status) => {
          handleUpdateStatus(id, status);
          setViewingOrder(null);
        }}
      />

      <OrderForm 
        isOpen={isModalOpen}
        tables={tables}
        menuItems={menuItems}
        initialOrder={selectedOrder}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      {isPending && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[110] flex items-center justify-center">
          <div className="bg-background dark:bg-background p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 border border-slate-100 dark:border-white/5">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-500">Atualizando Status...</p>
          </div>
        </div>
      )}
    </div>
  );
}
