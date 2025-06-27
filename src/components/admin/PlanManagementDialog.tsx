
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import type { ProfileWithEmail } from "@/hooks/useAdminUsers";

interface PlanManagementDialogProps {
  profile: ProfileWithEmail;
  onUpdatePlan: (userId: string, planData: {
    plan: string;
    activated_at: string;
    expires_at: string;
  }) => void;
}

const PlanManagementDialog = ({ profile, onUpdatePlan }: PlanManagementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState(profile.plan || "Let him cook (free)");
  const [activatedAt, setActivatedAt] = useState(
    profile.activated_at ? new Date(profile.activated_at).toISOString().split('T')[0] : ""
  );
  const [expiresAt, setExpiresAt] = useState(
    profile.expires_at ? new Date(profile.expires_at).toISOString().split('T')[0] : ""
  );

  const handlePlanChange = (newPlan: string) => {
    setPlanName(newPlan);
    
    // Auto-calculate dates for paid plans
    if (newPlan !== "Let him cook (free)") {
      const today = new Date();
      const oneMonthLater = new Date(today);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      
      if (!activatedAt) {
        setActivatedAt(today.toISOString().split('T')[0]);
      }
      if (!expiresAt) {
        setExpiresAt(oneMonthLater.toISOString().split('T')[0]);
      }
    } else {
      // Clear dates for free plan
      setActivatedAt("");
      setExpiresAt("");
    }
  };

  const handleSubmit = () => {
    onUpdatePlan(profile.id, {
      plan: planName,
      activated_at: activatedAt ? new Date(activatedAt).toISOString() : "",
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Manage Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage User Plan</DialogTitle>
          <DialogDescription>
            Update plan details for {profile.full_name || profile.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plan" className="text-right">
              Plan
            </Label>
            <Select value={planName} onValueChange={handlePlanChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Let him cook (free)">Let him cook (free)</SelectItem>
                <SelectItem value="Cooked">Cooked</SelectItem>
                <SelectItem value="Goated">Goated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {planName !== "Let him cook (free)" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activated" className="text-right">
                  Activated
                </Label>
                <Input
                  id="activated"
                  type="date"
                  value={activatedAt}
                  onChange={(e) => setActivatedAt(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires" className="text-right">
                  Expires
                </Label>
                <Input
                  id="expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanManagementDialog;
