import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SymbolStats } from "@/types/metrics";
import { formatCurrency, formatPercentage, formatCurrencyStreamer } from "@/utils/formatters";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface SymbolPerformanceProps {
  symbolStats: SymbolStats[];
}

const SymbolPerformance = ({ symbolStats }: SymbolPerformanceProps) => {
  const { streamerMode } = useStreamerMode();

  if (symbolStats.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Symbol</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {symbolStats.slice(0, 6).map((stat) => (
            <div key={stat.symbol} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{stat.symbol}</h4>
                <Badge variant={stat.pnl >= 0 ? "default" : "destructive"}>
                  <span className="font-bold">
                    {formatCurrencyStreamer(stat.pnl, streamerMode, 'pnl')}
                  </span>
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{stat.trades} trades • {formatPercentage(stat.winRate, 1)} win rate</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolPerformance;
