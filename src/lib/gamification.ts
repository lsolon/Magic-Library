import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export interface GamificationStats {
  level: number;
  xp: number;
  stars: number;
  totalBooks: number;
  completedBooks: number;
  totalPagesRead: number;
}

/**
 * Recalculates and returns user gamification stats based on their reading activity in Firestore.
 */
export function calculateStatsFromBooks(userBooks: Array<{ status?: string; pagesRead?: number }>): GamificationStats {
  const totalBooks = userBooks.length;
  const completedBooks = userBooks.filter(b => b.status === 'Lido').length;
  const totalPagesRead = userBooks.reduce((sum, b) => sum + (Number(b.pagesRead) || 0), 0);

  // 1. XP Rules:
  // +20 XP for every book added to library
  // +1 XP for every page lida
  // +100 XP bonus for completing a book ("Lido")
  const xp = (totalBooks * 20) + (totalPagesRead * 1) + (completedBooks * 100);

  // 2. Stars Rules:
  // +1 Star per completed book
  // +1 Star for every 500 pages read
  // +1 Star for every 5 books registered
  const stars = (completedBooks * 1) + Math.floor(totalPagesRead / 500) + Math.floor(totalBooks / 5);

  // 3. Level Rules:
  // Starts at Level 1 (0 XP)
  // Reaches Level 2 at 150 XP, Level 3 at 300 XP, etc.
  const level = Math.max(1, Math.floor(xp / 150) + 1);

  return { level, xp, stars, totalBooks, completedBooks, totalPagesRead };
}

/**
 * Fetches user's books from Firestore, recalculates stats, and syncs them to users/{userId}
 */
export async function syncUserGamificationStats(userId: string): Promise<GamificationStats> {
  try {
    const q = query(collection(db, 'user_books'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const userBooks = snap.docs.map(doc => doc.data() as { status?: string; pagesRead?: number });

    const stats = calculateStatsFromBooks(userBooks);

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      level: stats.level,
      xp: stats.xp,
      stars: stats.stars,
      updatedAt: new Date()
    }, { merge: true });

    return stats;
  } catch (err) {
    console.error('Error syncing user gamification stats:', err);
    return { level: 1, xp: 0, stars: 0, totalBooks: 0, completedBooks: 0, totalPagesRead: 0 };
  }
}
