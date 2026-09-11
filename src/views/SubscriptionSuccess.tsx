import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { TopBar } from '../components/TopBar';

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <TopBar title="Pagamento Aprovado" />
      
      <div className="bg-surface-container-low p-8 rounded-[3rem] border-2 border-tertiary-container shadow-2xl max-w-md w-full relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-tertiary/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-background z-10 relative">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-headline-xl text-primary mb-4 z-10 relative">Pagamento Aprovado!</h1>
        <p className="text-lg text-on-surface-variant mb-8 z-10 relative">
          Sua assinatura mágica foi ativada com sucesso. Obrigado por apoiar a Magic Library!
        </p>
        
        <Link 
          to="/dashboard"
          className="bg-primary text-on-primary font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 z-10 relative"
        >
          <Sparkles className="w-5 h-5" /> Retornar à Biblioteca
        </Link>
      </div>
    </div>
  );
}
