import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trade } from "@/types/trade";
import { TrendingUp, TrendingDown, Images, Eye } from "lucide-react";
import TradeDetailModal from "./TradeDetailModal";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';
import { formatCurrencyStreamer } from '@/utils/formatters';

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const TradeList = ({ trades, onEdit, onDelete, compact = false }: TradeListProps) => {
  const [sortField, setSortField] = useState<keyof Trade>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { streamerMode } = useStreamerMode();

  const sortedTrades = [...trades].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

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

  const handleViewTrade = (trade: Trade) => {
    console.log('Viewing trade:', trade);
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  // Subcomponent for rendering a single trade row
  function TradeTableRow({
    trade,
    compact,
    onEdit,
    onDelete,
    onView,
    getFirstTradeImage,
    formatDate,
    formatCurrency,
    getPnLColor
  }: {
    trade: Trade;
    compact: boolean;
    onEdit: (trade: Trade) => void;
    onDelete: (id: string) => void;
    onView: (trade: Trade) => void;
    getFirstTradeImage: (trade: Trade) => string | null;
    formatDate: (date: string) => string;
    formatCurrency: (value: number) => string;
    getPnLColor: (pnl: number) => string;
  }) {
                  const firstImage = getFirstTradeImage(trade);
                  const hasImages = trade.image_files && trade.image_files.length > 0;
                  
                  return (
                    <TableRow key={trade.id}>
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
  }

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No trades found. Add your first trade to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {compact ? `Recent Trades (${trades.length})` : `All Trades (${trades.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('symbol')}
                  >
                    Symbol {sortField === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('entry')}
                  >
                    Entry {sortField === 'entry' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('pnl')}
                  >
                    P&L {sortField === 'pnl' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTrades.map((trade) => (
                  <TradeTableRow
                    key={trade.id}
                    trade={trade}
                    compact={compact}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={handleViewTrade}
                    getFirstTradeImage={getFirstTradeImage}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getPnLColor={getPnLColor}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TradeDetailModal
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrade(null);
        }}
      />
    </>
  );
};

export default TradeList;
