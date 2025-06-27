
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Calendar } from 'lucide-react';

interface MentorGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentee: { id: string; full_name: string | null; email: string };
  onSubmit: (goalData: any) => void;
}

const MentorGoalDialog = ({ open, onOpenChange, mentee, onSubmit }: MentorGoalDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        target_date: formData.target_date || null
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        target_date: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Set Goal for {mentee.full_name || mentee.email}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Achieve 70% win rate, Reduce maximum drawdown to 5%"
                  value={formData.title}
                  onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Goal Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the goal, why it's important, and how to achieve it..."
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="target_date">Target Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <Input
                    id="target_date"
                    type="date"
                    min={getMinDate()}
                    value={formData.target_date}
                    onChange={(e) => setFormData(f => ({ ...f, target_date: e.target.value }))}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Set a target date for this goal
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Goal Setting Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make goals specific and measurable</li>
              <li>• Set realistic but challenging targets</li>
              <li>• Focus on process improvements over just profit</li>
              <li>• Include both short-term and long-term objectives</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? 'Setting Goal...' : 'Set Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorGoalDialog;
