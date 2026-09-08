import React from 'react';
import { Wand2, Sparkles } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#fefccf] text-[#1d1d03] relative overflow-hidden font-body-lg flex items-center justify-center">
      {/* Elementos Mágicos de Fundo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/30 blur-[80px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/20 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 text-center max-w-md p-8 glass-panel bg-surface-container-lowest/80 rounded-3xl magic-shadow border-[2px] border-primary-container/50 relative">
        <div className="flex justify-center mb-6 relative">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center border-4 border-primary-container shadow-lg relative">
            <Wand2 className="w-12 h-12 text-primary" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-secondary fill-secondary animate-bounce" />
          </div>
        </div>
        
        <h1 className="font-headline-lg text-primary mb-4">Em Manutenção</h1>
        <p className="font-body-md text-on-surface-variant mb-6">
          A Biblioteca Mágica está passando por alguns encantamentos e feitiços de melhoria para ficar ainda melhor. 
        </p>
        <div className="bg-primary-container/20 p-4 rounded-xl mb-6 border border-primary-container">
          <p className="font-label-lg text-primary font-bold">Início do evento:</p>
          <p className="font-body-md text-on-surface-variant">30 de agosto de 2026, às 10:00</p>
        </div>
        <p className="font-body-sm text-on-surface-variant font-bold">
          Nossos magos estão trabalhando nisso. Voltaremos em breve! ✨
        </p>
      </div>
    </div>
  );
}
