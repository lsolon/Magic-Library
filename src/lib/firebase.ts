import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC-USP8-9Gj-6MJlJ6VwwA2J9KdcuD076Y",
  authDomain: "gen-lang-client-0404948919.firebaseapp.com",
  projectId: "gen-lang-client-0404948919",
  storageBucket: "gen-lang-client-0404948919.firebasestorage.app",
  messagingSenderId: "1039826300849",
  appId: "1:1039826300849:web:5a71dbc69a403d813ed790"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "magic-library-db");
export const auth = getAuth(app);
