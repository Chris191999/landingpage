
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Target, MoreVertical, Trash2, Eye, BarChart3 } from 'lucide-react';
import { getInitials } from '@/utils/getInitials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MenteeCardProps {
  mentee: any;
  feedbackCount: number;
  goalsCount: number;
  onViewTrades: (menteeId: string) => void;
  onGiveFeedback: (menteeId: string) => void;
  onSetGoal: (menteeId: string) => void;
  onEndRelationship: (menteeId: string) => void;
  onViewAnalytics: (menteeId: string) => void;
  isEndingRelationship?: boolean;
}

const MenteeCard = ({ 
  mentee, 
  feedbackCount, 
  goalsCount, 
  onViewTrades, 
  onGiveFeedback, 
  onSetGoal, 
  onEndRelationship,
  onViewAnalytics,
  isEndingRelationship = false 
}: MenteeCardProps) => {
  const level = mentee.access_level;
  
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#f5dd01] text-black font-semibold">
                {getInitials(mentee.full_name || mentee.email || 'M')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {mentee.full_name || mentee.email?.split('@')[0] || 'Mentee'}
              </h3>
              <div className="text-sm text-gray-500">
                {mentee.plan} • Joined {new Date(mentee.created_at).toLocaleDateString()}
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
                <DropdownMenuItem onClick={() => onViewTrades(mentee.mentee_user_id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Trades
                </DropdownMenuItem>
                {(level === 'advanced' || level === 'full') && (
                  <DropdownMenuItem onClick={() => onViewAnalytics(mentee.mentee_user_id)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onEndRelationship(mentee.mentee_user_id)}
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">Feedback Given</div>
            <div className="text-lg font-semibold text-gray-800">{feedbackCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">Goals Set</div>
            <div className="text-lg font-semibold text-gray-800">{goalsCount}</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {(level === 'advanced' || level === 'full') && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onGiveFeedback(mentee.mentee_user_id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Give Feedback
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onViewAnalytics(mentee.mentee_user_id)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </>
          )}
          
          {level === 'full' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => onSetGoal(mentee.mentee_user_id)}
            >
              <Target className="h-4 w-4 mr-2" />
              Set Goal
            </Button>
          )}
          
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onViewTrades(mentee.mentee_user_id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Trades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenteeCard;
