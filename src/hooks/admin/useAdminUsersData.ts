
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileWithEmail = Profile & { 
  email: string | null; 
  storage_used: number;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
};

const fetchProfilesWithEmail = async (): Promise<ProfileWithEmail[]> => {
  const { data, error } = await supabase.rpc("get_profiles_with_email");
  if (error) throw new Error(error.message);
  if (!data) return [];
  return (data as any[]).map(profile => ({
    ...profile,
    storage_used: Number(profile.storage_used || 0)
  })) as ProfileWithEmail[];
};

export const useAdminUsersData = () => {
  return useQuery<ProfileWithEmail[]>({
    queryKey: ["profiles"],
    queryFn: fetchProfilesWithEmail,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
