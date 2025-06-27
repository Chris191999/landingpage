import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import TradeFormFields from "./TradeFormFields";
import TradeFormActions from "./TradeFormActions";
import { getInitialFormData } from "./TradeFormUtils";
import { useFormPersistence } from "@/hooks/useFormPersistence";

interface TradeFormProps {
  trade?: Trade | null;
  onSubmit: (trade: Trade) => void;
  onCancel?: () => void;
  trades?: any[];
}

const TradeForm = ({ trade, onSubmit, onCancel, trades = [] }: TradeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Trade>>(() => {
    if (trade) return trade;
    const initialData = getInitialFormData();
    return { ...initialData, id: crypto.randomUUID() };
  });

  const [hasRestoredData, setHasRestoredData] = useState(false);

  // Use form persistence hook
  const { clearSavedFormData, restoreFormData } = useFormPersistence(
    formData, 
    setFormData, 
    !!trade // isEditing flag
  );

  useEffect(() => {
    if (trade) {
      console.log('Loading existing trade:', trade.id);
      setFormData(trade);
      setHasRestoredData(true);
    } else if (!hasRestoredData) {
      // Try to restore saved data first
      const restored = restoreFormData();
      if (restored) {
        console.log('Restored form data from sessionStorage');
        setHasRestoredData(true);
      } else {
        // No saved data, use initial data
        const initialData = getInitialFormData();
        const newId = crypto.randomUUID();
        console.log('Creating new trade form with ID:', newId);
        setFormData({ ...initialData, id: newId });
        setHasRestoredData(true);
      }
    }
  }, [trade, restoreFormData, hasRestoredData]);

  const handleFieldChange = (field: keyof Trade, value: any) => {
    console.log('Form field changed:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting trade with data:', formData);
    
    // Validate required fields
    if (!formData.symbol?.trim()) {
      toast({
        title: "Validation Error",
        description: "Symbol is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.entry || formData.entry <= 0) {
      toast({
        title: "Validation Error", 
        description: "Entry price is required and must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Create complete trade object with proper undefined handling
    const completeTradeData: Trade = {
      id: formData.id || crypto.randomUUID(),
      symbol: formData.symbol || '',
      account_name: formData.account_name || '',
      direction: formData.direction || 'Long',
      trade_type: formData.trade_type || 'Day Trading',
      date: formData.date || new Date().toISOString().split('T')[0],
      status: formData.status || 'Open',
      test_type: formData.test_type || '',
      order_type: formData.order_type || 'Market',
      entry: formData.entry || 0,
      exit: formData.exit,
      risk: formData.risk || 0,
      position_size: formData.position_size || 1.0,
      planned_vs_actual_pnl: formData.planned_vs_actual_pnl || 0,
      fees: formData.fees || 0,
      market_condition: formData.market_condition || '',
      order_liq: formData.order_liq || '',
      liq_entry_breakeven_risk: formData.liq_entry_breakeven_risk || '',
      pnducm_imbalance: formData.pnducm_imbalance || '',
      entry_liq: formData.entry_liq || '',
      liquidity: formData.liquidity || '',
      notes: formData.notes || '',
      image_files: formData.image_files,
      emotion: formData.emotion,
      confidence_rating: formData.confidence_rating,
      mistake_category: formData.mistake_category,
      rules_followed: formData.rules_followed,
      post_trade_reflection: formData.post_trade_reflection,
      market_condition_detailed: formData.market_condition_detailed,
      time_of_day: formData.time_of_day,
      economic_events: formData.economic_events,
      market_volatility: formData.market_volatility,
      trade_duration_hours: formData.trade_duration_hours,
      max_adverse_excursion: formData.max_adverse_excursion,
      max_favorable_excursion: formData.max_favorable_excursion,
      slippage: formData.slippage,
      commission_breakdown: formData.commission_breakdown,
      setup_type: formData.setup_type,
      strategy_name: formData.strategy_name,
      timeframe: formData.timeframe,
      pnl: formData.pnl,
      roi: formData.roi,
      quantity: formData.quantity,
      winRate: formData.winRate,
      rMultiple: formData.rMultiple,
      stop_loss: formData.stop_loss,
      trailing_stop: formData.trailing_stop,
      session: formData.session,
      account_balance: formData.account_balance,
    };

    console.log('Final trade data:', completeTradeData);
    onSubmit(completeTradeData);
    
    // Clear saved draft data after successful submission
    clearSavedFormData();
    
    // Reset form if creating new trade
    if (!trade) {
      const newId = crypto.randomUUID();
      const initialData = getInitialFormData();
      setFormData({ ...initialData, id: newId });
      console.log('Form reset for new trade with ID:', newId);
    }

    toast({
      title: "Success",
      description: `Trade ${trade ? 'updated' : 'added'} successfully`
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TradeFormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
            trades={trades}
          />
          <TradeFormActions trade={trade} onCancel={onCancel} />
        </form>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
