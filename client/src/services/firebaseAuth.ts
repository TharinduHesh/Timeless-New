import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export const firebaseAuthService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Get ID token for API authentication
  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};
