
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, status, role }: { 
      userId: string, 
      status?: Profile['status'], 
      role?: Profile['role'] 
    }) => {
      const { error } = await supabase.functions.invoke("update-user-status", {
        body: { userId, status, role },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ userId, planData }: { 
      userId: string, 
      planData: {
        plan: string;
        activated_at: string;
        expires_at: string;
      }
    }) => {
      const { error } = await supabase.rpc('update_user_plan', {
        target_user_id: userId,
        new_plan_name: planData.plan,
        new_activated_at: planData.activated_at || null,
        new_expires_at: planData.expires_at || null,
      });
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Plan updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update plan: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userIdToDelete: userId },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteUserDataMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke("delete-user-data", {
        body: { userIdToDelete: userId },
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["storage-stats"] });
      toast.success("User data deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete user data: ${error.message}`);
    },
  });

  return {
    updateUserMutation,
    updatePlanMutation,
    deleteUserMutation,
    deleteUserDataMutation,
  };
};
