import { Trade } from "@/types/trade";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface DayData {
  date: Date;
  trades: Trade[];
  pnl: number;
  isCurrentMonth: boolean;
}

interface CalendarDayProps {
  dayData: DayData;
  onDayClick: (dayData: DayData) => void;
}

const CalendarDay = ({ dayData, onDayClick }: CalendarDayProps) => {
  const { streamerMode } = useStreamerMode();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getDayColor = (pnl: number, hasTradesThisMonth: boolean) => {
    if (!hasTradesThisMonth || pnl === 0) return 'text-gray-400';
    return pnl > 0 ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20';
  };

  return (
    <div
      onClick={() => onDayClick(dayData)}
      className={`
        min-h-[80px] p-2 rounded border border-gray-700 cursor-pointer
        transition-all hover:bg-gray-700/50
        ${getDayColor(dayData.pnl, dayData.isCurrentMonth && dayData.trades.length > 0)}
        ${!dayData.isCurrentMonth ? 'opacity-40' : ''}
      `}
    >
      <div className="text-sm font-medium">
        {dayData.date.getDate()}
      </div>
      {dayData.trades.length > 0 && (
        <div className="mt-1 space-y-1">
          <div className="text-xs">
            {dayData.trades.length} trade{dayData.trades.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs font-medium">
            {formatCurrencyStreamer(dayData.pnl, streamerMode, 'pnl')}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
