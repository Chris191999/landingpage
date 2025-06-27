export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      coupon_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_amount: number
          discount_percentage: number
          expires_at: string | null
          id: string
          influencer_name: string | null
          is_active: boolean | null
          max_uses: number | null
          original_amount: number
          plan_type: string
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount: number
          discount_percentage: number
          expires_at?: string | null
          id?: string
          influencer_name?: string | null
          is_active?: boolean | null
          max_uses?: number | null
          original_amount: number
          plan_type: string
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number
          discount_percentage?: number
          expires_at?: string | null
          id?: string
          influencer_name?: string | null
          is_active?: boolean | null
          max_uses?: number | null
          original_amount?: number
          plan_type?: string
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          coupon_code_id: string | null
          id: string
          payment_amount: number
          subscription_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code_id?: string | null
          id?: string
          payment_amount: number
          subscription_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code_id?: string | null
          id?: string
          payment_amount?: number
          subscription_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_code_id_fkey"
            columns: ["coupon_code_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_feedback: {
        Row: {
          comments: string | null
          created_at: string
          feedback_type: string
          id: string
          mentee_user_id: string
          mentor_user_id: string
          milestone: string | null
          rating: number | null
          suggestions: string | null
          trade_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          feedback_type: string
          id?: string
          mentee_user_id: string
          mentor_user_id: string
          milestone?: string | null
          rating?: number | null
          suggestions?: string | null
          trade_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          feedback_type?: string
          id?: string
          mentee_user_id?: string
          mentor_user_id?: string
          milestone?: string | null
          rating?: number | null
          suggestions?: string | null
          trade_id?: string | null
        }
        Relationships: []
      }
      mentor_invitations: {
        Row: {
          accepted_at: string | null
          access_level: string
          created_at: string
          id: string
          invitee_email: string
          inviter_user_id: string
          revoked_at: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          access_level?: string
          created_at?: string
          id?: string
          invitee_email: string
          inviter_user_id: string
          revoked_at?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          access_level?: string
          created_at?: string
          id?: string
          invitee_email?: string
          inviter_user_id?: string
          revoked_at?: string | null
          status?: string
        }
        Relationships: []
      }
      mentor_milestones: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          id: string
          mentee_user_id: string
          mentor_user_id: string | null
          target_date: string | null
          title: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          mentee_user_id: string
          mentor_user_id?: string | null
          target_date?: string | null
          title: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          mentee_user_id?: string
          mentor_user_id?: string | null
          target_date?: string | null
          title?: string
        }
        Relationships: []
      }
      mentor_relationships: {
        Row: {
          access_level: string
          active: boolean
          created_at: string
          id: string
          mentee_user_id: string
          mentor_user_id: string
        }
        Insert: {
          access_level?: string
          active?: boolean
          created_at?: string
          id?: string
          mentee_user_id: string
          mentor_user_id: string
        }
        Update: {
          access_level?: string
          active?: boolean
          created_at?: string
          id?: string
          mentee_user_id?: string
          mentor_user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          plan_name: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_name: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          plan_name?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          add_trade_access: boolean | null
          advanced_analytics_performancetab_access: boolean | null
          all_trades_access: boolean | null
          analytics_access: boolean | null
          created_at: string | null
          id: string
          max_images_per_trade: number | null
          mentor_mode: boolean | null
          monthly_price: number | null
          overview_access: boolean | null
          pdf_export_access: boolean | null
          plan_name: string
          psychology_access: boolean | null
          risk_access: boolean | null
          streamer_mode: boolean | null
          time_analysis_access: boolean | null
        }
        Insert: {
          add_trade_access?: boolean | null
          advanced_analytics_performancetab_access?: boolean | null
          all_trades_access?: boolean | null
          analytics_access?: boolean | null
          created_at?: string | null
          id?: string
          max_images_per_trade?: number | null
          mentor_mode?: boolean | null
          monthly_price?: number | null
          overview_access?: boolean | null
          pdf_export_access?: boolean | null
          plan_name: string
          psychology_access?: boolean | null
          risk_access?: boolean | null
          streamer_mode?: boolean | null
          time_analysis_access?: boolean | null
        }
        Update: {
          add_trade_access?: boolean | null
          advanced_analytics_performancetab_access?: boolean | null
          all_trades_access?: boolean | null
          analytics_access?: boolean | null
          created_at?: string | null
          id?: string
          max_images_per_trade?: number | null
          mentor_mode?: boolean | null
          monthly_price?: number | null
          overview_access?: boolean | null
          pdf_export_access?: boolean | null
          plan_name?: string
          psychology_access?: boolean | null
          risk_access?: boolean | null
          streamer_mode?: boolean | null
          time_analysis_access?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activated_at: string | null
          avatar_url: string | null
          email: string | null
          expires_at: string | null
          full_name: string | null
          id: string
          plan: string | null
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["app_status"]
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          avatar_url?: string | null
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id: string
          plan?: string | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          avatar_url?: string | null
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id?: string
          plan?: string | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["app_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_balance: number | null
          account_name: string | null
          commission_breakdown: string | null
          confidence_rating: number | null
          created_at: string
          date: string | null
          direction: string | null
          economic_events: string | null
          emotion: string | null
          entry: number | null
          entry_liq: string | null
          exit: number | null
          fees: number | null
          id: string
          image_files: string[] | null
          liq_entry_breakeven_risk: string | null
          liquidity: string | null
          market_condition: string | null
          market_condition_detailed: string | null
          market_volatility: string | null
          max_adverse_excursion: number | null
          max_favorable_excursion: number | null
          mistake_category: string | null
          notes: string | null
          order_liq: string | null
          order_type: string | null
          planned_vs_actual_pnl: number | null
          pnducm_imbalance: string | null
          pnl: number | null
          position_size: number | null
          post_trade_reflection: string | null
          quantity: number | null
          risk: number | null
          rules_followed: string | null
          session: string | null
          setup_type: string | null
          slippage: number | null
          status: string | null
          stop_loss: number | null
          strategy_name: string | null
          symbol: string | null
          test_type: string | null
          time_of_day: string | null
          timeframe: string | null
          trade_duration_hours: number | null
          trade_type: string | null
          trailing_stop: number | null
          user_id: string
        }
        Insert: {
          account_balance?: number | null
          account_name?: string | null
          commission_breakdown?: string | null
          confidence_rating?: number | null
          created_at?: string
          date?: string | null
          direction?: string | null
          economic_events?: string | null
          emotion?: string | null
          entry?: number | null
          entry_liq?: string | null
          exit?: number | null
          fees?: number | null
          id: string
          image_files?: string[] | null
          liq_entry_breakeven_risk?: string | null
          liquidity?: string | null
          market_condition?: string | null
          market_condition_detailed?: string | null
          market_volatility?: string | null
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          mistake_category?: string | null
          notes?: string | null
          order_liq?: string | null
          order_type?: string | null
          planned_vs_actual_pnl?: number | null
          pnducm_imbalance?: string | null
          pnl?: number | null
          position_size?: number | null
          post_trade_reflection?: string | null
          quantity?: number | null
          risk?: number | null
          rules_followed?: string | null
          session?: string | null
          setup_type?: string | null
          slippage?: number | null
          status?: string | null
          stop_loss?: number | null
          strategy_name?: string | null
          symbol?: string | null
          test_type?: string | null
          time_of_day?: string | null
          timeframe?: string | null
          trade_duration_hours?: number | null
          trade_type?: string | null
          trailing_stop?: number | null
          user_id: string
        }
        Update: {
          account_balance?: number | null
          account_name?: string | null
          commission_breakdown?: string | null
          confidence_rating?: number | null
          created_at?: string
          date?: string | null
          direction?: string | null
          economic_events?: string | null
          emotion?: string | null
          entry?: number | null
          entry_liq?: string | null
          exit?: number | null
          fees?: number | null
          id?: string
          image_files?: string[] | null
          liq_entry_breakeven_risk?: string | null
          liquidity?: string | null
          market_condition?: string | null
          market_condition_detailed?: string | null
          market_volatility?: string | null
          max_adverse_excursion?: number | null
          max_favorable_excursion?: number | null
          mistake_category?: string | null
          notes?: string | null
          order_liq?: string | null
          order_type?: string | null
          planned_vs_actual_pnl?: number | null
          pnducm_imbalance?: string | null
          pnl?: number | null
          position_size?: number | null
          post_trade_reflection?: string | null
          quantity?: number | null
          risk?: number | null
          rules_followed?: string | null
          session?: string | null
          setup_type?: string | null
          slippage?: number | null
          status?: string | null
          stop_loss?: number | null
          strategy_name?: string | null
          symbol?: string | null
          test_type?: string | null
          time_of_day?: string | null
          timeframe?: string | null
          trade_duration_hours?: number | null
          trade_type?: string | null
          trailing_stop?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_update_expired_plans: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profiles_with_email: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          updated_at: string
          full_name: string
          avatar_url: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["app_status"]
          plan: string
          activated_at: string
          expires_at: string
          email: string
          storage_used: number
        }[]
      }
      get_user_plan_features: {
        Args: { user_id: string }
        Returns: {
          plan_name: string
          max_images_per_trade: number
          calendar_access: boolean
          filters_access: boolean
          pdf_export_access: boolean
          advanced_analytics_access: boolean
          risk_psychology_access: boolean
          time_analysis_access: boolean
          overview_access: boolean
          add_trade_access: boolean
          analytics_access: boolean
          advanced_analytics_performancetab_access: boolean
          risk_access: boolean
          psychology_access: boolean
          streamer_mode: boolean
          mentor_mode: boolean
          all_trades_access: boolean
          expires_at: string
          activated_at: string
        }[]
      }
      get_user_status_by_email: {
        Args: { p_email: string }
        Returns: Database["public"]["Enums"]["app_status"]
      }
      increment_coupon_usage: {
        Args: { coupon_id: string }
        Returns: undefined
      }
      update_user_plan: {
        Args: {
          target_user_id: string
          new_plan_name: string
          new_activated_at?: string
          new_expires_at?: string
        }
        Returns: undefined
      }
      validate_coupon: {
        Args: { p_coupon_code: string; p_user_id: string; p_plan_type: string }
        Returns: {
          is_valid: boolean
          discount_amount: number
          original_amount: number
          discount_percentage: number
          coupon_id: string
          message: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      app_status: "pending_approval" | "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      app_status: ["pending_approval", "active", "inactive"],
    },
  },
} as const
