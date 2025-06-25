
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userType?: string) => Promise<{ error: any }>;
  signUpWithPhone: (phone: string, password: string, userType?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || session?.user?.phone);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || session?.user?.phone);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userType: string = 'user') => {
    try {
      // Use the current window origin for redirect URL
      const redirectUrl = window.location.origin;
      
      console.log('Signing up user:', email, 'as', userType);
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            user_type: userType
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
      } else {
        console.log('Sign up successful:', data);
      }

      return { error };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { error: err };
    }
  };

  const signUpWithPhone = async (phone: string, password: string, userType: string = 'user') => {
    try {
      console.log('Signing up user with phone:', phone, 'as', userType);
      
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });

      if (error) {
        console.error('Phone sign up error:', error);
      } else {
        console.log('Phone sign up successful:', data);
      }

      return { error };
    } catch (err) {
      console.error('Phone sign up exception:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful:', data?.user?.email);
      }

      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: err };
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      console.log('Signing in user with phone:', phone);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        console.error('Phone sign in error:', error);
      } else {
        console.log('Phone sign in successful:', data?.user?.phone);
      }

      return { error };
    } catch (err) {
      console.error('Phone sign in exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signUpWithPhone,
    signIn,
    signInWithPhone,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
