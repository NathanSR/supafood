'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Zap, Clock, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { Toggle, SettingRow } from './Shared';

export function NotificationsSection() {
  const t = useTranslations('Settings');
  
  const [channels, setChannels] = useState({
    email: true,
    push: true,
    whatsapp: false
  });

  const [alerts, setAlerts] = useState({
    orders: true,
    stock: false,
    report: true
  });

  // Task list mock for automatic notifications
  const tasks = [
    { id: 1, name: 'Relatório Diário de Vendas', schedule: 'Todo dia às 23:55', status: 'active', icon: History, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 2, name: 'Alerta de Estoque Crítico', schedule: 'Tempo Real', status: 'active', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 3, name: 'Resumo Semanal de Performance', schedule: 'Segunda às 08:00', status: 'paused', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Canais de Notificação */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-primary">
          <Bell className="w-4 h-4" />
          Canais de Comunicação
        </h3>
        <SettingRow label="E-mail" description="Alertas enviados para o e-mail cadastrado">
          <Toggle enabled={channels.email} onChange={(v) => setChannels({...channels, email: v})} />
        </SettingRow>
        <SettingRow label="Push Desktop" description="Notificações diretamente no navegador">
          <Toggle enabled={channels.push} onChange={(v) => setChannels({...channels, push: v})} />
        </SettingRow>
        <SettingRow label="WhatsApp (Beta)" description="Receba ordens críticas no seu celular">
          <Toggle enabled={channels.whatsapp} onChange={(v) => setChannels({...channels, whatsapp: v})} />
        </SettingRow>
      </div>

      {/* Tarefas Automáticas (Added requirement: Tasks) */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black flex items-center gap-2 text-indigo-500">
            <Zap className="w-4 h-4" />
            Tarefas de Notificação Automática
          </h3>
          <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/10 uppercase">
            3 Rodando
          </span>
        </div>
        
        <div className="grid gap-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${task.bg} ${task.color} flex items-center justify-center`}>
                  <task.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                    {task.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.schedule}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'active' ? 'text-green-500' : 'text-slate-400'}`}>
                      • {task.status === 'active' ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all">
                 <Zap className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferências de Disparo */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-amber-500">
          <Smartphone className="w-4 h-4" />
          Alertas de Operação
        </h3>
        <SettingRow label={t('orderAlerts')} description="Novos pedidos no salão ou takeaway">
          <Toggle enabled={alerts.orders} onChange={(v) => setAlerts({...alerts, orders: v})} />
        </SettingRow>
        <SettingRow label={t('lowStockAlerts')} description="Avisar quando itens atingem estoque mínimo">
          <Toggle enabled={alerts.stock} onChange={(v) => setAlerts({...alerts, stock: v})} />
        </SettingRow>
      </div>
    </div>
  );
}
