import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import { createUserProfile, getUserProfile } from '../lib/firestore';
import { User } from '../types/user';
import { Timestamp } from 'firebase/firestore';

export const useAuth = () => {
  const { user, loading, error, setUser, setError, clearUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get or create user profile
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            };
            await createUserProfile(newUser);
            userProfile = newUser;
          }

          setUser(userProfile);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user profile');
        }
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setError]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
      // Auth state listener will handle loading and user state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      clearUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };
};
