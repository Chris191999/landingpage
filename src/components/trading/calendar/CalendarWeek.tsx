import CalendarDay from "./CalendarDay";
import { Trade } from "@/types/trade";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface DayData {
  date: Date;
  trades: Trade[];
  pnl: number;
  isCurrentMonth: boolean;
}

interface CalendarWeekProps {
  week: DayData[];
  weekIndex: number;
  onDayClick: (dayData: DayData) => void;
}

const CalendarWeek = ({ week, weekIndex, onDayClick }: CalendarWeekProps) => {
  const { streamerMode } = useStreamerMode();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const weekPnL = week.reduce((sum, day) => sum + day.pnl, 0);

  return (
    <div className="grid grid-cols-8 gap-1">
      {week.map((day, dayIndex) => (
        <CalendarDay
          key={dayIndex}
          dayData={day}
          onDayClick={onDayClick}
        />
      ))}
      
      {/* Weekly P&L */}
      <div className="min-h-[80px] p-2 rounded border border-gray-700 bg-gray-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Week {weekIndex + 1}</div>
          <div className={`text-sm font-medium ${
            weekPnL > 0 ? 'text-green-400' : weekPnL < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {formatCurrencyStreamer(weekPnL, streamerMode, 'pnl')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWeek;
