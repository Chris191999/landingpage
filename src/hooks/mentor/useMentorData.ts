
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MenteeData {
  id: string;
  mentee_user_id: string;
  full_name: string | null;
  email: string;
  access_level: 'basic' | 'advanced' | 'full';
  active: boolean;
  created_at: string;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  lastTradeDate: string | null;
  avgRisk: number;
}

export const useMentorData = () => {
  const { user } = useAuth();
  const [mentees, setMentees] = useState<MenteeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMentees = async () => {
    if (!user) {
      setMentees([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching mentees for mentor:', user.id);
      
      // Fetch mentor relationships first
      const { data: relationships, error: relError } = await supabase
        .from('mentor_relationships')
        .select('*')
        .eq('mentor_user_id', user.id)
        .eq('active', true);

      if (relError) {
        console.error('Error fetching relationships:', relError);
        setMentees([]);
        setIsLoading(false);
        return;
      }

      console.log('Found relationships:', relationships);

      if (!relationships || relationships.length === 0) {
        console.log('No active mentor relationships found');
        setMentees([]);
        setIsLoading(false);
        return;
      }

      // Get mentee user IDs
      const menteeUserIds = relationships.map(rel => rel.mentee_user_id);
      console.log('Mentee user IDs:', menteeUserIds);

      // Fetch mentee profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', menteeUserIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      console.log('Profiles found:', profiles);

      // Create a profile lookup map
      const profileMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      // Get user emails via edge function
      let emailMap: Record<string, string> = {};
      try {
        const { data: userEmails, error: emailError } = await supabase.functions.invoke('get-profiles-with-email');
        if (emailError) {
          console.error('Error fetching emails:', emailError);
        } else if (userEmails) {
          console.log('User emails fetched:', userEmails.length);
          emailMap = (userEmails || []).reduce((acc: Record<string, string>, user: any) => {
            acc[user.id] = user.email;
            return acc;
          }, {});
        }
      } catch (emailError) {
        console.error('Error calling get-profiles-with-email function:', emailError);
      }

      console.log('Email map:', emailMap);

      // Fetch trading data for each mentee
      const menteesWithStats = await Promise.all(
        relationships.map(async (rel) => {
          const menteeId = rel.mentee_user_id;
          const profile = profileMap[menteeId];
          
          console.log(`Fetching trades for mentee ${menteeId}`);
          
          // Fetch trades for this mentee
          const { data: trades, error: tradesError } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', menteeId)
            .eq('status', 'Completed');

          if (tradesError) {
            console.error(`Error fetching trades for mentee ${menteeId}:`, tradesError);
          } else {
            console.log(`Found ${trades?.length || 0} trades for mentee ${menteeId}`);
          }

          const menteeData: MenteeData = {
            id: rel.id,
            mentee_user_id: menteeId,
            full_name: profile?.full_name || null,
            email: emailMap[menteeId] || 'Unknown',
            access_level: rel.access_level as 'basic' | 'advanced' | 'full',
            active: rel.active,
            created_at: rel.created_at,
            totalPnL: 0,
            winRate: 0,
            totalTrades: 0,
            avgWin: 0,
            avgLoss: 0,
            lastTradeDate: null,
            avgRisk: 0
          };

          if (trades && trades.length > 0) {
            const completedTrades = trades.filter(trade => trade.pnl !== null && trade.pnl !== undefined);
            const totalPnL = completedTrades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0);
            const winningTrades = completedTrades.filter(trade => (Number(trade.pnl) || 0) > 0);
            const losingTrades = completedTrades.filter(trade => (Number(trade.pnl) || 0) < 0);
            const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;
            const avgWin = winningTrades.length > 0 
              ? winningTrades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) / winningTrades.length 
              : 0;
            const avgLoss = losingTrades.length > 0 
              ? Math.abs(losingTrades.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) / losingTrades.length)
              : 0;
            const avgRisk = trades.reduce((sum, trade) => sum + (Number(trade.risk) || 0), 0) / trades.length;
            
            // Get last trade date
            const sortedTrades = trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const lastTradeDate = sortedTrades[0]?.date || null;

            menteeData.totalPnL = totalPnL;
            menteeData.winRate = winRate;
            menteeData.totalTrades = completedTrades.length;
            menteeData.avgWin = avgWin;
            menteeData.avgLoss = avgLoss;
            menteeData.lastTradeDate = lastTradeDate;
            menteeData.avgRisk = avgRisk;

            console.log(`Calculated stats for ${menteeId}:`, {
              totalPnL,
              winRate,
              totalTrades: completedTrades.length,
              avgWin,
              avgLoss
            });
          }

          return menteeData;
        })
      );

      console.log('Final mentees with stats:', menteesWithStats);
      setMentees(menteesWithStats);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      setMentees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentees();
  }, [user]);

  return {
    mentees,
    isLoading,
    refetch: fetchMentees
  };
};
