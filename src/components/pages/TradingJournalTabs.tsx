
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, PlusCircle, Upload, Brain } from "lucide-react";

const TradingJournalTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
      <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <BarChart3 size={16} />
        Overview
      </TabsTrigger>
      <TabsTrigger value="trades" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <TrendingUp size={16} />
        All Trades
      </TabsTrigger>
      <TabsTrigger value="add-trade" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <PlusCircle size={16} />
        Add Trade
      </TabsTrigger>
      <TabsTrigger value="import" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <Upload size={16} />
        Import/Export
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <BarChart3 size={16} />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
        <Brain size={16} />
        Advanced
      </TabsTrigger>
    </TabsList>
  );
};

export default TradingJournalTabs;
