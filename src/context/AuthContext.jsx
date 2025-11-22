import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase not configured.");
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      // Fetch additional profile data (name, membership status)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const { data: membership } = await supabase
        .from('memberships')
        .select('status, tier')
        .eq('user_id', authUser.id)
        .single();

      if (profile) {
        setUser({
          ...authUser,
          name: profile.full_name || authUser.email.split('@')[0],
          membership: membership?.status === 'active' ? 'active' : 'none',
          tier: membership?.tier || 'free'
        });
      } else {
        // Fallback if profile doesn't exist yet
        setUser({
          ...authUser,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          membership: 'none'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Even on error, we should set the user from authUser so they can access the dashboard
      setUser({
        ...authUser,
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        membership: 'none',
        tier: 'free'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!supabase) throw new Error("Supabase no está configurado.");
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email, password, name) => {
    if (!supabase) throw new Error("Supabase no está configurado.");
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    return supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    if (!supabase) return;
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard?reset=true`,
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
