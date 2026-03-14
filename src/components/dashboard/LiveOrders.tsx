'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Order } from '@/types/restaurant';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

// Helper for Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statusConfig: Record<string, any> = {
  'pending': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    container: 'bg-blue-500/20 text-blue-500',
    key: 'pending'
  },
  'preparing': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    container: 'bg-primary/20 text-primary',
    key: 'preparing'
  },
  'ready': {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    container: 'bg-green-500/20 text-green-500',
    key: 'ready'
  },
  'delivered': {
    bg: 'bg-slate-500/10',
    text: 'text-slate-500',
    container: 'bg-slate-500/20 text-slate-500',
    key: 'delivered'
  },
  'cancelled': {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    container: 'bg-red-500/20 text-red-500',
    key: 'cancelled'
  },
  'default': {
    bg: 'bg-slate-500/10',
    text: 'text-slate-500',
    container: 'bg-slate-500/20 text-slate-500',
    key: 'pending'
  }
};

export function LiveOrders({ orders }: { orders: Order[] }) {
  const t = useTranslations('Dashboard');
  const g = useTranslations('General');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass rounded-xl flex flex-col h-[500px]"
    >
      <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{t('liveOrders')}</h3>
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </div>
        <Link href="/orders" className="text-primary text-sm font-bold hover:underline">{t('viewAll')}</Link>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {orders.map((order, i) => {
            const config = statusConfig[order.status] || statusConfig.default;
            // Format order summary
            const primaryItem = order.items?.[0] || { name: 'Order', quantity: 0 };
            const hasMore = order.items?.length > 1;
            
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold", config.container)}>
                    #{order.orderNumber}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {primaryItem.name} 
                      <span className="text-slate-500 font-normal ml-1">x{primaryItem.quantity}</span>
                      {hasMore && <span className="text-slate-500 text-xs ml-1">+{order.items.length - 1} more</span>}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {order.source} {order.tableNumber ? `• ${g('table')} ${order.tableNumber} ` : ''}• {g('minsAgo', { mins: order.timeAgoInMins })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap", 
                    config.bg, 
                    config.text
                  )}>
                    {t(config.key as any)}
                  </span>
                  <Link href={`/orders?orderId=${order.id}`} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5 pointer-events-none" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
