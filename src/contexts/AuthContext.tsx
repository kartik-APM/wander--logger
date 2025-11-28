import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { createUserProfile, getUserProfile } from '../lib/firestore';
import { User } from '../types/user';
import { Timestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(firebaseUser: FirebaseUser | null) {
    if (firebaseUser) {
      try {
        // Get or create user profile in Firestore
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

        setCurrentUser(userProfile);

        // Check if provider is email and password login
        const isEmail = firebaseUser.providerData.some(
          (provider) => provider.providerId === 'password'
        );
        setIsEmailUser(isEmail);

        // Check if the auth provider is Google
        const isGoogle = firebaseUser.providerData.some(
          (provider) => provider.providerId === 'google.com'
        );
        setIsGoogleUser(isGoogle);

        setUserLoggedIn(true);
      } catch (error) {
        console.error('Error initializing user:', error);
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    }

    setLoading(false);
  }

  const value: AuthContextType = {
    currentUser,
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    loading,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
