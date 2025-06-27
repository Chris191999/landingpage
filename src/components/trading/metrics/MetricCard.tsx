
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCardProps } from "@/types/metrics";

const MetricCard = ({ title, value, subtitle, trend = 'neutral', icon: Icon }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : 'text-muted-foreground'}`} />}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`text-2xl font-bold ${getTrendColor()}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
