
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayLoader = () => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        setLoadError('Failed to load payment gateway. Please refresh and try again.');
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  return { razorpayLoaded, loadError };
};
