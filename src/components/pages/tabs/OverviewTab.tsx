import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PerformanceMetrics from "@/components/trading/PerformanceMetrics";
import TradeList from "@/components/trading/TradeList";
import TradingCalendar from "@/components/trading/calendar/TradingCalendar";
import { Trade } from "@/types/trade";
import TradeDetailModal from "@/components/trading/TradeDetailModal";
import { useState, useEffect } from "react";
import MenteeDashboard from "@/components/mentor/MenteeDashboard";
import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import { formatCurrencyStreamer } from "@/utils/formatters";
import { useStreamerMode } from "@/components/layout/StreamerModeProvider";
import { getCurrentCurrency } from "@/utils/currencyUtils";

interface OverviewTabProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  mentorProfiles?: any[];
}

const OverviewTab = ({ trades, onEdit, onDelete, mentorProfiles }: OverviewTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dayTrades, setDayTrades] = useState<Trade[]>([]);
  const [currentTradeIndex, setCurrentTradeIndex] = useState(0);
  const { streamerMode } = useStreamerMode();
  const [currency, setCurrency] = useState(getCurrentCurrency());

  const { stats } = usePerformanceStats(trades);

  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || getCurrentCurrency());
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  // Calculate week/month P&L
  const completedTrades = trades.filter(t => t.status === 'Completed');
  const weekMap = new Map();
  const monthMap = new Map();
  completedTrades.forEach(trade => {
    const date = new Date(trade.date);
    const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    weekMap.set(week, (weekMap.get(week) || 0) + (trade.pnl || 0));
    monthMap.set(month, (monthMap.get(month) || 0) + (trade.pnl || 0));
  });
  const avgWeekPnL = weekMap.size > 0 ? Array.from(weekMap.values()).reduce((a, b) => a + b, 0) / weekMap.size : 0;
  const avgMonthPnL = monthMap.size > 0 ? Array.from(monthMap.values()).reduce((a, b) => a + b, 0) / monthMap.size : 0;

  // Helper for color classes
  const getPnlColor = (value: number) => value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-yellow-400';
  const getWinRateColor = (value: number) => value > 50 ? 'text-green-400' : value > 0 ? 'text-yellow-400' : 'text-red-400';
  const getProfitFactorColor = (value: number) => value > 1.5 ? 'text-green-400' : value > 1 ? 'text-yellow-400' : 'text-red-400';

  const handleDayTradeClick = (tradesForDay: Trade[], date: Date) => {
    setDayTrades(tradesForDay);
    setCurrentTradeIndex(0);
    setModalOpen(true);
  };

  const handleTradeNavigation = (direction: 'prev' | 'next') => {
    setCurrentTradeIndex((prev) => {
      if (direction === 'prev') return Math.max(0, prev - 1);
      if (direction === 'next') return Math.min(dayTrades.length - 1, prev + 1);
      return prev;
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDayTrades([]);
    setCurrentTradeIndex(0);
  };

  return (
    <TabsContent value="overview">
      <div className="grid gap-6">
        {/* Metrics summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Total P&L</div>
            <div className={`text-2xl font-bold ${getPnlColor(stats.totalPnL)}`}>
              {formatCurrencyStreamer(stats.totalPnL, streamerMode, 'pnl')}
            </div>
            <div className="text-xs text-gray-500">Net profit/loss</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Week P&L</div>
            <div className={`text-2xl font-bold ${getPnlColor(avgWeekPnL)}`}>
              {formatCurrencyStreamer(avgWeekPnL, streamerMode, 'pnl')}
            </div>
            <div className="text-xs text-gray-500">Average weekly P&L</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Monthly P&L</div>
            <div className={`text-2xl font-bold ${getPnlColor(avgMonthPnL)}`}>
              {formatCurrencyStreamer(avgMonthPnL, streamerMode, 'pnl')}
            </div>
            <div className="text-xs text-gray-500">Average monthly P&L</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Total Trades</div>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <div className="text-xs text-gray-500">{stats.winningTrades}W / {stats.losingTrades}L</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Win Rate</div>
            <div className={`text-2xl font-bold ${getWinRateColor(stats.winRate)}`}>{stats.winRate.toFixed(2)}%</div>
            <div className="text-xs text-gray-500">Winning trades percentage</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Total R</div>
            <div className="text-2xl font-bold">{stats.totalR.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Gross R multiple</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-start shadow">
            <div className="text-xs text-gray-400">Profit Factor</div>
            <div className={`text-2xl font-bold ${getProfitFactorColor(stats.profitFactor)}`}>{stats.profitFactor.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Gross profit / Gross loss</div>
          </div>
        </div>
        {/* End metrics summary grid */}
        <TradingCalendar trades={trades} onDayTradeClick={handleDayTradeClick} />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeList 
              trades={trades.slice(-5)} 
              onEdit={onEdit}
              onDelete={onDelete}
              compact={true}
            />
          </CardContent>
        </Card>
        {/* Only show mentor dashboard if mentorProfiles is non-empty */}
        {mentorProfiles && mentorProfiles.length > 0 && (
          <MenteeDashboard mentors={mentorProfiles} />
        )}
      </div>
      <TradeDetailModal
        trade={dayTrades[currentTradeIndex] || null}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        dayTrades={dayTrades}
        currentTradeIndex={currentTradeIndex}
        onTradeNavigation={handleTradeNavigation}
      />
    </TabsContent>
  );
};

export default OverviewTab;
