const fs = require('fs');

let code = fs.readFileSync('src/views/Subscription.tsx', 'utf8');

code = code.replace(
  'const { user } = useAuth();',
  'const { user, isTrialExpired, trialDaysLeft, isSubscribed } = useAuth();'
);

code = code.replace('import { Check, Sparkles, Star, Zap, Crown } from \'lucide-react\';', "import { Check, Sparkles, Star, Zap, Crown, AlertTriangle } from 'lucide-react';");

const bannerBlock = `
        {/* Avaliação Gratuita */}
        <div className="bg-primary/20 border-2 border-primary/40 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-xl pointer-events-none"></div>
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 float-anim" />
          <h2 className="text-3xl font-bold text-on-surface mb-2">30 Dias de Magia Gratuita</h2>
          <p className="text-lg text-on-surface-variant font-medium max-w-lg mx-auto">
            Experimente todos os recursos da Bússola Mágica, Buscador de IA e Trocas P2P de forma 100% gratuita no seu primeiro mês.
          </p>
        </div>
`;

const newBannerBlock = `
        {/* Dynamic Banner */}
        {isSubscribed ? (
          <div className="bg-tertiary-container/20 border-2 border-tertiary/40 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-tertiary/30 rounded-full blur-xl pointer-events-none"></div>
            <Crown className="w-12 h-12 text-tertiary mx-auto mb-4 float-anim" />
            <h2 className="text-3xl font-bold text-on-surface mb-2">Você é um Assinante!</h2>
            <p className="text-lg text-on-surface-variant font-medium max-w-lg mx-auto">
              Obrigado por apoiar a Magic Library! Seu passe livre para explorar todos os mundos literários já está ativo.
            </p>
          </div>
        ) : isTrialExpired ? (
          <div className="bg-error-container/20 border-2 border-error/40 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-error/30 rounded-full blur-xl pointer-events-none"></div>
            <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4 pulse-anim" />
            <h2 className="text-3xl font-bold text-on-surface mb-2">Seu tempo gratuito expirou</h2>
            <p className="text-lg text-on-surface-variant font-medium max-w-lg mx-auto">
              Para continuar usando a Bússola Mágica, salvar mais livros e fazer trocas P2P, escolha um dos planos abaixo.
            </p>
          </div>
        ) : (
          <div className="bg-primary/20 border-2 border-primary/40 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-xl pointer-events-none"></div>
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 float-anim" />
            <h2 className="text-3xl font-bold text-on-surface mb-2">
              {trialDaysLeft} {trialDaysLeft === 1 ? 'Dia' : 'Dias'} de Magia Restante{trialDaysLeft === 1 ? '' : 's'}
            </h2>
            <p className="text-lg text-on-surface-variant font-medium max-w-lg mx-auto">
              Aproveite os dias restantes do seu teste de 30 Dias! Depois disso, você precisará escolher um plano para continuar sua jornada.
            </p>
          </div>
        )}
`;

code = code.replace(bannerBlock, newBannerBlock);

fs.writeFileSync('src/views/Subscription.tsx', code);
console.log('Patched Subscription.tsx');
