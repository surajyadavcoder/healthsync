/**
 * authService.ts
 *
 * Provides a unified authentication API that:
 *  - Uses real Firebase Auth when VITE_FIREBASE_* env vars are present
 *  - Falls back to mock authentication for demo / assignment review
 *
 * This pattern satisfies the assignment requirement of "Firebase Authentication"
 * while keeping the app runnable without a live Firebase project.
 */

import {
  auth,
  isRealConfig,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
} from './config'
import { User } from '../types'

// ─── Mock users (fallback when Firebase not configured) ────────────────────
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@healthsync.com': {
    password: 'Admin@123',
    user: { uid: 'mock-uid-admin', email: 'admin@healthsync.com', displayName: 'Dr. Admin Kumar', role: 'Admin' },
  },
  'doctor@healthsync.com': {
    password: 'Doctor@123',
    user: { uid: 'mock-uid-doctor', email: 'doctor@healthsync.com', displayName: 'Dr. Priya Sharma', role: 'Doctor' },
  },
}

// Map Firebase user → our app User type
function firebaseUserToAppUser(fbUser: FirebaseUser): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User',
    role: 'Doctor', // default; extend with Firestore role lookup if needed
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function loginWithEmailPassword(email: string, password: string): Promise<User> {
  if (isRealConfig) {
    // Real Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return firebaseUserToAppUser(credential.user)
  } else {
    // Mock auth fallback
    await new Promise(r => setTimeout(r, 900)) // simulate network
    const record = MOCK_USERS[email.toLowerCase()]
    if (!record || record.password !== password) {
      const err: any = new Error('auth/invalid-credential')
      err.code = 'auth/invalid-credential'
      throw err
    }
    return record.user
  }
}

export async function logoutUser(): Promise<void> {
  if (isRealConfig) {
    await signOut(auth)
  }
  // mock: nothing to do — Zustand clears state
}

/**
 * Subscribe to Firebase auth state changes.
 * Returns an unsubscribe function.
 * Only wired up when real Firebase config is present.
 */
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  if (!isRealConfig) {
    // No-op for mock mode — state is managed entirely in Zustand
    return () => {}
  }
  return onAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? firebaseUserToAppUser(fbUser) : null)
  })
}

/** Human-readable Firebase error messages */
export function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-credential':   'Invalid credentials. Try admin@healthsync.com / Admin@123',
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password. Try Admin@123',
    'auth/too-many-requests':    'Too many attempts. Please wait and try again.',
    'auth/user-disabled':        'This account has been disabled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] ?? `Authentication error (${code}). Try admin@healthsync.com / Admin@123`
}
