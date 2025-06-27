
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message?: string;
}

export const PaymentDialog = ({ isOpen, onClose, isSuccess, message }: PaymentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <DialogTitle className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message || (isSuccess 
              ? "Your payment has been processed successfully. You will receive a confirmation email shortly."
              : "There was an issue processing your payment. Please try again or contact support."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="w-full">
            {isSuccess ? "Continue" : "Try Again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
