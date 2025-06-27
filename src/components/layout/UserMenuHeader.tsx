
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Calendar, DollarSign, IndianRupee } from 'lucide-react';
import { getInitials } from '@/utils/getInitials';

interface UserMenuHeaderProps {
  profile: any;
  user: any;
  planFeatures: any;
  currency: 'USD' | 'INR';
  streamerMode: boolean;
  onToggleCurrency: () => void;
  onToggleStreamerMode: () => void;
}

const UserMenuHeader = React.memo(({ 
  profile, 
  user, 
  planFeatures, 
  currency, 
  streamerMode, 
  onToggleCurrency, 
  onToggleStreamerMode 
}: UserMenuHeaderProps) => {
  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Let him cook (free)':
        return 'bg-gray-500';
      case 'Cooked':
        return 'bg-purple-500';
      case 'Goated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (dateString: string | null) => {
    if (!dateString) return false;
    const expirationDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
  };

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    const expirationDate = new Date(dateString);
    const today = new Date();
    return expirationDate < today;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#f5dd01] text-black font-semibold">
            {getInitials(profile?.full_name || user?.email || 'U')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>
      
      {/* Plan Information */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Current Plan:</span>
          <Badge 
            className={`${getPlanColor(planFeatures?.plan_name || '')} text-white text-xs`}
          >
            <Crown className="h-3 w-3 mr-1" />
            {planFeatures?.plan_name || 'Loading...'}
          </Badge>
        </div>

        {/* Currency Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Currency:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCurrency}
            className="h-6 px-2 text-xs"
          >
            {currency === 'USD' ? (
              <>
                <DollarSign className="h-3 w-3 mr-1" />
                USD
              </>
            ) : (
              <>
                <IndianRupee className="h-3 w-3 mr-1" />
                INR
              </>
            )}
          </Button>
        </div>

        {/* Plan dates and status */}
        {planFeatures?.activated_at && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Activated:</span>
            <span className="text-xs font-medium text-green-600">
              <Calendar className="h-3 w-3 inline mr-1" />
              {formatDate(planFeatures.activated_at)}
            </span>
          </div>
        )}
        
        {planFeatures?.expires_at && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expires:</span>
              <span className={`text-xs font-medium ${
                isExpired(planFeatures.expires_at) 
                  ? 'text-red-500' 
                  : isExpiringSoon(planFeatures.expires_at) 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
              }`}>
                <Calendar className="h-3 w-3 inline mr-1" />
                {formatDate(planFeatures.expires_at)}
              </span>
            </div>
            
            {isExpired(planFeatures.expires_at) && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                ⚠️ Plan expired. Upgrade to restore full access.
              </div>
            )}
            
            {isExpiringSoon(planFeatures.expires_at) && !isExpired(planFeatures.expires_at) && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                ⏰ Plan expires soon. Consider renewing.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium">Streamer Mode:</span>
          <Button
            variant={streamerMode ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleStreamerMode}
            className={`h-6 px-2 text-xs ${streamerMode ? 'bg-purple-600 text-white' : ''}`}
          >
            {streamerMode ? 'ON' : 'OFF'}
          </Button>
        </div>
        {streamerMode && (
          <div className="text-xs text-purple-500 mt-1">Streamer Mode is active. Currency values are hidden in UI and shared links.</div>
        )}
      </div>
    </div>
  );
});

UserMenuHeader.displayName = 'UserMenuHeader';

export default UserMenuHeader;
