import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { Trade } from "@/types/trade";
import { analyzeTimePatterns, calculateTradeDurationStats } from "@/utils/timeAnalysis";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface TimeAnalysisMetricsProps {
  trades: Trade[];
}

const TimeAnalysisMetrics = ({ trades }: TimeAnalysisMetricsProps) => {
  const timeAnalysis = useMemo(() => analyzeTimePatterns(trades), [trades]);
  const durationStats = useMemo(() => calculateTradeDurationStats(trades), [trades]);
  const { streamerMode } = useStreamerMode();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const chartConfig = {
    pnl: {
      label: "P&L",
      color: "hsl(var(--chart-1))",
    },
    trades: {
      label: "Number of Trades",
      color: "hsl(var(--chart-2))",
    },
  };

  // Create heat map data for hours vs days
  const createHeatMapData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const heatMapData = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        const dayData = timeAnalysis.dailyPerformance.find(d => d.day === day);
        const hourData = timeAnalysis.hourlyPerformance.find(h => h.hour === hour);
        
        // Simplified heat map - would need more complex logic for actual hour-day combinations
        const intensity = (dayData?.pnl || 0) + (hourData?.pnl || 0);
        
        heatMapData.push({
          day,
          hour,
          intensity,
          trades: (dayData?.trades || 0) + (hourData?.trades || 0)
        });
      });
    });
    
    return heatMapData;
  };

  // Convert hours to minutes for display
  const avgDurationMinutes = (durationStats.avgDuration || 0) * 60;
  const medianDurationMinutes = (durationStats.medianDuration || 0) * 60;
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const pnlPerMinute = avgDurationMinutes > 0 ? totalPnL / avgDurationMinutes : 0;

  return (
    <div className="space-y-6">
      {/* Duration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Trade Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(avgDurationMinutes)}min
            </div>
            <p className="text-xs text-muted-foreground">
              Average holding time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Median Duration</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round(medianDurationMinutes)}min
            </div>
            <p className="text-xs text-muted-foreground">
              Middle holding time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {pnlPerMinute.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              P&L per minute
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Performance */}
        {timeAnalysis.hourlyPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance by Hour of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeAnalysis.hourlyPerformance}>
                    <XAxis dataKey="hour" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="pnl" 
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Daily Performance */}
        {timeAnalysis.dailyPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance by Day of Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeAnalysis.dailyPerformance}>
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="pnl" 
                      fill="#10b981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Monthly Performance Trend */}
      {timeAnalysis.monthlyPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeAnalysis.monthlyPerformance}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Best and Worst Time Periods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Time Periods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Best Hour */}
            {timeAnalysis.hourlyPerformance.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Best Hour</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {timeAnalysis.hourlyPerformance.reduce((best, current) => 
                      current.pnl > best.pnl ? current : best
                    ).hour}:00
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 dark:text-green-300">
                    {formatCurrencyStreamer(timeAnalysis.hourlyPerformance.reduce((best, current) => 
                      current.pnl > best.pnl ? current : best
                    ).pnl, streamerMode)}
                  </p>
                </div>
              </div>
            )}

            {/* Best Day */}
            {timeAnalysis.dailyPerformance.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Best Day</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {timeAnalysis.dailyPerformance.reduce((best, current) => 
                      current.pnl > best.pnl ? current : best
                    ).day}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 dark:text-green-300">
                    {formatCurrencyStreamer(timeAnalysis.dailyPerformance.reduce((best, current) => 
                      current.pnl > best.pnl ? current : best
                    ).pnl, streamerMode)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worst Time Periods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Worst Hour */}
            {timeAnalysis.hourlyPerformance.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">Worst Hour</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {timeAnalysis.hourlyPerformance.reduce((worst, current) => 
                      current.pnl < worst.pnl ? current : worst
                    ).hour}:00
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700 dark:text-red-300">
                    {formatCurrencyStreamer(timeAnalysis.hourlyPerformance.reduce((worst, current) => 
                      current.pnl < worst.pnl ? current : worst
                    ).pnl, streamerMode)}
                  </p>
                </div>
              </div>
            )}

            {/* Worst Day */}
            {timeAnalysis.dailyPerformance.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">Worst Day</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {timeAnalysis.dailyPerformance.reduce((worst, current) => 
                      current.pnl < worst.pnl ? current : worst
                    ).day}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700 dark:text-red-300">
                    {formatCurrencyStreamer(timeAnalysis.dailyPerformance.reduce((worst, current) => 
                      current.pnl < worst.pnl ? current : worst
                    ).pnl, streamerMode)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeAnalysisMetrics;
