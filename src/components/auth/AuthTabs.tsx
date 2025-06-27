
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LoginData, SignupData, ForgotPasswordData } from '@/lib/schemas/auth';

interface AuthTabsProps {
  onLogin: (data: LoginData) => Promise<void>;
  onSignup: (data: SignupData) => Promise<boolean>;
  onForgotPassword: (data: ForgotPasswordData) => Promise<void>;
  loading: boolean;
}

const AuthTabs = React.memo(({ onLogin, onSignup, onForgotPassword, loading }: AuthTabsProps) => {
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);

  const handleBackToLogin = useCallback(() => {
    setIsForgotPasswordView(false);
  }, []);

  const handleForgotPassword = useCallback(() => {
    setIsForgotPasswordView(true);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    if (value === 'login') {
      setIsForgotPasswordView(false);
    }
  }, []);

  return (
    <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
        <TabsTrigger 
          value="login" 
          className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        {isForgotPasswordView ? (
          <ForgotPasswordForm 
            onForgotPassword={onForgotPassword}
            onBackToLogin={handleBackToLogin}
            loading={loading}
          />
        ) : (
          <LoginForm 
            onLogin={onLogin}
            onForgotPassword={handleForgotPassword}
            loading={loading}
          />
        )}
      </TabsContent>

      <TabsContent value="signup">
        <SignupForm onSignup={onSignup} loading={loading} />
      </TabsContent>
    </Tabs>
  );
});

AuthTabs.displayName = 'AuthTabs';

export default AuthTabs;
