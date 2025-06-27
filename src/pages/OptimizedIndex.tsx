
import { useAuth } from "@/hooks/useAuth";
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Trade } from "@/types/trade";
import { useTrades } from "@/hooks/trading/useTrades";
import UserMenu from "@/components/layout/UserMenu";
import { LandingPage } from "@/components/layout/LandingPage";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load the heavy dashboard component
const TradingDashboard = lazy(() => import("@/components/trading/TradingDashboard"));

const OptimizedIndex = () => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5dd01] mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading your trading dashboard...</p>
        </div>
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
        
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
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
        </Suspense>
      </main>
    </div>
  );
};

export default OptimizedIndex;
