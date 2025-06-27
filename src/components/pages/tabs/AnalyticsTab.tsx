
import { useState, useMemo, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import PerformanceMetrics from "@/components/trading/PerformanceMetrics";
import TradeFilters, { TradeFilters as TradeFiltersType } from "@/components/trading/TradeFilters";
import { Trade } from "@/types/trade";
import { getCurrentCurrency } from "@/utils/currencyUtils";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import PlanUpgradePrompt from "@/components/common/PlanUpgradePrompt";

interface AnalyticsTabProps {
  trades: Trade[];
}

const AnalyticsTab = ({ trades }: AnalyticsTabProps) => {
  const [filters, setFilters] = useState<TradeFiltersType>({});
  const [accountBalance, setAccountBalance] = useState(10000);
  const [currency, setCurrency] = useState(getCurrentCurrency());
  const { data: planFeatures } = usePlanFeatures();

  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail?.currency || getCurrentCurrency());
    window.addEventListener("currencyChange", handler);
    return () => window.removeEventListener("currencyChange", handler);
  }, []);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (filters.symbol && !trade.symbol?.toLowerCase().includes(filters.symbol.toLowerCase())) return false;
      if (filters.accountName && (!trade.account_name || !trade.account_name.toLowerCase().includes(filters.accountName.toLowerCase()))) return false;
      if (filters.direction && trade.direction !== filters.direction) return false;
      if (filters.status && trade.status !== filters.status) return false;
      if (filters.dateFrom && trade.date < filters.dateFrom) return false;
      if (filters.dateTo && trade.date > filters.dateTo) return false;
      if (filters.minPnL !== undefined && (trade.pnl || 0) < filters.minPnL) return false;
      if (filters.maxPnL !== undefined && (trade.pnl || 0) > filters.maxPnL) return false;
      if (filters.tradeType && trade.trade_type !== filters.tradeType) return false;
      if (filters.emotion && trade.emotion !== filters.emotion) return false;
      if (filters.confidenceRating && trade.confidence_rating?.toString() !== filters.confidenceRating) return false;
      if (filters.mistakeCategory && trade.mistake_category !== filters.mistakeCategory) return false;
      if (filters.rulesFollowed && trade.rules_followed !== filters.rulesFollowed) return false;
      if (filters.economicEvents && (!trade.economic_events || !trade.economic_events.toLowerCase().includes(filters.economicEvents.toLowerCase()))) return false;
      if (filters.marketCondition && (!trade.market_condition || !trade.market_condition.toLowerCase().includes(filters.marketCondition.toLowerCase()))) return false;
      if (filters.strategyName && (!trade.strategy_name || !trade.strategy_name.toLowerCase().includes(filters.strategyName.toLowerCase()))) return false;
      if (filters.setupType && (!trade.setup_type || !trade.setup_type.toLowerCase().includes(filters.setupType.toLowerCase()))) return false;
      
      // Duration filters (convert hours to minutes for comparison)
      const durationInMinutes = trade.trade_duration_hours ? trade.trade_duration_hours * 60 : 0;
      if (filters.minTradeDuration !== undefined && durationInMinutes < filters.minTradeDuration) return false;
      if (filters.maxTradeDuration !== undefined && durationInMinutes > filters.maxTradeDuration) return false;
      
      return true;
    });
  }, [trades, filters]);

  if (!planFeatures?.analytics_access) {
    return (
      <TabsContent value="analytics" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Comprehensive analysis of your trading performance with advanced filtering capabilities.
          </p>
        </div>
        
        {/* Upgrade prompt positioned right below header */}
        <div className="mb-6">
          <PlanUpgradePrompt 
            feature="Analytics Dashboard"
            requiredPlan="Cooked"
            currentPlan={planFeatures?.plan_name}
            className="relative"
          />
        </div>
        
        {/* Blurred content with stronger blur */}
        <div className="filter blur-lg pointer-events-none">
          <TradeFilters
            trades={trades}
            onFiltersChange={setFilters}
            totalTrades={trades.length}
            filteredTrades={filteredTrades.length}
          />
          
          <PerformanceMetrics trades={filteredTrades} detailed={true} />
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="analytics" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive analysis of your trading performance with advanced filtering capabilities.
        </p>
      </div>
      
      <TradeFilters
        trades={trades}
        onFiltersChange={setFilters}
        totalTrades={trades.length}
        filteredTrades={filteredTrades.length}
      />
      
      <PerformanceMetrics trades={filteredTrades} detailed={true} />
    </TabsContent>
  );
};

export default AnalyticsTab;
