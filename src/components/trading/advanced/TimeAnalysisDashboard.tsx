import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trade } from '@/types/trade';
import { Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';
import { useEffect, useState } from 'react';

interface TimeAnalysisDashboardProps {
  trades: Trade[];
}

const TimeAnalysisDashboard = ({ trades }: TimeAnalysisDashboardProps) => {
  const timeMetrics = useMemo(() => {
    const completedTrades = trades.filter(t => t.status === 'Completed');
    
    // Time of day analysis
    const timeOfDayData: Record<string, { count: number; totalPnL: number; avgPnL: number; wins: number }> = {};
    
    // Session analysis
    const sessionData: Record<string, { count: number; totalPnL: number; avgPnL: number; wins: number }> = {};
    
    // Day of week analysis (extract from date)
    const dayOfWeekData: Record<string, { count: number; totalPnL: number; avgPnL: number; wins: number }> = {};
    
    // Trade duration analysis
    const durationRanges = {
      'Under 1h': { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 },
      '1-4h': { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 },
      '4-8h': { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 },
      'Over 8h': { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 }
    };

    // Monthly performance
    const monthlyData: Record<string, { count: number; totalPnL: number; avgPnL: number; wins: number }> = {};

    completedTrades.forEach(trade => {
      const pnl = trade.pnl || 0;
      const isWin = pnl > 0;
      
      // Time of day
      if (trade.time_of_day) {
        if (!timeOfDayData[trade.time_of_day]) {
          timeOfDayData[trade.time_of_day] = { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 };
        }
        timeOfDayData[trade.time_of_day].count++;
        timeOfDayData[trade.time_of_day].totalPnL += pnl;
        if (isWin) timeOfDayData[trade.time_of_day].wins++;
      }

      // Session
      if (trade.session) {
        if (!sessionData[trade.session]) {
          sessionData[trade.session] = { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 };
        }
        sessionData[trade.session].count++;
        sessionData[trade.session].totalPnL += pnl;
        if (isWin) sessionData[trade.session].wins++;
      }

      // Day of week
      if (trade.date) {
        const dayOfWeek = new Date(trade.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!dayOfWeekData[dayOfWeek]) {
          dayOfWeekData[dayOfWeek] = { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 };
        }
        dayOfWeekData[dayOfWeek].count++;
        dayOfWeekData[dayOfWeek].totalPnL += pnl;
        if (isWin) dayOfWeekData[dayOfWeek].wins++;
      }

      // Duration analysis
      const duration = trade.trade_duration_hours || 0;
      let range: keyof typeof durationRanges;
      if (duration < 1) range = 'Under 1h';
      else if (duration <= 4) range = '1-4h';
      else if (duration <= 8) range = '4-8h';
      else range = 'Over 8h';

      durationRanges[range].count++;
      durationRanges[range].totalPnL += pnl;
      if (isWin) durationRanges[range].wins++;

      // Monthly analysis
      if (trade.date) {
        const month = new Date(trade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { count: 0, totalPnL: 0, avgPnL: 0, wins: 0 };
        }
        monthlyData[month].count++;
        monthlyData[month].totalPnL += pnl;
        if (isWin) monthlyData[month].wins++;
      }
    });

    // Calculate averages
    Object.keys(timeOfDayData).forEach(time => {
      timeOfDayData[time].avgPnL = timeOfDayData[time].totalPnL / timeOfDayData[time].count;
    });

    Object.keys(sessionData).forEach(session => {
      sessionData[session].avgPnL = sessionData[session].totalPnL / sessionData[session].count;
    });

    Object.keys(dayOfWeekData).forEach(day => {
      dayOfWeekData[day].avgPnL = dayOfWeekData[day].totalPnL / dayOfWeekData[day].count;
    });

    Object.keys(durationRanges).forEach(range => {
      const rangeKey = range as keyof typeof durationRanges;
      if (durationRanges[rangeKey].count > 0) {
        durationRanges[rangeKey].avgPnL = durationRanges[rangeKey].totalPnL / durationRanges[rangeKey].count;
      }
    });

    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].avgPnL = monthlyData[month].totalPnL / monthlyData[month].count;
    });

    return {
      timeOfDayData,
      sessionData,
      dayOfWeekData,
      durationRanges,
      monthlyData
    };
  }, [trades]);

  // Prepare chart data
  const timeOfDayChartData = Object.entries(timeMetrics.timeOfDayData).map(([time, data]) => ({
    time,
    count: data.count,
    avgPnL: data.avgPnL,
    winRate: (data.wins / data.count) * 100,
    totalPnL: data.totalPnL
  }));

  const sessionChartData = Object.entries(timeMetrics.sessionData).map(([session, data]) => ({
    session,
    count: data.count,
    avgPnL: data.avgPnL,
    winRate: (data.wins / data.count) * 100,
    totalPnL: data.totalPnL
  }));

  const dayOfWeekChartData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    .map(day => ({
      day,
      count: timeMetrics.dayOfWeekData[day]?.count || 0,
      avgPnL: timeMetrics.dayOfWeekData[day]?.avgPnL || 0,
      winRate: timeMetrics.dayOfWeekData[day] ? (timeMetrics.dayOfWeekData[day].wins / timeMetrics.dayOfWeekData[day].count) * 100 : 0,
      totalPnL: timeMetrics.dayOfWeekData[day]?.totalPnL || 0
    }));

  const durationChartData = Object.entries(timeMetrics.durationRanges).map(([range, data]) => ({
    range,
    count: data.count,
    avgPnL: data.avgPnL,
    winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
    totalPnL: data.totalPnL
  }));

  const monthlyChartData = Object.entries(timeMetrics.monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, data]) => ({
      month,
      count: data.count,
      avgPnL: data.avgPnL,
      winRate: (data.wins / data.count) * 100,
      totalPnL: data.totalPnL
    }));

  const { streamerMode } = useStreamerMode();
  const [currency, setCurrency] = useState('USD');
  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || 'USD');
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Best Trading Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeOfDayChartData.length > 0 && (
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {timeOfDayChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).time}
                </div>
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrencyStreamer(timeOfDayChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).avgPnL, streamerMode, 'pnl')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Best Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dayOfWeekChartData.length > 0 && (
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {dayOfWeekChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).day}
                </div>
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrencyStreamer(dayOfWeekChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).avgPnL, streamerMode, 'pnl')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Optimal Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {durationChartData.length > 0 && (
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {durationChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).range}
                </div>
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrencyStreamer(durationChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).avgPnL, streamerMode, 'pnl')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Session</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionChartData.length > 0 && (
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {sessionChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).session}
                </div>
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrencyStreamer(sessionChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).avgPnL, streamerMode, 'pnl')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPnL" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPnL" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Trade Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPnL" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="totalPnL" stroke="#8884d8" name="Total P&L" />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#82ca9d" name="Win Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Time-Based Trading Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Performance Patterns</h4>
              <ul className="space-y-1 text-sm">
                {timeOfDayChartData.length > 0 && (
                  <li>• Best time: {timeOfDayChartData.reduce((best, current) => current.avgPnL > best.avgPnL ? current : best).time}</li>
                )}
                {dayOfWeekChartData.length > 0 && (
                  <li>• Best day: {dayOfWeekChartData.reduce((best, current) => current.avgPnL > best.avgPnL ? current : best).day}</li>
                )}
                {durationChartData.length > 0 && (
                  <li>• Optimal duration: {durationChartData.reduce((best, current) => current.avgPnL > best.avgPnL ? current : best).range}</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                <li>• Focus trading during your most profitable time periods</li>
                <li>• Consider avoiding days/times with consistent losses</li>
                <li>• Monitor if overtrading affects performance</li>
                <li>• Align trading schedule with your best performance windows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAnalysisDashboard;
