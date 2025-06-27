import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade, PerformanceStats } from "@/types/trade";
import RiskManagementMetrics from "./RiskManagementMetrics";
import PsychologicalAnalysis from "./PsychologicalAnalysis";
import TimeAnalysisMetrics from "./TimeAnalysisMetrics";
import OverallPerformanceScore from "./OverallPerformanceScore";
import PlanUpgradePrompt from "@/components/common/PlanUpgradePrompt";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import { Shield, Brain, Clock, TrendingUp, Award } from "lucide-react";
import { 
  calculateCalmarRatio, 
  calculateSortinoRatio, 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk, 
  calculateMAEMFE 
} from "@/utils/riskCalculations";
import AdvancedRiskAnalytics from "./AdvancedRiskAnalytics";

interface EnhancedAdvancedMetricsProps {
  trades: Trade[];
}

const EnhancedAdvancedMetrics = ({ trades }: EnhancedAdvancedMetricsProps) => {
  const { data: planFeatures } = usePlanFeatures();

  const stats: PerformanceStats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakEvenTrades: 0,
        winRate: 0,
        totalPnL: 0,
        totalFees: 0,
        netPnL: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        largestWin: 0,
        largestLoss: 0,
        averageRoi: 0,
        sharpeRatio: 0,
        totalR: 0,
        avgWinR: 0,
        avgLossR: 0,
        riskRewardRatio: 0,
        expectancy: 0,
        maxDrawdown: 0,
        maxDrawdownAmount: 0,
        longestWinStreak: 0,
        longestLossStreak: 0,
        systemQualityNumber: 0,
        calmarRatio: 0,
        sortinoRatio: 0,
        riskOfRuin: 0,
        kellyPercentage: 0,
        valueAtRisk95: 0,
        valueAtRisk99: 0,
        averageMAE: 0,
        averageMFE: 0,
        avgTradeDuration: 0
      };
    }

    const completedTrades = trades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    // Calculate R-multiples for each trade
    const tradesWithR = completedTrades.map(trade => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return { ...trade, rMultiple };
    });

    const wins = tradesWithR.filter(trade => (trade.pnl || 0) > 0);
    const losses = tradesWithR.filter(trade => (trade.pnl || 0) < 0);
    const breakEvens = tradesWithR.filter(trade => (trade.pnl || 0) === 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalFees = trades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
    const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    
    // R-multiple calculations
    const totalR = tradesWithR.reduce((sum, trade) => sum + trade.rMultiple, 0);
    const avgWinR = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.rMultiple, 0) / wins.length : 0;
    const avgLossR = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => sum + trade.rMultiple, 0) / losses.length) : 0;
    
    // Drawdown calculation
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    
    completedTrades.forEach(trade => {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdownAmount) {
        maxDrawdownAmount = drawdown;
        maxDrawdown = peak > 0 ? (drawdown / peak) * 100 : 0;
      }
    });

    // Streak calculations
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;

    completedTrades.forEach(trade => {
      if ((trade.pnl || 0) > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      } else if ((trade.pnl || 0) < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
      } else {
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    });

    // System Quality Number (SQN) calculation
    const expectancy = completedTrades.length > 0 ? totalR / completedTrades.length : 0;
    const rValues = tradesWithR.map(trade => trade.rMultiple);
    const standardDeviation = rValues.length > 1 ? 
      Math.sqrt(rValues.reduce((sum, r) => sum + Math.pow(r - expectancy, 2), 0) / (rValues.length - 1)) : 0;
    const systemQualityNumber = standardDeviation > 0 ? 
      (expectancy / standardDeviation) * Math.sqrt(completedTrades.length) : 0;

    // Sharpe Ratio calculation (simplified)
    const sharpeRatio = standardDeviation > 0 ? expectancy / standardDeviation : 0;

    // Calculate advanced metrics
    const winRate = completedTrades.length > 0 ? (wins.length / completedTrades.length) : 0;
    const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
    const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
    
    const calmarRatio = calculateCalmarRatio(totalPnL, maxDrawdown, 1);
    const sortinoRatio = calculateSortinoRatio(completedTrades, 0);
    const riskOfRuin = calculateRiskOfRuin(winRate, averageWin, averageLoss, 0.02, 10000);
    const kellyPercentage = calculateKellyPercentage(winRate, averageWin, averageLoss);
    const valueAtRisk95 = calculateValueAtRisk(completedTrades, 0.95);
    const valueAtRisk99 = calculateValueAtRisk(completedTrades, 0.99);
    
    const { avgMAE, avgMFE } = calculateMAEMFE(completedTrades);
    
    const avgTradeDuration = completedTrades.filter(t => t.trade_duration_hours).length > 0
      ? completedTrades.filter(t => t.trade_duration_hours).reduce((sum, t) => sum + (t.trade_duration_hours || 0), 0) / completedTrades.filter(t => t.trade_duration_hours).length
      : 0;

    return {
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      breakEvenTrades: breakEvens.length,
      winRate: winRate * 100,
      totalPnL,
      totalFees,
      netPnL: totalPnL - totalFees,
      averageWin,
      averageLoss,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      largestWin: wins.length > 0 ? Math.max(...wins.map(trade => trade.pnl || 0)) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map(trade => trade.pnl || 0)) : 0,
      averageRoi: 0,
      sharpeRatio: Math.abs(sharpeRatio),
      totalR,
      avgWinR,
      avgLossR,
      riskRewardRatio: avgLossR > 0 ? avgWinR / avgLossR : avgWinR > 0 ? Infinity : 0,
      expectancy,
      maxDrawdown,
      maxDrawdownAmount,
      longestWinStreak,
      longestLossStreak,
      systemQualityNumber: Math.abs(systemQualityNumber),
      calmarRatio,
      sortinoRatio,
      riskOfRuin,
      kellyPercentage,
      valueAtRisk95,
      valueAtRisk99,
      averageMAE: avgMAE,
      averageMFE: avgMFE,
      avgTradeDuration
    };
  }, [trades]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Advanced Trading Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="score" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="score" className="flex items-center gap-2">
                <Award size={16} />
                Score
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-2">
                <Shield size={16} />
                Risk
              </TabsTrigger>
              <TabsTrigger value="psychology" className="flex items-center gap-2">
                <Brain size={16} />
                Psychology
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Clock size={16} />
                Time
              </TabsTrigger>
            </TabsList>

            <TabsContent value="score">
              {planFeatures?.advanced_analytics_access ? (
                <OverallPerformanceScore trades={trades} stats={stats} />
              ) : (
                <div className="relative min-h-[400px]">
                  <OverallPerformanceScore trades={trades} stats={stats} />
                  <PlanUpgradePrompt 
                    feature="Performance Score Analytics"
                    requiredPlan="Cooked"
                    currentPlan={planFeatures?.plan_name}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="risk">
              <RiskManagementMetrics trades={trades} />
              <AdvancedRiskAnalytics trades={trades} />
            </TabsContent>

            <TabsContent value="psychology">
              {planFeatures?.risk_psychology_access ? (
                <PsychologicalAnalysis trades={trades} />
              ) : (
                <div className="relative min-h-[400px]">
                  <PsychologicalAnalysis trades={trades} />
                  <PlanUpgradePrompt 
                    feature="Psychological Analysis"
                    requiredPlan="Goated"
                    currentPlan={planFeatures?.plan_name}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="time">
              {planFeatures?.time_analysis_access ? (
                <TimeAnalysisMetrics trades={trades} />
              ) : (
                <div className="relative min-h-[400px]">
                  <TimeAnalysisMetrics trades={trades} />
                  <PlanUpgradePrompt 
                    feature="Time Analysis"
                    requiredPlan="Goated"
                    currentPlan={planFeatures?.plan_name}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdvancedMetrics;
