
import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useMenteeTrades } from '@/hooks/mentor/useMenteeTrades';
import PerformanceMetrics from '@/components/trading/PerformanceMetrics';
import TradeList from '@/components/trading/TradeList';
import MenteeFeedbackPanel from './MenteeFeedbackPanel';

interface MenteeDetailViewProps {
  mentee: any;
  onClose: () => void;
}

const MenteeDetailView = ({ mentee, onClose }: MenteeDetailViewProps) => {
  const { selectedMenteeTrades, fetchMenteeTrades } = useMenteeTrades();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrades = async () => {
      setIsLoading(true);
      await fetchMenteeTrades(mentee.mentee_user_id || mentee.id);
      setIsLoading(false);
    };
    loadTrades();
  }, [mentee.mentee_user_id, mentee.id, fetchMenteeTrades]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-[#f5dd01] text-black';
      case 'advanced': return 'bg-purple-500 text-white';
      case 'basic': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPerformanceColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  // Calculate risk indicators
  const riskIndicators = {
    highRiskTrades: selectedMenteeTrades.filter(t => (t.risk || 0) > 2).length,
    consecutiveLosses: 0, // Calculate consecutive losses
    overtrading: selectedMenteeTrades.filter(t => 
      new Date(t.date).toDateString() === new Date().toDateString()
    ).length > 5
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{mentee.full_name || mentee.email}</h1>
            <p className="text-gray-400">Mentee Performance Dashboard</p>
          </div>
          <Badge className={getAccessLevelColor(mentee.access_level)}>
            {mentee.access_level?.toUpperCase()} ACCESS
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${getPerformanceColor(mentee.totalPnL || 0)}`}>
                {formatCurrency(mentee.totalPnL || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">
                {mentee.winRate ? `${mentee.winRate.toFixed(1)}%` : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">{selectedMenteeTrades.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Win</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-400">
                {mentee.avgWin ? formatCurrency(mentee.avgWin) : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-yellow-400">
                {riskIndicators.highRiskTrades > 5 ? 'HIGH' : 'NORMAL'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6 h-[calc(100vh-300px)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Performance
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Trade Journal
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Feedback
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Goals
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[calc(100%-60px)] overflow-hidden">
            <TabsContent value="overview" className="h-full overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5dd01]"></div>
                </div>
              ) : (
                <PerformanceMetrics trades={selectedMenteeTrades} detailed={true} />
              )}
            </TabsContent>

            <TabsContent value="trades" className="h-full overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5dd01]"></div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <TradeList 
                    trades={selectedMenteeTrades} 
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="feedback" className="h-full overflow-hidden">
              <MenteeFeedbackPanel mentee={mentee} trades={selectedMenteeTrades} />
            </TabsContent>

            <TabsContent value="goals" className="h-full overflow-y-auto">
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Goal Setting</h3>
                <p className="text-gray-500">Set and track performance goals for your mentee.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MenteeDetailView;
