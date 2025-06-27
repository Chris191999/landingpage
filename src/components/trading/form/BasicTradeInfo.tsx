
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicTradeInfoProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
  trades?: any[];
}

const BasicTradeInfo = ({ formData, onFieldChange, trades = [] }: BasicTradeInfoProps) => {
  const [addingNew, setAddingNew] = useState(false);
  const [addingNewSymbol, setAddingNewSymbol] = useState(false);
  const uniqueAccountNames = Array.from(new Set((trades || []).map(t => t.account_name).filter(Boolean)));
  const uniqueSymbols = Array.from(new Set((trades || []).map(t => t.symbol).filter(Boolean)));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Basic Trade Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="symbol">Symbol *</Label>
          <Select
            value={addingNewSymbol ? 'add_new' : (formData.symbol || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNewSymbol(true);
                onFieldChange('symbol', '');
              } else {
                setAddingNewSymbol(false);
                onFieldChange('symbol', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select symbol</SelectItem>
              {uniqueSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNewSymbol && (
            <Input
              className="mt-2"
              id="symbol_new"
              value={formData.symbol || ''}
              onChange={e => onFieldChange('symbol', e.target.value)}
              placeholder="Enter new symbol"
              autoFocus
            />
          )}
        </div>

        <div>
          <Label htmlFor="account_name">Account Name</Label>
          <Select
            value={addingNew ? 'add_new' : (formData.account_name || 'all')}
            onValueChange={value => {
              if (value === 'add_new') {
                setAddingNew(true);
                onFieldChange('account_name', '');
              } else {
                setAddingNew(false);
                onFieldChange('account_name', value === 'all' ? '' : value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or add account name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select account</SelectItem>
              {uniqueAccountNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
              <SelectItem value="add_new">Add new...</SelectItem>
            </SelectContent>
          </Select>
          {addingNew && (
            <Input
              className="mt-2"
              id="account_name_new"
              value={formData.account_name || ''}
              onChange={e => onFieldChange('account_name', e.target.value)}
              placeholder="Enter new account name"
              autoFocus
            />
          )}
        </div>

        <div>
          <Label htmlFor="trade_type">Trade Type</Label>
          <select
            id="trade_type"
            value={formData.trade_type || 'Day Trading'}
            onChange={(e) => onFieldChange('trade_type', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Day Trading">Day Trading</option>
            <option value="Swing Trading">Swing Trading</option>
            <option value="Position Trading">Position Trading</option>
            <option value="Scalping">Scalping</option>
            <option value="Investing">Investing</option>
          </select>
        </div>

        <div>
          <Label htmlFor="direction">Direction</Label>
          <select
            id="direction"
            value={formData.direction || 'Long'}
            onChange={(e) => onFieldChange('direction', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => onFieldChange('date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="time_of_day">Time of Day</Label>
          <Input
            id="time_of_day"
            type="time"
            value={formData.time_of_day || ''}
            onChange={(e) => onFieldChange('time_of_day', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="session">Session</Label>
          <Select
            value={formData.session || ''}
            onValueChange={value => onFieldChange('session', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning session">Morning session</SelectItem>
              <SelectItem value="Afternoon session">Afternoon session</SelectItem>
              <SelectItem value="Evening session">Evening session</SelectItem>
              <SelectItem value="Overnight holds">Overnight holds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status || 'Open'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Open">Open</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <Label htmlFor="order_type">Order Type</Label>
          <select
            id="order_type"
            value={formData.order_type || 'Market'}
            onChange={(e) => onFieldChange('order_type', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
            <option value="Stop">Stop</option>
            <option value="Forward">Forward</option>
          </select>
        </div>

        <div>
          <Label htmlFor="stop_loss">Stop Loss</Label>
          <Input
            id="stop_loss"
            type="number"
            step="0.01"
            value={formData.stop_loss || ''}
            onChange={e => onFieldChange('stop_loss', parseFloat(e.target.value) || 0)}
            placeholder="Enter stop loss price"
          />
        </div>
        <div>
          <Label htmlFor="trailing_stop">Trailing Stop</Label>
          <Input
            id="trailing_stop"
            type="number"
            step="0.01"
            value={formData.trailing_stop || ''}
            onChange={e => onFieldChange('trailing_stop', parseFloat(e.target.value) || 0)}
            placeholder="Enter trailing stop price (optional)"
          />
        </div>
        <div>
          <Label htmlFor="account_balance">Account Balance</Label>
          <Input
            id="account_balance"
            type="number"
            step="0.01"
            value={formData.account_balance || ''}
            onChange={e => onFieldChange('account_balance', parseFloat(e.target.value) || 0)}
            placeholder="Enter account balance at time of trade"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicTradeInfo;
