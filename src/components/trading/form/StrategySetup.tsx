import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StrategySetupProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
  trades?: any[];
}

const StrategySetup = ({ formData, onFieldChange, trades = [] }: StrategySetupProps) => {
  const [addingNewStrategy, setAddingNewStrategy] = useState(false);
  const [addingNewSetup, setAddingNewSetup] = useState(false);
  const uniqueStrategyNames = Array.from(new Set((trades || []).map(t => t.strategy_name).filter(Boolean)));
  const uniqueSetupTypes = Array.from(new Set((trades || []).map(t => t.setup_type).filter(Boolean)));
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Strategy & Setup</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="strategy_name">Strategy Name</Label>
          <Select
            value={addingNewStrategy ? 'add_new' : (formData.strategy_name || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNewStrategy(true);
                onFieldChange('strategy_name', '');
              } else {
                setAddingNewStrategy(false);
                onFieldChange('strategy_name', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add strategy name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select strategy</SelectItem>
              {uniqueStrategyNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNewStrategy && (
            <Input
              className="mt-2"
              id="strategy_name_new"
              value={formData.strategy_name || ''}
              onChange={e => onFieldChange('strategy_name', e.target.value)}
              placeholder="Enter new strategy name"
              autoFocus
            />
          )}
        </div>

        <div>
          <Label htmlFor="setup_type">Setup Type</Label>
          <Select
            value={addingNewSetup ? 'add_new' : (formData.setup_type || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNewSetup(true);
                onFieldChange('setup_type', '');
              } else {
                setAddingNewSetup(false);
                onFieldChange('setup_type', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add setup type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select setup</SelectItem>
              {uniqueSetupTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNewSetup && (
            <Input
              className="mt-2"
              id="setup_type_new"
              value={formData.setup_type || ''}
              onChange={e => onFieldChange('setup_type', e.target.value)}
              placeholder="Enter new setup type"
              autoFocus
            />
          )}
        </div>

        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <select
            id="timeframe"
            value={formData.timeframe || '1h'}
            onChange={(e) => onFieldChange('timeframe', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrategySetup;
