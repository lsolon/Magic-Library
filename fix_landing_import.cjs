const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf8');

code = code.replace(
  "import { BookOpen, Sparkles, Shield, Compass, Star, ChevronRight, Users } from 'lucide-react';",
  "import { BookOpen, Sparkles, Shield, Compass, Star, ChevronRight, Users, Crown } from 'lucide-react';"
);

fs.writeFileSync('src/views/Landing.tsx', code);
console.log('Fixed imports in Landing.tsx');
