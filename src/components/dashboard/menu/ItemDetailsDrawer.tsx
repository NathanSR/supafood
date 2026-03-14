'use client';

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { 
  Clock, 
  Flame, 
  Star, 
  TrendingUp, 
  Info,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ItemDetailsDrawerProps {
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function ItemDetailsDrawer({ item, isOpen, onClose, onEdit, onDelete }: ItemDetailsDrawerProps) {
  const t = useTranslations('Menu');
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  if (!item) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto no-scrollbar border-none bg-card dark:bg-card p-0">
        <div className="relative h-64 w-full">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-6xl">
              🍽️
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-card via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                {item.menu_categories?.name}
              </span>
              {item.is_popular && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {t('popular')}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">{item.name}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('price')}</p>
              <p className="text-xl font-black text-primary">{formatter.format(item.price)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[24px] border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('available')}</p>
              <div className="flex items-center gap-2">
                {item.is_available ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-600">{t('available')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-red-600">{t('unavailable')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <Info className="w-4 h-4 text-primary" />
              <h3>{t('description')}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.description || 'Nenhuma descrição fornecida para este item.'}
            </p>
          </div>

          {/* nutritional info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3>Informações Adicionais</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t('calories')}</p>
                    <p className="text-[10px] text-slate-500">Valor energético</p>
                  </div>
                </div>
                <span className="font-black text-slate-700 dark:text-slate-200">{item.calories} KCAL</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t('prepTime')}</p>
                    <p className="text-[10px] text-slate-500">Tempo estimado</p>
                  </div>
                </div>
                <span className="font-black text-slate-700 dark:text-slate-200">{item.prep_time} {t('mins')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl font-bold bg-background dark:bg-white/5 border-slate-100 dark:border-white/5"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-100 dark:border-red-500/20"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
