import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, User, Eye, MessageSquare, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import MenteeDetailView from './MenteeDetailView';
import { MenteeData } from '@/hooks/mentor/useMentorData';

interface MenteeOverviewProps {
  mentees: MenteeData[];
  isLoading: boolean;
  onRefresh: () => void;
}

const MenteeOverview = ({ mentees, isLoading, onRefresh }: MenteeOverviewProps) => {
  const [selectedMentee, setSelectedMentee] = useState<MenteeData | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-[#f5dd01] text-black';
      case 'advanced': return 'bg-purple-500 text-white';
      case 'basic': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleViewMentee = (mentee: MenteeData) => {
    setSelectedMentee(mentee);
    setShowDetailView(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5dd01]"></div>
      </div>
    );
  }

  if (mentees.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Mentees Yet</h3>
        <p className="text-gray-500 mb-4">Start by inviting traders to become your mentees.</p>
        <Button onClick={onRefresh} className="bg-[#f5dd01] text-black hover:bg-[#f5dd01]/90">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto pr-2">
        {mentees.map((mentee) => (
          <Card key={mentee.id} className="bg-gray-800/50 border-gray-700 hover:border-[#f5dd01]/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-[#f5dd01]" />
                  {mentee.full_name || mentee.email}
                </CardTitle>
                <Badge className={getAccessLevelColor(mentee.access_level)}>
                  {mentee.access_level?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Total P&L</span>
                  <div className={`font-bold ${getPerformanceColor(mentee.totalPnL || 0)}`}>
                    {formatCurrency(mentee.totalPnL || 0)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Win Rate</span>
                  <div className="font-bold text-white">
                    {mentee.winRate ? `${mentee.winRate.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Total Trades</span>
                  <div className="font-bold text-white">{mentee.totalTrades || 0}</div>
                </div>
                <div>
                  <span className="text-gray-400">Avg Win</span>
                  <div className="font-bold text-green-400">
                    {mentee.avgWin ? formatCurrency(mentee.avgWin) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-2 text-xs">
                {mentee.totalPnL > 0 ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Profitable</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    <span>Needs Help</span>
                  </div>
                )}
                {mentee.lastTradeDate && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Last: {new Date(mentee.lastTradeDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-gray-600 hover:border-[#f5dd01] hover:text-[#f5dd01]"
                  onClick={() => handleViewMentee(mentee)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mentee Detail View Dialog */}
      <Dialog open={showDetailView} onOpenChange={setShowDetailView}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          {selectedMentee && (
            <MenteeDetailView
              mentee={selectedMentee}
              onClose={() => setShowDetailView(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenteeOverview;
