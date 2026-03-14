'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Rocket, ShieldCheck, ChevronRight, FileText, Calendar } from 'lucide-react';
import { SettingRow } from './Shared';

export function BillingSection() {
  const t = useTranslations('Settings');

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <div className="bg-[#FF5F15]/5 rounded-2xl p-6 border border-[#FF5F15]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FF5F15] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF5F15]/20">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Plano Professional</h3>
                <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded-full uppercase">Ativo</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">Sua próxima fatura é de R$ 149,90 em 15 abr 2025</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5F15] text-white text-xs font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#FF5F15]/20">
            UPGRADE PLANO
          </button>
        </div>
      </div>

      {/* Detalhes de Pagamento */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-indigo-500">
          <CreditCard className="w-4 h-4" />
          Método de Pagamento
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold">
              VISA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Mastercard terminando em 4321</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Expira em 12/28</p>
            </div>
          </div>
          <button className="text-xs font-black text-primary hover:underline flex items-center gap-1">
            EDITAR <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-slate-50/50 dark:bg-white/2 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
        <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-500">
          <FileText className="w-4 h-4" />
          Faturas Recentes
        </h3>
        
        <div className="space-y-2">
          {[
            { date: '15 Mar 2025', amount: 'R$ 149,90', status: 'pago' },
            { date: '15 Fev 2025', amount: 'R$ 149,90', status: 'pago' },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{invoice.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-800 dark:text-white">{invoice.amount}</span>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500">
                  <ShieldCheck className="w-3 h-3" />
                  {invoice.status}
                </span>
                <button className="p-2 opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/10 rounded-lg transition-all">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
