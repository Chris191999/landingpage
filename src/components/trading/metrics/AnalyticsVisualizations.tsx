import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Trade } from "@/types/trade";
import { useMemo } from "react";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6384"];

interface AnalyticsVisualizationsProps {
  trades: Trade[];
}

const AnalyticsVisualizations = ({ trades }: AnalyticsVisualizationsProps) => {
  const { streamerMode } = useStreamerMode();

  // --- Data Preparation ---
  const completedTrades = useMemo(() => trades.filter(t => t.status === 'Completed'), [trades]);

  // Daily Performance
  const dailyPerformance = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const map = new Map<string, { pnl: number; trades: number }>();
    completedTrades.forEach(trade => {
      const day = dayNames[new Date(trade.date).getDay()];
      const existing = map.get(day) || { pnl: 0, trades: 0 };
      map.set(day, { pnl: existing.pnl + (trade.pnl || 0), trades: existing.trades + 1 });
    });
    return dayNames.map(day => ({ day, pnl: map.get(day)?.pnl || 0, trades: map.get(day)?.trades || 0 }));
  }, [completedTrades]);

  // Monthly Performance
  const monthlyPerformance = useMemo(() => {
    const map = new Map<string, { pnl: number; trades: number }>();
    completedTrades.forEach(trade => {
      const d = new Date(trade.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const existing = map.get(key) || { pnl: 0, trades: 0 };
      map.set(key, { pnl: existing.pnl + (trade.pnl || 0), trades: existing.trades + 1 });
    });
    return Array.from(map.entries()).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month));
  }, [completedTrades]);

  // Session Analysis
  const sessionPerformance = useMemo(() => {
    const map = new Map<string, { pnl: number; trades: number }>();
    completedTrades.forEach(trade => {
      const session = trade.session || 'Unknown';
      const existing = map.get(session) || { pnl: 0, trades: 0 };
      map.set(session, { pnl: existing.pnl + (trade.pnl || 0), trades: existing.trades + 1 });
    });
    return Array.from(map.entries()).map(([session, data]) => ({ session, ...data }));
  }, [completedTrades]);

  // Trade Distributions (P&L and R-multiple)
  const pnlDistribution = useMemo(() => {
    // Bin size $50
    const binSize = 50;
    const bins = new Map<number, number>();
    completedTrades.forEach(trade => {
      const pnl = trade.pnl || 0;
      const bin = Math.floor(pnl / binSize) * binSize;
      bins.set(bin, (bins.get(bin) || 0) + 1);
    });
    return Array.from(bins.entries()).map(([bin, count]) => ({ bin, count })).sort((a, b) => a.bin - b.bin);
  }, [completedTrades]);

  const rMultipleDistribution = useMemo(() => {
    // Bin size 0.5R
    const binSize = 0.5;
    const bins = new Map<number, number>();
    completedTrades.forEach(trade => {
      const r = trade.rMultiple || 0;
      const bin = Math.floor(r / binSize) * binSize;
      bins.set(bin, (bins.get(bin) || 0) + 1);
    });
    return Array.from(bins.entries()).map(([bin, count]) => ({ bin, count })).sort((a, b) => a.bin - b.bin);
  }, [completedTrades]);

  // --- UI ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {/* Daily Performance */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Daily Performance</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-w-0">
          <ChartContainer className="h-[260px] min-w-0" config={{ pnl: { label: 'P&L', color: '#10b981' } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPerformance}>
                <XAxis dataKey="day" />
                <YAxis tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="pnl" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-w-0">
          <ChartContainer className="h-[260px] min-w-0" config={{ pnl: { label: 'P&L', color: '#6366f1' } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformance}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="pnl" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Session Analysis */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Session Analysis</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-w-0">
          <ChartContainer className="h-[260px] min-w-0" config={{ trades: { label: 'Trades', color: '#8884D8' } }}>
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionPerformance}
                    dataKey="trades"
                    nameKey="session"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ session }) => session}
                  >
                    {sessionPerformance.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {sessionPerformance.map((entry, idx) => (
                  <span key={entry.session} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: COLORS[idx % COLORS.length], color: '#fff' }}>{entry.session}: {entry.trades} trades</span>
                ))}
              </div>
            </>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Trade Distribution: P&L */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Trade P&L Distribution</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-w-0">
          <ChartContainer className="h-[260px] min-w-0" config={{ count: { label: 'Trades', color: '#f59e42' } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlDistribution}>
                <XAxis dataKey="bin" tickFormatter={v => `$${v}`} label={{ value: 'P&L Bin', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Trades', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#f59e42" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Trade Distribution: R-multiple */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">R-Multiple Distribution</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-w-0">
          <ChartContainer className="h-[260px] min-w-0" config={{ count: { label: 'Trades', color: '#6366f1' } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rMultipleDistribution}>
                <XAxis dataKey="bin" tickFormatter={v => `${v}R`} label={{ value: 'R Bin', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Trades', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsVisualizations;
