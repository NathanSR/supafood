'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { createOrder, addItemsToOrder } from '@/lib/actions/orders';
import { Loader2, X, ShoppingCart, Trash2, Plus, Minus, Search, Utensils, User, MapPin, CreditCard, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';

interface OrderFormProps {
  tables: any[];
  menuItems: any[];
  onClose: () => void;
  isOpen: boolean;
  initialOrder?: any;
}

export function OrderForm({ tables, menuItems, onClose, isOpen, initialOrder }: OrderFormProps) {
  const t = useTranslations('Orders');
  const mt = useTranslations('Menu');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [tableId, setTableId] = useState<string>(initialOrder?.table_id || '');
  const [customerName, setCustomerName] = useState<string>(initialOrder?.customer_name || '');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>(initialOrder?.type || 'dine-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  React.useEffect(() => {
    if (isOpen) {
      setTableId(initialOrder?.table_id || '');
      setCustomerName(initialOrder?.customer_name || '');
      setOrderType(initialOrder?.type || 'dine-in');
      setSelectedItems([]);
      setError(null);
    }
  }, [initialOrder, isOpen]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map(item => item.menu_categories?.name).filter(Boolean)));
    return ['all', ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.menu_categories?.name === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, activeCategory]);

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

  const total = selectedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError('Selecione ao menos um item');
      return;
    }
    if (orderType === 'dine-in' && !tableId) {
      setError('Selecione uma mesa');
      return;
    }

    startTransition(async () => {
      if (initialOrder) {
        const newTotal = (initialOrder.total_amount || 0) + total;
        const result = await addItemsToOrder(
          initialOrder.id,
          selectedItems.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
          newTotal
        );
        if (result?.error) {
          setError(result.error);
        } else {
          onClose();
          setSelectedItems([]);
        }
        return;
      }

      const orderData = {
        table_id: orderType === 'dine-in' ? tableId : null,
        customer_name: customerName,
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
        setSelectedItems([]);
        setCustomerName('');
        setTableId('');
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialOrder ? `${t('addItems')} #${initialOrder.orderNumber}` : (t('newOrder') || 'Novo Pedido')}
      maxWidth="max-w-6xl"
    >
      <div className="flex flex-col lg:flex-row h-[75vh] md:h-[80vh] overflow-auto ">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-black/20 border-r border-slate-100 dark:border-white/5">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar itens no cardápio..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-white/5 text-slate-500 border-slate-100 dark:border-white/5 hover:border-primary/50'
                    }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <motion.button
                  key={item.id}
                  layout
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addItem(item)}
                  className="group relative bg-background dark:bg-white/5 p-2 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left"
                >
                  <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 overflow-hidden mb-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl opacity-50">🍔</div>
                    )}
                  </div>
                  <div className="px-1 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-primary font-black text-sm">{formatter.format(item.price)}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all shadow-lg shadow-primary/30">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="flex-shrink-0 w-full lg:w-[400px] flex flex-col bg-card dark:bg-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-wider">Carrinho ({selectedItems.length})</h3>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className="text-[10px] font-bold text-red-500 hover:opacity-80 transition-opacity"
              >
                LIMPAR TUDO
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {selectedItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  className="group flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-[24px] border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-black/20 flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[11px] font-black text-primary">{formatter.format(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-white/10 p-1.5 rounded-2xl shadow-sm">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 group-hover:text-primary transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black min-w-[1.5rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 group-hover:text-primary transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {selectedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Utensils className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-black text-sm">CARRINHO VAZIO</p>
                  <p className="text-[10px]">Escolha alguns deliciosos itens do cardápio</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'dine-in' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  No Local
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'takeaway' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Para Viagem
                </button>
              </div>

              {initialOrder ? (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">Modo Adição</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Adicionando novos itens ao pedido #{initialOrder.orderNumber}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cliente</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Nome"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs outline-none focus:ring-2 focus:ring-primary/30 font-bold"
                      />
                    </div>
                  </div>

                  {orderType === 'dine-in' && (
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mesa</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5" />
                        <select
                          value={tableId}
                          onChange={e => setTableId(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs outline-none focus:ring-2 focus:ring-primary/30 font-black appearance-none"
                        >
                          <option value="">Nº</option>
                          {tables.map(table => (
                            <option key={table.id} value={table.id}>{table.name || table.number}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 bg-primary rounded-[28px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

              <div className="relative flex items-center justify-between gap-6">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{initialOrder ? t('addedAmount') || 'Valor Adicional' : t('totalAmount') || 'Valor Total'}</span>
                  <h2 className="text-2xl font-black">{formatter.format(total)}</h2>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isPending || selectedItems.length === 0}
                  className="bg-white text-primary px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-xl"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Confirmar Pedido
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-tighter">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
