const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const typeRegex = /interface AuthContextType \{[\s\S]*?\n\}/;
code = code.replace(typeRegex, `interface AuthContextType {
  user: User | null;
  userAvatar: string;
  loading: boolean;
  needsProfileSetup: boolean;
  isTrialExpired: boolean;
  trialDaysLeft: number;
  isSubscribed: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, realName: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeProfile: (name: string, realName: string) => Promise<void>;
}`);

const stateVariables = `
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);
  const [isSubscribed, setIsSubscribed] = useState(false);
`;

code = code.replace(
  '  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);',
  stateVariables
);

const onSnapshotLogic = `        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setNeedsProfileSetup(false);
            const data = docSnap.data();
            
            // Check subscription and trial
            const subscribed = !!data.isSubscribed;
            setIsSubscribed(subscribed);
            
            if (data.createdAt && !subscribed) {
              const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt.seconds * 1000);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - createdDate.getTime());
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const daysLeft = Math.max(0, 30 - diffDays);
              
              setTrialDaysLeft(daysLeft);
              setIsTrialExpired(daysLeft === 0);
            } else if (subscribed) {
              setTrialDaysLeft(30);
              setIsTrialExpired(false);
            } else {
               // Fallback if no createdAt
              setTrialDaysLeft(30);
              setIsTrialExpired(false);
            }

            if (data.avatarUrl) {
              setUserAvatar(data.avatarUrl);
            } else {
              setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
            }
          } else {
            setNeedsProfileSetup(true);
            setIsTrialExpired(false);
            setIsSubscribed(false);
            setTrialDaysLeft(30);
            setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
          }`;

code = code.replace(
  /        unsubscribeDoc = onSnapshot\(userRef, \(docSnap\) => \{[\s\S]*?\} else \{/,
  onSnapshotLogic + " else {"
);

code = code.replace(
  '<AuthContext.Provider value={{ user, userAvatar, loading, needsProfileSetup, signInWithGoogle, registerWithEmail, loginWithEmail, logout, completeProfile }}>',
  '<AuthContext.Provider value={{ user, userAvatar, loading, needsProfileSetup, isTrialExpired, trialDaysLeft, isSubscribed, signInWithGoogle, registerWithEmail, loginWithEmail, logout, completeProfile }}>'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log('Patched AuthContext with trial logic.');
