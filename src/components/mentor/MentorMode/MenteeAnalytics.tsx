
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Award } from 'lucide-react';

interface MenteeAnalyticsProps {
  mentees: any[];
}

const MenteeAnalytics = ({ mentees }: MenteeAnalyticsProps) => {
  const analyticsData = useMemo(() => {
    if (mentees.length === 0) return null;

    // Performance distribution
    const performanceDistribution = mentees.map(mentee => ({
      name: mentee.full_name || mentee.email?.substring(0, 10) || 'Unknown',
      pnl: mentee.totalPnL || 0,
      winRate: mentee.winRate || 0,
      trades: mentee.totalTrades || 0
    }));

    // Win rate distribution
    const winRateRanges = [
      { range: '0-30%', count: 0, color: '#ef4444' },
      { range: '30-50%', count: 0, color: '#f97316' },
      { range: '50-70%', count: 0, color: '#eab308' },
      { range: '70-90%', count: 0, color: '#22c55e' },
      { range: '90-100%', count: 0, color: '#10b981' }
    ];

    mentees.forEach(mentee => {
      const winRate = mentee.winRate || 0;
      if (winRate < 30) winRateRanges[0].count++;
      else if (winRate < 50) winRateRanges[1].count++;
      else if (winRate < 70) winRateRanges[2].count++;
      else if (winRate < 90) winRateRanges[3].count++;
      else winRateRanges[4].count++;
    });

    // Risk levels
    const riskLevels = [
      { level: 'Conservative', count: 0 },
      { level: 'Moderate', count: 0 },
      { level: 'Aggressive', count: 0 }
    ];

    mentees.forEach(mentee => {
      const avgRisk = mentee.avgRisk || 1;
      if (avgRisk < 1) riskLevels[0].count++;
      else if (avgRisk < 2) riskLevels[1].count++;
      else riskLevels[2].count++;
    });

    return {
      performanceDistribution,
      winRateRanges,
      riskLevels,
      totalMentees: mentees.length,
      profitableMentees: mentees.filter(m => (m.totalPnL || 0) > 0).length,
      averageWinRate: mentees.reduce((sum, m) => sum + (m.winRate || 0), 0) / mentees.length,
      totalPnL: mentees.reduce((sum, m) => sum + (m.totalPnL || 0), 0)
    };
  }, [mentees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Add mentees to see performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Mentees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f5dd01]">{analyticsData.totalMentees}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Profitable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{analyticsData.profitableMentees}</div>
            <div className="text-xs text-gray-500">
              {((analyticsData.profitableMentees / analyticsData.totalMentees) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Avg Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {analyticsData.averageWinRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Combined P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analyticsData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(analyticsData.totalPnL)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Mentee Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'pnl' ? formatCurrency(value) : value,
                    name === 'pnl' ? 'P&L' : name === 'winRate' ? 'Win Rate' : 'Trades'
                  ]}
                />
                <Bar dataKey="pnl" fill="#f5dd01" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win Rate Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Win Rate Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.winRateRanges}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.winRateRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Profile Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Risk Profile Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.riskLevels} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis dataKey="level" type="category" stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win Rate vs P&L Correlation */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Win Rate vs P&L Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="winRate" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'P&L']}
                />
                <Line type="monotone" dataKey="pnl" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenteeAnalytics;
