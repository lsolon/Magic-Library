import { Link, useLocation } from 'react-router-dom';
import { Compass, BookOpen, Package, User, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Compass, label: 'Mapa' },
    { path: '/library', icon: BookOpen, label: 'Livros' },
    { path: '/clubs', icon: Package, label: 'Compartilhados' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container/90 backdrop-blur-xl rounded-t-xl shadow-[0_-10px_40px_rgba(112,93,0,0.15)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-secondary-container text-on-secondary-container rounded-full px-6 py-2 scale-110 shadow-md'
                : 'text-on-surface-variant opacity-70 hover:bg-secondary-fixed-dim/20 active:scale-95'
            )}
          >
            <Icon className={cn('mb-1', isActive ? 'w-6 h-6' : 'w-6 h-6')} />
            <span className="font-label-lg mt-1 text-[12px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
