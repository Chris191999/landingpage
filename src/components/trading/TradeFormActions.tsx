
import { Button } from "@/components/ui/button";
import { Trade } from "@/types/trade";

interface TradeFormActionsProps {
  trade?: Trade | null;
  onCancel?: () => void;
}

const TradeFormActions = ({ trade, onCancel }: TradeFormActionsProps) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" className="flex-1">
        {trade ? 'Update Trade' : 'Add Trade'}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};

export default TradeFormActions;
