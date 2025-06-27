
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MenteeFeedbackPanelProps {
  mentee: any;
  trades: any[];
}

const MenteeFeedbackPanel = ({ mentee, trades }: MenteeFeedbackPanelProps) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'general' | 'trade_specific' | 'milestone'>('general');
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [previousFeedback, setPreviousFeedback] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menteeUserId = mentee.mentee_user_id || mentee.id;

  useEffect(() => {
    fetchPreviousFeedback();
  }, [menteeUserId]);

  const fetchPreviousFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_feedback')
        .select('*')
        .eq('mentee_user_id', menteeUserId)
        .eq('mentor_user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPreviousFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter feedback before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('mentor_feedback')
        .insert([{
          mentor_user_id: user?.id,
          mentee_user_id: menteeUserId,
          feedback_type: feedbackType,
          comments: feedback,
          rating: rating > 0 ? rating : null,
          trade_id: selectedTrade?.id || null,
        }]);

      if (error) throw error;

      toast.success('Feedback submitted successfully');
      setFeedback('');
      setRating(0);
      setSelectedTrade(null);
      fetchPreviousFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTradePerformanceInsights = () => {
    if (trades.length === 0) return [];

    const insights = [];
    const winRate = (trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100;
    const avgWin = trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.filter(t => (t.pnl || 0) > 0).length;
    const avgLoss = trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0) / trades.filter(t => (t.pnl || 0) < 0).length;

    if (winRate < 50) {
      insights.push({
        type: 'warning',
        message: `Win rate is ${winRate.toFixed(1)}% - focus on trade selection and entry timing`,
        icon: AlertCircle,
        color: 'text-yellow-400'
      });
    }

    if (avgLoss > avgWin * 1.5) {
      insights.push({
        type: 'danger',
        message: 'Average losses are significantly larger than wins - review risk management',
        icon: ThumbsDown,
        color: 'text-red-400'
      });
    }

    if (trades.filter(t => (t.risk || 0) > 2).length > trades.length * 0.3) {
      insights.push({
        type: 'warning',
        message: 'High percentage of trades with risk > 2% - consider position sizing',
        icon: AlertCircle,
        color: 'text-yellow-400'
      });
    }

    return insights;
  };

  const insights = getTradePerformanceInsights();

  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* Performance Insights */}
      {insights.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#f5dd01] flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className={`flex items-start gap-2 p-2 rounded bg-gray-700/30`}>
                <insight.icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
                <span className="text-sm text-gray-300">{insight.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feedback Form */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#f5dd01]" />
            Provide Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Type */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={feedbackType === 'general' ? 'default' : 'outline'}
              onClick={() => setFeedbackType('general')}
              className={feedbackType === 'general' ? 'bg-[#f5dd01] text-black' : 'border-gray-600'}
            >
              General
            </Button>
            <Button
              size="sm"
              variant={feedbackType === 'trade_specific' ? 'default' : 'outline'}
              onClick={() => setFeedbackType('trade_specific')}
              className={feedbackType === 'trade_specific' ? 'bg-[#f5dd01] text-black' : 'border-gray-600'}
            >
              Trade Specific
            </Button>
            <Button
              size="sm"
              variant={feedbackType === 'milestone' ? 'default' : 'outline'}
              onClick={() => setFeedbackType('milestone')}
              className={feedbackType === 'milestone' ? 'bg-[#f5dd01] text-black' : 'border-gray-600'}
            >
              Milestone
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`h-4 w-4 ${star <= rating ? 'fill-[#f5dd01] text-[#f5dd01]' : 'text-gray-400'}`}
                />
              </Button>
            ))}
          </div>

          {/* Feedback Text */}
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback, suggestions, or observations..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
          />

          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting}
            className="w-full bg-[#f5dd01] text-black hover:bg-[#f5dd01]/90"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Feedback */}
      {previousFeedback.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Previous Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {previousFeedback.map((fb) => (
              <div key={fb.id} className="p-3 rounded bg-gray-700/30 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {fb.feedback_type?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>
                {fb.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= fb.rating ? 'fill-[#f5dd01] text-[#f5dd01]' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-300">{fb.comments}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenteeFeedbackPanel;
