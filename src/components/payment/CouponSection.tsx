
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCoupons, CouponValidation } from '@/hooks/useCoupons';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface CouponSectionProps {
  planType: string;
  originalPrice: number;
  onCouponApplied: (validation: CouponValidation | null) => void;
}

const CouponSection = ({ planType, originalPrice, onCouponApplied }: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [error, setError] = useState('');
  const { validateCoupon, loading } = useCoupons();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setError('');
    const validation = await validateCoupon(couponCode, planType);
    
    if (validation.isValid) {
      setAppliedCoupon(validation);
      onCouponApplied(validation);
      setError('');
    } else {
      setError(validation.message);
      setAppliedCoupon(null);
      onCouponApplied(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    onCouponApplied(null);
    setCouponCode('');
    setError('');
  };

  return (
    <Card className="glass-morphism border-0">
      <CardContent className="p-4 space-y-3">
        <div className="text-sm font-medium text-white">Have a coupon code?</div>
        
        {!appliedCoupon ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={loading}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="bg-[#f5dd01] text-black hover:bg-[#d4bc00]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>
        ) : (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">
                  {appliedCoupon.discountPercentage}% off applied!
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-400 hover:text-green-300 h-auto p-1"
              >
                Remove
              </Button>
            </div>
            <div className="text-sm text-green-300 mt-1">
              Discount: ₹{originalPrice - appliedCoupon.discountAmount}
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponSection;
