import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trade } from '@/types/trade';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';
import { useEffect, useState } from 'react';

interface RulesTrackingSectionProps {
  trades: Trade[];
}

const RulesTrackingSection = ({ trades }: RulesTrackingSectionProps) => {
  const rulesAnalysis = useMemo(() => {
    const completedTrades = trades.filter(t => t.status === 'Completed');
    
    const rulesFollowed = completedTrades.filter(t => t.rules_followed === 'yes').length;
    const rulesViolated = completedTrades.filter(t => t.rules_followed === 'no').length;
    const rulesPartial = completedTrades.filter(t => t.rules_followed === 'partial').length;
    
    // Calculate P&L for each category
    const followedPnL = completedTrades
      .filter(t => t.rules_followed === 'yes')
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
    
    const violatedPnL = completedTrades
      .filter(t => t.rules_followed === 'no')
      .reduce((sum, t) => sum + (t.pnl || 0), 0);
    
    const avgFollowedPnL = rulesFollowed > 0 ? followedPnL / rulesFollowed : 0;
    const avgViolatedPnL = rulesViolated > 0 ? violatedPnL / rulesViolated : 0;
    
    return {
      rulesFollowed,
      rulesViolated,
      rulesPartial,
      followedPnL,
      violatedPnL,
      avgFollowedPnL,
      avgViolatedPnL,
      total: completedTrades.length,
      adherenceRate: completedTrades.length > 0 ? (rulesFollowed / completedTrades.length) * 100 : 0
    };
  }, [trades]);

  const { streamerMode } = useStreamerMode();
  const [currency, setCurrency] = useState('USD');
  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || 'USD');
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            Rules Followed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {rulesAnalysis.rulesFollowed}
              </div>
              <div className="text-sm text-gray-400">
                Avg P&L: {formatCurrencyStreamer(rulesAnalysis.avgFollowedPnL, streamerMode, 'pnl')}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Adherence Rate</span>
                <span className="text-green-400 font-medium">
                  {rulesAnalysis.adherenceRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={rulesAnalysis.adherenceRate} className="h-2" />
            </div>

            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/20">
              <div className="text-sm font-medium text-green-400 mb-1">
                Total P&L from Rule-Following
              </div>
              <div className="text-xl font-bold text-green-400">
                {formatCurrencyStreamer(rulesAnalysis.followedPnL, streamerMode, 'pnl')}
              </div>
            </div>

            <div className="space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Disciplined Trading
              </Badge>
              {rulesAnalysis.adherenceRate > 80 && (
                <div className="text-xs text-green-400">
                  🎯 Excellent discipline! Keep following your rules.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-400">
            <XCircle className="w-5 h-5" />
            Rules Violated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">
                {rulesAnalysis.rulesViolated}
              </div>
              <div className="text-sm text-gray-400">
                Avg P&L: {formatCurrencyStreamer(rulesAnalysis.avgViolatedPnL, streamerMode, 'pnl')}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Violation Rate</span>
                <span className="text-red-400 font-medium">
                  {((rulesAnalysis.rulesViolated / rulesAnalysis.total) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(rulesAnalysis.rulesViolated / rulesAnalysis.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/20">
              <div className="text-sm font-medium text-red-400 mb-1">
                Total P&L from Rule Violations
              </div>
              <div className="text-xl font-bold text-red-400">
                {formatCurrencyStreamer(rulesAnalysis.violatedPnL, streamerMode, 'pnl')}
              </div>
            </div>

            <div className="space-y-2">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                Needs Improvement
              </Badge>
              {rulesAnalysis.rulesViolated > rulesAnalysis.rulesFollowed && (
                <div className="text-xs text-red-400">
                  ⚠️ Focus on rule adherence to improve performance.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Card */}
      <Card className="md:col-span-2 bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Rules Analysis & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {rulesAnalysis.rulesPartial}
              </div>
              <div className="text-sm text-gray-400">Partially Followed</div>
            </div>
            
            <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {formatCurrencyStreamer(rulesAnalysis.avgFollowedPnL - rulesAnalysis.avgViolatedPnL, streamerMode, 'pnl')}
              </div>
              <div className="text-sm text-gray-400">P&L Difference</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {rulesAnalysis.adherenceRate > 70 ? "Good" : rulesAnalysis.adherenceRate > 50 ? "Fair" : "Poor"}
              </div>
              <div className="text-sm text-gray-400">Discipline Score</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold text-white mb-2">AI Insights:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              {rulesAnalysis.avgFollowedPnL > rulesAnalysis.avgViolatedPnL ? (
                <li>✅ Following rules results in {((rulesAnalysis.avgFollowedPnL / Math.abs(rulesAnalysis.avgViolatedPnL)) * 100).toFixed(0)}% better average P&L</li>
              ) : (
                <li>⚠️ Rule violations are surprisingly profitable - review your rules for potential improvements</li>
              )}
              
              {rulesAnalysis.adherenceRate < 60 && (
                <li>🎯 Focus on improving rule adherence - current rate of {rulesAnalysis.adherenceRate.toFixed(1)}% needs improvement</li>
              )}
              
              {rulesAnalysis.rulesPartial > rulesAnalysis.rulesFollowed * 0.3 && (
                <li>📋 High partial adherence suggests rules may be too complex - consider simplifying</li>
              )}
              
              <li>
                💡 {rulesAnalysis.followedPnL > 0 ? "Rule-following trades are profitable" : "Review rule effectiveness"} - Total P&L: {formatCurrencyStreamer(rulesAnalysis.followedPnL, streamerMode, 'pnl')}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesTrackingSection;
