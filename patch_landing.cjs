const fs = require('fs');

let code = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// I'll add the subscription banner and plans right before the Feature Cards
const subscriptionSection = `
        {/* Subscription Plans Section */}
        <div className="w-full mt-24 slide-up relative" id="planos">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Escolha sua Jornada</h2>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
              Todos os heróis recebem <strong className="text-primary">30 Dias de Magia Gratuita</strong>. Após esse período, escolha o plano perfeito para continuar sua odisseia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Mensal */}
            <div className="bg-surface-container-low border-2 border-surface-variant rounded-3xl p-8 flex flex-col hover:border-primary transition-colors shadow-sm relative text-left">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 mb-2">
                <Star className="text-secondary w-6 h-6" /> Mago Aprendiz
              </h3>
              <p className="text-on-surface-variant mb-6">Plano Mensal</p>
              <div className="text-4xl font-bold text-primary mb-6">
                R$ 18,00<span className="text-lg text-on-surface-variant font-medium">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-on-surface">
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> Acesso completo à estante mágica</li>
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> Inteligência Artificial Ilimitada (5/dia)</li>
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> Trocas P2P liberadas</li>
              </ul>
              <Link 
                to="/register"
                className="w-full bg-surface-container-high text-on-surface font-bold py-4 rounded-2xl border-2 border-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Começar 30 Dias Grátis
              </Link>
            </div>

            {/* Plano Anual */}
            <div className="bg-surface-container-highest border-2 border-primary rounded-3xl p-8 flex flex-col magic-shadow relative transform hover:-translate-y-2 transition-all text-left">
              <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                15% Off
              </div>
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 mb-2">
                <Crown className="text-secondary-container w-6 h-6" /> Grão-Mestre
              </h3>
              <p className="text-on-surface-variant mb-6">Plano Anual</p>
              <div className="text-4xl font-bold text-primary mb-2">
                R$ 183,60<span className="text-lg text-on-surface-variant font-medium">/ano</span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium mb-6">Equivale a apenas R$ 15,30/mês</p>
              <ul className="space-y-4 mb-8 flex-1 text-on-surface">
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> Todos os recursos do plano mensal</li>
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> Símbolo Exclusivo de Grão-Mestre</li>
                <li className="flex items-center gap-3"><div className="bg-tertiary/20 p-1 rounded-full"><Sparkles className="text-tertiary w-4 h-4" /></div> 2 meses gratuitos garantidos</li>
              </ul>
              <Link 
                to="/register"
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Começar 30 Dias Grátis
              </Link>
            </div>
          </div>
        </div>
`;

code = code.replace('{/* Feature Cards */}', subscriptionSection + '\n\n        {/* Feature Cards */}');

// Also need to import Crown if it's missing
if (!code.includes('Crown')) {
    code = code.replace(
        "import { Book, Sparkles, BookOpen, ChevronRight, Compass, Users, Star, Shield } from 'lucide-react';",
        "import { Book, Sparkles, BookOpen, ChevronRight, Compass, Users, Star, Shield, Crown } from 'lucide-react';"
    );
}


fs.writeFileSync('src/views/Landing.tsx', code);
console.log('Patched Landing page with plans');
