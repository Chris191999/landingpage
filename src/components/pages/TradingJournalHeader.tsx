
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap } from "lucide-react";

interface TradingJournalHeaderProps {
  onGenerateNewData: () => void;
}

const TradingJournalHeader = ({ onGenerateNewData }: TradingJournalHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-white">
        <TrendingUp className="text-blue-400" />
        The House Of Traders - Trading Journal
      </h1>
      <p className="text-gray-300 text-lg">
        Track, analyze, and improve your trading performance with advanced analytics
      </p>
      
      <div className="mt-4">
        <Button 
          onClick={onGenerateNewData}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Zap className="mr-2 h-4 w-4" />
          Generate New Demo Data
        </Button>
      </div>
    </div>
  );
};

export default TradingJournalHeader;
