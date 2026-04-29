// Firebase configuration
// NOTE: For demo/assignment purposes, this uses environment variables.
// Create a .env file with your Firebase project credentials, OR
// the app falls back to mock authentication automatically.

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth'

// Replace these with your own Firebase project values
// or set them in a .env file as VITE_FIREBASE_* variables
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'demo-api-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'demo-project.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'demo-project',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:000000000000:web:000000000000',
}

// Initialise only once (handles React Strict Mode double-mount)
let app: FirebaseApp
let auth: Auth

const isRealConfig = firebaseConfig.apiKey !== 'demo-api-key'

if (isRealConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
}

export { auth, isRealConfig }
export type { FirebaseUser }
export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}
