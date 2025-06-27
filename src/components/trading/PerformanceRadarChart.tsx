
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Trade, PerformanceStats } from "@/types/trade";
import { Activity } from "lucide-react";

interface PerformanceRadarChartProps {
  trades: Trade[];
  stats: PerformanceStats;
}

const PerformanceRadarChart = ({ trades, stats }: PerformanceRadarChartProps) => {
  const radarData = useMemo(() => {
    // Normalize metrics to 0-100 scale for radar chart
    const normalizeWinRate = Math.min(100, (stats.winRate / 70) * 100); // 70% = 100 points
    const normalizeProfitFactor = stats.profitFactor === Infinity ? 100 : Math.min(100, (stats.profitFactor / 3) * 100); // 3.0 PF = 100 points
    const normalizeRecoveryFactor = stats.maxDrawdownAmount > 0 ? 
      Math.min(100, ((stats.totalPnL / stats.maxDrawdownAmount) / 5) * 100) : 100; // 5.0 RF = 100 points
    const normalizeExpectancy = Math.min(100, Math.max(0, (stats.expectancy / 0.5) * 100)); // 0.5R = 100 points
    const normalizeMaxDrawdown = Math.min(100, Math.max(0, (1 - stats.maxDrawdown / 30) * 100)); // 30% DD = 0 points
    const normalizeConsistency = Math.min(100, (stats.sharpeRatio / 2.5) * 100); // 2.5 Sharpe = 100 points

    return [
      {
        metric: "Win Rate",
        value: normalizeWinRate,
        fullMark: 100,
      },
      {
        metric: "Profit Factor",
        value: normalizeProfitFactor,
        fullMark: 100,
      },
      {
        metric: "Recovery Factor",
        value: normalizeRecoveryFactor,
        fullMark: 100,
      },
      {
        metric: "Expectancy",
        value: normalizeExpectancy,
        fullMark: 100,
      },
      {
        metric: "Max Drawdown",
        value: normalizeMaxDrawdown,
        fullMark: 100,
      },
      {
        metric: "Consistency",
        value: normalizeConsistency,
        fullMark: 100,
      },
    ];
  }, [stats]);

  const metricsDisplay = useMemo(() => {
    const recoveryFactor = stats.maxDrawdownAmount > 0 ? (stats.totalPnL / stats.maxDrawdownAmount) : Infinity;
    
    return [
      { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%`, color: "text-green-400" },
      { label: "Profit Factor", value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2), color: "text-blue-400" },
      { label: "Recovery Factor", value: recoveryFactor === Infinity ? "∞" : recoveryFactor.toFixed(2), color: "text-purple-400" },
      { label: "Expectancy", value: `${stats.expectancy.toFixed(2)}R`, color: "text-cyan-400" },
      { label: "Max Drawdown", value: `${stats.maxDrawdown.toFixed(1)}%`, color: "text-orange-400" },
      { label: "Consistency", value: stats.sharpeRatio.toFixed(2), color: "text-pink-400" },
    ];
  }, [stats]);

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5" />
          Performance Radar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" className="opacity-30" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  className="text-gray-400"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickCount={5}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#8B5CF6" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Display */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Key Metrics</h4>
            <div className="grid grid-cols-1 gap-3">
              {metricsDisplay.map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 text-sm font-medium">{metric.label}</span>
                  <span className={`text-lg font-bold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
            
            {/* Performance Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round(radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length)}%
                </div>
                <div className="text-sm text-gray-400">Overall Performance</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceRadarChart;
