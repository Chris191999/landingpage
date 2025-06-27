import { Trade } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatCurrencyStreamer } from "@/utils/formatters";
import { useStreamerMode } from '@/components/layout/StreamerModeProvider';

interface TradeBasicInfoProps {
  trade: Trade;
}

const TradeBasicInfo = ({ trade }: TradeBasicInfoProps) => {
  const { streamerMode } = useStreamerMode();

  const getDirectionBadgeColor = (direction: string) => {
    return direction === 'Long' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Open':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'Cancelled':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getPnLColor = (pnl?: number) => {
    if (!pnl) return 'text-gray-400';
    return pnl > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-3">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 text-lg">Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between">
            <span className="text-gray-300">Symbol:</span>
            <span className="text-orange-400 font-semibold">{trade.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Direction:</span>
            <Badge className={`${getDirectionBadgeColor(trade.direction)} text-white`}>
              {trade.direction}
            </Badge>
          </div>
          {trade.trade_type && (
            <div className="flex justify-between">
              <span className="text-gray-300">Trade Type:</span>
              <span className="text-white">{trade.trade_type}</span>
            </div>
          )}
          {trade.account_name && (
            <div className="flex justify-between">
              <span className="text-gray-300">Account Name:</span>
              <span className="text-white">{trade.account_name}</span>
            </div>
          )}
          {trade.account_balance !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Account Balance:</span>
              <span className="text-white">{formatCurrencyStreamer(trade.account_balance, streamerMode)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Date:</span>
            <span className="text-white">{trade.date}</span>
          </div>
          {trade.time_of_day && (
            <div className="flex justify-between">
              <span className="text-gray-300">Time:</span>
              <span className="text-white">{
                (() => {
                  const time = trade.time_of_day;
                  if (!time) return '';
                  // If already contains AM/PM, just show it
                  if (time.match(/am|pm|AM|PM/)) return time;
                  // Convert HH:mm to 12-hour format
                  const [h, m] = time.split(":");
                  let hour = parseInt(h);
                  const ampm = hour >= 12 ? "PM" : "AM";
                  hour = hour % 12 || 12;
                  return `${hour}:${m} ${ampm}`;
                })()
              }</span>
            </div>
          )}
          {trade.session && (
            <div className="flex justify-between">
              <span className="text-gray-300">Session:</span>
              <span className="text-white">{trade.session}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Status:</span>
            <Badge className={`${getStatusBadgeColor(trade.status)} text-white`}>
              {trade.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Order Type:</span>
            <span className="text-white">{trade.order_type}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 text-lg">Trade Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between">
            <span className="text-gray-300">Entry Price:</span>
            <span className="text-blue-400 font-semibold">{formatCurrencyStreamer(trade.entry, streamerMode, 'entry')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Exit Price:</span>
            <span className="text-blue-400 font-semibold">{trade.exit ? formatCurrencyStreamer(trade.exit, streamerMode, 'exit') : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Position Size:</span>
            <span className="text-white">{trade.position_size || 1.0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">P&L:</span>
            <span className={`font-semibold ${getPnLColor(trade.pnl)}`}>{trade.pnl ? formatCurrencyStreamer(trade.pnl, streamerMode, 'pnl') : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Risk:</span>
            <span className="text-white">{formatCurrencyStreamer(trade.risk, streamerMode)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Fees:</span>
            <span className="text-white">{formatCurrencyStreamer(trade.fees || 0, streamerMode)}</span>
          </div>
          {trade.stop_loss !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Stop Loss:</span>
              <span className="text-white">{formatCurrencyStreamer(trade.stop_loss, streamerMode)}</span>
            </div>
          )}
          {trade.trailing_stop !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Trailing Stop:</span>
              <span className="text-white">{formatCurrencyStreamer(trade.trailing_stop, streamerMode)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 text-lg">Advanced Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {trade.risk && trade.risk > 0 && trade.pnl !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">R-Multiple:</span>
              <span className="text-white font-semibold">
                {(trade.pnl / trade.risk).toFixed(2)}R
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">MAE:</span>
            <span className="text-red-400">{trade.max_adverse_excursion !== undefined ? formatCurrency(trade.max_adverse_excursion) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">MFE:</span>
            <span className="text-green-400">{trade.max_favorable_excursion !== undefined ? formatCurrency(trade.max_favorable_excursion) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Duration:</span>
            <span className="text-white">{trade.trade_duration_hours !== undefined ? Math.round(trade.trade_duration_hours * 60) + 'min' : 'N/A'}</span>
          </div>
          {trade.strategy_name && (
            <div className="flex justify-between">
              <span className="text-gray-300">Strategy:</span>
              <span className="text-white">{trade.strategy_name}</span>
            </div>
          )}
          {trade.setup_type && (
            <div className="flex justify-between">
              <span className="text-gray-300">Setup Type:</span>
              <span className="text-white">{trade.setup_type}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {(trade.market_condition || trade.market_condition_detailed || trade.market_volatility || trade.economic_events) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-400 text-lg">Market Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {trade.market_condition && (
              <div className="flex justify-between">
                <span className="text-gray-300">Market Condition:</span>
                <span className="text-white">{trade.market_condition}</span>
              </div>
            )}
            {trade.market_condition_detailed && (
              <div className="flex justify-between">
                <span className="text-gray-300">Market Condition (Detailed):</span>
                <span className="text-white">{trade.market_condition_detailed.replace('_', ' ')}</span>
              </div>
            )}
            {trade.market_volatility && (
              <div className="flex justify-between">
                <span className="text-gray-300">Volatility:</span>
                <span className="text-white">{trade.market_volatility}</span>
              </div>
            )}
            {trade.economic_events && (
              <div className="flex justify-between">
                <span className="text-gray-300">Economic Events:</span>
                <span className="text-white">{trade.economic_events}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(trade.emotion || trade.confidence_rating || trade.mistake_category || trade.rules_followed !== undefined) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-400 text-lg">Psychological Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {trade.emotion && (
              <div className="flex justify-between">
                <span className="text-gray-300">Emotion:</span>
                <span className="text-white capitalize">{trade.emotion}</span>
              </div>
            )}
            {trade.confidence_rating && (
              <div className="flex justify-between">
                <span className="text-gray-300">Confidence:</span>
                <span className="text-white">{trade.confidence_rating}/10</span>
              </div>
            )}
            {trade.mistake_category && trade.mistake_category !== 'none' && (
              <div className="flex justify-between">
                <span className="text-gray-300">Mistake:</span>
                <span className="text-red-400">{trade.mistake_category.replace('_', ' ')}</span>
              </div>
            )}
            {trade.rules_followed !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-300">Rules Followed:</span>
                <span className={trade.rules_followed === 'yes' ? 'text-green-400' : trade.rules_followed === 'partial' ? 'text-yellow-400' : 'text-red-400'}>
                  {trade.rules_followed === 'yes' ? 'Yes' : trade.rules_followed === 'partial' ? 'Partially' : 'No'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradeBasicInfo;
