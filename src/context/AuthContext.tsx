import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSession, setupAuthListener } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error('Error loading session:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to load your session. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();

    // Set up auth state change listener
    const subscription = setupAuthListener((session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Extract user information from the session
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatar_url: session.user.user_metadata?.avatar_url,
      }
    : null;

  const value = {
    session,
    isLoading,
    isAuthenticated: !!session,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
