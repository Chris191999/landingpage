
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Crown } from 'lucide-react';
import MentorDashboard from './MentorDashboard';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const MentorModeAccess = () => {
  const [showMentorDashboard, setShowMentorDashboard] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start px-2 py-1.5 h-auto text-sm font-normal hover:bg-gray-800"
        onClick={() => setShowMentorDashboard(true)}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-[#f5dd01]" />
            <Crown className="h-3 w-3 text-[#f5dd01]" />
          </div>
          <span className="text-white">Mentor Mode</span>
          <span className="text-xs text-[#f5dd01] font-semibold">PREMIUM</span>
        </div>
      </Button>

      <Dialog open={showMentorDashboard} onOpenChange={setShowMentorDashboard}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
          <MentorDashboard onClose={() => setShowMentorDashboard(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MentorModeAccess;
