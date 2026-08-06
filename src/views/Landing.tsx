import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Shield, Compass, Star, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#fefccf] text-[#1d1d03] relative overflow-hidden font-body-lg">
      {/* Playful Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#87ceeb] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-80 h-80 bg-[#fcd400] rounded-full mix-blend-multiply filter blur-3xl float-anim" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-[#76da75] rounded-full mix-blend-multiply filter blur-3xl float-anim" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            alt="Magic Library Logo" 
            className="w-12 h-12 rounded-full shadow-md border-2 border-[#87ceeb]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDva-qK4dyshafW3iHriK_oaoWDV0E5SDZxy3pRs9l10h-O-HsKPwBuNWz4Prq3eOOaSdnkLKpNrmXPhgq97ixztTflLeRNdKbmsb26CcgaTduzvAetWhhndOzY_Lzi4kE-YnxIfiohbpM6LGc-h1go6Xb-IwyzmGtQx2D0B_Z5Eg1jSJR4tTUZ-c91HTq35mzNbENb7_7UeeFiL3Xy1TXAC5OYV4KGNKHa8SJlmnnt_Xz9oUkgLRpTr8qgTEN3Rnk4yAhoWV3WwlNA" 
          />
          <span className="font-headline-lg-mobile text-[#0c6780] drop-shadow-sm font-bold text-2xl">Magic Library</span>
        </div>
        <Link 
          to="/register"
          className="bg-[#0c6780] text-white px-6 py-2.5 rounded-full font-label-lg shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
        >
          Entrar na Aventura
          <ChevronRight className="w-4 h-4" />
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto space-y-8 slide-up">
          <div className="inline-flex items-center gap-2 bg-[#87ceeb]/30 text-[#005870] px-4 py-2 rounded-full font-label-lg mx-auto border border-[#87ceeb]/50">
            <Sparkles className="w-4 h-4" />
            <span>O seu escudeiro nas maiores jornadas</span>
          </div>
          
          <h1 className="font-headline-xl text-5xl md:text-7xl text-[#0c6780] drop-shadow-sm leading-tight font-bold">
            Descubra mundos infinitos a cada página.
          </h1>
          
          <p className="font-body-lg text-[#3f484c] text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            A Magic Library é o seu companheiro fiel. Guardamos suas conquistas, conectamos você a outros exploradores e transformamos a leitura na maior aventura da sua vida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              to="/register"
              className="bg-[#fcd400] text-[#6e5c00] text-xl md:text-2xl font-bold py-4 px-10 rounded-full shadow-[0_8px_0_rgba(112,93,0,0.2)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(112,93,0,0.2)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer pointer-events-none"></div>
              <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform fill-current" />
              <span className="relative z-10">Começar Explorar</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 slide-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#87ceeb] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#87ceeb]/30 rounded-full blur-2xl group-hover:bg-[#87ceeb]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#87ceeb] text-white flex items-center justify-center mb-6 shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#0c6780] mb-3">Seu Fiel Escudeiro</h3>
            <p className="text-[#3f484c] leading-relaxed">
              Deixe que nós guardamos o seu progresso! Anote suas páginas, acompanhe sua jornada e nunca mais perca o fio da meada em suas missões literárias.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#fcd400] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#fcd400]/30 rounded-full blur-2xl group-hover:bg-[#fcd400]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#fcd400] text-[#6e5c00] flex items-center justify-center mb-6 shadow-md transform rotate-3 group-hover:rotate-0 transition-transform">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-[#6e5c00] mb-3">Conquistas Mágicas</h3>
            <p className="text-[#3f484c] leading-relaxed">
              Ganhe medalhas e suba de nível enquanto lê! Cada livro finalizado é um baú de tesouro aberto, com recompensas brilhantes para a sua estante.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#76da75] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#76da75]/30 rounded-full blur-2xl group-hover:bg-[#76da75]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#76da75] text-[#005f17] flex items-center justify-center mb-6 shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform">
              <BookOpen className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-[#005f17] mb-3">Guilda de Leitores</h3>
            <p className="text-[#3f484c] leading-relaxed">
              A jornada fica melhor em grupo. Empreste livros mágicos, descubra novos tesouros na biblioteca e interaja com outros exploradores apaixonados.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
