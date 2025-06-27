import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PaymentConfig } from '@/hooks/usePaymentConfig';
import { CouponValidation, useCoupons } from '@/hooks/useCoupons';
import CouponSection from './CouponSection';
import { Checkbox } from '@/components/ui/checkbox';

interface PaymentFormProps {
  config: PaymentConfig;
  razorpayLoaded: boolean;
  onPaymentResult: (isSuccess: boolean, message?: string) => void;
  appliedCoupon: CouponValidation | null;
  setAppliedCoupon: (coupon: CouponValidation | null) => void;
  outsideIndia: boolean;
  setOutsideIndia: (val: boolean) => void;
}

// PayPal button ID mappings (same as SignupForm)
const PAYPAL_BUTTONS = {
  Cooked: {
    none: "GNRQKB6Z6S4A6",
    10: "NLWDBZXAMYJX2",
    25: "A55BKH8W2H65Cv",
    50: "64W9Z5PTGVALS",
  },
  Goated: {
    none: "GNRQKB6Z6S4A6",
    10: "NLWDBZXAMYJX2",
    25: "A55BKH8W2H65C",
    50: "64W9Z5PTGVALS",
  }
};
const COUPON_DISCOUNTS = {
  INFLUENCER10: "10",
  INFLUENCER25: "25",
  INFLUENCER50: "50",
  // Add more influencer codes as needed
};
const getDiscountLevel = (coupon) => COUPON_DISCOUNTS[coupon] || "none";

const PaymentForm = ({ config, razorpayLoaded, onPaymentResult, appliedCoupon, setAppliedCoupon, outsideIndia, setOutsideIndia }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedPlan, isUpgrade, fullName, email, planId, planName, previousPlan } = config;
  const { recordCouponUsage } = useCoupons();

  // Calculate final price
  const originalPrice = parseInt(config.planPrice);
  const finalPrice = appliedCoupon ? appliedCoupon.discountAmount : originalPrice;

  // Determine price and currency based on outsideIndia
  let displayPrice: string | number = finalPrice;
  let displayCurrency = '₹';
  if (outsideIndia) {
    if (planName.toLowerCase().includes('cooked')) {
      displayPrice = appliedCoupon && appliedCoupon.discountPercentage ? (10 - (10 * appliedCoupon.discountPercentage / 100)) : 10;
    } else if (planName.toLowerCase().includes('goated')) {
      displayPrice = appliedCoupon && appliedCoupon.discountPercentage ? (15 - (15 * appliedCoupon.discountPercentage / 100)) : 15;
    }
    displayCurrency = '$';
  }

  const handlePayment = async () => {
    if (!selectedPlan || selectedPlan === 'free') {
      onPaymentResult(false, 'Please select a valid plan');
      return;
    }

    // PayPal logic for outside India
    if (outsideIndia && selectedPlan !== 'free') {
      let plan = '';
      if (planName.toLowerCase().includes('cooked')) plan = 'Cooked';
      else if (planName.toLowerCase().includes('goated')) plan = 'Goated';
      else plan = 'Cooked'; // fallback
      // Use discountPercentage to map to PayPal discount
      let discount = 'none';
      if (appliedCoupon && appliedCoupon.discountPercentage) {
        discount = String(appliedCoupon.discountPercentage);
      }
      const buttonId = PAYPAL_BUTTONS[plan][discount];
      const params = new URLSearchParams({
        plan: planName,
        fullName: fullName,
        email: email,
        buttonId,
      });
      navigate(`/paypal?${params.toString()}`);
      return;
    }

    if (!razorpayLoaded) {
      onPaymentResult(false, 'Payment gateway is still loading. Please wait...');
      return;
    }

    setLoading(true);

    try {
      if (!planId) {
        throw new Error('Invalid plan selected');
      }

      const isActualUpgrade = isUpgrade && previousPlan !== 'Let him cook (free)';

      console.log('Payment context:', {
        isUpgrade: isActualUpgrade,
        previousPlan,
        selectedPlan,
        planId,
        appliedCoupon: appliedCoupon ? appliedCoupon.discountPercentage + '% off' : 'none',
        finalPrice,
        originalPrice
      });

      // Prepare subscription data with coupon information
      const subscriptionPayload: {
        plan_id: string;
        customer_email: string;
        is_upgrade: boolean;
        previous_plan: string | null;
        coupon_discount_amount?: number;
        original_amount?: number;
      } = {
        plan_id: planId,
        customer_email: email,
        is_upgrade: isActualUpgrade,
        previous_plan: isActualUpgrade ? previousPlan : null,
      };

      // Add coupon data if applied
      if (appliedCoupon) {
        subscriptionPayload.coupon_discount_amount = appliedCoupon.discountAmount;
        subscriptionPayload.original_amount = appliedCoupon.originalAmount;
      }

      logStep("Sending subscription payload", subscriptionPayload);

      const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('create-razorpay-subscription', {
        body: subscriptionPayload,
      });

      if (subscriptionError) throw subscriptionError;
      if (!subscriptionData || !subscriptionData.id) throw new Error('Failed to create subscription');

      // Check if this is a coupon payment (new flow) or regular subscription
      if (subscriptionData.is_coupon_payment && subscriptionData.payment_order_id) {
        // Handle coupon payment with one-time payment order
        const options = {
          key: 'rzp_test_5M9X4GfWripAMj',
          order_id: subscriptionData.payment_order_id,
          amount: subscriptionData.payment_amount,
          currency: 'INR',
          name: 'The House of Traders',
          description: isActualUpgrade 
            ? `Upgrade from ${previousPlan} to ${planName} Plan (First Payment with Coupon)` 
            : `${planName} Plan - First Payment with Coupon`,
          handler: async (response: any) => {
            // Record coupon usage if applied
            if (appliedCoupon && appliedCoupon.couponId) {
              await recordCouponUsage(appliedCoupon.couponId, subscriptionData.id, finalPrice);
            }

            onPaymentResult(
              true, 
              isActualUpgrade 
                ? 'Plan upgraded successfully! Your account will be updated shortly. Future payments will be charged automatically.' 
                : 'Payment successful! Your account will be activated shortly. You will receive a confirmation email. Future payments will be charged automatically.'
            );
          },
          prefill: {
            name: fullName,
            email: email,
          },
          theme: {
            color: '#f5dd01',
          },
          modal: {
            ondismiss: () => {
              onPaymentResult(false, 'Payment was cancelled. You can try again anytime.');
            }
          },
          notes: {
            coupon_applied: appliedCoupon ? `${appliedCoupon.discountPercentage}% off` : 'none',
            original_price: originalPrice,
            final_price: finalPrice,
            subscription_id: subscriptionData.id
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          onPaymentResult(false, `Payment failed: ${response.error.description || 'Unknown error occurred'}`);
        });
        rzp.open();
      } else {
        // Handle regular subscription payment
        const options = {
          key: 'rzp_test_5M9X4GfWripAMj',
          subscription_id: subscriptionData.id,
          name: 'The House of Traders',
          description: isActualUpgrade 
            ? `Upgrade from ${previousPlan} to ${planName} Plan` 
            : `${planName} Plan Subscription`,
          handler: async (response: any) => {
            onPaymentResult(
              true, 
              isActualUpgrade 
                ? 'Plan upgraded successfully! Your account will be updated shortly.' 
                : 'Payment successful! Your account will be activated shortly. You will receive a confirmation email.'
            );
          },
          prefill: {
            name: fullName,
            email: email,
          },
          theme: {
            color: '#f5dd01',
          },
          modal: {
            ondismiss: () => {
              onPaymentResult(false, 'Payment was cancelled. You can try again anytime.');
            }
          },
          notes: {
            original_price: originalPrice,
            final_price: finalPrice,
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          onPaymentResult(false, `Payment failed: ${response.error.description || 'Unknown error occurred'}`);
        });
        rzp.open();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentResult(false, `Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logStep = (step: string, details?: any) => {
    const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
    console.log(`[PAYMENT-FORM] ${step}${detailsStr}`);
  };

  return (
    <div className="space-y-4">
      <CouponSection
        planType={selectedPlan.toLowerCase()}
        originalPrice={originalPrice}
        onCouponApplied={setAppliedCoupon}
      />
      {/* Outside India Checkbox */}
      <div className="flex items-center justify-center mt-6 mb-4">
        <div className="flex items-center gap-1 bg-[#181c25] px-2 py-1 rounded-xl border-2 border-[#e6c200] shadow-md">
          <input
            type="checkbox"
            id="outsideIndia"
            checked={outsideIndia}
            onChange={e => setOutsideIndia(e.target.checked)}
            className="accent-yellow-400 w-3 h-3 cursor-pointer border-2 border-[#e6c200] rounded-md"
            style={{ minWidth: '14px', minHeight: '14px' }}
          />
          <label htmlFor="outsideIndia" className="text-sm font-semibold text-[#e6c200] cursor-pointer select-none">
            Outside India
          </label>
        </div>
      </div>
      <Button 
        onClick={handlePayment} 
        disabled={loading || (!razorpayLoaded && !outsideIndia)}
        className="w-full bg-[#f5dd01] text-black hover:bg-[#d4bc00] font-semibold"
      >
        {loading ? 'Processing...' : !razorpayLoaded && !outsideIndia ? 'Loading...' : 
          `${isUpgrade ? 'Upgrade' : 'Pay'} ${displayCurrency}${outsideIndia ? Number(displayPrice).toFixed(2) : displayPrice}${appliedCoupon && appliedCoupon.discountPercentage ? ' (First Payment)' : ''}`
        }
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate(isUpgrade ? '/pricing' : '/auth')}
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        {isUpgrade ? 'Back to Pricing' : 'Back to Signup'}
      </Button>
    </div>
  );
};

export default PaymentForm;
