import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userAvatar: string;
  loading: boolean;
  needsProfileSetup: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, realName: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeProfile: (name: string, realName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined = undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = undefined;
      }

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setNeedsProfileSetup(false);
            const data = docSnap.data();
            if (data.avatarUrl) {
              setUserAvatar(data.avatarUrl);
            } else {
              setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
            }
          } else {
            setNeedsProfileSetup(true);
            setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
          }
          setLoading(false);
        }, (err) => {
          console.error("Error watching user doc:", err);
          setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
          setLoading(false);
        });
      } else {
        setNeedsProfileSetup(false);
        setUserAvatar('');
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const createUserDocument = async (user: User, displayName?: string | null, realName?: string | null) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const defaultAvatar = user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.uid;
      await setDoc(userRef, {
        displayName: displayName || user.displayName || 'Novo(a) Explorador(a) de Mundos',
        realName: realName || user.displayName || 'Explorador(a) de Mundos',
        avatarUrl: defaultAvatar,
        level: 1,
        xp: 0,
        stars: 0,
        createdAt: serverTimestamp()
      });
      setUserAvatar(defaultAvatar);
      setNeedsProfileSetup(false);
    }
  };

  const completeProfile = async (name: string, realName: string) => {
    if (!user) throw new Error("Usuário não autenticado");
    
    const trimmedName = name.trim();
    const trimmedRealName = realName.trim();

    if (!trimmedName) throw new Error('O nome de exibição é obrigatório.');
    if (!trimmedRealName) throw new Error('O nome real é obrigatório.');

    const q = query(collection(db, 'users'), where('displayName', '==', trimmedName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error('Este nome de exibição já está em uso por outro explorador. Escolha outro nome.');
    }

    await updateProfile(user, { displayName: trimmedName });
    await createUserDocument(user, trimmedName, trimmedRealName);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const registerWithEmail = async (email: string, password: string, name: string, realName: string) => {
    const trimmedName = name.trim();
    const trimmedRealName = realName.trim();
    if (!trimmedName) {
      throw new Error('O nome de exibição é obrigatório.');
    }
    if (!trimmedRealName) {
      throw new Error('O nome real é obrigatório.');
    }

    // Check if displayName already exists in users collection
    const q = query(collection(db, 'users'), where('displayName', '==', trimmedName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Este nome de exibição já está em uso por outro explorador. Escolha outro nome.');
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: trimmedName });
    await createUserDocument(result.user, trimmedName, trimmedRealName);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userAvatar, loading, needsProfileSetup, signInWithGoogle, registerWithEmail, loginWithEmail, logout, completeProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
