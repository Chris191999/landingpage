import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketContextProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
  trades?: any[];
}

const MarketContext = ({ formData, onFieldChange, trades = [] }: MarketContextProps) => {
  const [addingNew, setAddingNew] = useState(false);
  const [addingNewMarketCondition, setAddingNewMarketCondition] = useState(false);
  const uniqueEconomicEvents = Array.from(new Set((trades || []).map(t => t.economic_events).filter(Boolean)));
  const uniqueMarketConditions = Array.from(new Set((trades || []).map(t => t.market_condition).filter(Boolean)));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Market Context</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="market_condition_detailed">Market Condition</Label>
          <Select
            value={addingNewMarketCondition ? 'add_new' : (formData.market_condition || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNewMarketCondition(true);
                onFieldChange('market_condition', '');
              } else {
                setAddingNewMarketCondition(false);
                onFieldChange('market_condition', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add market condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select condition</SelectItem>
              {uniqueMarketConditions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNewMarketCondition && (
            <Input
              className="mt-2"
              id="market_condition_new"
              value={formData.market_condition || ''}
              onChange={e => onFieldChange('market_condition', e.target.value)}
              placeholder="Enter new market condition"
              autoFocus
            />
          )}
        </div>

        <div>
          <Label htmlFor="market_volatility">Market Volatility</Label>
          <select
            id="market_volatility"
            value={formData.market_volatility || 'medium'}
            onChange={(e) => onFieldChange('market_volatility', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <Label htmlFor="economic_events">Economic Events</Label>
          <Select
            value={addingNew ? 'add_new' : (formData.economic_events || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNew(true);
                onFieldChange('economic_events', '');
              } else {
                setAddingNew(false);
                onFieldChange('economic_events', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add economic event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select event</SelectItem>
              {uniqueEconomicEvents.map(event => (
                <SelectItem key={event} value={event}>{event}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNew && (
            <Input
              className="mt-2"
              id="economic_events_new"
              value={formData.economic_events || ''}
              onChange={e => onFieldChange('economic_events', e.target.value)}
              placeholder="Enter new economic event"
              autoFocus
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketContext;
