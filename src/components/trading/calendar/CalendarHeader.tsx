
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentMonth: string;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const CalendarHeader = ({ currentMonth, onNavigateMonth }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-white text-xl font-semibold">Trading Calendar</h3>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigateMonth('prev')}
          className="text-white hover:bg-gray-700"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-white font-medium min-w-[180px] text-center">
          {currentMonth}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigateMonth('next')}
          className="text-white hover:bg-gray-700"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
