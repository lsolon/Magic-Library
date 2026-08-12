const fs = require('fs');
let code = fs.readFileSync('src/lib/gamification.ts', 'utf8');

const badgesCode = `
export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  iconType: string;
  achieved: boolean;
  progress: number; // 0 to 1
}

export function calculateBadges(stats: GamificationStats): BadgeDef[] {
  return [
    {
      id: 'first_book',
      name: 'Primeiro Passo',
      description: 'Adicionou seu primeiro livro à biblioteca.',
      iconType: 'book',
      achieved: stats.totalBooks >= 1,
      progress: Math.min(1, stats.totalBooks / 1)
    },
    {
      id: 'avid_reader',
      name: 'Leitor Ávido',
      description: 'Terminou de ler 5 livros.',
      iconType: 'flame',
      achieved: stats.completedBooks >= 5,
      progress: Math.min(1, stats.completedBooks / 5)
    },
    {
      id: 'page_marathon',
      name: 'Maratonista',
      description: 'Leu 1.000 páginas ou mais.',
      iconType: 'timer',
      achieved: stats.totalPagesRead >= 1000,
      progress: Math.min(1, stats.totalPagesRead / 1000)
    },
    {
      id: 'collector',
      name: 'Colecionador',
      description: 'Adicionou 15 livros à biblioteca.',
      iconType: 'package',
      achieved: stats.totalBooks >= 15,
      progress: Math.min(1, stats.totalBooks / 15)
    },
    {
      id: 'wisdom_master',
      name: 'Mestre da Sabedoria',
      description: 'Alcançou o Nível 5 de exploração.',
      iconType: 'crown',
      achieved: stats.level >= 5,
      progress: Math.min(1, stats.level / 5)
    }
  ];
}
`;

if (!code.includes('calculateBadges')) {
  code = code.replace('export interface GamificationStats', badgesCode + '\nexport interface GamificationStats');
}

fs.writeFileSync('src/lib/gamification.ts', code);
console.log('done');
