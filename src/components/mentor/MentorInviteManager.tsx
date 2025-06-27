import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Clock, CheckCircle, XCircle, Trash2, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MentorInviteManager = () => {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('basic');
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInvites();
    }
  }, [user]);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_invitations')
        .select('*')
        .eq('inviter_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast.error('Failed to load invites');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setLoading(true);
    try {
      // Check if there's already a pending invite to this email
      const { data: existingInvite } = await supabase
        .from('mentor_invitations')
        .select('*')
        .eq('inviter_user_id', user.id)
        .eq('invitee_email', inviteEmail.trim())
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        toast.error('You already have a pending invitation to this email address');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('mentor_invitations')
        .insert([
          {
            inviter_user_id: user.id,
            invitee_email: inviteEmail.trim(),
            access_level: accessLevel,
          },
        ]);

      if (error) throw error;

      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setAccessLevel('basic');
      fetchInvites();
    } catch (error: any) {
      console.error('Error sending invite:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string, inviteeEmail: string) => {
    try {
      // First update the invitation status
      const { error: updateError } = await supabase
        .from('mentor_invitations')
        .update({ 
          status: 'revoked', 
          revoked_at: new Date().toISOString() 
        })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // Also clean up any existing relationship data if the invite was already accepted
      // Get the user ID from the email
      const { data: userProfile } = await supabase.rpc('get_profiles_with_email');
      const inviteeUser = userProfile?.find((profile: any) => profile.email === inviteeEmail);
      
      if (inviteeUser) {
        // Clean up mentor relationships
        await supabase
          .from('mentor_relationships')
          .delete()
          .eq('mentor_user_id', user.id)
          .eq('mentee_user_id', inviteeUser.id);

        // Clean up feedback
        await supabase
          .from('mentor_feedback')
          .delete()
          .eq('mentor_user_id', user.id)
          .eq('mentee_user_id', inviteeUser.id);

        // Clean up milestones
        await supabase
          .from('mentor_milestones')
          .delete()
          .eq('mentor_user_id', user.id)
          .eq('mentee_user_id', inviteeUser.id);
      }

      toast.success('Invitation revoked and all related data cleaned up');
      fetchInvites();
    } catch (error: any) {
      console.error('Error revoking invite:', error);
      toast.error(error.message || 'Failed to revoke invitation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="border-red-500 text-red-600"><XCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[80vh]">
      {/* Access Level Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Access Level Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Access</h4>
              <ul className="text-xs space-y-1">
                <li>• View trade summary</li>
                <li>• Basic performance metrics</li>
                <li>• Trade count and win rate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advanced Access</h4>
              <ul className="text-xs space-y-1">
                <li>• Full trade details</li>
                <li>• Complete analytics dashboard</li>
                <li>• Provide feedback on trades</li>
                <li>• Advanced performance metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Full Access</h4>
              <ul className="text-xs space-y-1">
                <li>• Everything in Advanced</li>
                <li>• Set goals and milestones</li>
                <li>• Track progress over time</li>
                <li>• Complete mentor dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Send Mentor Invitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="email"
                  placeholder="Enter mentee's email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Access</SelectItem>
                  <SelectItem value="advanced">Advanced Access</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              <Mail className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No invitations sent yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.invitee_email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {invite.access_level}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(invite.status)}</TableCell>
                    <TableCell>
                      {new Date(invite.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {invite.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevokeInvite(invite.id, invite.invitee_email)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Revoke
                        </Button>
                      )}
                      {invite.status === 'accepted' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevokeInvite(invite.id, invite.invitee_email)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          End Relationship
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorInviteManager;
