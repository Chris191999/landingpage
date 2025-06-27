
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserMenuInvitationsProps {
  pendingReceivedInvites: any[];
  pendingSentInvites: any[];
  inviterProfiles: Record<string, { full_name: string | null, email: string }>;
  inviteLoading: boolean;
  onAcceptInvite: (invite: any) => void;
  onDeclineInvite: (invite: any) => void;
}

const UserMenuInvitations = React.memo(({ 
  pendingReceivedInvites, 
  pendingSentInvites, 
  inviterProfiles, 
  inviteLoading, 
  onAcceptInvite, 
  onDeclineInvite 
}: UserMenuInvitationsProps) => {
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-[#f5dd01] text-black';
      case 'advanced': return 'bg-purple-500 text-white';
      case 'basic': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-yellow-400" />
        <span className="font-semibold text-sm text-white">Mentor Invitations</span>
        {pendingReceivedInvites.length > 0 && (
          <Badge className="bg-red-500 text-white text-xs">
            {pendingReceivedInvites.length}
          </Badge>
        )}
      </div>
      
      {inviteLoading && <div className="text-xs text-gray-400 mb-2">Loading invitations...</div>}
      
      {/* Received Invites */}
      {pendingReceivedInvites.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-300 mb-2 flex items-center gap-1">
            <Crown className="w-3 h-3 text-[#f5dd01]" />
            Mentor invitations for you:
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pendingReceivedInvites.map(invite => (
              <div key={invite.id} className="bg-gray-800 rounded-lg p-3 border border-[#f5dd01]/20">
                <div className="text-xs text-gray-300 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <strong>From:</strong> 
                    <span className="text-white">
                      {inviterProfiles[invite.inviter_user_id]?.full_name || 
                       inviterProfiles[invite.inviter_user_id]?.email || 'Unknown Mentor'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>Access Level:</strong>
                    <Badge className={`${getAccessLevelColor(invite.access_level)} text-xs`}>
                      {invite.access_level?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6" 
                    onClick={() => onAcceptInvite(invite)} 
                    disabled={inviteLoading}
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="text-xs px-2 py-1 h-6" 
                    onClick={() => onDeclineInvite(invite)} 
                    disabled={inviteLoading}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Sent Invites */}
      {pendingSentInvites.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-300 mb-1">Your sent invites:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {pendingSentInvites.map((invite: any) => (
              <div key={invite.id} className="flex items-center justify-between bg-gray-800 rounded px-2 py-1">
                <span className="text-white text-xs">To: {invite.invitee_email}</span>
                <div className="flex items-center gap-1">
                  <Badge className={`${getAccessLevelColor(invite.access_level)} text-xs`}>
                    {invite.access_level?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-yellow-400">Pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {pendingReceivedInvites.length === 0 && pendingSentInvites.length === 0 && !inviteLoading && (
        <div className="text-xs text-gray-400">No pending mentor invitations.</div>
      )}
    </div>
  );
});

UserMenuInvitations.displayName = 'UserMenuInvitations';

export default UserMenuInvitations;
