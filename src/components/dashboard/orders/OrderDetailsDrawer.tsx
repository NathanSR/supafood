'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OrderDetailsDrawerProps {
  order: any;
  onClose: () => void;
  statusStyles: any;
  formatter: Intl.NumberFormat;
}

export function OrderDetailsDrawer({ order, onClose, statusStyles, formatter }: OrderDetailsDrawerProps) {
  const t = useTranslations('Orders');

  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-[120] flex items-center justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-card dark:bg-card shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-foreground">{t('orderDetails')}</h2>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[order.status]?.bg} ${statusStyles[order.status]?.text}`}>
                    {t(order.status)}
                  </span>
                </div>
                <h3 className="text-xl font-black text-foreground">#{order.orderNumber}</h3>
                <p className="font-bold text-slate-500 mt-1">{order.customer}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('items')}</h4>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {order.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm tracking-tight text-foreground">{item.menu_items?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">x{item.quantity}</p>
                      </div>
                      <span className="font-black text-sm text-foreground">{formatter.format(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-500">Subtotal</span>
                  <span className="font-bold text-foreground">{formatter.format(order.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <span className="text-lg font-black text-foreground">{t('totalAmount')}</span>
                  <span className="text-2xl font-black text-primary">{formatter.format(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
