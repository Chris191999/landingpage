
import { useMemo, useCallback } from "react";
import { Trade } from "@/types/trade";
import AdvancedMetricsFilters from "./AdvancedMetricsFilters";

export interface AdvancedFilters {
  dateFrom: string;
  dateTo: string;
  selectedSymbol: string;
  strategy: string;
  emotion: string;
  confidenceMin: number;
  confidenceMax: number;
  minTradeDuration: number;
  maxTradeDuration: number;
  minPnL: number;
  maxPnL: number;
}

interface MetricsFilterPanelProps {
  trades: Trade[];
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
}

const MetricsFilterPanel = ({ trades, filters, onFiltersChange, onClearFilters }: MetricsFilterPanelProps) => {
  const uniqueSymbols = useMemo(() => 
    [...new Set(trades.map(trade => trade.symbol).filter(Boolean))], 
    [trades]
  );

  const uniqueStrategies = useMemo(() => 
    [...new Set(trades.map(trade => trade.strategy_name).filter(Boolean))], 
    [trades]
  );

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (filters.dateFrom && trade.date < filters.dateFrom) return false;
      if (filters.dateTo && trade.date > filters.dateTo) return false;
      if (filters.selectedSymbol && filters.selectedSymbol !== "all" && trade.symbol !== filters.selectedSymbol) return false;
      if (filters.strategy && trade.strategy_name !== filters.strategy) return false;
      if (filters.emotion && trade.emotion !== filters.emotion) return false;
      if (filters.confidenceMin && (trade.confidence_rating || 0) < filters.confidenceMin) return false;
      if (filters.confidenceMax && (trade.confidence_rating || 0) > filters.confidenceMax) return false;
      if (filters.minPnL !== undefined && (trade.pnl || 0) < filters.minPnL) return false;
      if (filters.maxPnL !== undefined && (trade.pnl || 0) > filters.maxPnL) return false;
      
      // Duration filters (convert hours to minutes for comparison)
      const durationInMinutes = trade.trade_duration_hours ? trade.trade_duration_hours * 60 : 0;
      if (filters.minTradeDuration !== undefined && durationInMinutes < filters.minTradeDuration) return false;
      if (filters.maxTradeDuration !== undefined && durationInMinutes > filters.maxTradeDuration) return false;
      
      return true;
    });
  }, [trades, filters]);

  return {
    filteredTrades,
    uniqueSymbols,
    FilterComponent: () => (
      <AdvancedMetricsFilters 
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        symbols={uniqueSymbols}
        strategies={uniqueStrategies}
      />
    )
  };
};

export default MetricsFilterPanel;
