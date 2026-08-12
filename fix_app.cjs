const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  const { user, needsProfileSetup } = useAuth();',
  '  const { user, needsProfileSetup, loading } = useAuth();'
);

code = code.replace(
  '  if (!user) {\n    return <Navigate to="/register" replace />;\n  }',
  '  if (loading) {\n    return <div className="min-h-screen bg-[#fefccf] flex items-center justify-center font-headline-md text-primary">Carregando a Magia...</div>;\n  }\n\n  if (!user) {\n    return <Navigate to="/register" replace />;\n  }'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed loading state');
