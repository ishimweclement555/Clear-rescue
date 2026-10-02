import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FbUser } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;
  isCustomer: boolean;
  isTechnician: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  customer: {
    uid: 'demo-customer-01',
    email: 'facilities@kigalihq.rw',
    displayName: 'Jean-Paul Mugisha',
    role: 'customer',
    organizationId: 'org-rwanda-demo',
    organizationName: 'Kigali Holdings Ltd',
    phone: '+250 788 123 456',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    createdAt: '2026-01-10T08:00:00Z',
  },
  technician: {
    uid: 'demo-tech-01',
    email: 'emmanuel.tech@clearrescue.rw',
    displayName: 'Emmanuel Nshimiyimana',
    role: 'technician',
    organizationId: 'org-rwanda-demo',
    organizationName: 'CLEAR RESCUE Field Support',
    phone: '+250 788 987 654',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    createdAt: '2026-01-05T08:00:00Z',
  },
  admin: {
    uid: 'demo-admin-01',
    email: 'ishimweclement537@gmail.com',
    displayName: 'Clement Ishimwe',
    role: 'admin',
    organizationId: 'org-rwanda-demo',
    organizationName: 'CLEAR RESCUE AI - Central Command',
    phone: '+250 788 555 777',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    createdAt: '2026-01-01T08:00:00Z',
  },
  superadmin: {
    uid: 'demo-superadmin-01',
    email: 'admin.super@clearrescue.rw',
    displayName: 'Aline Mukamana (Super Admin)',
    role: 'superadmin',
    organizationId: 'org-rwanda-demo',
    organizationName: 'CLEAR RESCUE AI Global',
    phone: '+250 788 999 000',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    createdAt: '2026-01-01T08:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Default to admin demo user for full evaluator discovery
    const saved = localStorage.getItem('clear_rescue_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS.admin;
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FbUser | null) => {
      if (fbUser) {
        const isAdminEmail = fbUser.email === 'ishimweclement537@gmail.com';
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || 'user@clearrescue.rw',
          displayName: fbUser.displayName || 'Authorized User',
          role: isAdminEmail ? 'admin' : 'customer',
          organizationId: 'org-rwanda-demo',
          organizationName: 'Kigali Enterprise Safety',
          avatarUrl: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('clear_rescue_user', JSON.stringify(profile));
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = cred.user;
      const isAdminEmail = fbUser.email === 'ishimweclement537@gmail.com';
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Authorized User',
        role: isAdminEmail ? 'admin' : 'customer',
        organizationId: 'org-rwanda-demo',
        organizationName: 'Kigali Operations Hub',
        avatarUrl: fbUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      localStorage.setItem('clear_rescue_user', JSON.stringify(profile));
    } catch (err) {
      console.error('Firebase Google sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    localStorage.setItem('clear_rescue_user', JSON.stringify(demo));
  };

  const switchRole = (role: UserRole) => {
    loginAsDemoUser(role);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('clear_rescue_user');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('clear_rescue_user', JSON.stringify(updated));
  };

  const isCustomer = user?.role === 'customer';
  const isTechnician = user?.role === 'technician';
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        updateProfile,
        switchRole,
        isCustomer,
        isTechnician,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
