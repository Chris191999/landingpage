
export const formatCurrencyByType = (value: number, currencyType: 'USD' | 'INR' = 'USD'): string => {
  if (currencyType === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const getCurrencySymbol = (currencyType: 'USD' | 'INR' = 'USD'): string => {
  return currencyType === 'USD' ? '$' : '₹';
};

export const getCurrentCurrency = (): 'USD' | 'INR' => {
  const stored = localStorage.getItem('currency');
  return (stored === 'INR' || stored === 'USD') ? stored : 'USD';
};
