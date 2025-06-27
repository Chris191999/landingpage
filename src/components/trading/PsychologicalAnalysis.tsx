import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Tooltip, LineChart, Line } from "recharts";
import { Trade } from "@/types/trade";
import { Brain, Heart, AlertCircle, CheckCircle, Flame, TrendingDown, TrendingUp } from "lucide-react";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface PsychologicalAnalysisProps {
  trades: Trade[];
}

const PsychologicalAnalysis = ({ trades }: PsychologicalAnalysisProps) => {
  const { streamerMode } = useStreamerMode();
  const completedTrades = useMemo(() => trades.filter(t => t.status === 'Completed'), [trades]);

  // --- Pre-existing Metrics ---
  const rulesFollowedStats = useMemo(() => {
    const rulesFollowed = completedTrades.filter(trade => trade.rules_followed === 'yes');
    const rulesNotFollowed = completedTrades.filter(trade => trade.rules_followed === 'no');
    const avgPnlRulesFollowed = rulesFollowed.length > 0 
      ? rulesFollowed.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / rulesFollowed.length
      : 0;
    const avgPnlRulesNotFollowed = rulesNotFollowed.length > 0
      ? rulesNotFollowed.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / rulesNotFollowed.length
      : 0;
    return {
      rulesFollowed: rulesFollowed.length,
      rulesNotFollowed: rulesNotFollowed.length,
      avgPnlRulesFollowed,
      avgPnlRulesNotFollowed,
      total: completedTrades.length
    };
  }, [completedTrades]);
  const adherenceRate = rulesFollowedStats.total > 0 
    ? rulesFollowedStats.rulesFollowed / rulesFollowedStats.total
    : 0;
  const adherenceBadgeVariant = adherenceRate >= 0.8 ? 'default' : 'destructive';
  const adherenceBadgeLabel = adherenceRate >= 0.8 ? 'Good' : 'Needs Work';
  const disciplineImpact = rulesFollowedStats.avgPnlRulesFollowed - rulesFollowedStats.avgPnlRulesNotFollowed;

  // --- Emotion-Performance Heatmap ---
  const emotionMap = useMemo(() => {
    const map = new Map<string, { trades: number; totalPnl: number }>();
    completedTrades.forEach(trade => {
      if (trade.emotion) {
        const existing = map.get(trade.emotion) || { trades: 0, totalPnl: 0 };
        map.set(trade.emotion, {
          trades: existing.trades + 1,
          totalPnl: existing.totalPnl + (trade.pnl || 0)
        });
      }
    });
    return Array.from(map.entries()).map(([emotion, data]) => ({
      emotion,
      trades: data.trades,
      avgPnl: data.totalPnl / data.trades
    }));
  }, [completedTrades]);

  // --- Confidence Calibration ---
  const confidenceMap = useMemo(() => {
    const map = new Map<number, { trades: number; totalPnl: number }>();
    completedTrades.forEach(trade => {
      if (trade.confidence_rating) {
        const existing = map.get(trade.confidence_rating) || { trades: 0, totalPnl: 0 };
        map.set(trade.confidence_rating, {
          trades: existing.trades + 1,
          totalPnl: existing.totalPnl + (trade.pnl || 0)
        });
      }
    });
    return Array.from(map.entries()).map(([rating, data]) => ({
      rating,
      trades: data.trades,
      avgPnl: data.totalPnl / data.trades
    })).sort((a, b) => a.rating - b.rating);
  }, [completedTrades]);

  // --- Mistake Category Impact ---
  const mistakeMap = useMemo(() => {
    const map = new Map<string, { frequency: number; totalLoss: number }>();
    completedTrades.forEach(trade => {
      if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
        const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
        map.set(trade.mistake_category, {
          frequency: existing.frequency + 1,
          totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
        });
      }
    });
    return Array.from(map.entries()).map(([mistake, data]) => ({
      mistake,
      frequency: data.frequency,
      totalLoss: data.totalLoss,
      avgLoss: data.frequency > 0 ? data.totalLoss / data.frequency : 0
    }));
  }, [completedTrades]);
  const mostCostlyMistake = mistakeMap.reduce((max, curr) => curr.totalLoss > max.totalLoss ? curr : max, { mistake: '', frequency: 0, totalLoss: 0, avgLoss: 0 });

  // --- Rules Adherence Timeline ---
  const adherenceTimeline = useMemo(() => {
    return completedTrades.map(trade => ({
      date: trade.date,
      followed: trade.rules_followed === 'yes',
      pnl: trade.pnl || 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [completedTrades]);

  // --- Streak & Tilt Detection ---
  const streaks = useMemo(() => {
    let winStreak = 0, lossStreak = 0, maxWin = 0, maxLoss = 0;
    let tiltDetected = false;
    adherenceTimeline.forEach(trade => {
      if (trade.pnl > 0) {
        winStreak++;
        lossStreak = 0;
      } else if (trade.pnl < 0) {
        lossStreak++;
        winStreak = 0;
        if (lossStreak >= 3) tiltDetected = true;
      } else {
        winStreak = 0;
        lossStreak = 0;
      }
      maxWin = Math.max(maxWin, winStreak);
      maxLoss = Math.max(maxLoss, lossStreak);
    });
    return { maxWin, maxLoss, tiltDetected };
  }, [adherenceTimeline]);

  // --- Psychological Score ---
  const disciplineScore = useMemo(() => {
    // 40% rules adherence, 30% mistake avoidance, 30% emotional stability
    const adherence = adherenceRate;
    const mistakePenalty = 1 - (mistakeMap.length > 0 ? Math.min(1, mistakeMap.reduce((sum, m) => sum + m.frequency, 0) / completedTrades.length) : 0);
    const emotionSpread = emotionMap.length > 0 ? 1 - (emotionMap.length / 8) : 1; // 8 = number of emotions
    return Math.round((adherence * 0.4 + mistakePenalty * 0.3 + emotionSpread * 0.3) * 100);
  }, [adherenceRate, mistakeMap, emotionMap, completedTrades.length]);

  // --- Actionable Insights ---
  const insights = useMemo(() => {
    const arr = [];
    if (adherenceRate < 0.5) arr.push({ type: 'negative', message: 'Low rules adherence. Review your trading plan and stick to your rules.' });
    if (disciplineScore < 60) arr.push({ type: 'warning', message: 'Discipline score is low. Focus on consistency and emotional control.' });
    if (mostCostlyMistake.mistake) arr.push({ type: 'negative', message: `Most costly mistake: ${mostCostlyMistake.mistake.replace('_', ' ')}.` });
    if (streaks.tiltDetected) arr.push({ type: 'warning', message: 'Tilt detected: Multiple consecutive losses. Take a break and review your trades.' });
    if (adherenceRate >= 0.8 && disciplineScore >= 80) arr.push({ type: 'positive', message: 'Excellent discipline and rule adherence. Keep it up!' });
    return arr;
  }, [adherenceRate, disciplineScore, mostCostlyMistake, streaks.tiltDetected]);

  // --- UI ---
  return (
    <div className="space-y-8">
      {/* Score & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rules Followed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{rulesFollowedStats.rulesFollowed}</div>
            <p className="text-xs text-muted-foreground">Avg P&L: {formatCurrencyStreamer(rulesFollowedStats.avgPnlRulesFollowed, streamerMode)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rules Violated</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{rulesFollowedStats.rulesNotFollowed}</div>
            <p className="text-xs text-muted-foreground">Avg P&L: {formatCurrencyStreamer(rulesFollowedStats.avgPnlRulesNotFollowed, streamerMode)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{(adherenceRate * 100).toFixed(1)}%</div>
            <Badge variant={adherenceBadgeVariant}>{adherenceBadgeLabel}</Badge>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Discipline Impact</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{formatCurrencyStreamer(disciplineImpact, streamerMode)}</div>
            <p className="text-xs text-muted-foreground">Difference per trade</p>
          </CardContent>
        </Card>
      </div>

      {/* Discipline Score & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Discipline Score</CardTitle>
            <Flame className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={disciplineScore} className="h-3 w-full bg-gray-700" />
              <span className="text-lg font-bold text-yellow-400">{disciplineScore}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Aggregated from adherence, mistakes, and emotional stability</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Psychology Insights</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.length === 0 && <li className="text-xs text-muted-foreground">No major psychological issues detected. Keep up the good work!</li>}
              {insights.map((insight, idx) => (
                <li key={idx} className={`text-sm font-medium ${insight.type === 'positive' ? 'text-green-400' : insight.type === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>{insight.message}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance by Emotion */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <CardHeader>
            <CardTitle>Performance by Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ avgPnl: { label: 'Average P&L', color: '#22c55e' } }} className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionMap}>
                  <XAxis dataKey="emotion" />
                  <YAxis tickFormatter={v => `$${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgPnl" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Confidence vs Performance */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <CardHeader>
            <CardTitle>Confidence vs Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ avgPnl: { label: 'Average P&L', color: '#3b82f6' } }} className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceMap}>
                  <XAxis dataKey="rating" />
                  <YAxis tickFormatter={v => `$${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgPnl" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Emotion-Performance Heatmap */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 mt-8">
        <CardHeader>
          <CardTitle>Emotion-Performance Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-gray-400">Emotion</th>
                  <th className="px-4 py-2 text-gray-400">Avg P&L</th>
                  <th className="px-4 py-2 text-gray-400">Trades</th>
                </tr>
              </thead>
              <tbody>
                {emotionMap.map((row) => {
                  // Color intensity for P&L
                  const color = row.avgPnl > 0 ? `rgba(34,197,94,${Math.min(1, row.avgPnl/100)})` : `rgba(239,68,68,${Math.min(1, Math.abs(row.avgPnl)/100)})`;
                  return (
                    <tr key={row.emotion} className="rounded">
                      <td className="px-4 py-2 capitalize">{row.emotion}</td>
                      <td className="px-4 py-2" style={{ background: color, color: '#fff', borderRadius: '6px' }}>
                        {row.avgPnl >= 0 ? '+' : ''}${row.avgPnl.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{row.trades}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Calibration Scatter Plot */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 mt-8">
        <CardHeader>
          <CardTitle>Confidence Calibration</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ pnl: { label: 'P&L', color: '#6366f1' } }} className="h-[300px]">
            <>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <XAxis dataKey="confidence_rating" name="Confidence" type="number" domain={[1, 10]} />
                  <YAxis dataKey="pnl" name="P&L" tickFormatter={v => `$${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter data={completedTrades.map(t => ({ confidence_rating: t.confidence_rating, pnl: t.pnl }))} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Mistake Category Impact */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 mt-8">
        <CardHeader>
          <CardTitle>Mistake Category Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ totalLoss: { label: 'Total Loss', color: '#ef4444' } }} className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(() => {
                const map = new Map<string, { frequency: number; totalLoss: number }>();
                completedTrades.forEach(trade => {
                  if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
                    const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
                    map.set(trade.mistake_category, {
                      frequency: existing.frequency + 1,
                      totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
                    });
                  }
                });
                return Array.from(map.entries()).map(([mistake, data]) => ({
                  mistake,
                  frequency: data.frequency,
                  totalLoss: data.totalLoss,
                  avgLoss: data.frequency > 0 ? data.totalLoss / data.frequency : 0
                }));
              })()}>
                <XAxis dataKey="mistake" />
                <YAxis tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalLoss" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Most Costly Mistake Highlight */}
          {(() => {
            const map = new Map<string, { frequency: number; totalLoss: number }>();
            completedTrades.forEach(trade => {
              if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
                const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
                map.set(trade.mistake_category, {
                  frequency: existing.frequency + 1,
                  totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
                });
              }
            });
            const arr = Array.from(map.entries()).map(([mistake, data]) => ({ mistake, ...data }));
            if (arr.length === 0) return null;
            const mostCostly = arr.reduce((max, curr) => curr.totalLoss > max.totalLoss ? curr : max, arr[0]);
            return (
              <div className="mt-2 text-xs text-red-400 font-semibold">Most Costly: {mostCostly.mistake.replace('_', ' ')} (${mostCostly.totalLoss.toFixed(2)})</div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Rules Adherence Timeline */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 mt-8">
        <CardHeader>
          <CardTitle>Rules Adherence Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ pnl: { label: 'P&L', color: '#6366f1' } }} className="h-[260px]">
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completedTrades.map(trade => ({
                  date: trade.date,
                  pnl: trade.pnl,
                  rules_followed: trade.rules_followed
                })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={v => `$${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="pnl" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 text-xs justify-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-600 text-white">● Rules Followed</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-600 text-white">● Rules Violated</span>
              </div>
            </>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Streak & Tilt Detection */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 mt-8 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Streaks & Tilt</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            let winStreak = 0, lossStreak = 0, maxWin = 0, maxLoss = 0;
            let tiltDetected = false;
            completedTrades.forEach(trade => {
              if ((trade.pnl || 0) > 0) {
                winStreak++;
                lossStreak = 0;
              } else if ((trade.pnl || 0) < 0) {
                lossStreak++;
                winStreak = 0;
                if (lossStreak >= 3) tiltDetected = true;
              } else {
                winStreak = 0;
                lossStreak = 0;
              }
              maxWin = Math.max(maxWin, winStreak);
              maxLoss = Math.max(maxLoss, lossStreak);
            });
            return (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">Longest Win Streak:</span>
                  <span className="text-white font-bold">{maxWin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-semibold">Longest Loss Streak:</span>
                  <span className="text-white font-bold">{maxLoss}</span>
                </div>
                {tiltDetected && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400 font-semibold">Tilt Detected: Take a break and review your trades!</span>
                  </div>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Aggregate Discipline Score & Actionable Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Discipline Score</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              // 40% rules adherence, 30% mistake avoidance, 30% emotional stability
              const adherence = adherenceRate;
              const mistakePenalty = 1 - (() => {
                const map = new Map<string, { frequency: number; totalLoss: number }>();
                completedTrades.forEach(trade => {
                  if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
                    const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
                    map.set(trade.mistake_category, {
                      frequency: existing.frequency + 1,
                      totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
                    });
                  }
                });
                return map.size > 0 ? Math.min(1, Array.from(map.values()).reduce((sum, m) => sum + m.frequency, 0) / completedTrades.length) : 0;
              })();
              const emotionSpread = emotionMap.length > 0 ? 1 - (emotionMap.length / 8) : 1; // 8 = number of emotions
              const score = Math.round((adherence * 0.4 + mistakePenalty * 0.3 + emotionSpread * 0.3) * 100);
              return (
                <div className="flex items-center gap-4">
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full" style={{ width: `${score}%`, background: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }}></div>
                  </div>
                  <span className="text-lg font-bold" style={{ color: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }}>{score}%</span>
                </div>
              );
            })()}
            <p className="text-xs text-muted-foreground mt-2">Aggregated from adherence, mistakes, and emotional stability</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Psychology Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const insights = [];
              if (adherenceRate < 0.5) insights.push({ type: 'negative', message: 'Low rules adherence. Review your trading plan and stick to your rules.' });
              // Use the same mistakePenalty and score logic as above
              const mistakePenalty = 1 - (() => {
                const map = new Map<string, { frequency: number; totalLoss: number }>();
                completedTrades.forEach(trade => {
                  if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
                    const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
                    map.set(trade.mistake_category, {
                      frequency: existing.frequency + 1,
                      totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
                    });
                  }
                });
                return map.size > 0 ? Math.min(1, Array.from(map.values()).reduce((sum, m) => sum + m.frequency, 0) / completedTrades.length) : 0;
              })();
              const emotionSpread = emotionMap.length > 0 ? 1 - (emotionMap.length / 8) : 1;
              const score = Math.round((adherenceRate * 0.4 + mistakePenalty * 0.3 + emotionSpread * 0.3) * 100);
              if (score < 60) insights.push({ type: 'warning', message: 'Discipline score is low. Focus on consistency and emotional control.' });
              // Most costly mistake
              const map = new Map<string, { frequency: number; totalLoss: number }>();
              completedTrades.forEach(trade => {
                if (trade.mistake_category && trade.mistake_category !== 'none' && (trade.pnl || 0) < 0) {
                  const existing = map.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
                  map.set(trade.mistake_category, {
                    frequency: existing.frequency + 1,
                    totalLoss: existing.totalLoss + Math.abs(trade.pnl || 0)
                  });
                }
              });
              const arr = Array.from(map.entries()).map(([mistake, data]) => ({ mistake, ...data }));
              if (arr.length > 0) {
                const mostCostly = arr.reduce((max, curr) => curr.totalLoss > max.totalLoss ? curr : max, arr[0]);
                insights.push({ type: 'negative', message: `Most costly mistake: ${mostCostly.mistake.replace('_', ' ')}.` });
              }
              // Tilt detection
              let lossStreak = 0, tiltDetected = false;
              completedTrades.forEach(trade => {
                if ((trade.pnl || 0) < 0) {
                  lossStreak++;
                  if (lossStreak >= 3) tiltDetected = true;
                } else {
                  lossStreak = 0;
                }
              });
              if (tiltDetected) insights.push({ type: 'warning', message: 'Tilt detected: Multiple consecutive losses. Take a break and review your trades.' });
              if (adherenceRate >= 0.8 && score >= 80) insights.push({ type: 'positive', message: 'Excellent discipline and rule adherence. Keep it up!' });
              return (
                <ul className="space-y-2">
                  {insights.length === 0 && <li className="text-xs text-muted-foreground">No major psychological issues detected. Keep up the good work!</li>}
                  {insights.map((insight, idx) => (
                    <li key={idx} className={`text-sm font-medium ${insight.type === 'positive' ? 'text-green-400' : insight.type === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>{insight.message}</li>
                  ))}
                </ul>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PsychologicalAnalysis;
