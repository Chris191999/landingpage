
import { useState, useMemo } from "react";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import PlanUpgradePrompt from "@/components/common/PlanUpgradePrompt";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import MonthlyPnLSummary from "./MonthlyPnLSummary";
import { Trade } from "@/types/trade";

interface TradingCalendarProps {
  trades: Trade[];
  onDayTradeClick?: (trades: Trade[], date: Date) => void;
}

const TradingCalendar = ({ trades, onDayTradeClick }: TradingCalendarProps) => {
  const { data: planFeatures } = usePlanFeatures();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Generate calendar data
  const { weeklyData, monthlyPnL } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and calculate start of calendar grid
    const firstDay = new Date(year, month, 1);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));
    
    const weeks = [];
    let currentWeekStart = new Date(startOfWeek);
    
    // Generate 6 weeks of data
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + dayIndex);
        
        const dayTrades = trades.filter(trade => {
          const tradeDate = new Date(trade.date);
          return tradeDate.toDateString() === date.toDateString();
        });
        
        const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        
        week.push({
          date,
          trades: dayTrades,
          pnl: dayPnL,
          isCurrentMonth: date.getMonth() === month
        });
      }
      weeks.push(week);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    // Calculate monthly P&L
    const monthlyTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() === month && tradeDate.getFullYear() === year;
    });
    
    const totalPnL = monthlyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    
    return {
      weeklyData: weeks,
      monthlyPnL: totalPnL
    };
  }, [trades, currentDate]);

  const handleDayClick = (dayData: any) => {
    if (onDayTradeClick && dayData.trades && dayData.trades.length > 0) {
      onDayTradeClick(dayData.trades, dayData.date);
    }
  };

  // Calendar is now accessible to all plans including free, so no need to check access
  return (
    <div className="space-y-6">
      <CalendarHeader 
        currentMonth={currentMonth}
        onNavigateMonth={handleNavigateMonth}
      />
      <CalendarGrid 
        weeklyData={weeklyData}
        onDayClick={handleDayClick}
      />
      <MonthlyPnLSummary 
        monthlyPnL={monthlyPnL}
        currentMonth={currentMonth}
      />
    </div>
  );
};

export default TradingCalendar;
