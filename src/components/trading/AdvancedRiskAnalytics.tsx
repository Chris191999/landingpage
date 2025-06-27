import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/types/trade';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Target, Brain, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface AdvancedRiskAnalyticsProps {
  trades: Trade[];
}

const AdvancedRiskAnalytics = ({ trades }: AdvancedRiskAnalyticsProps) => {
  const { riskOfRuin, kellyPercentage, var95, var99, calmarRatio, sortinoRatio, avgMAE, avgMFE } = useRiskMetrics({ trades });
  const { streamerMode } = useStreamerMode();
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || 'USD');
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  const riskAnalysisData = useMemo(() => {
    const completedTrades = trades.filter(t => t.status === 'Completed');
    
    // Calculate running drawdown
    let runningPnL = 0;
    let peak = 0;
    const drawdownData = completedTrades.map((trade, index) => {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) peak = runningPnL;
      const drawdown = peak - runningPnL;
      return {
        day: index + 1,
        drawdown: drawdown,
        equity: runningPnL
      };
    });

    // Risk distribution
    const riskDistribution = completedTrades.reduce((acc, trade) => {
      const riskLevel = trade.risk || 0;
      if (riskLevel <= 50) acc.low++;
      else if (riskLevel <= 100) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    // Monthly risk metrics
    const monthlyRisk = completedTrades.reduce((acc, trade) => {
      const month = trade.date.substring(0, 7);
      if (!acc[month]) acc[month] = { totalRisk: 0, trades: 0, pnl: 0 };
      acc[month].totalRisk += trade.risk || 0;
      acc[month].trades += 1;
      acc[month].pnl += trade.pnl || 0;
      return acc;
    }, {} as Record<string, { totalRisk: number; trades: number; pnl: number }>);

    const monthlyData = Object.entries(monthlyRisk).map(([month, data]) => ({
      month,
      avgRisk: data.totalRisk / data.trades,
      pnl: data.pnl,
      riskAdjustedReturn: data.pnl / (data.totalRisk / data.trades)
    }));

    return { drawdownData, riskDistribution, monthlyData };
  }, [trades]);

  const riskMetrics = [
    {
      title: "Risk of Ruin",
      value: `${(riskOfRuin * 100).toFixed(2)}%`,
      subtitle: riskOfRuin < 0.05 ? "Very Low" : riskOfRuin < 0.15 ? "Low" : "High",
      color: riskOfRuin < 0.05 ? "text-green-400" : riskOfRuin < 0.15 ? "text-yellow-400" : "text-red-400",
      bgColor: riskOfRuin < 0.05 ? "bg-green-900/20" : riskOfRuin < 0.15 ? "bg-yellow-900/20" : "bg-red-900/20",
      borderColor: riskOfRuin < 0.05 ? "border-green-500/30" : riskOfRuin < 0.15 ? "border-yellow-500/30" : "border-red-500/30",
      icon: AlertTriangle
    },
    {
      title: "Kelly %",
      value: `${(kellyPercentage * 100).toFixed(2)}%`,
      subtitle: "Optimal position size",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30",
      icon: TrendingUp
    },
    {
      title: "VaR (95%)",
      value: `$${var95.toFixed(2)}`,
      subtitle: "95% confidence loss limit",
      color: "text-orange-400",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-500/30",
      icon: TrendingDown
    },
    {
      title: "VaR (99%)",
      value: `$${var99.toFixed(2)}`,
      subtitle: "99% confidence loss limit",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-500/30",
      icon: AlertTriangle
    },
    {
      title: "Calmar Ratio",
      value: calmarRatio === Infinity ? "∞" : calmarRatio.toFixed(2),
      subtitle: calmarRatio > 3 ? "Excellent" : calmarRatio > 1 ? "Good" : "Poor",
      color: calmarRatio > 3 ? "text-purple-400" : calmarRatio > 1 ? "text-blue-400" : "text-red-400",
      bgColor: calmarRatio > 3 ? "bg-purple-900/20" : calmarRatio > 1 ? "bg-blue-900/20" : "bg-red-900/20",
      borderColor: calmarRatio > 3 ? "border-purple-500/30" : calmarRatio > 1 ? "border-blue-500/30" : "border-red-500/30",
      icon: TrendingUp
    },
    {
      title: "Sortino Ratio",
      value: sortinoRatio === Infinity ? "∞" : sortinoRatio.toFixed(2),
      subtitle: sortinoRatio > 2 ? "Excellent" : sortinoRatio > 1 ? "Good" : "Poor",
      color: sortinoRatio > 2 ? "text-cyan-400" : sortinoRatio > 1 ? "text-blue-400" : "text-red-400",
      bgColor: sortinoRatio > 2 ? "bg-cyan-900/20" : sortinoRatio > 1 ? "bg-blue-900/20" : "bg-red-900/20",
      borderColor: sortinoRatio > 2 ? "border-cyan-500/30" : sortinoRatio > 1 ? "border-blue-500/30" : "border-red-500/30",
      icon: TrendingUp
    },
    {
      title: "Avg MAE",
      value: `$${avgMAE.toFixed(2)}`,
      subtitle: "Average adverse excursion",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-500/30",
      icon: TrendingDown
    },
    {
      title: "Avg MFE",
      value: `$${avgMFE.toFixed(2)}`,
      subtitle: "Average favorable excursion",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-500/30",
      icon: TrendingUp
    }
  ];

  // AI-powered insights based on current performance
  const generateRiskInsights = () => {
    const insights = [];
    
    if (riskOfRuin > 0.2) {
      insights.push("🚨 Critical: Your risk of ruin is dangerously high. Consider reducing position sizes immediately.");
    } else if (riskOfRuin > 0.1) {
      insights.push("⚠️ Warning: Risk of ruin is elevated. Review your risk management strategy.");
    } else {
      insights.push("✅ Excellent: Your risk of ruin is well-controlled, showing strong risk management.");
    }

    if (kellyPercentage > 0.25) {
      insights.push("🎯 Opportunity: Your Kelly percentage suggests you could increase position sizes for optimal growth.");
    } else if (kellyPercentage < 0.05) {
      insights.push("📉 Concern: Low Kelly percentage indicates suboptimal risk-reward ratio. Focus on improving win rate or average wins.");
    }

    if (avgMAE > avgMFE * 0.5) {
      insights.push("🔍 Analysis: High MAE relative to MFE suggests room for improvement in entry timing or stop-loss placement.");
    }

    return insights;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {riskMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                  {formatCurrencyStreamer(Number(metric.value), streamerMode, 'pnl')}
                </div>
                <p className="text-xs text-gray-400">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Visual Risk Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Drawdown Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskAnalysisData.drawdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="equity" stroke="#22c55e" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { risk: 'Low (≤$50)', count: riskAnalysisData.riskDistribution.low },
                  { risk: 'Medium ($50-100)', count: riskAnalysisData.riskDistribution.medium },
                  { risk: 'High (>$100)', count: riskAnalysisData.riskDistribution.high }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Risk-Adjusted Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskAnalysisData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="riskAdjustedReturn" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              AI Risk Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generateRiskInsights().map((insight, index) => (
                <div key={index} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              ✓ Profitability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-green-400">
              <li>• Outstanding profit factor shows strong edge and trade selection</li>
              <li>• Strong expectancy indicates each trade adds significant value</li>
              <li>• Excellent risk/reward allows for lower win rates while staying profitable</li>
              <li>• {kellyPercentage > 0.15 ? "Kelly criterion suggests room for increased position sizing" : "Position sizing appears conservative and appropriate"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              🛡️ Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-400">
              <li>• {riskOfRuin < 0.1 ? "Excellent drawdown control shows disciplined risk management" : "Risk management needs improvement - consider reducing position sizes"}</li>
              <li>• {calmarRatio > 2 ? "Strong recovery factor shows profits significantly exceed worst losses" : "Focus on improving risk-adjusted returns"}</li>
              <li>• {sortinoRatio > 1.5 ? "Consistent performance with minimal volatility" : "Work on reducing downside deviation"}</li>
              <li>• VaR metrics suggest maximum daily loss expectations are {var95 < 200 ? "well-controlled" : "concerning"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              📊 Consistency & Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-purple-400">
              <li>• {sortinoRatio > 2 ? "Excellent Sortino ratio demonstrates superior downside risk management" : "Focus on reducing negative volatility while maintaining upside"}</li>
              <li>• {calmarRatio > 3 ? "Outstanding Calmar ratio shows exceptional risk-adjusted performance" : "Work on improving returns relative to maximum drawdown"}</li>
              <li>• MAE/MFE analysis suggests {avgMFE > avgMAE * 2 ? "excellent trade management" : "room for improvement in exit strategies"}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              🧠 Trading Behavior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-cyan-400">
              <li>• {riskOfRuin < 0.05 ? "Exceptional risk control indicates mature trading psychology" : "Risk management discipline needs strengthening"}</li>
              <li>• Kelly percentage of {(kellyPercentage * 100).toFixed(1)}% suggests {kellyPercentage > 0.2 ? "aggressive but mathematically sound" : "conservative"} position sizing</li>
              <li>• {avgMAE < 50 ? "Disciplined stop-loss execution" : "Consider tightening stop-loss discipline"}</li>
              <li>• Risk distribution shows {riskAnalysisData.riskDistribution.high > riskAnalysisData.riskDistribution.low ? "aggressive" : "conservative"} position sizing approach</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            🎯 Personalized Risk Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <div className="font-medium text-blue-400 mb-1">Position Sizing Optimization</div>
                <div className="text-sm text-gray-300">
                  Based on Kelly criterion of {(kellyPercentage * 100).toFixed(1)}%, 
                  {kellyPercentage > 0.25 ? " you could increase position sizes for optimal growth" : 
                   kellyPercentage < 0.05 ? " focus on improving win rate before increasing size" : 
                   " your current sizing appears optimal"}
                </div>
              </div>
              <div className="p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                <div className="font-medium text-orange-400 mb-1">Daily Risk Limits</div>
                <div className="text-sm text-gray-300">
                  Set maximum daily loss at VaR 95% level: ${var95.toFixed(2)}. 
                  This gives you 95% confidence in your daily risk exposure.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <div className="font-medium text-green-400 mb-1">Exit Strategy Enhancement</div>
                <div className="text-sm text-gray-300">
                  Target MFE of ${(avgMFE * 1.2).toFixed(2)} to improve profit capture. 
                  Current MAE suggests {avgMAE > 30 ? "tighter stops needed" : "good stop discipline"}.
                </div>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <div className="font-medium text-purple-400 mb-1">Portfolio Heat</div>
                <div className="text-sm text-gray-300">
                  Maintain total portfolio risk below {(kellyPercentage * 100 * 0.5).toFixed(1)}% 
                  to ensure long-term capital preservation.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedRiskAnalytics;
