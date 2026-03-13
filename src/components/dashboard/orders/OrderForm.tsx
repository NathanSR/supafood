'use client';

import React, { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createOrder } from '@/app/actions/restaurant';
import { Loader2, X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderFormProps {
  tables: any[];
  menuItems: any[];
  onClose: () => void;
}

export function OrderForm({ tables, menuItems, onClose }: OrderFormProps) {
  const t = useTranslations('Orders');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [tableId, setTableId] = useState<string>('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');

  const addItem = (item: any) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === id);
      if (exists?.quantity === 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const deleteItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const total = selectedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError('Select at least one item');
      return;
    }
    if (orderType === 'dine-in' && !tableId) {
      setError('Select a table');
      return;
    }

    startTransition(async () => {
      const orderData = {
        table_id: orderType === 'dine-in' ? tableId : null,
        status: 'pending',
        type: orderType,
        total_amount: total,
        items: selectedItems.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
      };

      const result = await createOrder(orderData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left: Menu Items Selection */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100 dark:border-white/5">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              {t('newOrder') || 'New Order'}
            </h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => addItem(item)}
                className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-left hover:ring-2 hover:ring-primary/50 transition-all group"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-200 dark:bg-white/10 mb-2 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                  )}
                </div>
                <h3 className="font-bold text-xs truncate">{item.name}</h3>
                <p className="text-xs text-primary font-bold">{formatter.format(item.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cart & Order Details */}
        <div className="w-full md:w-80 flex flex-col bg-slate-50/50 dark:bg-slate-800/20">
          <div className="p-6 border-b border-slate-100 dark:border-white/5">
            <h3 className="font-bold">{t('orderDetails') || 'Order Details'}</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {selectedItems.map(item => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-500">{formatter.format(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addItem(item)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md">
                      <Plus className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {selectedItems.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">{t('emptyCart') || 'Cart is empty'}</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                 <button 
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${orderType === 'dine-in' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-slate-500'}`}
                >
                  {t('dineIn') || 'Dine-in'}
                </button>
                <button 
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${orderType === 'takeaway' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-slate-500'}`}
                >
                  {t('takeaway') || 'Takeaway'}
                </button>
              </div>

              {orderType === 'dine-in' && (
                <select 
                  value={tableId}
                  onChange={e => setTableId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">{t('selectTable') || 'Select Table'}</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>{table.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>{formatter.format(total)}</span>
              </div>
              <div className="flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-primary">{formatter.format(total)}</span>
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 text-center">{error}</p>}

            <button 
              onClick={handleSubmit}
              disabled={isPending || selectedItems.length === 0}
              className="w-full py-3 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('confirmOrder') || 'Confirm Order'}
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              {t('cancel') || 'Cancel'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
