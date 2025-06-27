
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface MentorInvitation {
  id: string;
  inviter_user_id: string;
  invitee_email: string;
  access_level: 'basic' | 'advanced' | 'full';
  status: string;
  created_at: string;
  inviter_profile?: {
    full_name: string | null;
    email: string;
  };
}

export const useMentorInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<MentorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch pending invitations for the current user
      const { data: invites, error } = await supabase
        .from('mentor_invitations')
        .select('*')
        .eq('invitee_email', user.email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        return;
      }

      // Get inviter profiles
      const inviterIds = invites?.map(invite => invite.inviter_user_id) || [];
      let inviterProfiles: Record<string, { full_name: string | null, email: string }> = {};

      if (inviterIds.length > 0) {
        // Fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', inviterIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Get emails via edge function
        try {
          const { data: userEmails, error: emailError } = await supabase.functions.invoke('get-profiles-with-email');
          if (!emailError && userEmails) {
            const emailMap = userEmails.reduce((acc: Record<string, string>, userData: any) => {
              acc[userData.id] = userData.email;
              return acc;
            }, {});

            // Combine profile and email data
            inviterProfiles = (profiles || []).reduce((acc, profile) => {
              acc[profile.id] = {
                full_name: profile.full_name,
                email: emailMap[profile.id] || 'Unknown'
              };
              return acc;
            }, {} as Record<string, { full_name: string | null, email: string }>);
          }
        } catch (emailError) {
          console.error('Error fetching emails:', emailError);
        }
      }

      // Map invitations with inviter profiles and ensure proper typing
      const invitationsWithProfiles = (invites || []).map(invite => ({
        ...invite,
        access_level: invite.access_level as 'basic' | 'advanced' | 'full',
        inviter_profile: inviterProfiles[invite.inviter_user_id]
      }));

      setInvitations(invitationsWithProfiles);
    } catch (error) {
      console.error('Error in fetchInvitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInvitation = async (invitationId: string, accessLevel: 'basic' | 'advanced' | 'full') => {
    if (!user) return false;

    try {
      // Get the invitation details
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) {
        toast.error('Invitation not found');
        return false;
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from('mentor_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Error updating invitation:', updateError);
        toast.error('Failed to accept invitation');
        return false;
      }

      // Create mentor relationship
      const { error: relationshipError } = await supabase
        .from('mentor_relationships')
        .insert({
          mentor_user_id: invitation.inviter_user_id,
          mentee_user_id: user.id,
          access_level: accessLevel,
          active: true
        });

      if (relationshipError) {
        console.error('Error creating relationship:', relationshipError);
        toast.error('Failed to create mentor relationship');
        return false;
      }

      toast.success('Mentor invitation accepted successfully!');
      await fetchInvitations(); // Refresh invitations
      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation');
      return false;
    }
  };

  const declineInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('mentor_invitations')
        .update({ 
          status: 'declined',
          revoked_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) {
        console.error('Error declining invitation:', error);
        toast.error('Failed to decline invitation');
        return false;
      }

      toast.success('Invitation declined');
      await fetchInvitations(); // Refresh invitations
      return true;
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation');
      return false;
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    invitations,
    isLoading,
    acceptInvitation,
    declineInvitation,
    refetch: fetchInvitations
  };
};
