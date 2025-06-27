import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Trade } from '@/types/trade';
import { Brain, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import RulesTrackingSection from '../psychology/RulesTrackingSection';
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface PsychologyDashboardProps {
  trades: Trade[];
}

const PsychologyDashboard = ({ trades }: PsychologyDashboardProps) => {
  const psychologyMetrics = useMemo(() => {
    const completedTrades = trades.filter(t => t.status === 'Completed');
    
    // Emotion analysis
    const emotionData: Record<string, { count: number; avgPnL: number; totalPnL: number }> = {};
    completedTrades.forEach(trade => {
      if (trade.emotion) {
        if (!emotionData[trade.emotion]) {
          emotionData[trade.emotion] = { count: 0, avgPnL: 0, totalPnL: 0 };
        }
        emotionData[trade.emotion].count++;
        emotionData[trade.emotion].totalPnL += trade.pnl || 0;
      }
    });

    Object.keys(emotionData).forEach(emotion => {
      emotionData[emotion].avgPnL = emotionData[emotion].totalPnL / emotionData[emotion].count;
    });

    // Rules followed analysis
    const rulesData = { yes: 0, no: 0, partial: 0 };
    const rulesPnL = { yes: 0, no: 0, partial: 0 };
    completedTrades.forEach(trade => {
      if (trade.rules_followed && trade.rules_followed in rulesData) {
        rulesData[trade.rules_followed as keyof typeof rulesData]++;
        rulesPnL[trade.rules_followed as keyof typeof rulesPnL] += trade.pnl || 0;
      }
    });

    // Confidence vs Performance
    const confidenceData: Record<number, { count: number; avgPnL: number; winRate: number; wins: number }> = {};
    completedTrades.forEach(trade => {
      if (trade.confidence_rating) {
        if (!confidenceData[trade.confidence_rating]) {
          confidenceData[trade.confidence_rating] = { count: 0, avgPnL: 0, winRate: 0, wins: 0 };
        }
        confidenceData[trade.confidence_rating].count++;
        confidenceData[trade.confidence_rating].avgPnL += trade.pnl || 0;
        if ((trade.pnl || 0) > 0) {
          confidenceData[trade.confidence_rating].wins++;
        }
      }
    });

    Object.keys(confidenceData).forEach(rating => {
      const ratingNum = parseInt(rating);
      confidenceData[ratingNum].avgPnL = confidenceData[ratingNum].avgPnL / confidenceData[ratingNum].count;
      confidenceData[ratingNum].winRate = (confidenceData[ratingNum].wins / confidenceData[ratingNum].count) * 100;
    });

    // Mistake categories
    const mistakeData: Record<string, number> = {};
    completedTrades.forEach(trade => {
      if (trade.mistake_category && trade.mistake_category !== 'none') {
        mistakeData[trade.mistake_category] = (mistakeData[trade.mistake_category] || 0) + 1;
      }
    });

    // Discipline score calculation
    const disciplineScore = (() => {
      const rulesFollowedPercent = (rulesData.yes / (rulesData.yes + rulesData.no + rulesData.partial)) * 100;
      const noMistakePercent = ((completedTrades.length - Object.values(mistakeData).reduce((a, b) => a + b, 0)) / completedTrades.length) * 100;
      return (rulesFollowedPercent + noMistakePercent) / 2;
    })();

    return {
      emotionData,
      rulesData,
      rulesPnL,
      confidenceData,
      mistakeData,
      disciplineScore
    };
  }, [trades]);

  const emotionChartData = Object.entries(psychologyMetrics.emotionData).map(([emotion, data]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    count: data.count,
    avgPnL: data.avgPnL,
    totalPnL: data.totalPnL
  }));

  const rulesChartData = Object.entries(psychologyMetrics.rulesData).map(([rule, count]) => ({
    rule: rule.charAt(0).toUpperCase() + rule.slice(1),
    count,
    avgPnL: psychologyMetrics.rulesPnL[rule as keyof typeof psychologyMetrics.rulesPnL] / count
  }));

  const confidenceChartData = Object.entries(psychologyMetrics.confidenceData)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([rating, data]) => ({
      confidence: `${rating}/10`,
      avgPnL: data.avgPnL,
      winRate: data.winRate,
      trades: data.count
    }));

  const mistakeChartData = Object.entries(psychologyMetrics.mistakeData).map(([mistake, count]) => ({
    mistake: mistake.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347'];

  const { streamerMode } = useStreamerMode();
  const [currency, setCurrency] = useState('USD');
  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || 'USD');
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  return (
    <div className="space-y-6">
      {/* Rules Tracking Section from Image 3 */}
      <RulesTrackingSection trades={trades} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Discipline Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {psychologyMetrics.disciplineScore.toFixed(1)}%
            </div>
            <Progress value={psychologyMetrics.disciplineScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rules Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Always</span>
                <Badge variant="outline">{psychologyMetrics.rulesData.yes}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sometimes</span>
                <Badge variant="outline">{psychologyMetrics.rulesData.partial}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Never</span>
                <Badge variant="destructive">{psychologyMetrics.rulesData.no}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Profitable Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            {emotionChartData.length > 0 && (
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {emotionChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).emotion}
                </div>
                <div className="text-sm text-gray-500">
                  Avg: {formatCurrencyStreamer(emotionChartData.reduce((best, current) => 
                    current.avgPnL > best.avgPnL ? current : best
                  ).avgPnL, streamerMode, 'pnl')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Common Mistakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-red-600">
              {Object.values(psychologyMetrics.mistakeData).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Mistakes</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotion vs Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" angle={-45} textAnchor="end" height={80} />
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
            <CardTitle>Rules Adherence Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rulesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rule" />
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
            <CardTitle>Confidence vs Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="confidence" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="avgPnL" stroke="#8884d8" name="Avg P&L" />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#82ca9d" name="Win Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Mistakes Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mistakeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mistakeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Psychology Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Strengths</h4>
              {psychologyMetrics.disciplineScore > 70 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Good discipline score indicates strong rule adherence</span>
                </div>
              )}
              {emotionChartData.length > 0 && emotionChartData.some(e => e.avgPnL > 0) && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Profitable emotional states identified - leverage these conditions</span>
                </div>
              )}
              {trades.filter(t => t.rules_followed === 'yes').length > trades.filter(t => t.rules_followed === 'no').length && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Strong rule-following behavior leads to better outcomes</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">Areas for Improvement</h4>
              {psychologyMetrics.disciplineScore < 70 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Focus on rule adherence and mistake reduction to improve discipline</span>
                </div>
              )}
              {Object.values(psychologyMetrics.mistakeData).reduce((a, b) => a + b, 0) > trades.length * 0.3 && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">High mistake frequency - implement pre-trade checklists and review processes</span>
                </div>
              )}
              {trades.filter(t => t.rules_followed === 'no').length > trades.filter(t => t.rules_followed === 'yes').length && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Rule violations exceed adherence - focus on discipline improvement</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologyDashboard;
