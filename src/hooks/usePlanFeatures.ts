
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PlanFeatures {
  plan_name: string;
  max_images_per_trade: number;
  calendar_access: boolean;
  filters_access: boolean;
  pdf_export_access: boolean;
  advanced_analytics_access: boolean;
  risk_psychology_access: boolean;
  time_analysis_access: boolean;
  overview_access: boolean;
  add_trade_access: boolean;
  analytics_access: boolean;
  advanced_analytics_performancetab_access: boolean;
  risk_access: boolean;
  psychology_access: boolean;
  streamer_mode: boolean;
  mentor_mode: boolean;
  all_trades_access: boolean;
  expires_at: string | null;
  activated_at: string | null;
}

export const usePlanFeatures = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["plan-features", user?.id],
    queryFn: async (): Promise<PlanFeatures> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.rpc("get_user_plan_features", {
        user_id: user.id,
      });

      if (error) throw error;
      if (!data || data.length === 0) {
        // Return default free plan features if no data found
        return {
          plan_name: "Let him cook (free)",
          max_images_per_trade: 1,
          calendar_access: true,
          filters_access: false,
          pdf_export_access: false,
          advanced_analytics_access: false,
          risk_psychology_access: true,
          time_analysis_access: false,
          overview_access: true,
          add_trade_access: true,
          analytics_access: false,
          advanced_analytics_performancetab_access: false,
          risk_access: false,
          psychology_access: true,
          streamer_mode: false,
          mentor_mode: false,
          all_trades_access: false,
          expires_at: null,
          activated_at: null,
        };
      }

      return data[0];
    },
    enabled: !!user?.id,
  });
};
