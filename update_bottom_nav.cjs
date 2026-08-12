const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

code = code.replace(
  "    { path: '/clubs', icon: Package, label: 'Compartilhados' },",
  "    { path: '/clubs', icon: Package, label: 'Grupos' },"
);

code = code.replace(
  'className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container/90 backdrop-blur-xl rounded-t-xl shadow-[0_-10px_40px_rgba(112,93,0,0.15)]"',
  'className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-between gap-1 items-center px-2 pb-6 pt-2 bg-surface-container/90 backdrop-blur-xl rounded-t-xl shadow-[0_-10px_40px_rgba(112,93,0,0.15)] overflow-x-auto no-scrollbar"'
);

code = code.replace(
  "'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200',",
  "'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 shrink-0 min-w-[60px]',"
);

code = code.replace(
  "? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-2 scale-110 shadow-md'",
  "? 'bg-secondary-container text-on-secondary-container rounded-full px-3 py-2 scale-105 shadow-md'"
);

code = code.replace(
  "<span className=\"font-label-lg mt-1 text-[12px]\">{item.label}</span>",
  "<span className=\"font-label-lg mt-0.5 text-[10px] leading-tight text-center\">{item.label}</span>"
);

code = code.replace(
  "<Icon className={cn('mb-1', isActive ? 'w-6 h-6' : 'w-6 h-6')} />",
  "<Icon className=\"w-5 h-5 mb-1\" />"
);


fs.writeFileSync('src/components/BottomNav.tsx', code);

let topBar = fs.readFileSync('src/components/TopBar.tsx', 'utf8');
topBar = topBar.replace(
  "    { path: '/clubs', icon: Package, label: 'Compartilhados' },",
  "    { path: '/clubs', icon: Package, label: 'Grupos' },"
);
fs.writeFileSync('src/components/TopBar.tsx', topBar);

console.log('Done');
