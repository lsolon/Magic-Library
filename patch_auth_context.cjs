const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

if (!code.includes('addDoc(collection(db, \'access_logs\')')) {
  // Add import for addDoc
  code = code.replace(
    "import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';",
    "import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';"
  );

  const newOnAuthCode = `      if (currentUser) {
        // Record access log
        if (!sessionStorage.getItem('access_recorded_' + currentUser.uid)) {
          sessionStorage.setItem('access_recorded_' + currentUser.uid, 'true');
          addDoc(collection(db, 'access_logs'), {
            userId: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            accessedAt: serverTimestamp(),
            userAgent: navigator.userAgent
          }).catch(err => console.error("Error logging access", err));
        }

        const userRef = doc(db, 'users', currentUser.uid);`;

  code = code.replace(
    `      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);`,
    newOnAuthCode
  );

  fs.writeFileSync('src/contexts/AuthContext.tsx', code);
  console.log('Patched AuthContext.tsx');
}
