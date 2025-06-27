
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Crown, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { useMentorInvitations } from '@/hooks/mentor/useMentorInvitations';
import MentorDashboard from '../mentor/MentorMode/MentorDashboard';
import MentorInviteManager from '../mentor/MentorMode/MenteeInviteManager';
import MenteeInvitationPage from '../mentor/MenteeInvitationPage';

const MainLayout = () => {
  const [mentorModeOpen, setMentorModeOpen] = useState(false);
  const [invitationsOpen, setInvitationsOpen] = useState(false);
  const { user } = useAuth();
  const { data: planFeatures } = usePlanFeatures();
  const { invitations } = useMentorInvitations();

  // Check if user has Goated plan for mentor access
  const hasGoatedPlan = planFeatures?.plan_name === 'Goated';
  const hasPendingInvitations = invitations.length > 0;
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      
      {/* Mentor Invitations Button - Show for all users with pending invitations */}
      {user && hasPendingInvitations && (
        <Button
          onClick={() => setInvitationsOpen(true)}
          className="fixed z-50 bottom-6 left-6 shadow-2xl bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white rounded-full p-0 w-16 h-16 flex items-center justify-center border-4 border-white/20 hover:scale-105 transition-transform premium-glow"
          style={{ boxShadow: '0 8px 32px 0 rgba(136, 0, 255, 0.25)' }}
          aria-label="View Mentor Invitations"
        >
          <Crown className="w-7 h-7" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {invitations.length}
          </div>
        </Button>
      )}
      
      {/* Only show mentor mode button for Goated plan users and when user is logged in */}
      {user && hasGoatedPlan && (
        <Button
          onClick={() => setMentorModeOpen(true)}
          className="fixed z-50 bottom-6 right-6 shadow-2xl bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white rounded-full p-0 w-16 h-16 flex items-center justify-center border-4 border-white/20 hover:scale-105 transition-transform premium-glow"
          style={{ boxShadow: '0 8px 32px 0 rgba(136, 0, 255, 0.25)' }}
          aria-label="Open Mentor Mode"
        >
          <Crown className="w-7 h-7" />
          <Users className="w-5 h-5 absolute bottom-2 right-2 opacity-80" />
        </Button>
      )}

      {/* Mentor Invitations Dialog */}
      <Dialog open={invitationsOpen} onOpenChange={setInvitationsOpen}>
        <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Crown className="text-yellow-400" /> Mentor Invitations
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 h-full overflow-y-auto">
            <MenteeInvitationPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Mentor Mode Dialog */}
      <Dialog open={mentorModeOpen} onOpenChange={setMentorModeOpen}>
        <DialogContent className="max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Crown className="text-yellow-400" /> Mentor Mode
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="dashboard" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="invites">Manage Invites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6 h-full overflow-y-auto">
              <MentorDashboard onClose={() => setMentorModeOpen(false)} />
            </TabsContent>
            
            <TabsContent value="invites" className="mt-6 h-full overflow-y-auto">
              <MentorInviteManager onRefresh={() => {}} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;
