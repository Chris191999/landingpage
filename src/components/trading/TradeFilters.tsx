import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import PlanUpgradePrompt from '@/components/common/PlanUpgradePrompt';

interface TradeFiltersProps {
  onFiltersChange: (filters: TradeFilters) => void;
  totalTrades: number;
  filteredTrades: number;
  trades: any[];
}

export interface TradeFilters {
  symbol?: string;
  accountName?: string;
  direction?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minPnL?: number;
  maxPnL?: number;
  tradeType?: string;
  emotion?: string;
  confidenceRating?: string;
  mistakeCategory?: string;
  rulesFollowed?: string;
  economicEvents?: string;
  marketCondition?: string;
  minTradeDuration?: number;
  maxTradeDuration?: number;
  strategyName?: string;
  setupType?: string;
  session?: string;
}

const TradeFilters = ({ onFiltersChange, totalTrades, filteredTrades, trades }: TradeFiltersProps) => {
  const { data: planFeatures } = usePlanFeatures();
  const [filters, setFilters] = useState<TradeFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFiltersAccess = planFeatures?.filters_access || false;

  // Get unique account names for dropdown
  const uniqueAccountNames = Array.from(new Set((trades || []).map(t => t.account_name).filter(Boolean)));

  // Get unique economic events for dropdown
  const uniqueEconomicEvents = Array.from(new Set((trades || []).map(t => t.economic_events).filter(Boolean)));

  // Get unique strategy names and setup types for dropdowns
  const uniqueStrategyNames = Array.from(new Set((trades || []).map(t => t.strategy_name).filter(Boolean)));
  const uniqueSetupTypes = Array.from(new Set((trades || []).map(t => t.setup_type).filter(Boolean)));

  // Get unique market conditions for dropdown
  const uniqueMarketConditions = Array.from(new Set((trades || []).map(t => t.market_condition).filter(Boolean)));

  // Get unique symbols for dropdown
  const uniqueSymbols = Array.from(new Set((trades || []).map(t => t.symbol).filter(Boolean)));

  // Get unique sessions for dropdown
  const uniqueSessions = Array.from(new Set((trades || []).map(t => t.session).filter(Boolean)));

  const updateFilter = (key: keyof TradeFilters, value: any) => {
    if (!hasFiltersAccess) return;
    
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value || undefined
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    if (!hasFiltersAccess) return;
    
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  if (!hasFiltersAccess) {
    // Only show the PlanUpgradePrompt if analytics dashboard is unlocked
    const showUpgradePrompt = planFeatures?.analytics_access;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Trade Filters
            <Badge variant="secondary">Locked</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[200px]">
            {/* Blurred filter content */}
            <div className="filter blur-sm pointer-events-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Symbol</Label>
                  <Input placeholder="e.g., AAPL" disabled />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input placeholder="e.g., Main Account" disabled />
                </div>
                <div>
                  <Label>Direction</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            </div>
            {/* Upgrade prompt overlay - only show if analytics dashboard is unlocked */}
            {showUpgradePrompt && (
              <PlanUpgradePrompt 
                feature="Trade Filters"
                requiredPlan="Cooked"
                currentPlan={planFeatures?.plan_name}
                className="absolute inset-0"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Trade Filters
            {activeFiltersCount > 0 && (
              <Badge variant="default">{activeFiltersCount} active</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X size={16} />
                Clear
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredTrades} of {totalTrades} trades
        </p>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Basic Filters */}
          <div>
            <h4 className="text-sm font-medium mb-3">Basic Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Select
                  value={filters.symbol || 'all'}
                  onValueChange={value => updateFilter('symbol', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Select
                  value={filters.accountName || 'all'}
                  onValueChange={value => updateFilter('accountName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueAccountNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="direction">Direction</Label>
                <Select value={filters.direction || 'all'} onValueChange={(value) => updateFilter('direction', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                    <SelectItem value="Short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tradeType">Trade Type</Label>
                <Select value={filters.tradeType || 'all'} onValueChange={(value) => updateFilter('tradeType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Day Trading">Day Trading</SelectItem>
                    <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                    <SelectItem value="Position Trading">Position Trading</SelectItem>
                    <SelectItem value="Scalping">Scalping</SelectItem>
                    <SelectItem value="Investing">Investing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="session">Session</Label>
                <Select
                  value={filters.session || 'all'}
                  onValueChange={value => updateFilter('session', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueSessions.map(session => (
                      <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date and P&L Filters */}
          <div>
            <h4 className="text-sm font-medium mb-3">Date & P&L Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="minPnL">Min P&L</Label>
                <Input
                  id="minPnL"
                  type="number"
                  step="0.01"
                  placeholder="Minimum profit/loss"
                  value={filters.minPnL || ''}
                  onChange={(e) => updateFilter('minPnL', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="maxPnL">Max P&L</Label>
                <Input
                  id="maxPnL"
                  type="number"
                  step="0.01"
                  placeholder="Maximum profit/loss"
                  value={filters.maxPnL || ''}
                  onChange={(e) => updateFilter('maxPnL', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Psychological & Strategy Filters */}
          <div>
            <h4 className="text-sm font-medium mb-3">Psychological & Strategy Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emotion">Emotion During Trade</Label>
                <Select
                  value={filters.emotion || 'all'}
                  onValueChange={value => updateFilter('emotion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="fearful">Fearful</SelectItem>
                    <SelectItem value="fomo">FOMO</SelectItem>
                    <SelectItem value="greedy">Greedy</SelectItem>
                    <SelectItem value="disciplined">Disciplined</SelectItem>
                    <SelectItem value="uncertain">Uncertain</SelectItem>
                    <SelectItem value="undisciplined">Undisciplined</SelectItem>
                    <SelectItem value="tilt">Tilt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="confidenceRating">Confidence Rating</Label>
                <Select value={filters.confidenceRating || 'all'} onValueChange={(value) => updateFilter('confidenceRating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[1,2,3,4,5,6,7,8,9,10].map(rating => (
                      <SelectItem key={rating} value={rating.toString()}>{rating}/10</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mistakeCategory">Mistake Category</Label>
                <Select
                  value={filters.mistakeCategory || 'all'}
                  onValueChange={value => updateFilter('mistakeCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mistake category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="none">No Mistake</SelectItem>
                    <SelectItem value="early_exit">Early Exit</SelectItem>
                    <SelectItem value="late_entry">Late Entry</SelectItem>
                    <SelectItem value="late_exit">Late Exit</SelectItem>
                    <SelectItem value="early_entry">Early Entry</SelectItem>
                    <SelectItem value="oversized">Position Too Large</SelectItem>
                    <SelectItem value="position_too_small">Position Too Small</SelectItem>
                    <SelectItem value="revenge_trade">Revenge Trade</SelectItem>
                    <SelectItem value="fomo">FOMO Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rulesFollowed">Trading Rules Followed</Label>
                <Select value={filters.rulesFollowed || 'all'} onValueChange={(value) => updateFilter('rulesFollowed', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partial">Partially</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="strategyName">Strategy Name</Label>
                <Select
                  value={filters.strategyName || 'all'}
                  onValueChange={value => updateFilter('strategyName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueStrategyNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="setupType">Setup Type</Label>
                <Select
                  value={filters.setupType || 'all'}
                  onValueChange={value => updateFilter('setupType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select setup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueSetupTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Market & Duration Filters */}
          <div>
            <h4 className="text-sm font-medium mb-3">Market Conditions & Duration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="economicEvents">Economic Events</Label>
                <Select
                  value={filters.economicEvents || 'all'}
                  onValueChange={value => updateFilter('economicEvents', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or add economic event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueEconomicEvents.map(event => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="marketCondition">Market Condition</Label>
                <Select
                  value={filters.marketCondition || 'all'}
                  onValueChange={value => updateFilter('marketCondition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueMarketConditions.map(condition => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="minTradeDuration">Min Duration (Minutes)</Label>
                <Input
                  id="minTradeDuration"
                  type="number"
                  placeholder="Minimum duration"
                  value={filters.minTradeDuration || ''}
                  onChange={(e) => updateFilter('minTradeDuration', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="maxTradeDuration">Max Duration (Minutes)</Label>
                <Input
                  id="maxTradeDuration"
                  type="number"
                  placeholder="Maximum duration"
                  value={filters.maxTradeDuration || ''}
                  onChange={(e) => updateFilter('maxTradeDuration', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TradeFilters;
