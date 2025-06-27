import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  status: 'pending_approval' | 'active' | 'inactive';
  plan: string | null;
  activated_at: string | null;
  expires_at: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!session) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      setTimeout(async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        // If user signed out while we were fetching, abort
        if (!currentUser || currentUser.id !== session.user.id) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          if (profileData.status === "active") {
            setSession(session);
            setUser(session.user);
            setProfile(profileData as Profile);
          } else {
            if (profileData.status === "pending_approval") {
              if (event === "SIGNED_IN") {
                toast.warning(
                  "Your email is verified. Your account is now pending admin approval."
                );
              } else {
                toast.info("Your account is still pending admin approval.");
              }
            } else if (profileData.status === "inactive") {
              toast.error("Your account is inactive. Please contact support.");
            }
            await supabase.auth.signOut();
          }
        } else {
          toast.error("Could not retrieve user profile. Please try again.");
          await supabase.auth.signOut();
        }
        setLoading(false);
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    navigate('/');
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
