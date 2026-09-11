const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Subscription')) {
  code = code.replace(
    "import Profile from './views/Profile';",
    "import Profile from './views/Profile';\nimport Subscription from './views/Subscription';\nimport SubscriptionSuccess from './views/SubscriptionSuccess';"
  );
  
  code = code.replace(
    '<Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />',
    '<Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />\n          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />\n          <Route path="/subscription-success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />'
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log('Patched App.tsx');
}
