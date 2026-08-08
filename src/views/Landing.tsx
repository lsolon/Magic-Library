import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Shield, Compass, Star, ChevronRight, Users } from 'lucide-react';
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
            alt="Biblioteca Mítica Logo" 
            className="w-12 h-12 rounded-full shadow-md border-2 border-[#87ceeb]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDva-qK4dyshafW3iHriK_oaoWDV0E5SDZxy3pRs9l10h-O-HsKPwBuNWz4Prq3eOOaSdnkLKpNrmXPhgq97ixztTflLeRNdKbmsb26CcgaTduzvAetWhhndOzY_Lzi4kE-YnxIfiohbpM6LGc-h1go6Xb-IwyzmGtQx2D0B_Z5Eg1jSJR4tTUZ-c91HTq35mzNbENb7_7UeeFiL3Xy1TXAC5OYV4KGNKHa8SJlmnnt_Xz9oUkgLRpTr8qgTEN3Rnk4yAhoWV3WwlNA" 
          />
          <span className="font-headline-lg-mobile text-[#0c6780] drop-shadow-sm font-bold text-2xl">Biblioteca Mítica</span>
        </div>
        <Link 
          to="/register"
          className="bg-[#0c6780] text-white px-6 py-2.5 rounded-full font-label-lg shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
        >
          Entrar na Odisseia
          <ChevronRight className="w-4 h-4" />
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto space-y-8 slide-up">
          <div className="inline-flex items-center gap-2 bg-[#87ceeb]/30 text-[#005870] px-4 py-2 rounded-full font-label-lg mx-auto border border-[#87ceeb]/50">
            <Sparkles className="w-4 h-4" />
            <span>O seu oráculo nas maiores odisseias</span>
          </div>
          
          <h1 className="font-headline-xl text-5xl md:text-7xl text-[#0c6780] drop-shadow-sm leading-tight font-bold">
            Desbrave épicos e lendas a cada página.
          </h1>
          
          <p className="font-body-lg text-[#3f484c] text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            A Biblioteca Mítica é o seu panteão literário. Guardamos seus mitos, conectamos você a outros semideuses da leitura e transformamos cada livro em uma odisseia épica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              to="/register"
              className="bg-[#fcd400] text-[#6e5c00] text-xl md:text-2xl font-bold py-4 px-10 rounded-full shadow-[0_8px_0_rgba(112,93,0,0.2)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(112,93,0,0.2)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer pointer-events-none"></div>
              <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform fill-current" />
              <span className="relative z-10">Iniciar Odisseia</span>
            </Link>
          </div>
        </div>

        {/* Highlight Section: Restricted Groups */}
        <div className="w-full mt-24 slide-up relative">
          <div className="absolute inset-0 bg-[#0c6780]/5 rounded-[3rem] transform -skew-y-2 z-0"></div>
          <div className="relative z-10 bg-white/70 backdrop-blur-xl border-4 border-[#0c6780] p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#fcd400] text-[#6e5c00] px-4 py-2 rounded-full font-label-lg font-bold">
                <Users className="w-5 h-5" />
                <span>Panteões de Leitura</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0c6780] leading-tight">
                Crie seu Clube Secreto!
              </h2>
              <p className="text-xl text-[#3f484c] leading-relaxed">
                Jovens heróis podem criar seus próprios <strong>clubes secretos</strong> com aliados! Colaborem em <strong>pergaminhos de leitura compartilhados</strong>, somem suas páginas lidas e desbloqueiem <strong>relíquias divinas e conquistas épicas</strong> para todo o grupo.
              </p>
              <ul className="space-y-3 text-lg text-[#0c6780] font-medium">
                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-[#fcd400]" /> Desbravem profecias literárias em equipe</li>
                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-[#fcd400]" /> Conquistem tesouros do Olimpo ao cumprirem os oráculos</li>
                <li className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-[#fcd400]" /> Um refúgio seguro, como o Monte Olimpo, apenas para os pequenos heróis</li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#fcd400] rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-[#0c6780] w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center border-8 border-white shadow-2xl">
                  <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-white" />
                  <div className="absolute -bottom-4 -right-4 bg-[#76da75] w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24 slide-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#87ceeb] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#87ceeb]/30 rounded-full blur-2xl group-hover:bg-[#87ceeb]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#87ceeb] text-white flex items-center justify-center mb-6 shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#0c6780] mb-3">Seu Fiel Pégaso</h3>
            <p className="text-[#3f484c] leading-relaxed">
              Deixe que o oráculo guarde o seu progresso! Registre seus pergaminhos, acompanhe sua odisseia e nunca perca o fio de Ariadne nas suas missões literárias.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#fcd400] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#fcd400]/30 rounded-full blur-2xl group-hover:bg-[#fcd400]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#fcd400] text-[#6e5c00] flex items-center justify-center mb-6 shadow-md transform rotate-3 group-hover:rotate-0 transition-transform">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-[#6e5c00] mb-3">Conquistas Épicas</h3>
            <p className="text-[#3f484c] leading-relaxed">
              Conquiste os louros da vitória e ascenda ao Olimpo enquanto lê! Cada épico finalizado é um Velocino de Ouro para a sua estante divina.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#76da75] shadow-xl hover:scale-105 transition-transform text-left relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#76da75]/30 rounded-full blur-2xl group-hover:bg-[#76da75]/50 transition-colors"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#76da75] text-[#005f17] flex items-center justify-center mb-6 shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform">
              <BookOpen className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-[#005f17] mb-3">Clube dos Semideuses</h3>
            <p className="text-[#3f484c] leading-relaxed">
              A odisseia é mais gloriosa em grupo. Compartilhe pergaminhos sagrados, descubra mitos no labirinto e debata com outros heróis apaixonados.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
