export interface Trade {
  id: string;
  symbol: string;
  account_name?: string; // New field
  direction: 'Long' | 'Short';
  trade_type?: 'Day Trading' | 'Swing Trading' | 'Position Trading' | 'Scalping' | 'Investing';
  date: string;
  status: 'Completed' | 'Open' | 'Cancelled';
  test_type: string;
  order_type: 'Forward' | 'Market' | 'Limit' | 'Stop';
  entry: number;
  exit?: number;
  risk: number;
  position_size?: number;
  planned_vs_actual_pnl: number;
  fees: number;
  market_condition: string;
  order_liq: string;
  liq_entry_breakeven_risk: string;
  pnducm_imbalance: string;
  entry_liq: string;
  liquidity: string;
  notes: string;
  image_files?: string[];
  
  // Psychological & Behavioral - Updated emotion options
  emotion?: 'confident' | 'fearful' | 'fomo' | 'greedy' | 'disciplined' | 'uncertain' | 'undisciplined' | 'tilt';
  confidence_rating?: number; // 1-10 scale
  mistake_category?: 'early_exit' | 'late_entry' | 'oversized' | 'revenge_trade' | 'fomo' | 'none' | 'late_exit' | 'early_entry' | 'position_too_small';
  rules_followed?: 'yes' | 'no' | 'partial';
  post_trade_reflection?: string;

  // Market Context
  market_condition_detailed?: 'trending_up' | 'trending_down' | 'ranging' | 'volatile' | 'low_volume';
  time_of_day?: string; // HH:MM format
  economic_events?: string;
  market_volatility?: 'low' | 'medium' | 'high';

  // Enhanced Trade Data
  trade_duration_hours?: number;
  max_adverse_excursion?: number; // MAE - worst unrealized loss
  max_favorable_excursion?: number; // MFE - best unrealized profit
  slippage?: number; // Difference from intended price
  commission_breakdown?: string; // JSON string for complex commission data

  // Setup & Strategy
  setup_type?: string; // breakout, pullback, reversal, etc.
  strategy_name?: string;
  timeframe?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  
  // Calculated fields
  pnl?: number;
  roi?: number;
  quantity?: number;
  winRate?: number;
  rMultiple?: number; // R-multiple for this trade

  session?: string;

  stop_loss?: number;
  trailing_stop?: number;
  account_balance?: number;
}

export interface PerformanceStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  winRate: number;
  totalPnL: number;
  totalFees: number;
  netPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  averageRoi: number;
  sharpeRatio: number;
  
  // R-multiple metrics
  totalR: number;
  avgWinR: number;
  avgLossR: number;
  riskRewardRatio: number;
  expectancy: number;
  
  // Drawdown metrics
  maxDrawdown: number;
  maxDrawdownAmount: number;
  
  // Streak metrics
  longestWinStreak: number;
  longestLossStreak: number;
  
  // System quality metrics
  systemQualityNumber: number;
  
  // New Advanced Metrics - Adding the missing properties
  calmarRatio: number;
  sortinoRatio: number;
  riskOfRuin: number;
  kellyPercentage: number;
  valueAtRisk95: number;
  valueAtRisk99: number;
  averageMAE: number;
  averageMFE: number;
  avgTradeDuration: number;
}

export interface GoalSettings {
  monthly_profit_target: number;
  quarterly_profit_target: number;
  max_daily_loss_limit: number;
  max_monthly_loss_limit: number;
  target_win_rate: number;
  target_profit_factor: number;
  account_size: number;
  max_risk_per_trade: number;
  max_portfolio_risk: number;
  kelly_fraction: number;
}

export interface TimeAnalysis {
  hourlyPerformance: Array<{hour: number, pnl: number, trades: number}>;
  dailyPerformance: Array<{day: string, pnl: number, trades: number}>;
  monthlyPerformance: Array<{month: string, pnl: number, trades: number}>;
}

export interface PsychologicalAnalysis {
  emotionBreakdown: Array<{emotion: string, trades: number, avgPnl: number}>;
  confidenceCorrelation: Array<{rating: number, avgPnl: number, trades: number}>;
  mistakeAnalysis: Array<{mistake: string, frequency: number, totalLoss: number}>;
}
