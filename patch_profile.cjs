const fs = require('fs');

let code = fs.readFileSync('src/views/Profile.tsx', 'utf8');

const subscriptionSection = `
            {/* Subscription Section */}
            <div className="bg-primary/10 rounded-2xl p-6 border-2 border-primary/30 shadow-lg space-y-4">
              <h3 className="font-headline-md text-primary flex items-center gap-2 border-b border-primary/20 pb-3 font-bold">
                <Crown className="w-5 h-5" />
                Planos e Assinaturas
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Você está utilizando a avaliação mágica de 30 dias. Aproveite para expandir seus horizontes com nossos planos!
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/subscription')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Planos Mágicos</span>
                </button>
              </div>
            </div>
`;

code = code.replace(
  '{/* Danger Zone Section */}',
  subscriptionSection + '\n            {/* Danger Zone Section */}'
);

fs.writeFileSync('src/views/Profile.tsx', code);
console.log('Patched Profile.tsx');
