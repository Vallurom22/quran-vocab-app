/**
 * 🔐 AUTH CONTEXT - WITH PERSISTENT SESSION
 * Remembers user login across browser sessions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check for existing session on mount
    checkUser();

    // ✅ Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);
        
        if (session?.user) {
          setUser(session.user);
          
          // ✅ Save session to localStorage for persistence
          localStorage.setItem('supabase_user', JSON.stringify(session.user));
          console.log('✅ User session saved to localStorage');
        } else {
          setUser(null);
          localStorage.removeItem('supabase_user');
          console.log('🚪 User session removed from localStorage');
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Check for existing user session
  const checkUser = async () => {
    try {
      // First, try to get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }

      if (session?.user) {
        console.log('✅ Found active Supabase session');
        setUser(session.user);
        localStorage.setItem('supabase_user', JSON.stringify(session.user));
      } else {
        // ✅ Fallback: Check localStorage for saved user
        const savedUser = localStorage.getItem('supabase_user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('✅ Restored user from localStorage');
            setUser(parsedUser);
            
            // Try to refresh the session
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.log('⚠️ Could not refresh session:', refreshError.message);
              // Keep the user logged in anyway (offline mode)
            }
          } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('supabase_user');
          }
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Sign in successful');
      return { user: data.user, error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { user: null, error };
    }
  };

  // Sign up with email/password
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;

      console.log('✅ Sign up successful');
      return { user: data.user, error: null };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { user: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      setUser(null);
      localStorage.removeItem('supabase_user');
      localStorage.removeItem('trial_info');
      localStorage.removeItem('subscription_status');
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      console.log('✅ Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
