
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMentorInvitations } from '@/hooks/mentor/useMentorInvitations';
import MentorInvitationCard from './MentorInvitationCard';

const MenteeInvitationPage = () => {
  const { invitations, isLoading, acceptInvitation, declineInvitation, refetch } = useMentorInvitations();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (invitationId: string, accessLevel: 'basic' | 'advanced' | 'full') => {
    setProcessingId(invitationId);
    const success = await acceptInvitation(invitationId, accessLevel);
    setProcessingId(null);
    return success;
  };

  const handleDecline = async (invitationId: string) => {
    setProcessingId(invitationId);
    const success = await declineInvitation(invitationId);
    setProcessingId(null);
    return success;
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5dd01] mx-auto mb-2"></div>
          <div className="text-gray-600">Loading mentor invitations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-[#f5dd01]" />
          <div>
            <h2 className="text-2xl font-bold text-white">Mentor Invitations</h2>
            <p className="text-gray-400">Accept or decline mentor invitations</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {invitations.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              No Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                You don't have any pending mentor invitations.
              </div>
              <div className="text-sm text-gray-400">
                When mentors invite you, their invitations will appear here.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <MentorInvitationCard
              key={invitation.id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isProcessing={processingId === invitation.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenteeInvitationPage;
