import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface MenteeTradesViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentee: { id: string; full_name: string | null; email: string };
  trades: any[];
  accessLevel: 'basic' | 'advanced' | 'full';
}

const MenteeTradesView = ({ open, onOpenChange, mentee, trades, accessLevel }: MenteeTradesViewProps) => {
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'win': return 'bg-green-500';
      case 'loss': return 'bg-red-500';
      case 'breakeven': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const recentTrades = trades.slice(0, 10);
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length * 100).toFixed(1) : '0';

  const handleTradeDetail = (trade: any) => {
    setSelectedTrade(trade);
    setDetailViewOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {mentee.full_name || mentee.email}'s Trading Activity
              <Badge className="capitalize ml-2">{accessLevel} access</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trades.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{winRate}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getPnLColor(totalPnL)}`}>
                    {formatCurrency(totalPnL)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced/Full: show full trade details and analytics */}
            {(accessLevel === 'advanced' || accessLevel === 'full') && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  {trades.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No trades found for this mentee
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Direction</TableHead>
                          <TableHead>Entry</TableHead>
                          <TableHead>Exit</TableHead>
                          <TableHead>P&L</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTrades.map((trade) => (
                          <TableRow key={trade.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(trade.date)}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {trade.direction === 'long' ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                {trade.direction}
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(trade.entry || 0)}</TableCell>
                            <TableCell>{formatCurrency(trade.exit || 0)}</TableCell>
                            <TableCell>
                              <div className={`flex items-center gap-1 ${getPnLColor(trade.pnl || 0)}`}>
                                <DollarSign className="w-4 h-4" />
                                {formatCurrency(trade.pnl || 0)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(trade.status)} text-white`}>
                                {trade.status || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTradeDetail(trade)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}

            {trades.length > 10 && (
              <div className="text-center text-sm text-gray-500">
                Showing {recentTrades.length} of {trades.length} trades
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Trade Detail Dialog: always available for advanced/full */}
      {(accessLevel === 'advanced' || accessLevel === 'full') && (
        <Dialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Trade Details</DialogTitle>
            </DialogHeader>
            {selectedTrade && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Symbol</label>
                    <div className="text-lg font-semibold">{selectedTrade.symbol}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <div>{formatDate(selectedTrade.date)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Direction</label>
                    <div className="capitalize">{selectedTrade.direction}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Strategy</label>
                    <div>{selectedTrade.strategy_name || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Entry</label>
                    <div>{formatCurrency(selectedTrade.entry || 0)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Exit</label>
                    <div>{formatCurrency(selectedTrade.exit || 0)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quantity</label>
                    <div>{selectedTrade.quantity || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">P&L</label>
                    <div className={getPnLColor(selectedTrade.pnl || 0)}>
                      {formatCurrency(selectedTrade.pnl || 0)}
                    </div>
                  </div>
                </div>

                {selectedTrade.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedTrade.notes}
                    </div>
                  </div>
                )}

                {selectedTrade.post_trade_reflection && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Post-Trade Reflection</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedTrade.post_trade_reflection}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MenteeTradesView;
