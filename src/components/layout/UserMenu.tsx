
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Crown, Key, Shield, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { supabase } from '@/integrations/supabase/client';
import { getInitials } from '@/utils/getInitials';
import { Link } from 'react-router-dom';
import { useStreamerMode } from './StreamerModeProvider';
import { toast } from 'sonner';
import UserMenuHeader from './UserMenuHeader';
import MentorModeAccess from '@/components/mentor/MentorMode/MentorModeAccess';

const UserMenu = () => {
  const { user, profile } = useAuth();
  const { data: planFeatures, refetch: refetchPlanFeatures } = usePlanFeatures();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const { streamerMode, setStreamerMode } = useStreamerMode();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  const handleMenuOpen = useCallback(() => {
    refetchPlanFeatures();
  }, [refetchPlanFeatures]);

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === 'USD' ? 'INR' : 'USD';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: { currency: newCurrency } }));
  }, [currency]);

  const toggleStreamerMode = useCallback(() => {
    setStreamerMode(!streamerMode);
  }, [streamerMode, setStreamerMode]);

  const isAdmin = profile?.role === 'admin';
  const isGoatedUser = planFeatures?.plan_name === 'Goated';

  useEffect(() => {
    localStorage.setItem('streamerMode', streamerMode ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('streamerModeChange', { detail: { streamerMode } }));
  }, [streamerMode]);

  return (
    <DropdownMenu onOpenChange={(open) => open && handleMenuOpen()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#f5dd01] text-black font-semibold">
              {getInitials(profile?.full_name || user?.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <UserMenuHeader
            profile={profile}
            user={user}
            planFeatures={planFeatures}
            currency={currency}
            streamerMode={streamerMode}
            onToggleCurrency={toggleCurrency}
            onToggleStreamerMode={toggleStreamerMode}
          />
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {isGoatedUser && (
          <>
            <MentorModeAccess />
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex items-center cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            <span>Manage Plan</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/update-password" className="flex items-center cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
