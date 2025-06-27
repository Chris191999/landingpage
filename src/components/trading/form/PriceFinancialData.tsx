
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface PriceFinancialDataProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const PriceFinancialData = ({ formData, onFieldChange }: PriceFinancialDataProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Price & Financial Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="entry">Entry Price *</Label>
          <Input
            id="entry"
            type="number"
            step="0.01"
            value={formData.entry || ''}
            onChange={(e) => onFieldChange('entry', parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="exit">Exit Price</Label>
          <Input
            id="exit"
            type="number"
            step="0.01"
            value={formData.exit || ''}
            onChange={(e) => onFieldChange('exit', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="risk">Risk Amount</Label>
          <Input
            id="risk"
            type="number"
            step="0.01"
            value={formData.risk || ''}
            onChange={(e) => onFieldChange('risk', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="position_size">Position Size</Label>
          <Input
            id="position_size"
            type="number"
            step="0.01"
            value={formData.position_size || ''}
            onChange={(e) => onFieldChange('position_size', parseFloat(e.target.value))}
            placeholder="Enter position size"
          />
        </div>

        <div>
          <Label htmlFor="pnl">Profit/Loss Amount</Label>
          <Input
            id="pnl"
            type="number"
            step="0.01"
            value={formData.pnl || ''}
            onChange={(e) => onFieldChange('pnl', parseFloat(e.target.value) || 0)}
            placeholder="Enter profit (+) or loss (-)"
            className={
              (formData.pnl || 0) > 0 
                ? 'text-green-600' 
                : (formData.pnl || 0) < 0 
                ? 'text-red-600' 
                : ''
            }
          />
        </div>

        <div>
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            type="number"
            step="0.01"
            value={formData.fees || ''}
            onChange={(e) => onFieldChange('fees', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="slippage">Slippage</Label>
          <Input
            id="slippage"
            type="number"
            step="0.01"
            value={formData.slippage || ''}
            onChange={(e) => onFieldChange('slippage', parseFloat(e.target.value))}
            placeholder="Price difference from intended"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFinancialData;
