import { useMemo, useState } from "react";
import { Trade, PerformanceStats } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, Award } from "lucide-react";
import { 
  calculateCalmarRatio, 
  calculateSortinoRatio, 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk, 
  calculateMAEMFE 
} from "@/utils/riskCalculations";
import { calculateTradeDurationStats } from "@/utils/timeAnalysis";
import MetricsFilters from "./metrics/MetricsFilters";
import CorePerformanceCards from "./metrics/CorePerformanceCards";
import GoalSettingSection from "./performance/GoalSettingSection";

interface AdvancedPerformanceMetricsProps {
  trades: Trade[];
  detailed?: boolean;
}

const AdvancedPerformanceMetrics = ({ trades, detailed = false }: AdvancedPerformanceMetricsProps) => {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("all");

  // Get unique symbols for filter dropdown
  const uniqueSymbols = useMemo(() => {
    const symbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();
    return symbols;
  }, [trades]);

  // Filter trades based on selected criteria
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Date filtering
      if (dateFrom && trade.date < dateFrom) return false;
      if (dateTo && trade.date > dateTo) return false;
      
      // Symbol filtering
      if (selectedSymbol !== "all" && trade.symbol !== selectedSymbol) return false;
      
      return true;
    });
  }, [trades, dateFrom, dateTo, selectedSymbol]);

  // Clear all filters
  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedSymbol("all");
  };

  const stats: PerformanceStats = useMemo(() => {
    if (filteredTrades.length === 0) {
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

    const completedTrades = filteredTrades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    // Calculate R-multiples for each trade
    const tradesWithR = completedTrades.map(trade => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return { ...trade, rMultiple };
    });

    const wins = tradesWithR.filter(trade => (trade.pnl || 0) > 0);
    const losses = tradesWithR.filter(trade => (trade.pnl || 0) < 0);
    const breakEvens = tradesWithR.filter(trade => (trade.pnl || 0) === 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalFees = filteredTrades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
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
    const riskOfRuin = calculateRiskOfRuin(winRate, averageWin, averageLoss, 0.02, accountBalance);
    const kellyPercentage = calculateKellyPercentage(winRate, averageWin, averageLoss);
    const valueAtRisk95 = calculateValueAtRisk(completedTrades, 0.95);
    const valueAtRisk99 = calculateValueAtRisk(completedTrades, 0.99);
    
    const { avgMAE, avgMFE } = calculateMAEMFE(completedTrades);
    const { avgDuration } = calculateTradeDurationStats(completedTrades);

    return {
      totalTrades: filteredTrades.length,
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
      avgTradeDuration: avgDuration
    };
  }, [filteredTrades, accountBalance]);

  const equityCurveData = useMemo(() => {
    let runningBalance = accountBalance;
    return filteredTrades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((trade, index) => {
        runningBalance += (trade.pnl || 0);
        return {
          day: `Day ${index + 1}`,
          balance: runningBalance,
          date: trade.date
        };
      });
  }, [filteredTrades, accountBalance]);

  // Additional calculations for detailed view
  const additionalMetrics = useMemo(() => {
    if (!detailed) return {
      mostProfitableDay: { date: 'N/A', pnl: 0 },
      leastProfitableDay: { date: 'N/A', pnl: 0 },
      avgTradesPerDay: 0,
      avgWinningTradePnL: 0,
      avgLosingTradePnL: 0
    };

    const completedTrades = filteredTrades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    if (completedTrades.length === 0) {
      return {
        mostProfitableDay: { date: 'N/A', pnl: 0 },
        leastProfitableDay: { date: 'N/A', pnl: 0 },
        avgTradesPerDay: 0,
        avgWinningTradePnL: 0,
        avgLosingTradePnL: 0
      };
    }

    // Group trades by date for daily analysis
    const dailyPnL = new Map<string, number>();
    const dailyTradeCount = new Map<string, number>();
    
    completedTrades.forEach(trade => {
      const date = trade.date.split('T')[0]; // Get just the date part
      const pnl = trade.pnl || 0;
      
      dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
      dailyTradeCount.set(date, (dailyTradeCount.get(date) || 0) + 1);
    });

    // Find most and least profitable days
    let mostProfitableDay = { date: 'N/A', pnl: -Infinity };
    let leastProfitableDay = { date: 'N/A', pnl: Infinity };
    
    dailyPnL.forEach((pnl, date) => {
      if (pnl > mostProfitableDay.pnl) {
        mostProfitableDay = { date, pnl };
      }
      if (pnl < leastProfitableDay.pnl) {
        leastProfitableDay = { date, pnl };
      }
    });

    // Calculate average trades per day
    const uniqueDays = dailyTradeCount.size;
    const avgTradesPerDay = uniqueDays > 0 ? completedTrades.length / uniqueDays : 0;

    // Calculate average winning and losing trade P&L
    const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const avgWinningTradePnL = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length 
      : 0;
    
    const avgLosingTradePnL = losingTrades.length > 0 
      ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length 
      : 0;

    return {
      mostProfitableDay,
      leastProfitableDay,
      avgTradesPerDay,
      avgWinningTradePnL,
      avgLosingTradePnL
    };
  }, [filteredTrades, detailed]);

  const chartData = useMemo(() => {
    if (!detailed) return [];
    
    let cumulativePnL = 0;
    return filteredTrades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(trade => {
        cumulativePnL += (trade.pnl || 0);
        return {
          date: trade.date,
          pnl: trade.pnl || 0,
          cumulative: cumulativePnL
        };
      });
  }, [filteredTrades, detailed]);

  const symbolStats = useMemo(() => {
    if (!detailed) return [];
    
    const symbolMap = new Map();
    
    filteredTrades
      .filter(trade => trade.status === 'Completed')
      .forEach(trade => {
        const symbol = trade.symbol;
        if (!symbolMap.has(symbol)) {
          symbolMap.set(symbol, {
            symbol,
            trades: 0,
            pnl: 0,
            wins: 0,
            winRate: 0
          });
        }
        
        const stat = symbolMap.get(symbol);
        stat.trades++;
        stat.pnl += (trade.pnl || 0);
        if ((trade.pnl || 0) > 0) stat.wins++;
        stat.winRate = (stat.wins / stat.trades) * 100;
      });
    
    return Array.from(symbolMap.values()).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades, detailed]);

  return (
    <div className="space-y-6 bg-gray-900 text-white p-6 rounded-lg">
      {/* Performance Radar Chart */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Performance Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { metric: "Win Rate", value: Math.min(100, (stats.winRate / 70) * 100) },
                  { metric: "Profit Factor", value: stats.profitFactor === Infinity ? 100 : Math.min(100, (stats.profitFactor / 2) * 100) },
                  { metric: "Recovery Factor", value: stats.maxDrawdownAmount > 0 ? Math.min(100, ((stats.totalPnL / stats.maxDrawdownAmount) / 3) * 100) : 100 },
                  { metric: "Expectancy", value: Math.min(100, Math.max(0, (stats.expectancy / 0.5) * 100)) },
                  { metric: "Max Drawdown", value: Math.min(100, Math.max(0, (1 - stats.maxDrawdown / 30) * 100)) },
                  { metric: "Consistency", value: Math.min(100, (stats.sharpeRatio / 2) * 100) }
                ]}>
                  <PolarGrid gridType="polygon" className="opacity-30" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} tickCount={5} />
                  <Radar name="Performance" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: "#8B5CF6" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Key Metrics</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Win Rate</span>
                  <span className="text-lg font-bold text-green-400">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Profit Factor</span>
                  <span className="text-lg font-bold text-blue-400">{stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Recovery Factor</span>
                  <span className="text-lg font-bold text-purple-400">{stats.maxDrawdownAmount > 0 ? (stats.totalPnL / stats.maxDrawdownAmount).toFixed(2) : "∞"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Expectancy</span>
                  <span className="text-lg font-bold text-cyan-400">{stats.expectancy.toFixed(2)}R</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Max Drawdown</span>
                  <span className="text-lg font-bold text-orange-400">{stats.maxDrawdown.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">Consistency</span>
                  <span className="text-lg font-bold text-pink-400">{stats.sharpeRatio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Setting and Milestone Tracking */}
      <GoalSettingSection currentStats={{
        totalPnL: stats.totalPnL,
        winRate: stats.winRate,
        sharpeRatio: stats.sharpeRatio,
        maxDrawdown: stats.maxDrawdown
      }} />

      {/* Overall Performance Score */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-yellow-500" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold text-white">
                {Math.round(([
                  Math.min(20, (stats.winRate / 70) * 20),
                  stats.profitFactor === Infinity ? 20 : Math.min(20, (stats.profitFactor / 2) * 20),
                  stats.riskRewardRatio === Infinity ? 15 : Math.min(15, (stats.riskRewardRatio / 2) * 15),
                  Math.min(15, Math.max(0, (stats.expectancy / 0.5) * 15)),
                  Math.min(15, (stats.systemQualityNumber / 3) * 15),
                  Math.min(10, Math.max(0, (1 - stats.maxDrawdown / 20) * 10)),
                  Math.min(5, (stats.sharpeRatio / 2) * 5)
                ].reduce((a, b) => a + b, 0)))}
              </div>
              <div className="text-gray-400 text-lg">/100</div>
            </div>
            <div className="bg-green-500 text-white text-lg px-4 py-2 rounded-full font-semibold">
              A - Excellent
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis Cards with AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">✓ Profitability Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-green-400">
              <li>• {stats.profitFactor > 2 ? "Outstanding profit factor shows strong edge and trade selection" : "Profit factor needs improvement - focus on win rate or risk/reward"}</li>
              <li>• {stats.expectancy > 0.3 ? "Strong expectancy indicates each trade adds significant value" : "Low expectancy suggests need for better trade selection"}</li>
              <li>• {stats.riskRewardRatio > 2 ? "Excellent risk/reward allows for lower win rates while staying profitable" : "Improve risk/reward ratio by better exit strategies"}</li>
              <li>• Current recovery factor of {stats.maxDrawdownAmount > 0 ? (stats.totalPnL / stats.maxDrawdownAmount).toFixed(2) : "∞"} shows {stats.maxDrawdownAmount > 0 && stats.totalPnL / stats.maxDrawdownAmount > 3 ? "excellent" : "adequate"} capital efficiency</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">🛡️ Risk Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-400">
              <li>• {stats.maxDrawdown < 10 ? "Excellent drawdown control shows disciplined risk management" : stats.maxDrawdown < 20 ? "Good drawdown control with room for improvement" : "High drawdown - review risk management immediately"}</li>
              <li>• {stats.maxDrawdownAmount > 0 && stats.totalPnL / stats.maxDrawdownAmount > 2 ? "Strong recovery factor shows profits significantly exceed worst losses" : "Focus on improving profit relative to maximum losses"}</li>
              <li>• {stats.sharpeRatio > 1.5 ? "Consistent performance with minimal volatility" : "Work on reducing volatility while maintaining returns"}</li>
              <li>• Maximum single loss represents {stats.maxDrawdownAmount > 0 ? ((Math.abs(stats.largestLoss) / stats.maxDrawdownAmount) * 100).toFixed(1) : "0"}% of max drawdown</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">📊 Consistency & Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-purple-400">
              <li>• {stats.systemQualityNumber > 2 ? "Excellent SQN indicates highly reliable and consistent performance" : stats.systemQualityNumber > 1 ? "Good system quality with room for improvement" : "System quality needs significant improvement"}</li>
              <li>• {stats.sharpeRatio > 2 ? "Strong Sharpe ratio demonstrates consistent risk-adjusted returns" : "Focus on improving consistency of returns"}</li>
              <li>• {stats.winRate > 60 ? "High win rate provides psychological comfort and steady returns" : "Lower win rate compensated by strong risk/reward ratio"}</li>
              <li>• Monthly consistency score: {stats.sharpeRatio > 1.5 ? "Excellent" : stats.sharpeRatio > 1 ? "Good" : "Needs improvement"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">🧠 Trading Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-cyan-400">
              <li>• {stats.winRate > 65 ? "Exceptional win rate indicates excellent trade selection and timing" : stats.winRate > 50 ? "Solid win rate with room for improvement in entries" : "Low win rate - focus on trade selection quality"}</li>
              <li>• {stats.longestWinStreak > 5 ? "Longest winning streak shows ability to capitalize on favorable conditions" : "Work on maintaining momentum during winning periods"}</li>
              <li>• {stats.longestLossStreak < 5 ? "Good loss control prevents extended drawdown periods" : "Focus on cutting losses quickly to prevent extended streaks"}</li>
              <li>• Average trade duration suggests {stats.avgTradeDuration > 24 ? "swing trading approach" : stats.avgTradeDuration > 4 ? "day trading style" : "scalping methodology"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedPerformanceMetrics;
