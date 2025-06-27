import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CouponValidation {
  isValid: boolean;
  discountAmount: number;
  originalAmount: number;
  discountPercentage: number;
  couponId: string | null;
  message: string;
}

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const validateCoupon = async (couponCode: string, planType: string): Promise<CouponValidation> => {
    // Use user from top-level scope
    setLoading(true);
    try {
      const userId = user ? user.id : null;
      const { data, error } = await supabase.rpc('validate_coupon', {
        p_coupon_code: couponCode.toUpperCase(),
        p_user_id: userId,
        p_plan_type: planType.toLowerCase()
      });
      if (error) throw error;
      const result = data[0];
      return {
        isValid: result.is_valid,
        discountAmount: result.discount_amount,
        originalAmount: result.original_amount,
        discountPercentage: result.discount_percentage,
        couponId: result.coupon_id,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      return {
        isValid: false,
        discountAmount: 0,
        originalAmount: 0,
        discountPercentage: 0,
        couponId: null,
        message: 'Error validating coupon'
      };
    } finally {
      setLoading(false);
    }
  };

  const recordCouponUsage = async (couponId: string, subscriptionId: string, paymentAmount: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('coupon_usage')
        .insert({
          user_id: user.id,
          coupon_code_id: couponId,
          subscription_id: subscriptionId,
          payment_amount: paymentAmount
        });

      if (error) throw error;

      // Increment usage count
      await supabase.rpc('increment_coupon_usage', { coupon_id: couponId });
    } catch (error) {
      console.error('Error recording coupon usage:', error);
    }
  };

  return { validateCoupon, recordCouponUsage, loading };
};
