
import { useAuth } from "@/hooks/useAuth";
import TradingDashboard from "@/components/trading/TradingDashboard";
import { useState, useCallback, useMemo } from "react";
import { Trade } from "@/types/trade";
import { useTrades } from "@/hooks/trading/useTrades";
import UserMenu from "@/components/layout/UserMenu";
import { LandingPage } from "@/components/layout/LandingPage";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const {
    trades,
    isLoadingTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    deleteAllTrades,
    importTrades,
  } = useTrades();

  // Memoize trades array to prevent unnecessary re-renders
  const memoizedTrades = useMemo(() => trades || [], [trades]);

  const handleAddTrade = useCallback((trade: Trade) => {
    addTrade(trade, {
      onSuccess: () => {
        setSelectedTrade(null);
      },
    });
  }, [addTrade]);

  const handleUpdateTrade = useCallback((trade: Trade) => {
    updateTrade(trade, {
      onSuccess: () => {
        setSelectedTrade(null);
      },
    });
  }, [updateTrade]);

  const handleEditTrade = useCallback((trade: Trade | null) => {
    setSelectedTrade(trade);
  }, []);

  if (loading || (user && isLoadingTrades)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5dd01] mb-4"></div>
        <div className="text-lg font-medium text-[#f5dd01] mb-2">TRADEMIND</div>
        <div className="text-sm text-muted-foreground">Loading your trading dashboard...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 relative">
        <UserMenu />
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            <span style={{ color: '#f5dd01' }}>TRADEMIND</span>
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user.email}.
          </p>
        </div>
        <TradingDashboard
          trades={memoizedTrades}
          selectedTrade={selectedTrade}
          onAddTrade={handleAddTrade}
          onUpdateTrade={handleUpdateTrade}
          onDeleteTrade={deleteTrade}
          onImportTrades={importTrades}
          onDeleteAllTrades={deleteAllTrades}
          onEditTrade={handleEditTrade}
        />
      </main>
    </div>
  );
};

export default Index;
