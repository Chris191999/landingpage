import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trade } from '@/types/trade';
import { toast } from 'sonner';

export const useMenteeTrades = () => {
  const [selectedMenteeTrades, setSelectedMenteeTrades] = useState<Trade[]>([]);

  const fetchMenteeTrades = useCallback(async (menteeId: string) => {
    setSelectedMenteeTrades([]);
    if (!menteeId) return;
    
    console.log('Fetching trades for mentee:', menteeId);
    
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', menteeId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching mentee trades:', error);
        throw error;
      }
      
      console.log('Fetched trades:', data);
      
      setSelectedMenteeTrades(
        (data || []).map(trade => ({
          ...trade,
          direction: trade.direction === 'Short' ? 'Short' : 'Long',
          trade_type: ([
            'Day Trading',
            'Swing Trading',
            'Position Trading',
            'Scalping',
            'Investing',
          ].includes(trade.trade_type)
            ? trade.trade_type
            : 'Day Trading') as 'Day Trading' | 'Swing Trading' | 'Position Trading' | 'Scalping' | 'Investing',
          status: ([
            'Completed',
            'Open',
            'Cancelled',
          ].includes(trade.status)
            ? trade.status
            : 'Completed') as 'Completed' | 'Open' | 'Cancelled',
          order_type: ([
            'Forward',
            'Market',
            'Limit',
            'Stop',
          ].includes(trade.order_type)
            ? trade.order_type
            : 'Market') as 'Forward' | 'Market' | 'Limit' | 'Stop',
          emotion: ([
            'confident',
            'fearful',
            'fomo',
            'greedy',
            'disciplined',
            'uncertain',
            'undisciplined',
            'tilt'
          ].includes(trade.emotion)
            ? trade.emotion
            : undefined) as 'confident' | 'fearful' | 'fomo' | 'greedy' | 'disciplined' | 'uncertain' | 'undisciplined' | 'tilt' | undefined,
          mistake_category: ([
            'early_exit',
            'late_entry',
            'oversized',
            'revenge_trade',
            'fomo',
            'none',
            'late_exit',
            'early_entry',
            'position_too_small'
          ].includes(trade.mistake_category)
            ? trade.mistake_category
            : undefined) as 'early_exit' | 'late_entry' | 'oversized' | 'revenge_trade' | 'fomo' | 'none' | 'late_exit' | 'early_entry' | 'position_too_small' | undefined,
          rules_followed: ([
            'yes',
            'no',
            'partial'
          ].includes(trade.rules_followed)
            ? trade.rules_followed
            : undefined) as 'yes' | 'no' | 'partial' | undefined,
          market_condition_detailed: ([
            'trending_up',
            'trending_down',
            'ranging',
            'volatile',
            'low_volume'
          ].includes(trade.market_condition_detailed)
            ? trade.market_condition_detailed
            : undefined) as 'trending_up' | 'trending_down' | 'ranging' | 'volatile' | 'low_volume' | undefined,
          market_volatility: ([
            'low',
            'medium',
            'high'
          ].includes(trade.market_volatility)
            ? trade.market_volatility
            : undefined) as 'low' | 'medium' | 'high' | undefined,
          timeframe: ([
            '1m',
            '5m',
            '15m',
            '1h',
            '4h',
            '1d'
          ].includes(trade.timeframe)
            ? trade.timeframe
            : undefined) as '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | undefined,
        }))
      );
    } catch (error) {
      console.error('Error fetching mentee trades:', error);
      toast.error('Failed to load mentee trades');
    }
  }, []);

  return {
    selectedMenteeTrades,
    fetchMenteeTrades
  };
};
