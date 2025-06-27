
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';

interface AdvancedFilters {
  dateFrom: string;
  dateTo: string;
  selectedSymbol: string;
  strategy: string;
  emotion: string;
  confidenceMin: number;
  confidenceMax: number;
  minTradeDuration: number;
  maxTradeDuration: number;
  minPnL: number;
  maxPnL: number;
}

interface AdvancedMetricsFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  symbols: string[];
  strategies: string[];
}

const AdvancedMetricsFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  symbols,
  strategies
}: AdvancedMetricsFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 0 && value !== 100
    ).length;
  };

  const emotions = [
    'confident', 'fearful', 'fomo', 'greedy', 'disciplined', 
    'uncertain', 'undisciplined', 'tilt'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Symbol and Strategy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Symbol</Label>
              <Select
                value={filters.selectedSymbol}
                onValueChange={(value) => handleFilterChange('selectedSymbol', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All symbols" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Symbols</SelectItem>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Strategy</Label>
              <Select
                value={filters.strategy}
                onValueChange={(value) => handleFilterChange('strategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All strategies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Strategies</SelectItem>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Emotion and Confidence */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Emotion</Label>
              <Select
                value={filters.emotion}
                onValueChange={(value) => handleFilterChange('emotion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All emotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Emotions</SelectItem>
                  {emotions.map(emotion => (
                    <SelectItem key={emotion} value={emotion}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Confidence Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="1"
                  max="10"
                  value={filters.confidenceMin || ''}
                  onChange={(e) => handleFilterChange('confidenceMin', parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="1"
                  max="10"
                  value={filters.confidenceMax || ''}
                  onChange={(e) => handleFilterChange('confidenceMax', parseInt(e.target.value) || 10)}
                />
              </div>
            </div>
          </div>

          {/* P&L Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min P&L</Label>
              <Input
                type="number"
                step="0.01"
                value={filters.minPnL || ''}
                onChange={(e) => handleFilterChange('minPnL', parseFloat(e.target.value) || 0)}
                placeholder="Minimum P&L"
              />
            </div>
            <div>
              <Label>Max P&L</Label>
              <Input
                type="number"
                step="0.01"
                value={filters.maxPnL || ''}
                onChange={(e) => handleFilterChange('maxPnL', parseFloat(e.target.value) || 0)}
                placeholder="Maximum P&L"
              />
            </div>
          </div>

          {/* Trade Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Duration (minutes)</Label>
              <Input
                type="number"
                min="0"
                value={filters.minTradeDuration || ''}
                onChange={(e) => handleFilterChange('minTradeDuration', parseInt(e.target.value) || 0)}
                placeholder="Min duration"
              />
            </div>
            <div>
              <Label>Max Duration (minutes)</Label>
              <Input
                type="number"
                min="0"
                value={filters.maxTradeDuration || ''}
                onChange={(e) => handleFilterChange('maxTradeDuration', parseInt(e.target.value) || 0)}
                placeholder="Max duration"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdvancedMetricsFilters;
