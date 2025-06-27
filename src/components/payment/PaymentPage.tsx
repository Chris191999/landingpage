import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentDialog } from '@/components/auth/PaymentDialog';
import { usePaymentConfig } from '@/hooks/usePaymentConfig';
import { useRazorpayLoader } from '@/hooks/useRazorpayLoader';
import { CouponValidation } from '@/hooks/useCoupons';
import PaymentDetails from './PaymentDetails';
import PaymentForm from './PaymentForm';
import AuthBackground from '@/components/auth/AuthBackground';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentPageProps {
  onSuccess?: () => void;
}

const PaymentPage = ({ onSuccess }: PaymentPageProps) => {
  const [paymentDialog, setPaymentDialog] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    message?: string;
  }>({ isOpen: false, isSuccess: false });
  
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [outsideIndia, setOutsideIndia] = useState(false);
  
  const navigate = useNavigate();
  const config = usePaymentConfig();
  const { razorpayLoaded, loadError } = useRazorpayLoader();

  // Handle Razorpay load error
  if (loadError) {
    setPaymentDialog({
      isOpen: true,
      isSuccess: false,
      message: loadError
    });
  }

  const handlePaymentResult = (isSuccess: boolean, message?: string) => {
    setPaymentDialog({
      isOpen: true,
      isSuccess,
      message
    });
    if (isSuccess && onSuccess) onSuccess();
  };

  const closePaymentDialog = () => {
    setPaymentDialog({ isOpen: false, isSuccess: false });
    if (paymentDialog.isSuccess) {
      if (config.isUpgrade) {
        navigate('/'); // Redirect to dashboard for upgrades
      } else {
        navigate('/auth?tab=login'); // Redirect to login for new signups
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuthBackground />
      <div className="flex items-center justify-center min-h-screen relative z-10 px-4">
        <Card className="w-[420px] max-w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
          <CardContent className="py-6 px-6">
            <div className="space-y-4">
              <PaymentDetails 
                config={config} 
                discountAmount={appliedCoupon?.discountAmount}
                discountPercentage={appliedCoupon?.discountPercentage}
                outsideIndia={outsideIndia}
              />
              <PaymentForm 
                config={config}
                razorpayLoaded={razorpayLoaded}
                onPaymentResult={handlePaymentResult}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                outsideIndia={outsideIndia}
                setOutsideIndia={setOutsideIndia}
              />
            </div>
          </CardContent>
        </Card>

        <PaymentDialog
          isOpen={paymentDialog.isOpen}
          onClose={closePaymentDialog}
          isSuccess={paymentDialog.isSuccess}
          message={paymentDialog.message}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
