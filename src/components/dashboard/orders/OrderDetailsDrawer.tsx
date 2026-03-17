'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Edit2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface OrderDetailsDrawerProps {
  order: any;
  onClose: () => void;
  statusStyles: any;
  formatter: Intl.NumberFormat;
  onEdit: (order: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function OrderDetailsDrawer({ order, onClose, statusStyles, formatter, onEdit, onUpdateStatus }: OrderDetailsDrawerProps) {
  const t = useTranslations('Orders');

  if (!order) return null;
  
  const statusStyle = statusStyles[order.status] || statusStyles.pending;

  return (
    <Drawer 
      isOpen={!!order} 
      onClose={onClose} 
      title={t('orderDetails')}
      className="p-8"
    >
      <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
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

              <div className="space-y-4 pt-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-2xl font-bold bg-background dark:bg-white/5 border-slate-100 dark:border-white/10 text-foreground"
                    onClick={() => onEdit(order)}
                  >
                    <Edit2 className="w-4 h-4 mr-2 text-primary" />
                    Adicionar Itens
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-2xl font-bold text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 border-green-100 dark:border-green-500/20"
                    onClick={() => onUpdateStatus(order.id, 'delivered')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Entregar
                  </Button>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
                >
                  {t('close') || 'Fechar Detalhes'}
                </button>
              </div>
            </div>
    </Drawer>
  );
}
