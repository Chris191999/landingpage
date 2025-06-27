
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trade } from "@/types/trade";
import { TrendingUp, TrendingDown, Images, Eye } from "lucide-react";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface TradeListRowProps {
  trade: Trade;
  compact: boolean;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onView: (trade: Trade) => void;
}

const TradeListRow = memo(({ trade, compact, onEdit, onDelete, onView }: TradeListRowProps) => {
  const { streamerMode } = useStreamerMode();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-600';
    if (pnl < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getFirstTradeImage = (trade: Trade) => {
    if (!trade.image_files || trade.image_files.length === 0) return null;
    return trade.image_files[0];
  };

  const firstImage = getFirstTradeImage(trade);
  const hasImages = trade.image_files && trade.image_files.length > 0;

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {firstImage ? (
            <button
              onClick={() => onView(trade)}
              className="relative w-10 h-10 rounded border overflow-hidden hover:ring-2 hover:ring-primary"
            >
              <img
                src={firstImage}
                alt="Trade thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/public/placeholder.svg'; }}
              />
              {hasImages && trade.image_files!.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {trade.image_files!.length}
                </div>
              )}
            </button>
          ) : hasImages ? (
            <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
              <Images size={16} className="text-muted-foreground" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
              <div className="w-2 h-2 bg-muted-foreground/30 rounded"></div>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{formatDate(trade.date)}</TableCell>
      <TableCell className="font-medium">{trade.symbol}</TableCell>
      <TableCell>
        <Badge variant={trade.direction === 'Long' ? 'default' : 'secondary'}>
          {trade.direction === 'Long' ? (
            <TrendingUp size={12} className="mr-1" />
          ) : (
            <TrendingDown size={12} className="mr-1" />
          )}
          {trade.direction}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge 
          variant={
            trade.status === 'Completed' ? 'default' :
            trade.status === 'Open' ? 'secondary' : 'outline'
          }
        >
          {trade.status}
        </Badge>
      </TableCell>
      <TableCell>{formatCurrencyStreamer(trade.entry, streamerMode, 'entry')}</TableCell>
      <TableCell>
        {trade.exit ? formatCurrencyStreamer(trade.exit, streamerMode, 'exit') : '-'}
      </TableCell>
      <TableCell className={getPnLColor(trade.pnl || 0)}>
        {trade.pnl ? formatCurrencyStreamer(trade.pnl, streamerMode, 'pnl') : '-'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(trade)}
          >
            <Eye size={12} className="mr-1" />
            View
          </Button>
          {!compact && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(trade)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(trade.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});

TradeListRow.displayName = 'TradeListRow';

export default TradeListRow;
