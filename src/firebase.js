import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC59X-Zgd_cgdtDwK6_i9bq7dHa5qyaCdk",
  authDomain: "clone-ddc61.firebaseapp.com",
  projectId: "clone-ddc61",
  storageBucket: "clone-ddc61.firebasestorage.app",
  messagingSenderId: "1019058496986",
  appId: "1:1019058496986:web:7ef97926c12b8d30680ce3",
  measurementId: "G-Q02BNRMMQW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
