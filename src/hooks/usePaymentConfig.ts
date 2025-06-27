
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';

export interface PaymentConfig {
  selectedPlan: string;
  isUpgrade: boolean;
  fullName: string;
  email: string;
  planId: string;
  planPrice: string;
  planName: string;
  previousPlan: string;
}

export const usePaymentConfig = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const { data: planFeatures } = usePlanFeatures();

  const planIdMapUI: Record<string, string> = {
    'cooked': 'plan_Qki1LVj5xEqYA9',
    'goated': 'plan_Qki15ngu8LVEIm',
  };

  const planPrices: Record<string, string> = {
    'cooked': '499',
    'goated': '799',
  };

  const planNames: Record<string, string> = {
    'cooked': 'Cooked',
    'goated': 'Goated',
  };

  const selectedPlan = searchParams.get('plan') || location.state?.plan || 'cooked';
  const isUpgrade = location.state?.isUpgrade || false;
  const fullName = searchParams.get('fullName') || user?.user_metadata?.full_name || '';
  const email = searchParams.get('email') || user?.email || '';
  const previousPlan = planFeatures?.plan_name || 'Let him cook (free)';

  const config: PaymentConfig = {
    selectedPlan,
    isUpgrade,
    fullName,
    email,
    planId: planIdMapUI[selectedPlan.toLowerCase()],
    planPrice: planPrices[selectedPlan.toLowerCase()] || '499',
    planName: planNames[selectedPlan.toLowerCase()] || 'Cooked',
    previousPlan,
  };

  return config;
};
