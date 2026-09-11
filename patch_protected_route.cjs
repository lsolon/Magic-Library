const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newProtectedRoute = `function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, needsProfileSetup, isTrialExpired, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-headline-md text-primary">Carregando a Magia...</div>;
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  if (needsProfileSetup && location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />;
  }

  if (isTrialExpired && !['/subscription', '/subscription-success', '/profile', '/setup-profile'].includes(location.pathname)) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}`;

code = code.replace(/function ProtectedRoute\(\{ children \}: \{ children: React\.ReactNode \}\) \{[\s\S]*?return <>{children}<\/>;\n\}/, newProtectedRoute);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx with Trial restrictions');
