
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface AdvancedTradeDataProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const AdvancedTradeData = ({ formData, onFieldChange }: AdvancedTradeDataProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Advanced Trade Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="max_adverse_excursion">Max Adverse Excursion (MAE)</Label>
          <Input
            id="max_adverse_excursion"
            type="number"
            step="0.01"
            value={formData.max_adverse_excursion || ''}
            onChange={(e) => onFieldChange('max_adverse_excursion', parseFloat(e.target.value))}
            placeholder="Worst unrealized loss"
          />
        </div>

        <div>
          <Label htmlFor="max_favorable_excursion">Max Favorable Excursion (MFE)</Label>
          <Input
            id="max_favorable_excursion"
            type="number"
            step="0.01"
            value={formData.max_favorable_excursion || ''}
            onChange={(e) => onFieldChange('max_favorable_excursion', parseFloat(e.target.value))}
            placeholder="Best unrealized profit"
          />
        </div>

        <div>
          <Label htmlFor="trade_duration_hours">Trade Duration (Minutes)</Label>
          <Input
            id="trade_duration_hours"
            type="number"
            step="1"
            value={formData.trade_duration_hours ? Math.round(formData.trade_duration_hours * 60) : ''}
            onChange={(e) => onFieldChange('trade_duration_hours', parseFloat(e.target.value) / 60)}
            placeholder="How long was the trade open (minutes)"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedTradeData;
