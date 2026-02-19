/**
 * 🟣 SUPABASE CLIENT CONFIGURATION - FIXED ERROR HANDLING
 * Initialize Supabase client for authentication and database access
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables! ' +
    'Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in .env.local'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ✅ FIXED: Get current user (no error if not logged in)
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // ✅ Just return null, don't log error (normal when not logged in)
      return null;
    }
    return user;
  } catch (error) {
    // ✅ Catch any errors and return null
    return null;
  }
};

// ✅ FIXED: Get current session (no error if not logged in)
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      // ✅ Just return null, don't log error
      return null;
    }
    return session;
  } catch (error) {
    // ✅ Catch any errors and return null
    return null;
  }
};

// Helper function: Sign up with email & password
export const signUp = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Signup error:', error.message);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { user: null, error };
  }
};

// Helper function: Sign in with email & password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error.message);
      return { user: null, session: null, error };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error };
  }
};

// Helper function: Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      return { error };
    }
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

// Helper function: Reset password (send email)
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('Password reset error:', error.message);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error };
  }
};

// Helper function: Update password
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Update password error:', error.message);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { error };
  }
};

// Helper function: Update profile
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error.message);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { profile: null, error };
  }
};

// Helper function: Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error.message);
      return { profile: null, error };
    }

    return { profile: data, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error };
  }
};

// Helper function: Check if user has premium
export const checkPremiumStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('premium_status, premium_expires_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Check premium error:', error.message);
      return { isPremium: false, expiresAt: null };
    }

    const isPremium = data.premium_status && 
      (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date());

    return { isPremium, expiresAt: data.premium_expires_at };
  } catch (error) {
    console.error('Check premium error:', error);
    return { isPremium: false, expiresAt: null };
  }
};

// Helper function: Save known word to cloud
export const saveKnownWord = async (userId, wordId) => {
  try {
    const { data, error } = await supabase
      .from('known_words')
      .upsert({
        user_id: userId,
        word_id: wordId,
        learned_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,word_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Save known word error:', error.message);
      return { word: null, error };
    }

    return { word: data, error: null };
  } catch (error) {
    console.error('Save known word error:', error);
    return { word: null, error };
  }
};

// Helper function: Get all known words for user
export const getKnownWords = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('known_words')
      .select('word_id, learned_at, review_count, confidence_level')
      .eq('user_id', userId)
      .order('learned_at', { ascending: false });

    if (error) {
      console.error('Get known words error:', error.message);
      return { words: [], error };
    }

    return { words: data, error: null };
  } catch (error) {
    console.error('Get known words error:', error);
    return { words: [], error };
  }
};

// Helper function: Update user progress
export const updateUserProgress = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Update progress error:', error.message);
      return { progress: null, error };
    }

    return { progress: data, error: null };
  } catch (error) {
    console.error('Update progress error:', error);
    return { progress: null, error };
  }
};

// Helper function: Get user progress
export const getUserProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Get progress error:', error.message);
      return { progress: null, error };
    }

    return { progress: data, error: null };
  } catch (error) {
    console.error('Get progress error:', error);
    return { progress: null, error };
  }
};

// Helper function: Save study session
export const saveStudySession = async (userId, sessionData) => {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        ...sessionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Save session error:', error.message);
      return { session: null, error };
    }

    return { session: data, error: null };
  } catch (error) {
    console.error('Save session error:', error);
    return { session: null, error };
  }
};

export default supabase;