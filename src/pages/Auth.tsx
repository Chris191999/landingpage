import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginData, SignupData, ForgotPasswordData } from '@/lib/schemas/auth';
import AuthBackground from '@/components/auth/AuthBackground';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthTabs from '@/components/auth/AuthTabs';
import AuthFooter from '@/components/auth/AuthFooter';

const AuthPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (data: LoginData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignup = useCallback(async (data: SignupData): Promise<boolean> => {
    setLoading(true);
    console.log('Starting signup process for:', data.email);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      console.log('User signed up successfully, now sending admin notification...');

      // Notify admin via Edge Function
      try {
        const { error: notificationError } = await supabase.functions.invoke('send-signup-notification', {
          body: {
            fullName: data.fullName,
            email: data.email,
            pricingPlan: data.pricingPlan,
            auraCode: data.auraCode,
          },
        });

        if (notificationError) {
          console.error('Error sending admin notification:', notificationError);
          toast.warning('Account created but admin notification failed. Please contact support.');
        }
      } catch (e) {
        console.error('Failed to send admin notification:', e);
        toast.warning('Account created but admin notification failed. Please contact support.');
      }

      toast.success('Check your email for a confirmation link. Your account will be active after admin approval.');
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleForgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setLoading(true);

    try {
      const { data: status, error: rpcError } = await supabase.rpc(
        "get_user_status_by_email",
        { p_email: data.email }
      );
      
      if (rpcError) {
        console.error("Error fetching user status:", rpcError);
        toast.success("If an account with this email exists, a password reset link has been sent.");
        return;
      }

      if (status === 'inactive') {
        toast.error('Your account is inactive. Please contact support.');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("If an account with this email exists, a password reset link has been sent.");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);
  
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuthBackground />
      
      <div className="flex justify-center items-center min-h-screen relative z-10">
        <Card className="w-[480px] max-w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
          <CardHeader>
            <AuthHeader />
          </CardHeader>
          <CardContent className="py-4 px-6">
            <AuthTabs 
              onLogin={handleLogin}
              onSignup={handleSignup}
              onForgotPassword={handleForgotPassword}
              loading={loading}
            />
            <AuthFooter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
