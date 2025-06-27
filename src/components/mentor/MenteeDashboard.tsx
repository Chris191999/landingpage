import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import MentorCard from './MentorCard';

interface MentorProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  status: string | null;
  plan: string | null;
  activated_at: string | null;
  expires_at: string | null;
  access_level: 'basic' | 'advanced' | 'full';
}

interface Feedback {
  id: string;
  mentor_user_id: string;
  comments: string | null;
  rating: number | null;
  feedback_type: string;
  created_at: string;
}

interface Goal {
  id: string;
  mentor_user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  completed: boolean;
  created_at: string;
}

interface MenteeDashboardProps {
  mentors?: MentorProfile[];
}

const accessLevelOrder = ['basic', 'advanced', 'full'] as const;

const MenteeDashboard = ({ mentors: mentorsProp }: MenteeDashboardProps) => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorProfile[]>(mentorsProp || []);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [endingRelationship, setEndingRelationship] = useState<string | null>(null);

  const fetchMentorData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    
    try {
      if (!user) return;

      if (showRefreshIndicator) setLoading(false);
      else setLoading(true);

      // Fetch mentor relationships with access_level
      const { data: mentorRels } = await supabase
        .from('mentor_relationships')
        .select('mentor_user_id, access_level')
        .eq('mentee_user_id', user.id)
        .eq('active', true);

      const mentorMap: Record<string, { access_level: 'basic' | 'advanced' | 'full' }> = {};
      const mentorIds = mentorRels?.map((r: any) => {
        // If multiple relationships, keep the highest access
        const id = r.mentor_user_id;
        const level = r.access_level;
        if (!mentorMap[id] || accessLevelOrder.indexOf(level) > accessLevelOrder.indexOf(mentorMap[id].access_level)) {
          mentorMap[id] = { access_level: level };
        }
        return id;
      }) || [];

      let mentorProfiles: MentorProfile[] = [];
      if (mentorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, role, status, plan, activated_at, expires_at')
          .in('id', mentorIds);
        mentorProfiles = (profiles || []).map((profile: any) => ({
          ...profile,
          access_level: mentorMap[profile.id]?.access_level || 'basic',
        }));
      }
      setMentors(mentorProfiles);

      // Fetch feedback
      const { data: feedbackData } = await supabase
        .from('mentor_feedback')
        .select('*')
        .eq('mentee_user_id', user.id)
        .order('created_at', { ascending: false });
      setFeedback(feedbackData || []);

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('mentor_milestones')
        .select('*')
        .eq('mentee_user_id', user.id)
        .order('created_at', { ascending: false });
      setGoals(goalsData || []);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      toast.error('Failed to load mentor data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (mentorsProp) {
      setMentors(mentorsProp);
      setLoading(false);
      return;
    }
    if (!user) return;
    
    fetchMentorData();

    // Set up real-time subscriptions for feedback and goals
    const feedbackChannel = supabase
      .channel('mentor-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentor_feedback',
          filter: `mentee_user_id=eq.${user.id}`
        },
        () => {
          console.log('Feedback updated, refreshing...');
          fetchMentorData(true);
        }
      )
      .subscribe();

    const goalsChannel = supabase
      .channel('mentor-goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentor_milestones',
          filter: `mentee_user_id=eq.${user.id}`
        },
        () => {
          console.log('Goals updated, refreshing...');
          fetchMentorData(true);
        }
      )
      .subscribe();

    const relationshipsChannel = supabase
      .channel('mentor-relationships-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentor_relationships',
          filter: `mentee_user_id=eq.${user.id}`
        },
        () => {
          console.log('Relationships updated, refreshing...');
          fetchMentorData(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(feedbackChannel);
      supabase.removeChannel(goalsChannel);
      supabase.removeChannel(relationshipsChannel);
    };
  }, [user, mentorsProp]);

  const handleEndRelationship = async (mentorId: string) => {
    setEndingRelationship(mentorId);
    try {
      // Delete all mentor-related data in proper order to avoid foreign key constraints
      
      // Delete mentor_feedback
      const { error: feedbackError } = await supabase
        .from('mentor_feedback')
        .delete()
        .eq('mentor_user_id', mentorId)
        .eq('mentee_user_id', user.id);
      
      if (feedbackError) {
        console.error('Error deleting feedback:', feedbackError);
      }

      // Delete mentor_milestones
      const { error: milestonesError } = await supabase
        .from('mentor_milestones')
        .delete()
        .eq('mentor_user_id', mentorId)
        .eq('mentee_user_id', user.id);
      
      if (milestonesError) {
        console.error('Error deleting milestones:', milestonesError);
      }

      // Delete mentor_relationships
      const { error: relError } = await supabase
        .from('mentor_relationships')
        .delete()
        .eq('mentor_user_id', mentorId)
        .eq('mentee_user_id', user.id);

      if (relError) throw relError;

      // Delete mentor_invitations
      const { error: inviteError } = await supabase
        .from('mentor_invitations')
        .delete()
        .eq('inviter_user_id', mentorId)
        .eq('invitee_email', user.email);
      
      if (inviteError) {
        console.error('Error deleting invitation:', inviteError);
      }

      toast.success('Mentor relationship ended successfully. All related data has been removed.');
      await fetchMentorData();
    } catch (error: any) {
      console.error('Error ending relationship:', error);
      toast.error('Failed to end mentor relationship: ' + error.message);
    } finally {
      setEndingRelationship(null);
    }
  };

  const handleRefresh = () => {
    fetchMentorData(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading your mentor dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Mentors</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {mentors.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              No Mentor Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                You don't have an active mentor relationship yet.
              </div>
              <div className="text-sm text-gray-400">
                If you have received an invite, please accept it from the user menu.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => {
            const mentorFeedback = feedback.filter(fb => fb.mentor_user_id === mentor.id);
            const mentorGoals = goals.filter(goal => goal.mentor_user_id === mentor.id);
            
            return (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                mentorFeedback={mentorFeedback}
                mentorGoals={mentorGoals}
                onEndRelationship={handleEndRelationship}
                isEndingRelationship={endingRelationship === mentor.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenteeDashboard;
