import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";

// RASED prototype runs on local mock auth + in-memory seed data by default
// (see lib/auth/AuthProvider.tsx and lib/store/useAppStore.ts). Firebase is
// wired here so Phase 4 (real Auth/Firestore) can be enabled by supplying
// the NEXT_PUBLIC_FIREBASE_* env vars — nothing else needs to change.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const firebaseApp = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;
