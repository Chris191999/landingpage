import { Trade } from "@/types/trade";
import BasicTradeInfo from "./form/BasicTradeInfo";
import PriceFinancialData from "./form/PriceFinancialData";
import AdvancedTradeData from "./form/AdvancedTradeData";
import StrategySetup from "./form/StrategySetup";
import MarketContext from "./form/MarketContext";
import PsychologicalAnalysis from "./form/PsychologicalAnalysis";
import NotesReflection from "./form/NotesReflection";

interface TradeFormFieldsProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
  trades?: any[];
}

const TradeFormFields = ({ formData, onFieldChange, trades = [] }: TradeFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <BasicTradeInfo formData={formData} onFieldChange={onFieldChange} trades={trades} />
      <PriceFinancialData formData={formData} onFieldChange={onFieldChange} />
      <AdvancedTradeData formData={formData} onFieldChange={onFieldChange} />
      <StrategySetup formData={formData} onFieldChange={onFieldChange} trades={trades} />
      <MarketContext formData={formData} onFieldChange={onFieldChange} trades={trades} />
      <PsychologicalAnalysis formData={formData} onFieldChange={onFieldChange} />
      <NotesReflection 
        formData={formData} 
        onFieldChange={onFieldChange} 
      />
    </div>
  );
};

export default TradeFormFields;
