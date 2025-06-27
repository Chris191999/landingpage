
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, Clock } from 'lucide-react';
import { MentorInvitation } from '@/hooks/mentor/useMentorInvitations';

interface MentorInvitationCardProps {
  invitation: MentorInvitation;
  onAccept: (invitationId: string, accessLevel: 'basic' | 'advanced' | 'full') => Promise<boolean>;
  onDecline: (invitationId: string) => Promise<boolean>;
  isProcessing: boolean;
}

const MentorInvitationCard = ({ invitation, onAccept, onDecline, isProcessing }: MentorInvitationCardProps) => {
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-[#f5dd01] text-black';
      case 'advanced': return 'bg-purple-500 text-white';
      case 'basic': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAccessLevelDescription = (level: string) => {
    switch (level) {
      case 'basic': return 'View basic performance metrics and receive feedback';
      case 'advanced': return 'Access detailed analytics, trade history, and comprehensive feedback';
      case 'full': return 'Complete access including goal setting, behavioral analysis, and advanced mentoring tools';
      default: return '';
    }
  };

  const handleAccept = async () => {
    const success = await onAccept(invitation.id, invitation.access_level);
    if (success) {
      // Card will be removed from list automatically when refetch happens
    }
  };

  const handleDecline = async () => {
    const success = await onDecline(invitation.id);
    if (success) {
      // Card will be removed from list automatically when refetch happens
    }
  };

  return (
    <Card className="border-2 border-[#f5dd01]/20 hover:border-[#f5dd01]/40 transition-colors bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#f5dd01]" />
            Mentor Invitation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-gray-400">
              {new Date(invitation.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mentor Info */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">From Mentor:</h4>
          <div className="text-sm">
            <div className="text-white font-medium">
              {invitation.inviter_profile?.full_name || 'Unknown Mentor'}
            </div>
            <div className="text-gray-400">
              {invitation.inviter_profile?.email || invitation.inviter_user_id}
            </div>
          </div>
        </div>

        {/* Access Level */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-white">Access Level:</h4>
            <Badge className={getAccessLevelColor(invitation.access_level)}>
              {invitation.access_level?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-300">
            {getAccessLevelDescription(invitation.access_level)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept Invitation
          </Button>
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isProcessing}
            className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorInvitationCard;
