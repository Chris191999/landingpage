import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentConfig } from '@/hooks/usePaymentConfig';

interface PaymentDetailsProps {
  config: PaymentConfig;
  discountAmount?: number;
  discountPercentage?: number;
  outsideIndia?: boolean;
}

const PaymentDetails = ({ config, discountAmount, discountPercentage, outsideIndia }: PaymentDetailsProps) => {
  const { selectedPlan, isUpgrade, fullName, email, planPrice, planName, previousPlan } = config;
  
  let originalPrice = parseInt(planPrice);
  let finalPrice = discountAmount || originalPrice;
  let displayCurrency = '₹';
  let displayOriginal = `₹${originalPrice}/month`;
  let displayFinal = `₹${finalPrice}/month`;
  let displaySavings = `Save ₹${originalPrice - finalPrice}/month`;
  if (outsideIndia) {
    if (planName.toLowerCase().includes('cooked')) {
      originalPrice = 10;
      finalPrice = discountPercentage ? (10 - (10 * discountPercentage / 100)) : 10;
    } else if (planName.toLowerCase().includes('goated')) {
      originalPrice = 15;
      finalPrice = discountPercentage ? (15 - (15 * discountPercentage / 100)) : 15;
    }
    displayCurrency = '$';
    displayOriginal = `$${originalPrice.toFixed(2)}/month`;
    displayFinal = `$${finalPrice.toFixed(2)}/month`;
    displaySavings = `Save $${(originalPrice - finalPrice).toFixed(2)}/month`;
  }
  const savings = originalPrice - finalPrice;

  return (
    <Card className="w-full max-w-md glass-morphism border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">
          {isUpgrade ? 'Upgrade Plan' : 'Complete Payment'}
        </CardTitle>
        <p className="text-gray-400">
          {isUpgrade 
            ? `Upgrade from ${previousPlan} to ${planName}` 
            : `Subscribe to ${planName} plan`
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {savings > 0 ? (
            <div>
              <div className="text-lg text-gray-400 line-through">
                {displayOriginal}
              </div>
              <div className="text-3xl font-bold text-[#f5dd01]">
                {displayFinal}
              </div>
              <div className="text-sm text-green-400 font-medium">
                {displaySavings} ({discountPercentage}% off)
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-[#f5dd01]">
              {displayFinal}
            </div>
          )}
          <p className="text-sm text-gray-400 mt-2">
            {savings > 0 ? 'Discounted first payment • Regular price after renewal' : 'Billed monthly • Cancel anytime'}
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>Plan:</strong> {planName}</p>
          {isUpgrade && <p><strong>Current Plan:</strong> {previousPlan}</p>}
          <p><strong>User:</strong> {fullName}</p>
          <p><strong>Email:</strong> {email}</p>
          {savings > 0 && (
            <p className="text-green-400"><strong>Discount Applied:</strong> {discountPercentage}% off first payment</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
