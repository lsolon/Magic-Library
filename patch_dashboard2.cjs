const fs = require('fs');
let code = fs.readFileSync('src/views/Dashboard.tsx', 'utf8');

const oldHeading = `<h3 className="font-headline-lg-mobile text-primary mb-4 flex items-center gap-2">
            <Compass className="w-6 h-6 text-tertiary" /> Buscar Livro com IA
          </h3>`;

const newHeading = `<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="font-headline-lg-mobile text-primary flex items-center gap-2">
              <Compass className="w-6 h-6 text-tertiary" /> Buscar Livro com IA
            </h3>
            <div className="text-sm font-body-sm text-on-surface-variant bg-surface-container-highest py-1 px-4 rounded-full self-start sm:self-auto flex flex-col items-center">
              <span>{aiLimit.searchesLeft} de {aiLimit.maxSearches} buscas restantes</span>
              {aiLimit.timeLeft && aiLimit.searchesLeft < aiLimit.maxSearches && (
                <span className="text-xs opacity-75">
                  Recarrega em {aiLimit.timeLeft.hours}h {aiLimit.timeLeft.minutes}m
                </span>
              )}
            </div>
          </div>`;

code = code.replace(oldHeading, newHeading);

fs.writeFileSync('src/views/Dashboard.tsx', code);
console.log('Patched UI in Dashboard.tsx');
