import { getCurrentCurrency } from './currencyUtils';

// Shared formatting utilities
export const formatCurrency = (value: number): string => {
  const currency = getCurrentCurrency();
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'INR'
  }).format(value);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatRMultiple = (value: number): string => {
  return `${value.toFixed(2)}R`;
};

export const formatLargeNumber = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return formatNumber(value, 0);
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
};

export function formatCurrencyStreamer(value: number, streamerMode: boolean, field?: string) {
  if (streamerMode && field === 'pnl') return '***';
  return formatCurrency(value);
}
