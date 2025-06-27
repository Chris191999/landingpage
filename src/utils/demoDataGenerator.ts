
import { Trade } from "@/types/trade";

export const generateSimulatedTrades = (): Trade[] => {
  const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'NFLX', 'UBER'];
  const emotions = ['confident', 'fearful', 'fomo', 'greedy', 'disciplined', 'uncertain'];
  const mistakes = ['early_exit', 'late_entry', 'oversized', 'revenge_trade', 'fomo', 'none'];
  const marketConditions = ['trending_up', 'trending_down', 'ranging', 'volatile', 'low_volume'];
  const setups = ['breakout', 'pullback', 'reversal', 'momentum', 'mean_reversion'];
  const strategies = ['scalping', 'swing_trade', 'day_trade', 'position'];
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  const simulatedTrades: Trade[] = [];

  for (let i = 0; i < 30; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const direction = Math.random() > 0.5 ? 'Long' : 'Short';
    const entry = 50 + Math.random() * 200; // Random entry between $50-$250
    const risk = 20 + Math.random() * 80; // Random risk between $20-$100
    
    // Generate realistic P&L based on some probability
    const isWin = Math.random() > 0.4; // 60% win rate
    let pnl: number;
    
    if (isWin) {
      pnl = Math.random() * risk * 3; // Wins can be up to 3R
    } else {
      pnl = -(Math.random() * risk); // Losses limited to risk amount
    }
    
    const exit = direction === 'Long' ? entry + pnl : entry - pnl;
    
    // Generate date between 3 months ago and now
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    const trade: Trade = {
      id: `sim_${i + 1}`,
      symbol,
      direction,
      date: randomDate.toISOString().split('T')[0],
      status: 'Completed',
      test_type: 'Live',
      order_type: Math.random() > 0.5 ? 'Market' : 'Limit',
      entry,
      exit,
      risk,
      pnl,
      planned_vs_actual_pnl: pnl,
      fees: 2 + Math.random() * 5, // Random fees between $2-$7
      market_condition: 'Normal',
      order_liq: 'High',
      liq_entry_breakeven_risk: 'Low',
      pnducm_imbalance: 'Balanced',
      entry_liq: 'Good',
      liquidity: 'High',
      notes: `Simulated trade #${i + 1} for ${symbol}`,
      
      // Enhanced fields
      emotion: emotions[Math.floor(Math.random() * emotions.length)] as any,
      confidence_rating: Math.floor(Math.random() * 10) + 1,
      mistake_category: mistakes[Math.floor(Math.random() * mistakes.length)] as any,
      rules_followed: Math.random() > 0.3 ? 'yes' : 'no', // 70% rules followed
      post_trade_reflection: `This was a ${isWin ? 'successful' : 'challenging'} trade on ${symbol}`,
      
      market_condition_detailed: marketConditions[Math.floor(Math.random() * marketConditions.length)] as any,
      time_of_day: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      economic_events: Math.random() > 0.7 ? 'FOMC Meeting' : 'None',
      market_volatility: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      
      trade_duration_hours: Math.random() * 48, // Up to 48 hours
      max_adverse_excursion: Math.random() * risk * 0.8, // MAE up to 80% of risk
      max_favorable_excursion: Math.abs(pnl) + Math.random() * 50, // MFE beyond P&L
      slippage: Math.random() * 0.5, // Up to $0.50 slippage
      commission_breakdown: `{"entry": ${(1 + Math.random()).toFixed(2)}, "exit": ${(1 + Math.random()).toFixed(2)}}`,
      
      setup_type: setups[Math.floor(Math.random() * setups.length)],
      strategy_name: strategies[Math.floor(Math.random() * strategies.length)],
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)] as any,
      
      roi: (pnl / entry) * 100,
      quantity: Math.floor(10 + Math.random() * 90), // 10-100 shares
      rMultiple: pnl / risk
    };
    
    simulatedTrades.push(trade);
  }
  
  return simulatedTrades;
};
