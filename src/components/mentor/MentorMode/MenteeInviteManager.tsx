import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, UserPlus, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MenteeInviteManagerProps {
  onRefresh: () => void;
}

type AccessLevel = 'basic' | 'advanced' | 'full';

interface Invite {
  id: string;
  invitee_email: string;
  access_level: AccessLevel;
  created_at: string;
  status: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
}

interface Relationship {
  id: string;
  mentee_user_id: string;
  access_level: AccessLevel;
  created_at: string;
  mentee_profile?: {
    id: string;
    full_name?: string;
  };
}

const MenteeInviteManager = ({ onRefresh }: MenteeInviteManagerProps) => {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('basic');
  const [isInviting, setIsInviting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [activeRelationships, setActiveRelationships] = useState<Relationship[]>([]);

  useEffect(() => {
    fetchInvitesAndRelationships();
  }, [user]);

  const fetchInvitesAndRelationships = async () => {
    if (!user) return;

    try {
      // Fetch pending invites
      const { data: invites, error: invitesError } = await supabase
        .from('mentor_invitations')
        .select('*')
        .eq('inviter_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitesError) {
        console.error('Error fetching invites:', invitesError);
      }

      // Fetch active relationships
      const { data: relationships, error: relationshipsError } = await supabase
        .from('mentor_relationships')
        .select('*')
        .eq('mentor_user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (relationshipsError) {
        console.error('Error fetching relationships:', relationshipsError);
      }

      // Get mentee user IDs to fetch their profiles separately
      const menteeUserIds = relationships?.map(rel => rel.mentee_user_id) || [];
      
      let profiles: any[] = [];
      if (menteeUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', menteeUserIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profiles = profilesData || [];
        }
      }

      // Create a profile lookup map
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      // Process invites with proper type casting
      const processedInvites: Invite[] = (invites || []).map(invite => ({
        id: invite.id,
        invitee_email: invite.invitee_email,
        access_level: invite.access_level as AccessLevel,
        created_at: invite.created_at,
        status: invite.status,
        accepted_at: invite.accepted_at,
        revoked_at: invite.revoked_at
      }));

      // Process relationships with profile data
      const processedRelationships: Relationship[] = (relationships || []).map(rel => ({
        id: rel.id,
        mentee_user_id: rel.mentee_user_id,
        access_level: rel.access_level as AccessLevel,
        created_at: rel.created_at,
        mentee_profile: profileMap[rel.mentee_user_id] || undefined
      }));

      setPendingInvites(processedInvites);
      setActiveRelationships(processedRelationships);
    } catch (error) {
      console.error('Error fetching invites and relationships:', error);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to send invites');
      return;
    }

    setIsInviting(true);
    try {
      // Create the invitation - the unique constraint will prevent duplicates
      const { error } = await supabase
        .from('mentor_invitations')
        .insert([{
          inviter_user_id: user.id,
          invitee_email: inviteEmail.trim(),
          access_level: accessLevel,
          status: 'pending'
        }]);

      if (error) {
        // Handle duplicate invitation error gracefully
        if (error.code === '23505' && error.message.includes('unique_pending_invite')) {
          toast.error('An invitation is already pending for this email');
        } else {
          console.error('Error sending invite:', error);
          toast.error('Failed to send invitation: ' + error.message);
        }
        return;
      }

      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setAccessLevel('basic');
      fetchInvitesAndRelationships();
    } catch (error: any) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('mentor_invitations')
        .update({ status: 'revoked', revoked_at: new Date().toISOString() })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Invitation revoked');
      fetchInvitesAndRelationships();
    } catch (error: any) {
      console.error('Error revoking invite:', error);
      toast.error('Failed to revoke invitation');
    }
  };

  const handleRemoveRelationship = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from('mentor_relationships')
        .update({ active: false })
        .eq('id', relationshipId);

      if (error) throw error;

      toast.success('Mentee relationship removed');
      fetchInvitesAndRelationships();
      onRefresh();
    } catch (error: any) {
      console.error('Error removing relationship:', error);
      toast.error('Failed to remove relationship');
    }
  };

  const getAccessLevelColor = (level: AccessLevel) => {
    switch (level) {
      case 'full': return 'bg-[#f5dd01] text-black';
      case 'advanced': return 'bg-purple-500 text-white';
      case 'basic': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAccessLevelDescription = (level: AccessLevel) => {
    switch (level) {
      case 'basic': return 'View basic performance metrics';
      case 'advanced': return 'View detailed analytics and trade history';
      case 'full': return 'Full access to all mentee data and feedback tools';
      default: return '';
    }
  };

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Send New Invite */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#f5dd01]" />
            Invite New Mentee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="mentee@example.com"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access" className="text-gray-300">Access Level</Label>
              <Select value={accessLevel} onValueChange={(value: AccessLevel) => setAccessLevel(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="basic">Basic Access</SelectItem>
                  <SelectItem value="advanced">Advanced Access</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSendInvite}
                disabled={isInviting}
                className="w-full bg-[#f5dd01] text-black hover:bg-[#f5dd01]/90"
              >
                <Send className="h-4 w-4 mr-2" />
                {isInviting ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {getAccessLevelDescription(accessLevel)}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              Pending Invitations ({pendingInvites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 rounded bg-gray-700/30 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-white">{invite.invitee_email}</div>
                      <div className="text-xs text-gray-400">
                        Sent {new Date(invite.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getAccessLevelColor(invite.access_level)}>
                      {invite.access_level?.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevokeInvite(invite.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Relationships */}
      {activeRelationships.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Active Mentees ({activeRelationships.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeRelationships.map((relationship) => (
                <div key={relationship.id} className="flex items-center justify-between p-3 rounded bg-gray-700/30 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-white">
                        {relationship.mentee_profile?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Connected {new Date(relationship.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getAccessLevelColor(relationship.access_level)}>
                      {relationship.access_level?.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveRelationship(relationship.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Level Guide */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Access Level Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge className="bg-gray-500 text-white">BASIC</Badge>
            <div className="text-sm text-gray-300">
              View basic performance metrics, win rate, and total P&L
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-purple-500 text-white">ADVANCED</Badge>
            <div className="text-sm text-gray-300">
              Full analytics dashboard, trade history, and performance insights
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-[#f5dd01] text-black">FULL</Badge>
            <div className="text-sm text-gray-300">
              Complete access including feedback tools, goals, and behavioral analysis
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenteeInviteManager;
