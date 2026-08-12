const fs = require('fs');
let code = fs.readFileSync('src/views/Profile.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { syncUserGamificationStats } from '../lib/gamification';",
  "import { syncUserGamificationStats, calculateBadges, BadgeDef, GamificationStats } from '../lib/gamification';"
);

code = code.replace(
  "import { User, Sparkles, Award, Star, Shield, Save, Camera, ArrowLeft, Lock, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';",
  "import { User, Sparkles, Award, Star, Shield, Save, Camera, ArrowLeft, Lock, Trash2, AlertTriangle, RotateCcw, Book, Flame, Timer, Package, Crown } from 'lucide-react';"
);

// Add badges state
code = code.replace(
  "const [stats, setStats] = useState({ level: 1, xp: 0, stars: 0 });",
  "const [stats, setStats] = useState<GamificationStats>({ level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 });\n  const [badges, setBadges] = useState<BadgeDef[]>([]);"
);

// Update setStats calls
code = code.replace(
  "setStats({ level: syncedStats.level, xp: syncedStats.xp, stars: syncedStats.stars });",
  "setStats(syncedStats);\n        setBadges(calculateBadges(syncedStats));"
);

code = code.replace(
  "setStats({ level: 1, xp: 0, stars: 0 });",
  "setStats({ level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 });\n      setBadges(calculateBadges({ level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 }));"
);
code = code.replace(
  "setStats({ level: 1, xp: 0, stars: 0 });",
  "setStats({ level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 });\n      setBadges(calculateBadges({ level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 }));"
);

// Build the Badges UI snippet
const badgesUI = `
            {/* Badges Section */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-primary-container shadow-lg flex flex-col">
              <h3 className="font-headline-sm text-primary font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Emblemas Conquistados
              </h3>
              <div className="flex flex-col gap-3">
                {badges.map((badge) => {
                  const Icon = badge.iconType === 'book' ? Book :
                               badge.iconType === 'flame' ? Flame :
                               badge.iconType === 'timer' ? Timer :
                               badge.iconType === 'package' ? Package :
                               badge.iconType === 'crown' ? Crown : Award;
                  return (
                    <div key={badge.id} className={\`flex items-center gap-4 p-3 rounded-xl border \${badge.achieved ? 'bg-primary-container/20 border-primary/30' : 'bg-surface-container border-surface-variant opacity-60 grayscale'}\`}>
                      <div className={\`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm \${badge.achieved ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}\`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className={\`font-label-lg font-bold \${badge.achieved ? 'text-primary' : 'text-on-surface-variant'}\`}>{badge.name}</h4>
                          {badge.achieved && <Star className="w-3.5 h-3.5 text-tertiary fill-tertiary" />}
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-tight">{badge.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
`;

code = code.replace(
  "              {/* Quick Preset Avatars */}",
  badgesUI + "\n              {/* Quick Preset Avatars */}"
);

fs.writeFileSync('src/views/Profile.tsx', code);
console.log('done');
