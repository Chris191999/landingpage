
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface MetricsFiltersProps {
  dateFrom: string;
  dateTo: string;
  selectedSymbol: string;
  uniqueSymbols: string[];
  filteredTradesCount: number;
  totalTradesCount: number;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onSymbolChange: (symbol: string) => void;
  onClearFilters: () => void;
}

const MetricsFilters = ({
  dateFrom,
  dateTo,
  selectedSymbol,
  uniqueSymbols,
  filteredTradesCount,
  totalTradesCount,
  onDateFromChange,
  onDateToChange,
  onSymbolChange,
  onClearFilters
}: MetricsFiltersProps) => {
  const hasActiveFilters = dateFrom || dateTo || selectedSymbol !== "all";

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Filter size={20} />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="date-from" className="text-white">From Date</Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="date-to" className="text-white">To Date</Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="symbol-filter" className="text-white">Symbol</Label>
            <Select value={selectedSymbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Symbols</SelectItem>
                {uniqueSymbols.map(symbol => (
                  <SelectItem key={symbol} value={symbol} className="text-white">
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={onClearFilters}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <X size={16} className="mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredTradesCount} of {totalTradesCount} total trades
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsFilters;
