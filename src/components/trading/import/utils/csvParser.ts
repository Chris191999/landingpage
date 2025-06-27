import { Trade } from "@/types/trade";
import { sanitizeCsvCell, sanitizeText } from "@/utils/security";
import { validateCsvImport } from "@/utils/validation";

export const parseCsvData = (csvText: string): Trade[] => {
  // Validate CSV before processing
  const validation = validateCsvImport(csvText);
  if (!validation.isValid) {
    throw new Error(`CSV validation failed: ${validation.errors.join(', ')}`);
  }

  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => sanitizeText(h.trim().replace(/"/g, '')));
  
  console.log('CSV Headers:', headers);
  
  const trades: Trade[] = [];
  
  for (let i = 1; i < Math.min(lines.length, 10001); i++) {
    try {
      const values = lines[i].split(',').map(v => sanitizeCsvCell(v.trim().replace(/"/g, '')));
      const trade: Partial<Trade> = {};
      
      headers.forEach((header, index) => {
        const value = values[index] ? sanitizeText(values[index]) : '';
        
        switch (header.toLowerCase()) {
          case 'symbol':
            if (value && /^[A-Z0-9]{1,10}$/.test(value.toUpperCase())) {
              trade.symbol = value.toUpperCase();
            }
            break;
          case 'direction':
            if (value === 'Long' || value === 'Short') {
              trade.direction = value as 'Long' | 'Short';
            }
            break;
          case 'date':
            if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
              trade.date = value;
            }
            break;
          case 'status':
            if (['Completed', 'Open', 'Cancelled'].includes(value)) {
              trade.status = value as 'Completed' | 'Open' | 'Cancelled';
            }
            break;
          case 'test_type':
            trade.test_type = value;
            break;
          case 'order_type':
            trade.order_type = value as 'Forward' | 'Market' | 'Limit' | 'Stop';
            break;
          case 'entry':
            const entryNum = parseFloat(value);
            if (!isNaN(entryNum) && entryNum > 0 && entryNum < 1000000) {
              trade.entry = entryNum;
            }
            break;
          case 'exit':
            const exitNum = parseFloat(value);
            if (!isNaN(exitNum) && exitNum >= 0 && exitNum < 1000000) {
              trade.exit = exitNum;
            }
            break;
          case 'risk':
            const riskNum = parseFloat(value);
            if (!isNaN(riskNum) && riskNum >= 0 && riskNum < 1000000) {
              trade.risk = riskNum;
            }
            break;
          case 'planned_vs_actual_pnl':
            trade.planned_vs_actual_pnl = parseFloat(value) || 0;
            break;
          case 'fees':
            const feesNum = parseFloat(value);
            if (!isNaN(feesNum) && feesNum >= 0 && feesNum < 10000) {
              trade.fees = feesNum;
            }
            break;
          case 'market_condition':
            trade.market_condition = value;
            break;
          case 'order_liq':
            trade.order_liq = value;
            break;
          case 'liq_entry_breakeven_risk':
            trade.liq_entry_breakeven_risk = value;
            break;
          case 'pnducm_imbalance':
            trade.pnducm_imbalance = value;
            break;
          case 'entry_liq':
            trade.entry_liq = value;
            break;
          case 'liquidity':
            trade.liquidity = value;
            break;
          case 'notes':
            if (value && value.length <= 5000) {
              trade.notes = sanitizeText(value);
            }
            break;
          case 'id':
            trade.id = value;
            break;
          case 'image_files':
            trade.image_files = value ? value.split(';').map(f => sanitizeText(f)).slice(0, 20) : [];
            break;
          case 'pnl':
            const pnlNum = parseFloat(value);
            if (!isNaN(pnlNum) && pnlNum > -1000000 && pnlNum < 1000000) {
              trade.pnl = pnlNum;
            }
            break;
          case 'emotion':
            trade.emotion = value as any;
            break;
          case 'confidence_rating':
            trade.confidence_rating = parseInt(value) || undefined;
            break;
          case 'mistake_category':
            trade.mistake_category = value as any;
            break;
          case 'rules_followed':
            if (value === 'yes' || value === 'no' || value === 'partial') {
              trade.rules_followed = value;
            } else if (value === 'true') {
              trade.rules_followed = 'yes';
            } else if (value === 'false') {
              trade.rules_followed = 'no';
            } else {
              trade.rules_followed = undefined;
            }
            break;
          case 'post_trade_reflection':
            trade.post_trade_reflection = value;
            break;
          case 'market_condition_detailed':
            trade.market_condition_detailed = value as any;
            break;
          case 'time_of_day':
            trade.time_of_day = value;
            break;
          case 'economic_events':
            trade.economic_events = value;
            break;
          case 'market_volatility':
            trade.market_volatility = value as any;
            break;
          case 'trade_duration_hours':
            trade.trade_duration_hours = parseFloat(value) || undefined;
            break;
          case 'max_adverse_excursion':
            trade.max_adverse_excursion = parseFloat(value) || undefined;
            break;
          case 'max_favorable_excursion':
            trade.max_favorable_excursion = parseFloat(value) || undefined;
            break;
          case 'slippage':
            trade.slippage = parseFloat(value) || undefined;
            break;
          case 'commission_breakdown':
            trade.commission_breakdown = value;
            break;
          case 'setup_type':
            trade.setup_type = value;
            break;
          case 'strategy_name':
            trade.strategy_name = value;
            break;
          case 'timeframe':
            trade.timeframe = value as any;
            break;
          default:
            if (value && value.length < 1000) {
              (trade as any)[header] = sanitizeText(value);
            }
            break;
        }
      });
      
      if (!trade.id) {
        trade.id = `imported_${Date.now()}_${i}`;
      }
      
      if (trade.entry && trade.exit && trade.direction && !trade.pnl) {
        trade.pnl = trade.direction === 'Long' 
          ? trade.exit - trade.entry 
          : trade.entry - trade.exit;
      }
      
      if (trade.symbol && trade.entry) {
        trades.push(trade as Trade);
      }
      
    } catch (error) {
      console.error(`Error parsing line ${i + 1}:`, error);
    }
  }
  
  return trades;
};
