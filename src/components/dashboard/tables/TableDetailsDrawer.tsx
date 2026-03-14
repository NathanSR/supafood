'use client';

import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Edit2, Trash2, Coffee } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TableDetailsDrawerProps {
  table: any | null;
  onClose: () => void;
  statusConfig: Record<string, any>;
  onEdit: (table: any) => void;
  onDelete: (id: string) => void;
}

export function TableDetailsDrawer({ table, onClose, statusConfig, onEdit, onDelete }: TableDetailsDrawerProps) {
  const t = useTranslations('Tables');

  if (!table) return null;

  const config = statusConfig[table.status] || statusConfig.available;

  return (
    <Sheet open={!!table} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md border-none bg-card dark:bg-card overflow-y-auto no-scrollbar">
        <div className="space-y-8 py-6">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center text-3xl`}>
                🪑
              </div>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                {t(config.label)}
              </span>
            </div>
            <SheetTitle className="text-3xl font-black tracking-tight mt-4 text-foreground text-left">
              Mesa {table.name}
            </SheetTitle>
            <SheetDescription className="text-slate-500 dark:text-slate-400 text-left">
              Detalhes e informações da mesa
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Capacidade</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">{table.capacity} pessoas</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Setor</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-foreground">{table.section}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl font-bold bg-background dark:bg-white/5 border-slate-100 dark:border-white/5"
                onClick={() => onEdit(table)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                className="h-14 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-100 dark:border-red-500/20"
                onClick={() => onDelete(table.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>

          {table.status === 'occupied' && (
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                   <Coffee className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-primary uppercase tracking-wider">Mesa Ocupada</p>
                   <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Há aproximadamente 45 minutos</p>
                 </div>
               </div>
               <Button className="w-full h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 font-bold hover:opacity-90 transition-opacity">
                 Ver Itens do Pedido
               </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
