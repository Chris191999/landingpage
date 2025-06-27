
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceStats } from "@/types/trade";
import { formatCurrency } from "@/utils/formatters";

interface CorePerformanceCardsProps {
  stats: PerformanceStats;
}

const CorePerformanceCards = ({ stats }: CorePerformanceCardsProps) => {
  const recoveryFactor = stats.maxDrawdownAmount > 0 ? stats.totalPnL / stats.maxDrawdownAmount : Infinity;
  
  const performanceCards = [
    {
      title: "Profit Factor",
      value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2),
      subtitle: "Gross P&L",
      color: stats.profitFactor > 2 ? "text-green-400" : stats.profitFactor > 1 ? "text-blue-400" : "text-red-400"
    },
    {
      title: "Recovery Factor", 
      value: recoveryFactor === Infinity ? "∞" : recoveryFactor.toFixed(2),
      subtitle: "Net P&L",
      color: recoveryFactor > 3 ? "text-green-400" : recoveryFactor > 1 ? "text-blue-400" : "text-red-400"
    },
    {
      title: "Expectancy",
      value: `${stats.expectancy.toFixed(2)}R`,
      subtitle: "Per Trade",
      color: stats.expectancy > 0.5 ? "text-green-400" : stats.expectancy > 0 ? "text-blue-400" : "text-red-400"
    },
    {
      title: "Max Drawdown",
      value: `${stats.maxDrawdown.toFixed(1)}%`,
      subtitle: "Largest DD",
      color: stats.maxDrawdown < 10 ? "text-green-400" : stats.maxDrawdown < 20 ? "text-yellow-400" : "text-red-400"
    },
    {
      title: "Consistency",
      value: stats.sharpeRatio.toFixed(2),
      subtitle: "Sharpe Ratio",
      color: stats.sharpeRatio > 2 ? "text-green-400" : stats.sharpeRatio > 1 ? "text-blue-400" : "text-red-400"
    },
    {
      title: "Win Rate", 
      value: `${stats.winRate.toFixed(0)}%`,
      subtitle: "Winning %",
      color: stats.winRate > 60 ? "text-green-400" : stats.winRate > 50 ? "text-blue-400" : "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {performanceCards.map((card, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CorePerformanceCards;
