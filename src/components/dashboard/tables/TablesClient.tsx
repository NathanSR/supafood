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
  AlertCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TablesClientProps {
  initialTables: any[];
}

const statusConfig: Record<string, any> = {
  available: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-600', label: 'available', dot: 'bg-green-500' },
  occupied: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', label: 'occupied', dot: 'bg-primary animate-pulse' },
  reserved: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', label: 'reserved', dot: 'bg-blue-500' },
  cleaning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', label: 'cleaning', dot: 'bg-amber-500 animate-pulse' },
};

const sections = ['all', 'indoor', 'outdoor', 'bar', 'private'];

export function TablesClient({ initialTables }: TablesClientProps) {
  const t = useTranslations('Tables');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'floorMap' | 'listView'>('floorMap');

  const filtered = initialTables.filter(table => 
    activeSection === 'all' || table.section === activeSection
  );

  const summaryStats = {
    total: initialTables.length,
    available: initialTables.filter(t => t.status === 'available').length,
    occupied: initialTables.filter(t => t.status === 'occupied').length,
    reserved: initialTables.filter(t => t.status === 'reserved').length,
  };

  return (
    <div className="space-y-6">
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
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
            <button
              onClick={() => setViewMode('floorMap')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'floorMap' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('listView')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'listView' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            {t('addTable')}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t('totalTables'), value: summaryStats.total, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-white/5' },
          { label: t('availableTables'), value: summaryStats.available, color: 'text-green-600', bg: 'bg-green-500/10' },
          { label: t('occupiedTables'), value: summaryStats.occupied, color: 'text-primary', bg: 'bg-primary/10' },
          { label: t('reservedTables'), value: summaryStats.reserved, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`${s.bg} rounded-2xl p-4 text-center`}
          >
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 flex-wrap"
      >
        {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
              {t(config.label as any)}
            </span>
          </div>
        ))}
      </motion.div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {sections.map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeSection === sec
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {t(sec as any)}
          </button>
        ))}
      </div>

      {viewMode === 'floorMap' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((table, i) => {
              const config = statusConfig[table.status] || statusConfig.available;
              return (
                <motion.button
                  key={table.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.03 }}
                  className={`${config.bg} border ${config.border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer aspect-square justify-center`}
                >
                  <span className="text-2xl">🪑</span>
                  <span className={`font-black text-lg ${config.text}`}>{table.name}</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{table.capacity}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="hidden md:grid grid-cols-[80px_100px_120px_150px_1fr_48px] gap-4 px-6 py-3 border-b border-slate-100 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>{t('tableNumber')}</span>
            <span>{t('capacity')}</span>
            <span>{t('section')}</span>
            <span>{t('status')}</span>
            <span>Info</span>
            <span />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((table, i) => {
              const config = statusConfig[table.status] || statusConfig.available;
              return (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-[80px_100px_120px_150px_1fr_48px] gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="flex items-center font-black text-slate-700 dark:text-slate-200">
                    {table.name}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-slate-400" />
                    {table.capacity}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 capitalize">
                    {t(table.section as any)}
                  </div>
                  <div className="flex items-center">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {t(config.label as any)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    {/* Additional info could go here */}
                  </div>
                  <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold text-primary hover:underline">
                      Editar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhuma mesa encontrada nesta seção</p>
        </div>
      )}
    </div>
  );
}
