
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';

interface MentorFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentee: { id: string; full_name: string | null; email: string };
  onSubmit: (feedbackData: any) => void;
}

const MentorFeedbackDialog = ({ open, onOpenChange, mentee, onSubmit }: MentorFeedbackDialogProps) => {
  const [formData, setFormData] = useState({
    rating: '',
    comments: '',
    suggestions: '',
    feedback_type: 'general',
    milestone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.comments) return;

    setLoading(true);
    try {
      await onSubmit({
        rating: Number(formData.rating),
        comments: formData.comments,
        suggestions: formData.suggestions,
        feedback_type: formData.feedback_type,
        milestone: formData.milestone || null
      });
      
      // Reset form
      setFormData({
        rating: '',
        comments: '',
        suggestions: '',
        feedback_type: 'general',
        milestone: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(f => ({ ...f, rating: star.toString() }))}
            className={`p-1 transition-colors ${
              Number(formData.rating) >= star 
                ? 'text-yellow-400' 
                : 'text-gray-400 hover:text-yellow-300'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Provide Feedback for {mentee.full_name || mentee.email}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="feedback_type">Feedback Type</Label>
                <Select 
                  value={formData.feedback_type} 
                  onValueChange={(value) => setFormData(f => ({ ...f, feedback_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Performance</SelectItem>
                    <SelectItem value="trade_specific">Trade Specific</SelectItem>
                    <SelectItem value="strategy">Strategy Review</SelectItem>
                    <SelectItem value="risk_management">Risk Management</SelectItem>
                    <SelectItem value="psychology">Trading Psychology</SelectItem>
                    <SelectItem value="milestone">Milestone Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Overall Rating *</Label>
                <div className="flex items-center gap-3 mt-2">
                  {renderStarRating()}
                  <span className="text-sm text-gray-500">
                    {formData.rating ? `${formData.rating}/5` : 'Select rating'}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comments *</Label>
                <Textarea
                  id="comments"
                  placeholder="Provide detailed feedback on their trading performance..."
                  value={formData.comments}
                  onChange={(e) => setFormData(f => ({ ...f, comments: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="suggestions">Improvement Suggestions</Label>
                <Textarea
                  id="suggestions"
                  placeholder="What specific areas should they focus on improving?"
                  value={formData.suggestions}
                  onChange={(e) => setFormData(f => ({ ...f, suggestions: e.target.value }))}
                  rows={3}
                />
              </div>

              {formData.feedback_type === 'milestone' && (
                <div>
                  <Label htmlFor="milestone">Milestone Details</Label>
                  <Input
                    id="milestone"
                    placeholder="Describe the milestone achieved or being tracked"
                    value={formData.milestone}
                    onChange={(e) => setFormData(f => ({ ...f, milestone: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.rating || !formData.comments}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorFeedbackDialog;
