import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface PsychologicalAnalysisProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const PsychologicalAnalysis = ({ formData, onFieldChange }: PsychologicalAnalysisProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Psychological & Behavioral Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="emotion">Emotion During Trade</Label>
          <select
            id="emotion"
            value={formData.emotion || 'confident'}
            onChange={(e) => onFieldChange('emotion', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="confident">Confident</option>
            <option value="fearful">Fearful</option>
            <option value="fomo">FOMO</option>
            <option value="greedy">Greedy</option>
            <option value="disciplined">Disciplined</option>
            <option value="uncertain">Uncertain</option>
            <option value="undisciplined">Undisciplined</option>
            <option value="tilt">Tilt</option>
          </select>
        </div>

        <div>
          <Label htmlFor="confidence_rating">Confidence Rating (1-10)</Label>
          <Input
            id="confidence_rating"
            type="number"
            min="1"
            max="10"
            value={formData.confidence_rating || ''}
            onChange={(e) => onFieldChange('confidence_rating', parseInt(e.target.value))}
            placeholder="Rate your confidence 1-10"
          />
        </div>

        <div>
          <Label htmlFor="mistake_category">Mistake Category</Label>
          <select
            id="mistake_category"
            value={formData.mistake_category || 'none'}
            onChange={(e) => onFieldChange('mistake_category', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="none">No Mistake</option>
            <option value="early_exit">Early Exit</option>
            <option value="late_entry">Late Entry</option>
            <option value="late_exit">Late Exit</option>
            <option value="early_entry">Early Entry</option>
            <option value="oversized">Position Too Large</option>
            <option value="position_too_small">Position Too Small</option>
            <option value="revenge_trade">Revenge Trade</option>
            <option value="fomo">FOMO Entry</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <Label htmlFor="rules_followed">Trading Rules Followed</Label>
          <select
            id="rules_followed"
            value={formData.rules_followed || 'yes'}
            onChange={e => {
              let value = e.target.value;
              if (value !== 'yes' && value !== 'no' && value !== 'partial') value = 'yes';
              onFieldChange('rules_followed', value);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="partial">Partially</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalAnalysis;
