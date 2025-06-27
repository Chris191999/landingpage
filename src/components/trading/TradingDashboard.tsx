
import { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Trade } from "@/types/trade";
import TradingJournalTabs from "@/components/pages/TradingJournalTabs";
import OverviewTab from "@/components/pages/tabs/OverviewTab";
import TradesTab from "@/components/pages/tabs/TradesTab";
import AddTradeTab from "@/components/pages/tabs/AddTradeTab";
import ImportTab from "@/components/pages/tabs/ImportTab";
import AnalyticsTab from "@/components/pages/tabs/AnalyticsTab";
import AdvancedTab from "@/components/pages/tabs/AdvancedTab";

interface TradingDashboardProps {
  trades: Trade[];
  selectedTrade: Trade | null;
  onAddTrade: (trade: Trade) => void;
  onUpdateTrade: (updatedTrade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onImportTrades: (importedTrades: Trade[]) => void;
  onDeleteAllTrades: () => void;
  onEditTrade: (trade: Trade | null) => void;
}

const ACTIVE_TAB_STORAGE_KEY = 'trading_dashboard_active_tab';
const DEFAULT_TAB = "overview";

const TradingDashboard = ({
  trades,
  selectedTrade,
  onAddTrade,
  onUpdateTrade,
  onDeleteTrade,
  onImportTrades,
  onDeleteAllTrades,
  onEditTrade,
}: TradingDashboardProps) => {
  // Initialize activeTab from sessionStorage or default
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || DEFAULT_TAB;
    } catch {
      return DEFAULT_TAB;
    }
  });

  // Memoize trades for performance with shallow comparison
  const memoizedTrades = useMemo(() => trades, [trades]);

  // Save active tab to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
    } catch (error) {
      console.error('Failed to save active tab:', error);
    }
  }, [activeTab]);

  // Auto-switch to add-trade tab when editing
  useEffect(() => {
    if (selectedTrade) {
      setActiveTab("add-trade");
    }
  }, [selectedTrade]);

  const handleSubmit = useCallback((trade: Trade) => {
    if (selectedTrade) {
      onUpdateTrade(trade);
    } else {
      onAddTrade(trade);
    }
    setActiveTab("trades");
  }, [selectedTrade, onUpdateTrade, onAddTrade]);

  const handleCancel = useCallback(() => {
    onEditTrade(null);
    setActiveTab("trades");
  }, [onEditTrade]);

  const handleEdit = useCallback((trade: Trade | null) => {
    onEditTrade(trade);
  }, [onEditTrade]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TradingJournalTabs />

      <OverviewTab 
        trades={memoizedTrades}
        onEdit={handleEdit}
        onDelete={onDeleteTrade}
      />

      <TradesTab 
        trades={memoizedTrades}
        onEdit={handleEdit}
        onDelete={onDeleteTrade}
      />

      <AddTradeTab 
        selectedTrade={selectedTrade}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        trades={memoizedTrades}
      />

      <ImportTab 
        trades={memoizedTrades}
        onImport={onImportTrades}
        onDeleteAll={onDeleteAllTrades}
      />

      <AnalyticsTab trades={memoizedTrades} />

      <AdvancedTab trades={memoizedTrades} />
    </Tabs>
  );
};

export default TradingDashboard;
