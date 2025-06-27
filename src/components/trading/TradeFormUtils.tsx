
import { Trade } from "@/types/trade";

export const getInitialFormData = (): Partial<Trade> => {
  return {
    symbol: '',
    direction: 'Long',
    trade_type: 'Day Trading',
    date: new Date().toISOString().split('T')[0],
    status: 'Open',
    order_type: 'Market',
    entry: 0,
    risk: 0,
    position_size: 1.0,
    fees: 0,
    planned_vs_actual_pnl: 0,
    market_condition: '',
    order_liq: '',
    liq_entry_breakeven_risk: '',
    pnducm_imbalance: '',
    entry_liq: '',
    liquidity: '',
    notes: '',
    test_type: '',
    emotion: 'confident',
    mistake_category: 'none',
    rules_followed: 'yes'
  };
};
