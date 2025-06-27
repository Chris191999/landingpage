
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trade } from "@/types/trade";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import TradeBasicInfo from "./TradeBasicInfo";
import TradeDetailContent from "./TradeDetailContent";

interface TradeDetailModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  dayTrades?: Trade[];
  currentTradeIndex?: number;
  onTradeNavigation?: (direction: 'prev' | 'next') => void;
}

const TradeDetailModal = ({ 
  trade, 
  isOpen, 
  onClose, 
  dayTrades = [], 
  currentTradeIndex = 0, 
  onTradeNavigation 
}: TradeDetailModalProps) => {
  if (!trade) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Trade Selected</DialogTitle>
          </DialogHeader>
          <p>Please select a trade to view details.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const hasMultipleTrades = dayTrades.length > 1;
  const canNavigatePrev = currentTradeIndex > 0;
  const canNavigateNext = currentTradeIndex < dayTrades.length - 1;

  const hasRightContent = Boolean(
    trade.notes || trade.post_trade_reflection || (trade.image_files && trade.image_files.length > 0)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden bg-gray-900 text-white border-gray-700 flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4 pt-4 px-6 flex-shrink-0">
          <DialogTitle className="flex items-center justify-between text-white text-xl">
            <div className="flex items-center gap-4">
              <span>Trade Details</span>
              {hasMultipleTrades && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTradeNavigation?.('prev')}
                    disabled={!canNavigatePrev}
                    className="text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-gray-300">
                    Trade {currentTradeIndex + 1} of {dayTrades.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTradeNavigation?.('next')}
                    disabled={!canNavigateNext}
                    className="text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
              <X size={20} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow flex gap-4 p-4 items-start">
          <div className="w-[400px] flex-shrink-0 max-h-[80vh] overflow-y-auto">
            <TradeBasicInfo trade={trade} />
          </div>
          {hasRightContent && (
            <div className="flex-1 min-w-0 max-h-[80vh] overflow-y-auto">
              <TradeDetailContent trade={trade} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDetailModal;
