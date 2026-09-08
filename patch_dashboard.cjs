const fs = require('fs');
let code = fs.readFileSync('src/views/Dashboard.tsx', 'utf8');

// 1. Add import for useAiSearchLimit
if (!code.includes('useAiSearchLimit')) {
  code = code.replace(
    "import { db } from '../lib/firebase';",
    "import { db } from '../lib/firebase';\nimport { useAiSearchLimit } from '../lib/useAiSearchLimit';"
  );
}

// 2. Add hook call in component
if (!code.includes('const aiLimit')) {
  code = code.replace(
    "  const [searchError, setSearchError] = useState('');",
    "  const [searchError, setSearchError] = useState('');\n  const aiLimit = useAiSearchLimit();"
  );
}

// 3. Add limit check in handleSearch
if (!code.includes('if (!aiLimit.canSearch)')) {
  code = code.replace(
    "    if (!searchQuery.trim()) return;\n    setIsSearching(true);",
    "    if (!searchQuery.trim()) return;\n    \n    if (!aiLimit.canSearch) {\n      setSearchError('Você atingiu o limite de 5 pesquisas nas últimas 24 horas.');\n      return;\n    }\n    \n    setIsSearching(true);"
  );
}

// 4. Increment count on successful search
if (!code.includes('aiLimit.incrementSearch();')) {
  code = code.replace(
    "      const data = await res.json();\n      setSearchResult(data);",
    "      const data = await res.json();\n      setSearchResult(data);\n      aiLimit.incrementSearch();"
  );
}

// 5. Add UI for counter and limit
const counterUI = `
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading text-on-surface flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-tertiary" />
                Buscar Livro com IA
              </h2>
              <div className="text-sm font-body-sm text-on-surface-variant bg-surface-container py-1 px-3 rounded-full flex flex-col items-end">
                <span>{aiLimit.searchesLeft} de {aiLimit.maxSearches} buscas restantes</span>
                {aiLimit.timeLeft && aiLimit.searchesLeft < aiLimit.maxSearches && (
                  <span className="text-xs opacity-75">
                    Recarrega em {aiLimit.timeLeft.hours}h {aiLimit.timeLeft.minutes}m
                  </span>
                )}
              </div>
            </div>
`;

code = code.replace(
  `          <div className="bg-surface p-6 rounded-[2rem] shadow-sm mb-6 tour-search">
            <h2 className="text-xl font-heading text-on-surface mb-4 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-tertiary" />
              Buscar Livro com IA
            </h2>
            <form onSubmit={handleSearch}`,
  `          <div className="bg-surface p-6 rounded-[2rem] shadow-sm mb-6 tour-search">` + counterUI + `            <form onSubmit={handleSearch}`
);

// Disable button if no searches left
code = code.replace(
  `disabled={isSearching || !searchQuery.trim()}`,
  `disabled={isSearching || !searchQuery.trim() || !aiLimit.canSearch}`
);

fs.writeFileSync('src/views/Dashboard.tsx', code);
console.log('Patched Dashboard.tsx');
