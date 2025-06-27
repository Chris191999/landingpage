
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Target, MoreVertical, Trash2 } from 'lucide-react';
import { getInitials } from '@/utils/getInitials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MentorCardProps {
  mentor: any;
  mentorFeedback: any[];
  mentorGoals: any[];
  onEndRelationship: (mentorId: string) => void;
  isEndingRelationship?: boolean;
}

const MentorCard = ({ 
  mentor, 
  mentorFeedback, 
  mentorGoals, 
  onEndRelationship,
  isEndingRelationship = false 
}: MentorCardProps) => {
  const level = mentor.access_level;
  
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#f5dd01] text-black font-semibold">
                {getInitials(mentor.full_name || 'M')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{mentor.full_name || 'Mentor'}</h3>
              <div className="text-sm text-gray-500">
                {mentor.role} • {mentor.plan}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`capitalize ${getAccessLevelColor(level)}`}>
              {level} access
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onEndRelationship(mentor.id)}
                  disabled={isEndingRelationship}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  End Relationship
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {level === 'basic' && (
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-gray-700 text-sm">
              You have basic access to trade summary and performance metrics. 
              Request your mentor to upgrade your access for more features.
            </div>
          </div>
        )}
        
        {(level === 'advanced' || level === 'full') && (
          <div className="space-y-4">
            {/* Feedback Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">
                  Feedback ({mentorFeedback.length})
                </h4>
              </div>
              {mentorFeedback.length === 0 ? (
                <p className="text-gray-500 text-sm">No feedback yet.</p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mentorFeedback.slice(0, 2).map((fb) => (
                    <div key={fb.id} className="bg-white rounded-md p-2 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {fb.feedback_type}
                        </Badge>
                        {fb.rating && (
                          <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 text-xs line-clamp-2">
                        {fb.comments}
                      </p>
                    </div>
                  ))}
                  {mentorFeedback.length > 2 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{mentorFeedback.length - 2} more feedback items
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Goals Section - Only for full access */}
            {level === 'full' && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-800">
                    Goals & Milestones ({mentorGoals.length})
                  </h4>
                </div>
                {mentorGoals.length === 0 ? (
                  <p className="text-gray-500 text-sm">No goals set yet.</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mentorGoals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="bg-white rounded-md p-2 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={goal.completed ? 'default' : 'secondary'}
                            className={`text-xs ${goal.completed ? 'bg-green-600' : ''}`}
                          >
                            {goal.completed ? '✓' : '○'} {goal.title}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-gray-700 text-xs line-clamp-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    ))}
                    {mentorGoals.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{mentorGoals.length - 2} more goals
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentorCard;
