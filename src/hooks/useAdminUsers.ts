import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useAdminUsersData, ProfileWithEmail } from "./admin/useAdminUsersData";
import { useAdminUserMutations } from "./admin/useAdminUserMutations";
import { useEmailNotifications } from "./admin/useEmailNotifications";

type Profile = Database['public']['Tables']['profiles']['Row'];

export type { ProfileWithEmail };

export const useAdminUsers = () => {
  const { data: profiles, isLoading, error } = useAdminUsersData();
  const {
    updateUserMutation,
    updatePlanMutation,
    deleteUserMutation,
    deleteUserDataMutation,
  } = useAdminUserMutations();
  const { sendUserUpdateEmail, sendPlanUpdateEmail } = useEmailNotifications();
  
  const handleUpdateUser = async (userId: string, updates: { status?: Profile['status'], role?: Profile['role'] }) => {
    const userProfile = profiles?.find(p => p.id === userId);
    
    if (!userProfile?.email) {
      toast.error("Cannot send email: User email not found");
      return;
    }

    try {
      console.log(`[ADMIN-USERS] Starting user update for ${userProfile.email}`);
      
      // First update the user
      await updateUserMutation.mutateAsync({ userId, ...updates });
      console.log(`[ADMIN-USERS] ✅ User database update successful`);
      
      // Then try to send email notification
      try {
        await sendUserUpdateEmail(userProfile, updates);
        console.log(`[ADMIN-USERS] ✅ Email notification sent to ${userProfile.email}`);
        toast.success("User updated successfully and email notification sent! 📧");
      } catch (emailError) {
        console.error('[ADMIN-USERS] ❌ Email notification failed:', emailError);
        toast.success("User updated successfully (email notification failed - check console for details)", {
          description: "The user update was successful, but we couldn't send the email notification."
        });
      }
      
    } catch (error) {
      console.error('[ADMIN-USERS] ❌ User update failed:', error);
      toast.error(`Failed to update user: ${error.message}`);
    }
  };

  const handleUpdatePlan = async (userId: string, planData: {
    plan: string;
    activated_at: string;
    expires_at: string;
  }) => {
    const userProfile = profiles?.find(p => p.id === userId);
    
    if (!userProfile?.email) {
      toast.error("Cannot send email: User email not found");
      return;
    }

    try {
      console.log(`[ADMIN-USERS] Starting plan update for ${userProfile.email} to ${planData.plan}`);
      
      // First update the plan
      await updatePlanMutation.mutateAsync({ userId, planData });
      console.log(`[ADMIN-USERS] ✅ Plan database update successful`);
      
      // Then try to send email notification
      try {
        await sendPlanUpdateEmail(userProfile, planData);
        console.log(`[ADMIN-USERS] ✅ Plan change email sent to ${userProfile.email}`);
        toast.success("Plan updated successfully and email notification sent! 📧");
      } catch (emailError) {
        console.error('[ADMIN-USERS] ❌ Plan change email failed:', emailError);
        toast.success("Plan updated successfully (email notification failed - check console for details)", {
          description: "The plan update was successful, but we couldn't send the email notification."
        });
      }
      
    } catch (error) {
      console.error('[ADMIN-USERS] ❌ Plan update failed:', error);
      toast.error(`Failed to update plan: ${error.message}`);
    }
  };
  
  const handleDeleteUser = (profileToDelete: ProfileWithEmail) => {
    deleteUserMutation.mutate(profileToDelete.id);
  };

  const handleDeleteUserData = (profileToDelete: ProfileWithEmail) => {
    deleteUserDataMutation.mutate(profileToDelete.id);
  };

  return {
    profiles,
    isLoading,
    error,
    updateUser: handleUpdateUser,
    updatePlan: handleUpdatePlan,
    deleteUser: handleDeleteUser,
    deleteUserData: handleDeleteUserData,
    isUpdatingUser: updateUserMutation.isPending,
    isUpdatingPlan: updatePlanMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    isDeletingData: deleteUserDataMutation.isPending,
  };
};
