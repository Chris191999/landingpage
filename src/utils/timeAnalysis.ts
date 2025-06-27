
import { Trade, TimeAnalysis } from "@/types/trade";

export const analyzeTimePatterns = (trades: Trade[]): TimeAnalysis => {
  const completedTrades = trades.filter(trade => trade.status === 'Completed');
  
  // Hourly performance
  const hourlyData = new Map<number, { pnl: number; trades: number }>();
  
  // Daily performance
  const dailyData = new Map<string, { pnl: number; trades: number }>();
  
  // Monthly performance
  const monthlyData = new Map<string, { pnl: number; trades: number }>();
  
  completedTrades.forEach(trade => {
    const tradeDate = new Date(trade.date);
    const pnl = trade.pnl || 0;
    
    // Hour analysis
    if (trade.time_of_day) {
      const hour = parseInt(trade.time_of_day.split(':')[0]);
      const existing = hourlyData.get(hour) || { pnl: 0, trades: 0 };
      hourlyData.set(hour, {
        pnl: existing.pnl + pnl,
        trades: existing.trades + 1
      });
    }
    
    // Day of week analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[tradeDate.getDay()];
    const existingDaily = dailyData.get(dayOfWeek) || { pnl: 0, trades: 0 };
    dailyData.set(dayOfWeek, {
      pnl: existingDaily.pnl + pnl,
      trades: existingDaily.trades + 1
    });
    
    // Monthly analysis
    const monthKey = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}`;
    const existingMonthly = monthlyData.get(monthKey) || { pnl: 0, trades: 0 };
    monthlyData.set(monthKey, {
      pnl: existingMonthly.pnl + pnl,
      trades: existingMonthly.trades + 1
    });
  });
  
  return {
    hourlyPerformance: Array.from(hourlyData.entries()).map(([hour, data]) => ({
      hour,
      pnl: data.pnl,
      trades: data.trades
    })).sort((a, b) => a.hour - b.hour),
    
    dailyPerformance: Array.from(dailyData.entries()).map(([day, data]) => ({
      day,
      pnl: data.pnl,
      trades: data.trades
    })),
    
    monthlyPerformance: Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      pnl: data.pnl,
      trades: data.trades
    })).sort((a, b) => a.month.localeCompare(b.month))
  };
};

export const calculateTradeDurationStats = (trades: Trade[]) => {
  const tradesWithDuration = trades.filter(trade => 
    trade.status === 'Completed' && trade.trade_duration_hours != null
  );
  
  if (tradesWithDuration.length === 0) return { avgDuration: 0, medianDuration: 0 };
  
  const durations = tradesWithDuration.map(trade => trade.trade_duration_hours!).sort((a, b) => a - b);
  const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  const medianDuration = durations[Math.floor(durations.length / 2)];
  
  return { avgDuration, medianDuration };
};
