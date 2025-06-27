
import CalendarWeek from "./CalendarWeek";
import { Trade } from "@/types/trade";

interface DayData {
  date: Date;
  trades: Trade[];
  pnl: number;
  isCurrentMonth: boolean;
}

interface CalendarGridProps {
  weeklyData: DayData[][];
  onDayClick: (dayData: DayData) => void;
}

const CalendarGrid = ({ weeklyData, onDayClick }: CalendarGridProps) => {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="grid grid-cols-8 gap-1 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Week P&L'].map(day => (
          <div key={day} className="text-center text-gray-400 text-sm font-medium p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar weeks */}
      {weeklyData.map((week, weekIndex) => (
        <CalendarWeek
          key={weekIndex}
          week={week}
          weekIndex={weekIndex}
          onDayClick={onDayClick}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;
