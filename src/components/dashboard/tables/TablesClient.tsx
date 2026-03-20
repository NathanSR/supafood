'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Users,
  LayoutGrid,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  MapPin,
  Coffee,
  Info,
  Wrench
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TableForm } from './TableForm';
import { TableDetailsDrawer } from './TableDetailsDrawer';
import { deleteTable } from '@/lib/actions/restaurant';
import { useRouter, useSearchParams } from 'next/navigation';

interface TablesClientProps {
  initialTables: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  summaryStats: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    cleaning: number;
    maintenance: number;
  };
}

const statusConfig: Record<string, any> = {
  available: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-600', label: 'available', dot: 'bg-green-500', icon: CheckCircle },
  occupied: { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary', label: 'occupied', dot: 'bg-primary animate-pulse', icon: Coffee },
  reserved: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', label: 'reserved', dot: 'bg-blue-500', icon: Clock },
  cleaning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', label: 'cleaning', dot: 'bg-amber-500 animate-pulse', icon: AlertCircle },
  maintenance: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', label: 'maintenance', dot: 'bg-red-500', icon: Wrench },
};

const sections = ['all', 'Indoor', 'Outdoor', 'Bar', 'Terrace', 'VIP'];

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TablesClient({
  initialTables,
  totalCount,
  currentPage,
  pageSize,
  summaryStats
}: TablesClientProps) {
  const t = useTranslations('Tables');
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSection = searchParams.get('section') || 'all';
  const activeStatus = searchParams.get('status') || 'all';

  const [viewMode, setViewMode] = useState<'floorMap' | 'listView'>('floorMap');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente remover esta mesa?')) {
      await deleteTable(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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
          <div className="flex items-center p-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
            <button
              onClick={() => setViewMode('floorMap')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'floorMap' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('listView')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'listView' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingTable(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            {t('addTable')}
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          { id: 'all', label: t('totalTables'), value: summaryStats.total, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-white/5', icon: LayoutGrid },
          { id: 'available', label: t('availableTables'), value: summaryStats.available, color: 'text-green-600', bg: 'bg-green-500/10', icon: CheckCircle },
          { id: 'occupied', label: t('occupiedTables'), value: summaryStats.occupied, color: 'text-primary', bg: 'bg-primary/10', icon: Coffee },
          { id: 'reserved', label: t('reservedTables'), value: summaryStats.reserved, color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Clock },
          { id: 'maintenance', label: t('maintenanceTables'), value: summaryStats.maintenance, color: 'text-red-500', bg: 'bg-red-500/10', icon: Wrench },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => updateFilters({ status: s.id })}
            className={`group ${s.bg} border ${activeStatus === s.id ? 'border-primary ring-2 ring-primary/20' : 'border-[#00000005] dark:border-[#ffffff05]'} rounded-[32px] p-6 text-center hover:shadow-xl hover:shadow-black/[0.02] dark:hover:shadow-white/[0.02] transition-all cursor-pointer`}
          >
            <div className={`w-12 h-12 mx-auto rounded-2xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <p className={`text-3xl font-black ${s.color} tracking-tight`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-black uppercase tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Legend & Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row items-center gap-6 bg-white dark:bg-white/5 p-3 rounded-[28px] border border-slate-100 dark:border-white/5 shadow-sm"
      >
        <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => updateFilters({ section: sec })}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeSection === sec
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
            >
              {sec === 'all' ? t('all') : sec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5 pr-4 border-l border-slate-100 dark:border-white/10 pl-6 h-10 overflow-x-auto no-scrollbar">
          {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
            <div key={key} className="flex items-center gap-2 group cursor-help" title={t(config.label as any)}>
              <span className={`w-3 h-3 rounded-full ${config.dot} shadow-sm group-hover:scale-125 transition-transform`} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest leading-none">
                {t(config.label as any)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      {viewMode === 'floorMap' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {initialTables.map((table, i) => {
              const config = statusConfig[table.status] || statusConfig.available;
              return (
                <motion.div
                  key={table.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedTable(table)}
                  className={`${config.bg} border-2 ${config.border} rounded-[32px] p-6 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300 group cursor-pointer aspect-square justify-center relative shadow-sm overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-white to-transparent dark:from-white/20"></div>

                  <div className="w-14 h-14 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    🪑
                  </div>

                  <div className="text-center">
                    <span className={`font-black text-xl leading-none ${config.text}`}>{table.name}</span>
                    <div className="flex items-center justify-center gap-1 mt-1 font-bold text-slate-500/80">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{table.capacity}</span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTable(table);
                        setIsModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-primary hover:text-white transition-all transform hover:rotate-6"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(table.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-all transform hover:-rotate-6"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500/50">{table.section}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background dark:bg-background rounded-[32px] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm"
        >
          <div className="hidden md:grid grid-cols-[100px_120px_150px_180px_1fr_100px] gap-4 px-8 py-5 border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{t('tableNumber')}</span>
            <span>{t('capacity')}</span>
            <span>{t('section')}</span>
            <span>{t('status')}</span>
            <span>Info</span>
            <span className="text-right">Ações</span>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {initialTables.map((table, i) => {
              const config = statusConfig[table.status] || statusConfig.available;
              return (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedTable(table)}
                  className="grid grid-cols-1 md:grid-cols-[100px_120px_150px_180px_1fr_100px] gap-3 md:gap-4 px-8 py-5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group items-center cursor-pointer"
                >
                  <div className="flex items-center font-black text-lg text-slate-900 dark:text-white">
                    {table.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-primary" />
                    {table.capacity} pessoas
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {table.section}
                  </div>
                  <div className="flex items-center">
                    <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {t(config.label as any)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <Clock className="w-3.5 h-3.5" />
                    Última verificação: 5m atrás
                  </div>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingTable(table);
                        setIsModalOpen(true);
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <TableForm
        isOpen={isModalOpen}
        initialData={editingTable}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(null);
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <span className="text-sm font-bold text-slate-500">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
            className="rounded-xl"
          >
            Próxima
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Table Details Drawer */}
      <TableDetailsDrawer
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        statusConfig={statusConfig}
        onEdit={(table) => {
          setEditingTable(table);
          setIsModalOpen(true);
          setSelectedTable(null);
        }}
        onDelete={(id) => {
          handleDelete(id);
          setSelectedTable(null);
        }}
      />

      {initialTables.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 bg-white dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center gap-4"
        >
          <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-5xl grayscale opacity-30">🪑</div>
          <div className="space-y-1">
            <p className="text-xl font-black text-slate-400 tracking-tight">Mesa não localizada</p>
            <p className="text-sm text-slate-500">Tente ajustar seus filtros ou busca.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
