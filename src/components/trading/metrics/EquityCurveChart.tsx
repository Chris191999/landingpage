import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface EquityCurveData {
  day: string;
  balance: number;
  date: string;
}

interface EquityCurveChartProps {
  equityCurveData: EquityCurveData[];
  accountBalance: number;
  onAccountBalanceChange: (balance: number) => void;
}

const EquityCurveChart = ({ 
  equityCurveData, 
  accountBalance, 
  onAccountBalanceChange 
}: EquityCurveChartProps) => {
  const { streamerMode } = useStreamerMode();

  const chartConfig = {
    balance: {
      label: "Account Balance",
      color: "#22c55e",
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Account Equity Curve</h3>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Account Equity Progression</CardTitle>
          <div className="flex items-center gap-4">
            <Label htmlFor="account-balance" className="text-white">Starting Balance:</Label>
            <Input
              id="account-balance"
              type="number"
              value={accountBalance}
              onChange={(e) => onAccountBalanceChange(Number(e.target.value))}
              className="w-32 bg-gray-700 border-gray-600 text-white"
              placeholder="10000"
            />
          </div>
        </CardHeader>
        <CardContent>
          {equityCurveData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityCurveData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151' }}
                    tickFormatter={(value) => streamerMode ? '***' : `$${value.toLocaleString()}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      color: 'white'
                    }}
                    formatter={(value) => streamerMode ? '***' : value}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-400">
              No trading data available for equity curve
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquityCurveChart;
